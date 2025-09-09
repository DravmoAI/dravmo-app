"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingProgressBar } from "@/components/loading-progress-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase";

interface Screen {
  id: string;
  projectId: string;
  sourceUrl: string;
  sourceType: "upload" | "figma";
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
}

interface DesignMaster {
  id: string;
  name: string;
  avatarUrl: string;
  fitSummary: string;
  philosophy: string;
  methodology: string[];
  signatureGestures: string[];
  talks: {
    title: string;
    content: string;
  }[];

  blogs: {
    title: string;
    content: string;
  }[];
}

interface AnalyzerPoint {
  id: string;
  name: string;
  description: string;
}

interface AnalyzerSubtopic {
  id: string;
  name: string;
  description: string;
  analyzerPoints: AnalyzerPoint[];
}

interface AnalyzerTopic {
  id: string;
  name: string;
  description: string;
  tier: string;
  analyzerSubtopics: AnalyzerSubtopic[];
}

interface SelectedAnalyzer {
  topicId: string;
  subtopicId: string;
  pointId: string;
}

export default function ScreenAnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const screenId = params.screenId as string;

  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [analyzerTopics, setAnalyzerTopics] = useState<AnalyzerTopic[]>([]);
  const [designMasters, setDesignMasters] = useState<DesignMaster[]>([]);
  const [selectedAnalyzers, setSelectedAnalyzers] = useState<SelectedAnalyzer[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("context");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [processedImageData, setProcessedImageData] = useState<any>(null);
  const [planInfo, setPlanInfo] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = getSupabaseClient();
  const [formData, setFormData] = useState({
    industry: "Education",
    productType: "Mobile App",
    purpose: "Learning Platform",
    audience: "Students",
    ageGroup: "18-25",
    brandPersonality: "Professional",
    platform: "Web",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch screen data
        const screenRes = await fetch(`/api/screens/${screenId}`);
        if (!screenRes.ok) throw new Error("Failed to fetch screen");
        const screenData = await screenRes.json();
        setScreen(screenData.screen);

        // Get user and plan info first
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Fetch analyzer topics (will be filtered based on user's plan)
        let analyzerData: any = null;
        if (session?.user) {
          const analyzerRes = await fetch(`/api/analyzer?userId=${session.user.id}`);
          if (!analyzerRes.ok) throw new Error("Failed to fetch analyzer topics");
          analyzerData = await analyzerRes.json();
          setAnalyzerTopics(analyzerData.topics);
          console.log(`Loaded ${analyzerData.topics.length} analyzer topics for user`);
        }

        // Fetch design masters
        const mastersRes = await fetch("/api/design-masters");
        if (!mastersRes.ok) throw new Error("Failed to fetch design masters");
        const mastersData = await mastersRes.json();
        setDesignMasters(mastersData.designMasters);

        if (session?.user) {
          setUserId(session.user.id);
          try {
            const planRes = await fetch(`/api/user-plan-info?userId=${session.user.id}`);
            if (planRes.ok) {
              console.log("planRes");

              const planData = await planRes.json();
              setPlanInfo(planData);
              console.log(planData);
            }
          } catch (error) {
            console.error("Error fetching plan info:", error);
          }

          // Pre-select the first point from the first subtopic of the first topic
          if (analyzerData.topics.length > 0) {
            const firstTopic = analyzerData.topics[0];
            if (firstTopic.analyzerSubtopics.length > 0) {
              const firstSubtopic = firstTopic.analyzerSubtopics[0];
              if (firstSubtopic.analyzerPoints.length > 0) {
                const firstPoint = firstSubtopic.analyzerPoints[0];
                setSelectedAnalyzers([
                  {
                    topicId: firstTopic.id,
                    subtopicId: firstSubtopic.id,
                    pointId: firstPoint.id,
                  },
                ]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [screenId]);

  const processImage = async (imageUrl: string) => {
    setImageProcessing(true);
    try {
      const formData = new FormData();
      formData.append("imageUrl", imageUrl);

      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const result = await response.json();
      setProcessedImageData(result.data);

      toast({
        title: "Success",
        description: "Image processed successfully!",
      });

      return result.data;
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setImageProcessing(false);
    }
  };

  const isPointSelected = (pointId: string) => {
    return selectedAnalyzers.some((analyzer) => analyzer.pointId === pointId);
  };

  const isSubtopicSelected = (subtopicId: string) => {
    return selectedAnalyzers.some((analyzer) => analyzer.subtopicId === subtopicId);
  };

  const isTopicSelected = (topicId: string) => {
    return selectedAnalyzers.some((analyzer) => analyzer.topicId === topicId);
  };

  const handlePointChange = (pointId: string, subtopicId: string, topicId: string) => {
    setSelectedAnalyzers((prev) => {
      const isSelected = prev.some((analyzer) => analyzer.pointId === pointId);

      if (isSelected) {
        // Remove the analyzer with this point
        return prev.filter((analyzer) => analyzer.pointId !== pointId);
      } else {
        // Add new analyzer
        return [
          ...prev,
          {
            topicId,
            subtopicId,
            pointId,
          },
        ];
      }
    });
  };

  const handleSubtopicChange = (subtopicId: string, topicId: string) => {
    const topic = analyzerTopics.find((t) => t.id === topicId);
    if (!topic) return;

    const subtopic = topic.analyzerSubtopics.find((s) => s.id === subtopicId);
    if (!subtopic) return;

    const isSelected = isSubtopicSelected(subtopicId);

    if (isSelected) {
      // Remove all analyzers for this subtopic
      setSelectedAnalyzers((prev) => prev.filter((analyzer) => analyzer.subtopicId !== subtopicId));
    } else {
      // Add all points from this subtopic
      const newAnalyzers = subtopic.analyzerPoints.map((point) => ({
        topicId,
        subtopicId,
        pointId: point.id,
      }));

      setSelectedAnalyzers((prev) => [
        ...prev.filter((analyzer) => analyzer.subtopicId !== subtopicId),
        ...newAnalyzers,
      ]);
    }
  };

  const handleTopicChange = (topicId: string) => {
    const topic = analyzerTopics.find((t) => t.id === topicId);
    if (!topic) return;

    const isSelected = isTopicSelected(topicId);

    if (isSelected) {
      // Remove all analyzers for this topic
      setSelectedAnalyzers((prev) => prev.filter((analyzer) => analyzer.topicId !== topicId));
    } else {
      // Add all points from all subtopics of this topic
      const newAnalyzers: SelectedAnalyzer[] = [];

      topic.analyzerSubtopics.forEach((subtopic) => {
        subtopic.analyzerPoints.forEach((point) => {
          newAnalyzers.push({
            topicId,
            subtopicId: subtopic.id,
            pointId: point.id,
          });
        });
      });

      setSelectedAnalyzers((prev) => [
        ...prev.filter((analyzer) => analyzer.topicId !== topicId),
        ...newAnalyzers,
      ]);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAnalyze = async () => {
    const isMasterMode = activeTab === "master";

    if (!isMasterMode && selectedAnalyzers.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one analysis point.",
        variant: "destructive",
      });
      return;
    }

    if (isMasterMode && !selectedMaster) {
      toast({
        title: "Selection Required",
        description: "Please select a design master for analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!screen?.sourceUrl) {
      toast({
        title: "Error",
        description: "No image found to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Check plan restrictions
    if (planInfo) {
      if (planInfo.usage.remainingQueries <= 0) {
        toast({
          title: "Query Limit Reached",
          description:
            planInfo.restrictions.maxQueriesPerMonth === 0
              ? "You've reached your monthly query limit. Upgrade your plan for more queries."
              : `You've used all ${planInfo.usage.currentQueriesThisMonth} queries this month. Upgrade your plan for more queries.`,
          variant: "destructive",
        });

        const shouldUpgrade = confirm(
          `You've reached your monthly query limit of ${planInfo.usage.currentQueriesThisMonth} queries.\n\nWould you like to upgrade your plan for more queries?`
        );

        if (shouldUpgrade) {
          startTransition(() => {
            router.push("/billing");
          });
        }
        return;
      }

      if (isMasterMode && !planInfo.restrictions.canUseMasterMode) {
        toast({
          title: "Master Mode Not Available",
          description:
            "Master mode is only available on paid plans. Upgrade to access this feature.",
          variant: "destructive",
        });

        const shouldUpgrade = confirm(
          "Master mode is only available on paid plans.\n\nWould you like to upgrade your plan to access this feature?"
        );

        if (shouldUpgrade) {
          startTransition(() => {
            router.push("/billing");
          });
        }
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // First, process the image to get base64 data
      let imageData = processedImageData;
      if (!imageData) {
        toast({
          title: "Processing Image",
          description: "Converting image for AI analysis...",
        });
        imageData = await processImage(screen.sourceUrl);
      }

      // Now proceed with the feedback query creation
      const response = await fetch("/api/feedback-queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenId,
          projectId,
          designMasterId: isMasterMode ? selectedMaster : null,
          industry: formData.industry,
          productType: formData.productType,
          purpose: formData.purpose,
          audience: formData.audience,
          ageGroup: formData.ageGroup,
          brandPersonality: formData.brandPersonality,
          platform: formData.platform,
          selectedAnalyzers: isMasterMode ? [] : selectedAnalyzers,
          imageData: imageData, // Include the processed image data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle plan restriction errors
        if (errorData.code === "QUERY_LIMIT_EXCEEDED") {
          toast({
            title: "Query Limit Reached",
            description: errorData.error,
            variant: "destructive",
          });

          const shouldUpgrade = confirm(
            `${errorData.error}\n\nWould you like to upgrade your plan for more queries?`
          );

          if (shouldUpgrade) {
            startTransition(() => {
              router.push("/billing");
            });
          }
          return;
        }

        if (errorData.code === "MASTER_MODE_NOT_ALLOWED") {
          toast({
            title: "Master Mode Not Available",
            description: errorData.error,
            variant: "destructive",
          });

          const shouldUpgrade = confirm(
            `${errorData.error}\n\nWould you like to upgrade your plan to access this feature?`
          );

          if (shouldUpgrade) {
            startTransition(() => {
              router.push("/billing");
            });
          }
          return;
        }

        throw new Error(errorData.error || "Failed to create feedback query");
      }

      const data = await response.json();
      startTransition(() => {
        router.push(data.redirectUrl);
      });
    } catch (error) {
      console.error("Error creating feedback query:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading analysis options...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!screen) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Screen not found</h2>
            <p className="text-muted-foreground mb-6">
              The screen you're looking for doesn't exist or has been removed.
            </p>
            <Link href={`/projects/${projectId}`}>
              <Button>Back to Project</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LoadingProgressBar isPending={isPending} />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/projects/${projectId}/screens/${screenId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Screen
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-krona-one">Analyze Design</h2>
            <p className="text-muted-foreground mb-8">
              Configure analysis options for{" "}
              <span className="font-medium">{screen.project?.name}</span>
            </p>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4 relative">
                  <img
                    src={screen.sourceUrl || "/placeholder.svg"}
                    alt="Design to analyze"
                    className="w-full h-full object-cover"
                  />
                  {imageProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Processing image...</p>
                      </div>
                    </div>
                  )}
                  {processedImageData && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      ✓ Processed
                    </div>
                  )}
                </div>
                {processedImageData && (
                  <div className="text-sm text-muted-foreground">
                    <p>Image processed successfully!</p>
                    <p>MIME Type: {processedImageData.mime_type}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-krona-one">Analysis Configuration</h3>
                {planInfo && (
                  <div className="text-sm text-muted-foreground">
                    Queries this month: {planInfo.usage.currentQueriesThisMonth}/
                    {planInfo.restrictions.maxQueriesPerMonth}
                    {planInfo.usage.remainingQueries === 0 && (
                      <span className="text-destructive ml-2">(Limit reached)</span>
                    )}
                  </div>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="context">Context Setup</TabsTrigger>
                  <TabsTrigger
                    value="master"
                    disabled={planInfo && !planInfo.restrictions.canUseMasterMode}
                    className={
                      planInfo && !planInfo.restrictions.canUseMasterMode ? "opacity-50" : ""
                    }
                  >
                    Master Mode {planInfo && !planInfo.restrictions.canUseMasterMode && "(Premium)"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="context" className="space-y-4 mt-6">
                  <p className="text-muted-foreground">
                    Configure the context and criteria for AI-powered design analysis.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="font-quantico">
                        Industry
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleSelectChange("industry", value)}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productType" className="font-quantico">
                        Product Type
                      </Label>
                      <Select
                        value={formData.productType}
                        onValueChange={(value) => handleSelectChange("productType", value)}
                      >
                        <SelectTrigger id="productType">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                          <SelectItem value="Landing Page">Landing Page</SelectItem>
                          <SelectItem value="Web Application">Web Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose" className="font-quantico">
                      Purpose
                    </Label>
                    <Select
                      value={formData.purpose}
                      onValueChange={(value) => handleSelectChange("purpose", value)}
                    >
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Learning Platform">Learning Platform</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Social Networking">Social Networking</SelectItem>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Information">Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="font-quantico">
                      Target Audience
                    </Label>
                    <Select
                      value={formData.audience}
                      onValueChange={(value) => handleSelectChange("audience", value)}
                    >
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Professionals">Professionals</SelectItem>
                        <SelectItem value="General Public">General Public</SelectItem>
                        <SelectItem value="Specialized Field">Specialized Field</SelectItem>
                        <SelectItem value="Children">Children</SelectItem>
                        <SelectItem value="Seniors">Seniors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageGroup" className="font-quantico">
                      Age Group
                    </Label>
                    <Select
                      value={formData.ageGroup}
                      onValueChange={(value) => handleSelectChange("ageGroup", value)}
                    >
                      <SelectTrigger id="ageGroup">
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under 18">Under 18</SelectItem>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-45">36-45</SelectItem>
                        <SelectItem value="46-55">46-55</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandPersonality" className="font-quantico">
                      Brand Personality
                    </Label>
                    <Select
                      value={formData.brandPersonality}
                      onValueChange={(value) => handleSelectChange("brandPersonality", value)}
                    >
                      <SelectTrigger id="brandPersonality">
                        <SelectValue placeholder="Select brand personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Playful">Playful</SelectItem>
                        <SelectItem value="Innovative">Innovative</SelectItem>
                        <SelectItem value="Trustworthy">Trustworthy</SelectItem>
                        <SelectItem value="Bold">Bold</SelectItem>
                        <SelectItem value="Minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform" className="font-quantico">
                      Platform
                    </Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) => handleSelectChange("platform", value)}
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web">Web</SelectItem>
                        <SelectItem value="iOS">iOS</SelectItem>
                        <SelectItem value="Android">Android</SelectItem>
                        <SelectItem value="Cross-platform">Cross-platform</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="master" className="space-y-4 mt-6">
                  <p className="text-muted-foreground">
                    Select a design master to analyze your design through their unique perspective
                    and philosophy.
                  </p>
                  <div className="grid gap-3">
                    {designMasters.map((master) => (
                      <Card
                        key={master.id}
                        className={`cursor-pointer transition-all ${
                          selectedMaster === master.id
                            ? "border-primary"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedMaster(master.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                              <img
                                src={master.avatarUrl || "/placeholder-user.jpg"}
                                alt={master.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold">{master.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Philosophy: {master.philosophy}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Speciality: <strong>{master.signatureGestures.join(", ")}</strong>
                              </p>
                            </div>
                            {selectedMaster === master.id && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <div className="sticky top-[240px]">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 font-krona-one">Analysis Topics</h3>
                  {activeTab === "context" ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {analyzerTopics.map((topic) => (
                        <Accordion
                          type="single"
                          collapsible
                          key={topic.id}
                          className="border rounded-md"
                        >
                          <AccordionItem value={topic.id} className="border-none">
                            <AccordionTrigger className="px-4 py-2 hover:no-underline">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`topic-${topic.id}`}
                                  checked={isTopicSelected(topic.id)}
                                  onCheckedChange={() => handleTopicChange(topic.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={
                                    topic.tier === "premium" &&
                                    planInfo &&
                                    !planInfo.restrictions.canUsePremiumAnalyzers
                                  }
                                />
                                <Label
                                  htmlFor={`topic-${topic.id}`}
                                  className={`font-medium cursor-pointer font-quantico ${
                                    topic.tier === "premium" &&
                                    planInfo &&
                                    !planInfo.restrictions.canUsePremiumAnalyzers
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      topic.tier === "premium" &&
                                      planInfo &&
                                      !planInfo.restrictions.canUsePremiumAnalyzers
                                    ) {
                                      toast({
                                        title: "Premium Feature",
                                        description:
                                          "This analyzer is only available on paid plans. Upgrade to access premium analyzers.",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    handleTopicChange(topic.id);
                                  }}
                                >
                                  {topic.name}
                                  {topic.tier === "premium" && (
                                    <span className="ml-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                                      Premium
                                    </span>
                                  )}
                                </Label>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-2">
                              <p className="text-sm text-muted-foreground mb-3">
                                {topic.description}
                              </p>
                              <div className="space-y-1 pl-6">
                                {topic.analyzerSubtopics.map((subtopic) => (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    key={subtopic.id}
                                    className="border rounded-md mt-2"
                                  >
                                    <AccordionItem value={subtopic.id} className="border-none">
                                      <AccordionTrigger className="px-4 py-2 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                          <Checkbox
                                            id={`subtopic-${subtopic.id}`}
                                            checked={isSubtopicSelected(subtopic.id)}
                                            onCheckedChange={() =>
                                              handleSubtopicChange(subtopic.id, topic.id)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={
                                              topic.tier === "premium" &&
                                              planInfo &&
                                              !planInfo.restrictions.canUsePremiumAnalyzers
                                            }
                                          />
                                          <Label
                                            htmlFor={`subtopic-${subtopic.id}`}
                                            className={`font-medium cursor-pointer font-quantico ${
                                              topic.tier === "premium" &&
                                              planInfo &&
                                              !planInfo.restrictions.canUsePremiumAnalyzers
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (
                                                topic.tier === "premium" &&
                                                planInfo &&
                                                !planInfo.restrictions.canUsePremiumAnalyzers
                                              ) {
                                                return;
                                              }
                                              handleSubtopicChange(subtopic.id, topic.id);
                                            }}
                                          >
                                            {subtopic.name}
                                          </Label>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="px-4 pb-2">
                                        <p className="text-sm text-muted-foreground mb-3">
                                          {subtopic.description}
                                        </p>
                                        <div className="space-y-2 pl-6">
                                          {subtopic.analyzerPoints.map((point) => (
                                            <div key={point.id} className="flex items-center gap-3">
                                              <Checkbox
                                                id={`point-${point.id}`}
                                                checked={isPointSelected(point.id)}
                                                onCheckedChange={() =>
                                                  handlePointChange(point.id, subtopic.id, topic.id)
                                                }
                                                disabled={
                                                  topic.tier === "premium" &&
                                                  planInfo &&
                                                  !planInfo.restrictions.canUsePremiumAnalyzers
                                                }
                                              />
                                              <div>
                                                <Label
                                                  htmlFor={`point-${point.id}`}
                                                  className={`font-medium cursor-pointer font-quantico ${
                                                    topic.tier === "premium" &&
                                                    planInfo &&
                                                    !planInfo.restrictions.canUsePremiumAnalyzers
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : ""
                                                  }`}
                                                >
                                                  {point.name}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                  {point.description}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-4 text-center text-muted-foreground">
                      <p>
                        Analysis topics are automatically determined based on the chosen design
                        master's expertise.
                      </p>
                    </div>
                  )}

                  <div className="mt-8">
                    <Button
                      onClick={handleAnalyze}
                      className="w-full gap-2"
                      disabled={
                        (activeTab === "context" && selectedAnalyzers.length === 0) ||
                        (activeTab === "master" && !selectedMaster) ||
                        isSubmitting ||
                        imageProcessing
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : imageProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing Image...
                        </>
                      ) : (
                        <>
                          Analyze with Dravmo <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
