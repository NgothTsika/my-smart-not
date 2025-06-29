import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { documentId: string } }
) {
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

    const { documentId } = params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.userId !== user.id) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    // Restore the document and its children recursively
    const restoreRecursive = async (docId: string) => {
      await prisma.document.update({
        where: { id: docId },
        data: { isArchived: false },
      });

      const children = await prisma.document.findMany({
        where: {
          parentDocumentId: docId,
          userId: user.id,
        },
      });

      for (const child of children) {
        await restoreRecursive(child.id);
      }
    };

    await restoreRecursive(documentId);

    return NextResponse.json({ success: true, documentId }, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENT_RESTORE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
