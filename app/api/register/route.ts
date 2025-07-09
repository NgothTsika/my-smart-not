import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Email is already registered", { status: 409 });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Optional: don’t return sensitive fields
    const { hashedPassword: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
