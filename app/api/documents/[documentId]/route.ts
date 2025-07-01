import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
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

    const { title } = await req.json();

    const document = await prisma.document.update({
      where: {
        id: params.documentId,
        userId: user.id,
      },
      data: { title },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENT_PATCH]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
