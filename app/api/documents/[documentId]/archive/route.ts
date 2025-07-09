import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  context: { params: { documentId: string } }
) {
  const { documentId } = context.params;

  try {
    const archiveRecursive = async (id: string) => {
      const children = await prisma.document.findMany({
        where: { parentDocumentId: id },
      });

      for (const child of children) {
        await archiveRecursive(child.id);
      }

      await prisma.document.update({
        where: { id },
        data: { isArchived: true },
      });
    };

    await archiveRecursive(documentId);

    return NextResponse.json({ message: "Document archived" });
  } catch (error) {
    console.error("[ARCHIVE_DOCUMENT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
