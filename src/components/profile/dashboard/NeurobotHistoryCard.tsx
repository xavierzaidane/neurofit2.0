"use client";

import React, { useState, useEffect } from "react";
import { History, MessageSquare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
  updatedAt: number;
}

export const NeurobotHistoryCard: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const loadHistory = () => {
    try {
      const stored = window.localStorage.getItem("neurobot:sessions:v2");
      if (stored) {
        const parsed: ChatSession[] = JSON.parse(stored);
        // Sort by updatedAt descending
        const sorted = parsed.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
        setSessions(sorted);
      } else {
        setSessions([]);
      }
    } catch (e) {
      console.error("Failed to load neurobot history:", e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-card border-border select-none hover:border-border/80 transition-all duration-300 flex flex-col justify-between h-full relative shadow-sm">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base text-card-foreground font-normal">Recent Conversations</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{formattedDate}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={loadHistory}
          className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-4" />
        </Button>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col justify-center pb-6">
        {sessions.length > 0 ? (
          <div className="space-y-3.5 w-full -mt-10">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/neurobot`}
                onClick={() => {
                  window.localStorage.setItem("neurobot:activeSessionId", session.id);
                }}
                className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/50 rounded-2xl hover:bg-muted/40 hover:border-foreground/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-foreground group-hover:bg-foreground/20 transition-all">
                    <History className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-normal text-card-foreground group-hover:text-foreground transition-colors truncate max-w-[150px] font-sans">
                      {session.title || "New Conversation"}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium font-sans mt-0.5">
                      {session.messages.length} messages
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground/60 font-mono">
                  {getRelativeTime(session.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground mb-4 border border-border">
              <MessageSquare className="size-6" />
            </div>
            <p className="text-[13px] font-bold text-card-foreground tracking-tight font-sans">
              No treatments scheduled for today
            </p>
            <p className="text-[11px] text-muted-foreground font-medium font-sans mt-1 max-w-[200px] leading-normal">
              Tip: Start a conversation with Neurobot to get advice.
            </p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mt-5 text-[11px] font-bold uppercase tracking-wider text-card-foreground border-border hover:bg-muted/40"
            >
              <Link href="/neurobot">
                Start Chat
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
