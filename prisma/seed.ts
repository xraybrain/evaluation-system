import { PrismaClient } from '@prisma/client';
import { UserType } from 'server/models/Enums';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      surname: 'admin',
      othernames: 'admin',
      password: 'admin',
      email: 'admin@gmail.com',
      type: UserType.Admin,
      createdAt: new Date(),
      admin: {},
    },
  });

  await prisma.level.createMany({
    data: [
      { name: 'ND1', createdAt: new Date() },
      { name: 'ND2', createdAt: new Date() },
      { name: 'HND1', createdAt: new Date() },
      { name: 'HND2', createdAt: new Date() },
    ],
  });
}

main()
  .then(() => console.log('Seeded!'))
  .catch((error) => console.log(error));
