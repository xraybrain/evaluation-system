import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (filter: any) => {
  let user: any | null;
  try {
    user = await prisma.user.findFirst({
      where: filter,
      select: {
        surname: true,
        othernames: true,
        email: true,
        type: true,
        avatar: true,
        student: true,
        admin: true,
        teacher: true,
      },
    });
  } catch (error) {
    console.log(error);
    user = null;
  }
  return user;
};
