"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Figma } from "lucide-react"
import { motion } from "framer-motion"

interface ConversationMessage {
  id: string
  type: "user" | "assistant"
  text: string
  timestamp: Date
}

const mockMessages: ConversationMessage[] = [
  {
    id: "1",
    type: "assistant",
    text: "Hey! I've analyzed your design. I found several areas we can improve across layout, typography, and color usage. Click on any numbered marker in the image to see detailed suggestions.",
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "2",
    type: "user",
    text: "What are the main issues with the layout?",
    timestamp: new Date(Date.now() - 3 * 60000),
  },
  {
    id: "3",
    type: "assistant",
    text: "The main layout issue is in the hero section. The text hierarchy isn't clear, and the spacing between elements needs adjustment. Check the analysis panel on the right for detailed breakdown by category.",
    timestamp: new Date(Date.now() - 2 * 60000),
  },
]

export function ConversationPanel() {
  const [messages, setMessages] = useState<ConversationMessage[]>(mockMessages)
  const [input, setInput] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: "user",
      text: input,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          text: "I'm analyzing your feedback. This helps me provide more targeted suggestions based on your specific concerns.",
          timestamp: new Date(),
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <h2 className="text-lg font-bold text-white/90 font-krona-one">Design Analysis Chat</h2>
        <p className="text-xs text-white/50 mt-1 font-quantico">Dravmo</p>
      </div>

      {/* Messages Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] ${
                message.type === "user"
                  ? "bg-cyan-500/20 border border-cyan-500/30"
                  : "bg-white/5 border border-white/10"
              } rounded-lg p-3`}
            >
              <p className="text-sm text-white/90 leading-relaxed font-quantico">{message.text}</p>
              <p className="text-xs text-white/40 mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <motion.div
          className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-2 shadow-2xl shadow-black/50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white/10 flex-shrink-0">
              <Paperclip className="h-5 w-5 text-cyan-400" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white/10 flex-shrink-0">
              <Figma className="h-5 w-5 text-cyan-400" />
              <span className="sr-only">Upload from Figma</span>
            </Button>

            <div className="relative w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your design..."
                className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-white placeholder:text-white/50 h-12 pr-10"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              variant="ghost"
              size="icon"
              className="rounded-lg bg-transparent hover:bg-white/10 flex-shrink-0"
            >
              <Send className="h-5 w-5 text-cyan-400" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
