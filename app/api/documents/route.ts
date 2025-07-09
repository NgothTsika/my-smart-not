import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const ParamsSchema = z.object({
  parentDocument: z.string().optional(),
});

export async function GET(req: Request) {
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

    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const parsed = ParamsSchema.safeParse(queryParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: user.id,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENT_GET_ERROR]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
