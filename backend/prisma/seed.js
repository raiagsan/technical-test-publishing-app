const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@example.com",
      password: hashedPassword,
    },
  });

  // Seed Authors
  const author1 = await prisma.author.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "J.K. Rowling",
      bio: "British author, best known for Harry Potter series.",
    },
  });

  const author2 = await prisma.author.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "George Orwell", bio: "English novelist and essayist." },
  });

  const author3 = await prisma.author.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Pramoedya Ananta Toer",
      bio: "Indonesian author and nationalist.",
    },
  });

  // Seed Publishers
  const publisher1 = await prisma.publisher.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Bloomsbury", address: "London, UK" },
  });

  const publisher2 = await prisma.publisher.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Secker & Warburg", address: "London, UK" },
  });

  const publisher3 = await prisma.publisher.upsert({
    where: { id: 3 },
    update: {},
    create: { name: "Hasta Mitra", address: "Jakarta, Indonesia" },
  });

  // Seed Books
  await prisma.book.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Harry Potter and the Philosopher's Stone",
        isbn: "9780747532743",
        year: 1997,
        authorId: author1.id,
        publisherId: publisher1.id,
      },
      {
        title: "Harry Potter and the Chamber of Secrets",
        isbn: "9780747538486",
        year: 1998,
        authorId: author1.id,
        publisherId: publisher1.id,
      },
      {
        title: "Nineteen Eighty-Four",
        isbn: "9780451524935",
        year: 1949,
        authorId: author2.id,
        publisherId: publisher2.id,
      },
      {
        title: "Animal Farm",
        isbn: "9780451526342",
        year: 1945,
        authorId: author2.id,
        publisherId: publisher2.id,
      },
      {
        title: "Bumi Manusia",
        isbn: "9789799731234",
        year: 1980,
        authorId: author3.id,
        publisherId: publisher3.id,
      },
      {
        title: "Anak Semua Bangsa",
        isbn: "9789799731235",
        year: 1981,
        authorId: author3.id,
        publisherId: publisher3.id,
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
