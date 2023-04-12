const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  // Clear the database
  await prisma.rating.deleteMany();
  await prisma.story.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.user.deleteMany();
  // Reset autoincrement IDs
  await prisma.$executeRaw`ALTER TABLE Rating AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Story AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Prompt AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1;`;
  // Create some users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const newUser = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        password: faker.internet.password(),
        apiKey: faker.datatype.uuid(),
      },
    });
    users.push(newUser);
  }

  // Create some prompts
  const prompts = [];
  for (let i = 0; i < 20; i++) {
    const newPrompt = await prisma.prompt.create({
      data: {
        content: faker.lorem.paragraph(5),
        user: {
          connect: {
            id: faker.helpers.arrayElement(users).id,
          },
        },
        published: faker.datatype.boolean(),
        currentPrompt: faker.datatype.boolean(),
      },
    });
    prompts.push(newPrompt);
  }

  // Create some stories
  const stories = [];
  for (let i = 0; i < 40; i++) {
    const newStory = await prisma.story.create({
      data: {
        content: faker.lorem.paragraphs(),
        author: {
          connect: {
            id: faker.helpers.arrayElement(users).id,
          },
        },
        prompt: {
          connect: {
            id: faker.helpers.arrayElement(prompts).id,
          },
        },
        published: faker.datatype.boolean(),
        public: faker.datatype.boolean(),
      },
    });
    stories.push(newStory);
  }
  // Create some ratings
  const ratings = [];
  for (let i = 0; i < 80; i++) {
    ratings.push({
      storyId: faker.helpers.arrayElement(stories).id,
      userId: faker.helpers.arrayElement(users).id,
      rating_plot: faker.datatype.number({ min: 1, max: 5 }),
      rating_characters: faker.datatype.number({ min: 1, max: 5 }),
      rating_grammar: faker.datatype.number({ min: 1, max: 5 }),
      rating_unique: faker.datatype.number({ min: 1, max: 5 }),
      rating_emotion: faker.datatype.number({ min: 1, max: 5 }),
      rating_prompt: faker.datatype.boolean(),
      rating_offensive: faker.datatype.boolean(),
      rating_explanation: faker.lorem.sentence(),
      createdAt: faker.date.recent(),
    });
  }
  const createdRatings = await prisma.rating.createMany({ data: ratings });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
