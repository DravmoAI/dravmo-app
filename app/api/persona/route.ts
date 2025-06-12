import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      personaCardId,
      colorBoldness,
      typeTemperament,
      spacingAiriness,
      motionDrama,
      keywords,
      moodboardUrls,
    } = body;

    // Create persona in a transaction
    const persona = await prisma.$transaction(async (tx) => {
      // Create the persona
      const newPersona = await tx.persona.create({
        data: {
          userId,
          personaCardId,
        },
      });

      // Create persona vibe
      await tx.personaVibe.create({
        data: {
          personaId: newPersona.id,
          colorBoldness,
          typeTemperament,
          spacingAiriness,
          motionDrama,
        },
      });

      // Create persona keywords
      if (keywords && keywords.length > 0) {
        await tx.personaKeyword.createMany({
          data: keywords.map((keyword: string) => ({
            personaId: newPersona.id,
            keyword,
          })),
        });
      }

      // Create persona moodboards
      if (moodboardUrls && moodboardUrls.length > 0) {
        await tx.personaMoodboard.createMany({
          data: moodboardUrls.map((url: string) => ({
            personaId: newPersona.id,
            snapshotUrl: url,
          })),
        });
      }

      // Update profile to mark persona as completed
      await tx.profile.update({
        where: { id: userId },
        data: {
          // Any additional profile updates
        },
      });

      // Return the complete persona with relations
      return tx.persona.findUnique({
        where: { id: newPersona.id },
        include: {
          personaCard: true,
          personaVibes: true,
          personaKeywords: true,
          personaMoodboards: true,
        },
      });
    });

    return NextResponse.json({ persona }, { status: 201 });
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json({ error: "Failed to create persona" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      personaCardId,
      colorBoldness,
      typeTemperament,
      spacingAiriness,
      motionDrama,
      keywords,
      moodboardUrls,
    } = body;

    // Update persona in a transaction with increased timeout
    const persona = await prisma.$transaction(
      async (tx) => {
        // Update the persona
        const updatedPersona = await tx.persona.update({
          where: { id },
          data: {
            personaCardId,
          },
        });

        // Update or create persona vibe
        await tx.personaVibe.upsert({
          where: { id }, // Use the unique id field
          update: {
            colorBoldness,
            typeTemperament,
            spacingAiriness,
            motionDrama,
          },
          create: {
            personaId: id,
            colorBoldness,
            typeTemperament,
            spacingAiriness,
            motionDrama,
          },
        });

        // Delete existing keywords and create new ones
        await tx.personaKeyword.deleteMany({
          where: { personaId: id },
        });

        if (keywords && keywords.length > 0) {
          await tx.personaKeyword.createMany({
            data: keywords.map((keyword: string) => ({
              personaId: id,
              keyword,
            })),
          });
        }

        // Handle moodboard updates if provided
        if (moodboardUrls && moodboardUrls.length > 0) {
          // Delete existing moodboards
          await tx.personaMoodboard.deleteMany({
            where: { personaId: id },
          });

          // Create new moodboards
          await tx.personaMoodboard.createMany({
            data: moodboardUrls.map((url: string) => ({
              personaId: id,
              snapshotUrl: url,
            })),
          });
        }

        // Return the updated persona with relations
        return tx.persona.findUnique({
          where: { id },
          include: {
            personaCard: true,
            personaVibes: true,
            personaKeywords: true,
            personaMoodboards: true,
          },
        });
      },
      {
        timeout: 10000, // 10 seconds max execution time
        maxWait: 10000, // 10 seconds to acquire a DB connection
      }
    );

    return NextResponse.json({ persona }, { status: 200 });
  } catch (error) {
    console.error("Error updating persona:", error);
    return NextResponse.json({ error: "Failed to update persona" }, { status: 500 });
  }
}
