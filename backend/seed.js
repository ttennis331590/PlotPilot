const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const prompts = [
  "The sun beat down on the arid desert as Dr. Alistair Harrison and his team of archaeologists uncovered the entrance to a previously unknown tomb. They had been searching for months, and now, as they descended into the dark, damp chamber, the air crackled with anticipation. Alistair's hand trembled as he reached for the seemingly innocuous artifact that lay before him, and as he touched it, the tomb began to rumble.",
  
  "Ellen had always been intrigued by the abandoned lighthouse on the cliff, but it wasn't until her 16th birthday that she found the courage to venture inside. Climbing the winding staircase, she discovered a door that led to a hidden chamber filled with dusty books and strange artifacts. As she dusted off the cover of a peculiar leather-bound tome, its pages flew open, revealing a cryptic message that would change her life forever.",
  
  "Detective Richardson had worked on countless cases, but none as puzzling as this one. The victim was found in a locked room, with no signs of forced entry, and no apparent cause of death. As he examined the scene, he noticed a series of cryptic symbols painted on the wall. Just as he was about to leave, a hidden compartment swung open, revealing a single note that read, \"Welcome to the game.\"",
  
  "Dr. Emilia Jackson was an accomplished scientist, well-known for her groundbreaking research in genetic engineering. However, her latest project had her colleagues questioning her ethics. It was the creation of an entirely new species, a hybrid between a human and a wolf. As she prepared to inject the serum into her first test subject, she wondered if she was crossing a line she could never come back from. The subject's eyes flashed red, and a chilling howl echoed through the laboratory.",
  
  "It was a day like any other, until the sky turned a dark shade of purple and the earth trembled beneath their feet. Panic spread across the town as the strange phenomenon continued, and people began to disappear one by one. Huddled together, Sarah and her friends discovered an old book in the attic, which seemed to hold the answers they were looking for. As they read the ominous passage aloud, the ground split open, revealing an ancient secret.",
  
  "In a world where humans could communicate with animals, nine-year-old Noah discovered he had a unique gift. He could not only speak to animals but could also understand their thoughts and feelings. As he walked through the forest one day, he heard a desperate plea for help from an injured deer. As he approached the animal, a hidden door in the trunk of a giant tree creaked open, revealing a mystical world in danger.",
  
  "The year was 2150, and humanity had successfully colonized Mars. The first settlers, including scientist Maria Vasquez, were busy building a new life on the Red Planet. While exploring a nearby cave system, Maria stumbled upon an artifact that seemed to defy all logic. It appeared to be a human skull, but with an otherworldly twist. As she reached out to touch it,the skull emitted a blinding light, and Maria suddenly found herself somewhere... or some time... else.",

  "A prestigious academy for young witches and wizards had just accepted its newest student, Elara. While exploring the enchanted library, Elara came across a forbidden section filled with dusty, ancient tomes. With her curiosity piqued, she opened a book titled 'The Lost Spells of Avalon.' As she whispered the first incantation, the room began to spin, and she was transported to an unfamiliar place, where danger lurked around every corner.",
  
  "Dr. Simon Lancaster was a renowned inventor, always pushing the boundaries of what was possible. His latest project was a time-traveling device, which he believed could change the world. As he flipped the switch for the first time, a sudden surge of energy sent him back to the year 1942, right in the midst of World War II. Simon's presence had a ripple effect on history, and as he struggled to set things right, a mysterious figure appeared with a dire warning.",
  
  "All her life, Amelia had been told the story of the enchanted forest that lay just beyond the border of her small village. Tales of magical creatures, hidden treasures, and dangerous curses filled her dreams. One fateful day, Amelia ventured into the forest and discovered a beautiful, glowing flower. As she reached out to touch it, her world turned upside down, and she found herself in the middle of a battle between light and darkness.",
  
  "The old mansion at the end of the lane had been abandoned for decades, shrouded in mystery and rumors of dark magic. As teenagers, Jack and his friends dared each other to enter and explore. Inside, they discovered a hidden room filled with strange symbols and a peculiar mirror. When Jack looked into the mirror, his reflection seemed to take on a life of its own, and a sinister voice whispered a chilling prophecy.",
  
  "It was said that every thousand years, the planets aligned and granted extraordinary power to those who knew how to harness it. Astronomer Sylvia had spent her entire career studying the phenomenon, and as the moment approached, she prepared to unlock the secrets of the universe. As she performed the ancient ritual under the cosmic light show, she felt a surge of energy pulsating through her veins, and a sudden, earth-shattering revelation.",
  
  "In a world ravaged by pollution and climate change, a group of scientists discovered a hidden utopia deep beneath the ocean's surface. They called it 'Atlantis Reborn,' and marveled at its pristine beauty and advanced technology. But as they explored the depths of the underwater city, they uncovered a dark secret that threatened not only their newfound paradise but the entire world above.",
  
  "As a child, Thomas had always been captivated by the stars, believing that they held the key to unlocking the secrets of the universe. Now an accomplished astrophysicist, he had finally decoded an ancient celestial message that pointed to the existence of a powerful, otherworldly artifact. As Thomas followed the map's cryptic instructions, he found himself in a remote cave, standing before a shimmering object that seemed to defy the laws of physics. The moment he touched it, his life was forever changed."
  ];

