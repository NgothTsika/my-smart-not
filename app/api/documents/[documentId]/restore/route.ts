import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function PATCH(
  req: NextRequest,
  context: { params: { documentId: string } }
) {
  const { documentId } = context.params; // ✅ FIXED

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

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        isArchived: false,
      },
    });

    return NextResponse.json(updatedDocument, { status: 200 }); // ✅ Make sure you return full document
  } catch (error) {
    console.error("[RESTORE_DOCUMENT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
