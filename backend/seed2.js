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
  const prompts = [
    "It was the first time since the outbreak that people were allowed back into the city. As the gates creaked open, an eerie silence hung in the air, and everyone knew things would never be the same.",
    "The abandoned amusement park stood untouched for decades, until one day, an adventurous group of friends dared to step inside. As they ventured deeper, they began to uncover the park's chilling secrets.",
    "In a world where the color of one's eyes revealed their deepest emotions, she was born with a unique condition—her eyes changed color every day, making her life an open book.",
    "It was supposed to be a routine space mission; however, when the crew of the Orion IX discovered an uncharted planet, they faced a decision that would change the course of human history.",
    "The old, dusty bookshop on the corner was on the verge of closing when a stranger appeared, offering a peculiar deal that would alter the shopkeeper's life forever.",
    "In the year 2150, Earth's resources were exhausted, and humanity looked to the stars for salvation. The first wave of pioneers embarked on a perilous journey to the nearest habitable planet.",
    "The final note of the song reverberated through the cavernous hall, and the performer vanished without a trace. As the audience searched for answers, they stumbled upon an ancient legend.",
    "As the storm raged on outside, the inhabitants of the isolated cabin discovered a hidden door leading to a labyrinth of tunnels. Little did they know what awaited them below.",
    "When the global network connecting human consciousness went online, the world braced for chaos. But nobody expected the rapid rise of a powerful new cult promising freedom from the system.",
    "The old clockmaker had always been eccentric, but the townspeople never imagined the secret hidden within the intricate gears of his finest creation, a secret that would change everything.",
    "In a time of oppressive government surveillance, an underground movement of hackers and rebels known as the 'Data Dissenters' emerged, sparking a digital war that would shape the future.",
    "The mist-shrouded village had a dark past that was whispered about but never truly acknowledged. On the eve of the centennial, its secrets would finally come to light.",
    "As the last known survivor of the cataclysm, she wandered the desolate wasteland, guided by a mysterious radio signal and the hope of finding others who had escaped the devastation.",
    "A young girl with the ability to communicate with animals embarked on a quest to save her forest from the encroaching darkness, accompanied by her loyal companions and ancient magic.",
    "The discovery of a forgotten letter tucked inside an old family heirloom unraveled a hidden history, leading to an unexpected journey through time, love, and sacrifice."
  ];
  

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
