import { Role } from "@prisma/client";
import prisma from "../../src/utils/prismaClient";

export async function seedUser() {
  console.log("Seeding Users...");

  const users = [
    {
      name: "Manager",
      email: "manager@test.com",
      password: await Bun.password.hash("test1234", {
        algorithm: "bcrypt",
        cost: 10,
      }),
      role: Role.MANAGER,
    },
    {
      name: "Admin",
      email: "admin1@test.com",
      password: await Bun.password.hash("test1234", {
        algorithm: "bcrypt",
        cost: 10,
      }),
      role: Role.ADMIN,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log("Users Seeded!");
}
