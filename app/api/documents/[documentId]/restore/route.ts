import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  contextPromise: Promise<{ params: { documentId: string } }>
) {
  const { params } = await contextPromise;
  const { documentId } = params;

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

    const updated = await prisma.document.update({
      where: {
        id: documentId,
        userId: user.id,
      },
      data: {
        isArchived: false,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[RESTORE_DOCUMENT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
