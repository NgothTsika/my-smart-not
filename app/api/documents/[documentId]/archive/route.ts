import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ documentId: string }> } // ✅ this is correct
) {
  const { documentId } = await context.params; // ✅ this is how you access it

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument || existingDocument.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Archive all child documents recursively
    const archiveChildren = async (parentId: string) => {
      const children = await prisma.document.findMany({
        where: {
          parentDocumentId: parentId,
          userId: user.id,
        },
      });

      for (const child of children) {
        await prisma.document.update({
          where: { id: child.id },
          data: { isArchived: true },
        });
        await archiveChildren(child.id);
      }
    };

    await archiveChildren(documentId);

    const archived = await prisma.document.update({
      where: { id: documentId },
      data: { isArchived: true },
    });

    return NextResponse.json(archived, { status: 200 });
  } catch (error) {
    console.error("[ARCHIVE_DOCUMENT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
