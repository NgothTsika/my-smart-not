import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const trash = searchParams.get("trash");

  if (query) {
    // Search docs
    const documents = await prisma.document.findMany({
      where: {
        userId: user.id,
        isArchived: false,
        title: { contains: query.toLowerCase() },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(documents);
  }

  if (trash === "true") {
    // Trashed docs
    const trashed = await prisma.document.findMany({
      where: {
        userId: user.id,
        isArchived: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(trashed);
  }

  // Default: All non-archived documents
  const documents = await prisma.document.findMany({
    where: { userId: user.id, isArchived: false },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { action, payload } = await req.json();

  try {
    switch (action) {
      case "create":
        if (!payload.title)
          return NextResponse.json(
            { error: "Title is required" },
            { status: 400 }
          );
        const newDoc = await prisma.document.create({
          data: {
            title: payload.title,
            userId: user.id,
            parentDocumentId: payload.parentDocumentId || null,
            isArchived: false,
            isPublished: false,
          },
        });
        return NextResponse.json(newDoc, { status: 201 });

      case "get":
        const doc = await prisma.document.findUnique({
          where: { id: payload.id },
        });
        if (!doc) return new NextResponse("Not found", { status: 404 });
        return NextResponse.json(doc);

      case "update":
        const existing = await prisma.document.findUnique({
          where: { id: payload.id },
        });
        if (!existing || existing.userId !== user.id) {
          return new NextResponse("Unauthorized or not found", { status: 403 });
        }
        const updated = await prisma.document.update({
          where: { id: payload.id },
          data: payload,
        });
        return NextResponse.json(updated);

      case "delete":
        const deleteRecursive = async (id: string) => {
          const children = await prisma.document.findMany({
            where: { parentDocumentId: id },
          });
          for (const child of children) await deleteRecursive(child.id);
          await prisma.document.delete({ where: { id } });
        };
        await deleteRecursive(payload.id);
        return NextResponse.json({ message: "Deleted" });

      case "archive":
        const archiveRecursive = async (id: string) => {
          const children = await prisma.document.findMany({
            where: { parentDocumentId: id },
          });
          for (const child of children) await archiveRecursive(child.id);
          await prisma.document.update({
            where: { id },
            data: { isArchived: true },
          });
        };
        await archiveRecursive(payload.id);
        return NextResponse.json({ message: "Archived" });

      case "restore":
        const restoreRecursive = async (id: string): Promise<any> => {
          const children = await prisma.document.findMany({
            where: { parentDocumentId: id },
          });
          for (const child of children) await restoreRecursive(child.id);
          return await prisma.document.update({
            where: { id },
            data: { isArchived: false },
          });
        };
        const restored = await restoreRecursive(payload.id);
        return NextResponse.json(restored);

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("[DOCUMENT_ACTION_ERROR]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
