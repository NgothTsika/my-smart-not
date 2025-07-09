import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;

  try {
    const restoreRecursive = async (id: string) => {
      const children = await prisma.document.findMany({
        where: { parentDocumentId: id },
      });

      for (const child of children) {
        await restoreRecursive(child.id);
      }

      const restored = await prisma.document.update({
        where: { id },
        data: { isArchived: false },
      });

      return restored;
    };

    const restored = await restoreRecursive(documentId);

    return NextResponse.json(restored);
  } catch (error) {
    console.error("[RESTORE_DOCUMENT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
