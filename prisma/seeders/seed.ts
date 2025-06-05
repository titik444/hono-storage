import { seedUser } from "./user.seeder";
import prisma from "../../src/utils/prismaClient";

async function main() {
  await seedUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
