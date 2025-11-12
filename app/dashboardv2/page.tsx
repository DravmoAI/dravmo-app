"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Image from "next/image";
import { getSupabaseClient } from "@/lib/supabase";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { DarkVeil } from "@/components/DarkVeil";
import { DashboardNav } from "@/components/dashboard-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Figma, HelpCircle, Lightbulb, Play, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex gap-3 my-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10">
          <Image src="/logo.svg" alt="Dravmo Logo" width={30} height={30} />
        </div> 
      )}
      <div
        className={`p-3 rounded-2xl max-w-lg ${
          isUser
            ? "bg-cyan-400/20 border border-cyan-400/30 text-white"
            : "bg-white/10 border border-white/20 text-white/90"
        }`}
      >
        <p className="font-roboto-flex text-sm">{message.content}</p>
      </div>
      {isUser && (
         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white/70" />
        </div>
      )}
    </motion.div>
  );
};

const suggestionCards = [
  {
    icon: HelpCircle,
    title: "Help me improve",
    description: "my design's visual hierarchy",
  },
  {
    icon: Lightbulb,
    title: "Suggestions for",
    description: "a more accessible color palette",
  },
  {
    icon: Play,
    title: "Start Analyzing",
    description: "my uploaded Figma file",
  },
];

const placeholderPrompts = [
  "Critique the visual hierarchy of my dashboard screen...",
  "Is my color palette WCAG AA compliant?",
  "Suggest improvements for my mobile app's onboarding...",
  "Analyze the user flow of my checkout process...",
];

const mockProjects = [
  { id: 1, name: "E-commerce Redesign", thumbnail: "/placeholder.svg?text=Project+1", screenCount: 12, updatedAt: "2 days ago" },
  { id: 2, name: "Mobile Banking App", thumbnail: "/placeholder.svg?text=Project+2", screenCount: 8, updatedAt: "5 days ago" },
  { id: 3, name: "SaaS Dashboard", thumbnail: "/placeholder.svg?text=Project+3", screenCount: 25, updatedAt: "1 week ago" },
  { id: 4, name: "Portfolio Website", thumbnail: "/placeholder.svg?text=Project+4", screenCount: 5, updatedAt: "2 weeks ago" },
  { id: 5, name: "Healthcare Portal", thumbnail: "/placeholder.svg?text=Project+5", screenCount: 18, updatedAt: "3 weeks ago" },
  { id: 6, name: "Travel Planner", thumbnail: "/placeholder.svg?text=Project+6", screenCount: 10, updatedAt: "1 month ago" },
];

interface Project {
  id: number;
  name: string;
  thumbnail: string;
  screenCount: number;
  updatedAt: string;
}

interface UserProfile {
  fullName: string;
}

