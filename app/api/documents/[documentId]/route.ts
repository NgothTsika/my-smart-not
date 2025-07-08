import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
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

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (existingDocument.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, icon, coverImage, content } = body;

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        ...(title !== undefined && { title }),
        ...(icon !== undefined && { icon }),
        ...(coverImage !== undefined && { coverImage }),
        ...(content !== undefined && { content }),
      },
    });

    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENT_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
