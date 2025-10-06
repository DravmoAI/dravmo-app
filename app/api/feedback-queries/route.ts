import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanRestrictionsService } from "@/lib/services/plan-restrictions";

interface SelectedAnalyzer {
  topicId: string;
  subtopicId: string;
  pointId: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body parsed:", body);

    const {
      screenId,
      designMasterId,
      industry,
      productType,
      purpose,
      audience,
      ageGroup,
      brandPersonality,
      platform,
      selectedAnalyzers,
      imageData,
    } = body;

    if (!screenId) {
      console.log("Validation failed: ScreenId is required");
      return NextResponse.json({ error: "ScreenId is required" }, { status: 400 });
    }

    if ((!selectedAnalyzers || selectedAnalyzers.length === 0) && !designMasterId) {
      console.log("Validation failed: At least one analyzer must be selected");
      return NextResponse.json(
        { error: "At least one analyzer must be selected" },
        { status: 400 }
      );
    }

    if (!imageData) {
      console.log("Validation failed: Image data is required");
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Get the user ID from the screen's project
    const screenWithProject = await prisma.screen.findUnique({
      where: { id: screenId },
      include: {
        project: true,
      },
    });

    if (!screenWithProject) {
      console.log("Screen not found:", screenId);
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    const userId = screenWithProject.project.userId;

    // Check if user can create a new feedback query
    const canCreate = await PlanRestrictionsService.canCreateFeedbackQuery(userId);
    if (!canCreate.allowed) {
      console.log("Query limit exceeded:", canCreate.reason);
      return NextResponse.json(
        {
          error: canCreate.reason,
          code: "QUERY_LIMIT_EXCEEDED",
          upgradeRequired: canCreate.upgradeRequired,
        },
        { status: 403 }
      );
    }

    // Check if user can use master mode (if designMasterId is provided)
    if (designMasterId) {
      const canUseMaster = await PlanRestrictionsService.canUseMasterMode(userId);
      if (!canUseMaster.allowed) {
        console.log("Master mode not allowed:", canUseMaster.reason);
        return NextResponse.json(
          {
            error: canUseMaster.reason,
            code: "MASTER_MODE_NOT_ALLOWED",
            upgradeRequired: canUseMaster.upgradeRequired,
          },
          { status: 403 }
        );
      }
    }

    // Check if user can use selected analyzers
    if (selectedAnalyzers && selectedAnalyzers.length > 0) {
      // Get analyzer topics to check names
      const analyzerTopics = await prisma.analyzerTopic.findMany();

      for (const selectedAnalyzer of selectedAnalyzers) {
        const topic = analyzerTopics.find((t) => t.id === selectedAnalyzer.topicId);
        if (topic) {
          const canUseAnalyzer = await PlanRestrictionsService.canUseAnalyzer(userId, topic.name);
          if (!canUseAnalyzer.allowed) {
            console.log("Analyzer not allowed:", canUseAnalyzer.reason);
            return NextResponse.json(
              {
                error: canUseAnalyzer.reason,
                code: "ANALYZER_NOT_ALLOWED",
                upgradeRequired: canUseAnalyzer.upgradeRequired,
                analyzerName: topic.name,
              },
              { status: 403 }
            );
          }
        }
      }
    }

    // Use the screen we already fetched
    const screen = screenWithProject;
    console.log("Screen fetched:", screen);

    // Create the feedback query
    const feedbackQuery = await prisma.feedbackQuery.create({
      data: {
        screen: {
          connect: { id: screenId },
        },
        ...(designMasterId && {
          designMaster: {
            connect: { id: designMasterId },
          },
        }),
        industry,
        productType,
        purpose,
        audience,
        ageGroup,
        brandPersonality,
        platform: platform || "Web",
      },
    });
    console.log("Feedback query created:", feedbackQuery);

    // Create the selected analyzers
    const analyzerData = selectedAnalyzers.map((analyzer: SelectedAnalyzer) => ({
      topicId: analyzer.topicId,
      pointId: analyzer.pointId,
      subtopicId: analyzer.subtopicId,
      feedbackQueryId: feedbackQuery.id,
    }));
    console.log("Analyzer data prepared:", analyzerData);

    await prisma.selectAnalyzer.createMany({
      data: analyzerData,
    });
    console.log("Selected analyzers created");

    // Get the count of existing feedback results
    const existingFeedbackCount = await prisma.feedbackResult.count({
      where: {
        feedbackQuery: {
          screenId: screenId,
        },
      },
    });
    console.log("Existing feedback count fetched:", existingFeedbackCount);

    // Generate version number
    const versionNumber = existingFeedbackCount + 1;
    const version = `v${versionNumber}`;
    console.log("Version number generated:", version);

    let reviewResult;

    if (designMasterId) {
      // Fetch design master details
      const designMaster = await prisma.designMaster.findUnique({
        where: { id: designMasterId },
        include: {
          talks: true,
          blogs: true,
        },
      });
      console.log("Design master fetched:", designMaster);

      if (!designMaster) {
        console.log("Design master not found:", designMasterId);
        return NextResponse.json({ error: "Design master not found" }, { status: 404 });
      }

      // Fetch expert advice
      const expertResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/expert-advice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metadata: {
              industry,
              productType,
              brandPersonality,
              ageGroup,
              platform,
            },
            expertDetails: {
              name: designMaster.name,
              philosophy: designMaster.philosophy,
              methodology: designMaster.methodology,
              signatureGestures: designMaster.signatureGestures,
              talks: designMaster.talks.map((talk) => ({
                title: talk.title,
                content: talk.content,
              })),
              blogs: designMaster.blogs.map((blog) => ({
                title: blog.title,
                content: blog.content,
              })),
            },
            imageData,
          }),
        }
      );
      console.log("Expert advice response fetched:", expertResponse);

      if (!expertResponse.ok) {
        console.log("Failed to fetch expert advice");
        throw new Error("Failed to get expert advice");
      }

      reviewResult = await expertResponse.json();
      console.log("Expert advice received:", reviewResult);
    } else {
      // Fetch analyzer topics
      const analyzerTopics = await prisma.analyzerTopic.findMany({
        include: {
          analyzerSubtopics: {
            include: {
              analyzerPoints: true,
            },
          },
        },
      });
      console.log("Analyzer topics fetched:", analyzerTopics);

      const criterias: any = {};

      selectedAnalyzers.forEach((selectedAnalyzer: SelectedAnalyzer) => {
        const topic = analyzerTopics.find((t) => t.id === selectedAnalyzer.topicId);
        const subtopic = topic?.analyzerSubtopics.find((s) => s.id === selectedAnalyzer.subtopicId);
        const point = subtopic?.analyzerPoints.find((p) => p.id === selectedAnalyzer.pointId);

        if (topic && subtopic && point) {
          if (!criterias[topic.name]) {
            criterias[topic.name] = {};
          }

          if (!criterias[topic.name][subtopic.name]) {
            criterias[topic.name][subtopic.name] = [];
          }

          if (!criterias[topic.name][subtopic.name].includes(point.name)) {
            criterias[topic.name][subtopic.name].push(point.name);
          }
        }
      });
      console.log("Criterias object built:", criterias);

      // Fetch general review
      const generalResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/general-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metadata: {
              industry,
              productType,
              brandPersonality,
              ageGroup,
              platform,
            },
            criterias,
            imageData,
          }),
        }
      );
      console.log("General review response fetched:", generalResponse);

      if (!generalResponse.ok) {
        console.log("Failed to fetch general review");
        throw new Error("Failed to generate AI review");
      }

      reviewResult = await generalResponse.json();
      console.log("General review received:", reviewResult);
    }

    if (!reviewResult.success) {
      console.log("AI review failed:", reviewResult.error || "Unknown error");
      throw new Error(reviewResult.error || "AI review failed");
    }

    // Create feedback result
    const feedbackResult = await prisma.feedbackResult.create({
      data: {
        feedbackQuery: {
          connect: { id: feedbackQuery.id },
        },
        feedbackSummary: JSON.stringify(reviewResult.data),
        version: version,
      },
    });
    console.log("Feedback result created:", feedbackResult);

    return NextResponse.json(
      {
        feedbackQuery,
        feedbackResult,
        redirectUrl: `/projects/${body.projectId}/screens/${screenId}/feedback/${feedbackResult.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating feedback query:", error);
    return NextResponse.json({ error: "Failed to create feedback query" }, { status: 500 });
  }
}
