import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  context: { params: { documentId: string } }
) {
  const { documentId } = context.params;
  try {
    const restored = await prisma.document.update({
      where: { id: documentId },
      data: { isArchived: false },
    });
    return NextResponse.json(restored);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
