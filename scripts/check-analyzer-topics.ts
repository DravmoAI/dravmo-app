import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Current analyzer topics:");

  const topics = await prisma.analyzerTopic.findMany({
    include: {
      analyzerSubtopics: {
        include: {
          analyzerPoints: true,
        },
      },
    },
  });

  topics.forEach((topic) => {
    console.log(`\n📋 ${topic.name} (${topic.id})`);
    console.log(`   Description: ${topic.description}`);
    console.log(`   Subtopics: ${topic.analyzerSubtopics.length}`);

    topic.analyzerSubtopics.forEach((subtopic) => {
      console.log(`   - ${subtopic.name} (${subtopic.analyzerPoints.length} points)`);
    });
  });

  console.log(`\nTotal topics: ${topics.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
