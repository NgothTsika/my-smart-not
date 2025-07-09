import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;
  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!document) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json(document);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { title, icon, coverImage, content, isPublished } = body;

  const existingDocument = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!existingDocument)
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (existingDocument.userId !== user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const updated = await prisma.document.update({
    where: { id: documentId },
    data: { title, icon, coverImage, content, isPublished },
  });
  return NextResponse.json(updated);
}