export default function DashboardV2Page() {
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [hasSubmittedFirstMessage, setHasSubmittedFirstMessage] = useState(false); // This is now the single source of truth
  const [isAnimatingPlaceholder, setIsAnimatingPlaceholder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const response = await fetch(`/api/profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        }
      }
    };
    fetchProfile();
  }, []);

  const count = useMotionValue(0);

  // ✅ Typewriter placeholder animation
  useEffect(() => {
    if (!isAnimatingPlaceholder) return;

    const currentText = placeholderPrompts[placeholderIndex];
    const typeAnimation = animate(count, currentText.length, {
      type: "tween",
      duration: 2,
      ease: "easeInOut",
      delay: 0.5,
      onUpdate: (latest) => {
        setIsTyping(true);
        setDisplayText(currentText.slice(0, Math.round(latest)));
      },
      onComplete: () => {
        setIsTyping(false);
        // Wait for a bit, then start backspacing
        setTimeout(() => {
          animate(count, 0, {
            type: "tween",
            duration: 1,
            ease: "easeInOut",
            onUpdate: (latest) => {
              setDisplayText(currentText.slice(0, Math.round(latest)));
            },
            onComplete: () => {
              setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
            },
          });
        }, 1500);
      },
    });

    return () => typeAnimation.stop();
  }, [placeholderIndex, count, isAnimatingPlaceholder]);

  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!hasSubmittedFirstMessage) setHasSubmittedFirstMessage(true);
    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = { role: "assistant", content: data.text };
        setConversation((prev) => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again later." };
        setConversation((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const assistantMessage: Message = { role: "assistant", content: "Sorry, an error occurred. Please try again later." };
      setConversation((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <DarkVeil
            hueShift={50}
            speed={0.5}
            resolutionScale={1.2}
        />
      </div>

      <DashboardNav />

      <main className="relative z-10">
        {/* Conversation Section */}
        <div className="h-screen flex flex-col pt-16">
          <div
            ref={chatContainerRef}
            className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto"
          >
            <AnimatePresence>
              {!hasSubmittedFirstMessage ? (
                <motion.div
                  key="greeting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <h1 className="text-3xl sm:text-5xl font-bold font-krona-one bg-gradient-to-br from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                    Hello, {profile ? profile.fullName.split(" ")[0] : ""}!
                  </h1>
                  <p className="mt-2 text-lg text-primary/80 font-quantico">
                    Let's review your design like never before.
                  </p>
                </motion.div>
              ) : (
                <div className="w-full max-w-4xl">
                  {conversation.map((msg, i) => (
                    <ChatBubble key={i} message={msg} />
                  ))}
                   {isLoading && (
                    <ChatBubble message={{ role: 'assistant', content: '...' }} />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestion Cards & Chat Input */}
          <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-8">
            {/* Suggestion Cards */}
            <AnimatePresence> 
              {!hasSubmittedFirstMessage && (
                <motion.div // Only show suggestion cards if not chatting and no message submitted
                  key="suggestions"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.4,
                      },
                    },
                  }}
                >
                  {suggestionCards.map((card, i) => (
                    <motion.div
                      key={i}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors duration-300"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                      }}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        setInput(card.title + " " + card.description);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <card.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-quantico font-bold text-white/90 text-center">{card.title}</h3>
                      </div>
                      <p className="font-roboto-flex text-sm mt-1 text-white/50 bg-clip-text">
                        {card.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input Box */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-2 shadow-2xl shadow-black/50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }} // This animation should always run when the component mounts
              transition={{ duration: 0.5, delay: hasSubmittedFirstMessage ? 0 : 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="group rounded-lg bg-white/10 hover:bg-[#03fcc6] flex-shrink-0 transition-colors">
                  <Paperclip className="h-5 w-5 text-primary group-hover:text-black transition-colors" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Button type="button" variant="ghost" size="icon" className="group rounded-lg bg-white/10 hover:bg-[#03fcc6] flex-shrink-0 transition-colors">
                  <Figma className="h-5 w-5 text-primary group-hover:text-black transition-colors" />
                  <span className="sr-only">Upload from Figma</span>
                </Button>

                {/* Typewriter Placeholder */}
                <div className="relative w-full flex items-center">
                  <TextareaAutosize
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => {
                      if (isAnimatingPlaceholder) {
                        setIsAnimatingPlaceholder(false);
                      }
                    }}
                    onBlur={() => {
                      if (!hasSubmittedFirstMessage && input === "") {
                        setIsAnimatingPlaceholder(true);
                      }
                    }}
                    placeholder={hasSubmittedFirstMessage ? "Ask anything..." : ""}
                    className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-base text-white placeholder:text-white/50 w-full resize-none pr-10 caret-white/50"
                    maxRows={5}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                  />
                  {!hasSubmittedFirstMessage && input === "" && isAnimatingPlaceholder && (
                    <motion.span className="absolute inset-y-0 left-3 flex items-center text-white/50 pointer-events-none">
                      <motion.span key={placeholderIndex}>{displayText}</motion.span>
                      {!isTyping && (
                        <motion.span
                          className="inline-block h-4 w-[1px] bg-white/80 ml-0.5"
                          animate={{ opacity: [0, 1, 1, 0, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            times: [0, 0.4, 0.6, 0.9, 1],
                          }}
                        />
                      )}
                    </motion.span>
                  )}
                </div>

                <Button type="submit" variant="ghost" size="icon" className="group rounded-lg bg-white/10 hover:bg-[#03fcc6] flex-shrink-0 transition-colors" disabled={isLoading}>
                  <Send className="h-5 w-5 text-primary group-hover:text-black transition-colors" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </motion.form>

            <p className="text-center text-xs text-white/40 mt-3">
              Dravmo can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>

        {/* Recent Projects */}
        <AnimatePresence>
        {!hasSubmittedFirstMessage && ( // Projects visible until first message is submitted
        <motion.div
          key="projects"
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl font-bold font-krona-one">Recent Projects</h2>
            <Link href="/projects">
              <Button variant="outline" className="bg-transparent border-white/20 hover:bg-white/10">
                View all
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {projects.slice(0, 6).map((project) => (
              <motion.div key={project.id} variants={itemVariants as any}>
                <Link href={`/projects/${project.id}`} legacyBehavior={false}>
                  <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="aspect-video w-full bg-black/20 overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate text-white/90">{project.name}</h3>
                      <div className="flex justify-between items-center mt-2 text-xs text-white/50">
                        <span>{project.screenCount} screen{project.screenCount !== 1 ? "s" : ""}</span>
                        <span>{project.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}