const sampleStories = [
  "The sun beat down on the arid desert as Dr. Alistair Harrison and his team of archaeologists uncovered the entrance to a previously unknown tomb. They had been searching for months, and now, as they descended into the dark, damp chamber, the air crackled with anticipation. Alistair's hand trembled as he reached for the seemingly innocuous artifact that lay before him, and as he touched it, the tomb began to rumble.",
  
  "Ellen had always been intrigued by the abandoned lighthouse on the cliff, but it wasn't until her 16th birthday that she found the courage to venture inside. Climbing the winding staircase, she discovered a door that led to a hidden chamber filled with dusty books and strange artifacts. As she dusted off the cover of a peculiar leather-bound tome, its pages flew open, revealing a cryptic message that would change her life forever.",
  
  "Detective Richardson had worked on countless cases, but none as puzzling as this one. The victim was found in a locked room, with no signs of forced entry, and no apparent cause of death. As he examined the scene, he noticed a series of cryptic symbols painted on the wall. Just as he was about to leave, a hidden compartment swung open, revealing a single note that read, \"Welcome to the game.\"",
  
  "Dr. Emilia Jackson was an accomplished scientist, well-known for her groundbreaking research in genetic engineering. However, her latest project had her colleagues questioning her ethics. It was the creation of an entirely new species, a hybrid between a human and a wolf. As she prepared to inject the serum into her first test subject, she wondered if she was crossing a line she could never come back from. The subject's eyes flashed red, and a chilling howl echoed through the laboratory.",
  
  "It was a day like any other, until the sky turned a dark shade of purple and the earth trembled beneath their feet. Panic spread across the town as the strange phenomenon continued, and people began to disappear one by one. Huddled together, Sarah and her friends discovered an old book in the attic, which seemed to hold the answers they were looking for. As they read the ominous passage aloud, the ground split open, revealing an ancient secret.",
  
  "In a world where humans could communicate with animals, nine-year-old Noah discovered he had a unique gift. He could not only speak to animals but could also understand their thoughts and feelings. As he walked through the forest one day, he heard a desperate plea for help from an injured deer. As he approached the animal, a hidden door in the trunk of a giant tree creaked open, revealing a mystical world in danger.",
  
  "The year was 2150, and humanity had successfully colonized Mars. The first settlers, including scientist Maria Vasquez, were busy building a new life on the Red Planet. While exploring a nearby cave system, Maria stumbled upon an artifact that seemed to defy all logic. It appeared to be a human skull, but with an otherworldly twist. As she reached out to touch it,the skull emitted a blinding light, and Maria suddenly found herself somewhere... or some time... else.",

  "A prestigious academy for young witches and wizards had just accepted its newest student, Elara. While exploring the enchanted library, Elara came across a forbidden section filled with dusty, ancient tomes. With her curiosity piqued, she opened a book titled 'The Lost Spells of Avalon.' As she whispered the first incantation, the room began to spin, and she was transported to an unfamiliar place, where danger lurked around every corner.",
  
  "Dr. Simon Lancaster was a renowned inventor, always pushing the boundaries of what was possible. His latest project was a time-traveling device, which he believed could change the world. As he flipped the switch for the first time, a sudden surge of energy sent him back to the year 1942, right in the midst of World War II. Simon's presence had a ripple effect on history, and as he struggled to set things right, a mysterious figure appeared with a dire warning.",
  
  "All her life, Amelia had been told the story of the enchanted forest that lay just beyond the border of her small village. Tales of magical creatures, hidden treasures, and dangerous curses filled her dreams. One fateful day, Amelia ventured into the forest and discovered a beautiful, glowing flower. As she reached out to touch it, her world turned upside down, and she found herself in the middle of a battle between light and darkness.",
  
  "The old mansion at the end of the lane had been abandoned for decades, shrouded in mystery and rumors of dark magic. As teenagers, Jack and his friends dared each other to enter and explore. Inside, they discovered a hidden room filled with strange symbols and a peculiar mirror. When Jack looked into the mirror, his reflection seemed to take on a life of its own, and a sinister voice whispered a chilling prophecy.",
  
  "It was said that every thousand years, the planets aligned and granted extraordinary power to those who knew how to harness it. Astronomer Sylvia had spent her entire career studying the phenomenon, and as the moment approached, she prepared to unlock the secrets of the universe. As she performed the ancient ritual under the cosmic light show, she felt a surge of energy pulsating through her veins, and a sudden, earth-shattering revelation.",
  
  "In a world ravaged by pollution and climate change, a group of scientists discovered a hidden utopia deep beneath the ocean's surface. They called it 'Atlantis Reborn,' and marveled at its pristine beauty and advanced technology. But as they explored the depths of the underwater city, they uncovered a dark secret that threatened not only their newfound paradise but the entire world above.",
  
  "As a child, Thomas had always been captivated by the stars, believing that they held the key to unlocking the secrets of the universe. Now an accomplished astrophysicist, he had finally decoded an ancient celestial message that pointed to the existence of a powerful, otherworldly artifact. As Thomas followed the map's cryptic instructions, he found himself in a remote cave, standing before a shimmering object that seemed to defy the laws of physics. The moment he touched it, his life was forever changed."
  ];

async function main() {
  // Clear the database
  await prisma.story.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`ALTER TABLE Prompt AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE Story AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1;`;


  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "testuser",
      password: "testpassword",
    },
  });

  // Create prompts
  const promptPromises = prompts.map((promptContent) =>
    prisma.prompt.create({
      data: {
        content: promptContent,
      },
    })
  );
  const createdPrompts = await Promise.all(promptPromises);

  const storyPromises = createdPrompts.map(async (prompt, index) => {
    const content = sampleStories[index] || ""; // Default to empty string if no matching story
    return prisma.story.create({
      data: {
        content,
        author: {
          connect: {
            id: newUser.id,
          },
        },
        prompt: {
          connect: {
            id: prompt.id,
          },
        },
      },
    });
  });

  await Promise.all(storyPromises);

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
