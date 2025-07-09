import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;
  try {
    const deleteRecursive = async (id: string) => {
      const children = await prisma.document.findMany({
        where: { parentDocumentId: id },
      });
      for (const child of children) await deleteRecursive(child.id);
      await prisma.document.delete({ where: { id } });
    };
    await deleteRecursive(documentId);
    return NextResponse.json({ message: "Document deleted" });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
