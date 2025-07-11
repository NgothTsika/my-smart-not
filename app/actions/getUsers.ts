import prisma from "@/lib/prismadb";

import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
    return users;
  } catch (error) {
    return [];
  }
};

export default getUsers;
