"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Github, MessageSquare, Send, Twitch, Youtube, ExternalLink, Twitter, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parse, isBefore, isAfter } from 'date-fns'; // Add date-fns to your project

import { StreamData } from '@/lib/sheets'

export default function HomePage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [allStreams, setAllStreams] = useState<StreamData[]>([])
  const [upcomingStreams, setUpcomingStreams] = useState<StreamData[]>([])
  const [pastStreams, setPastStreams] = useState<StreamData[]>([])
  const [authorName, setAuthorName] = useState("")
  const [newComment, setNewComment] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  // Load comments, streams, and author name
  useEffect(() => {
    fetchComments()
    fetchStreams()
    const savedName = localStorage.getItem("commentAuthor")
    if (savedName) {
      setAuthorName(savedName)
    }
  }, [])

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streams');
      const data = await response.json();
      const now = new Date();
  
      // Sort streams by date
      const sortedStreams = [...data].sort((a, b) => {
        const dateA = parse(`${a.date} ${a.time.replace(' IST', '')}`, 'MMM d, yyyy h:mm a', new Date());
        const dateB = parse(`${b.date} ${b.time.replace(' IST', '')}`, 'MMM d, yyyy h:mm a', new Date());
        return dateA.getTime() - dateB.getTime();
      });
  
      // Filter streams into upcoming and past
      const upcoming = sortedStreams.filter(stream => {
        const streamDate = parse(`${stream.date} ${stream.time.replace(' IST', '')}`, 'MMM d, yyyy h:mm a', new Date());
        return !isNaN(streamDate.getTime()) && isAfter(streamDate, now);
      });
  
      const past = sortedStreams.filter(stream => {
        const streamDate = parse(`${stream.date} ${stream.time.replace(' IST', '')}`, 'MMM d, yyyy h:mm a', new Date());
        return !isNaN(streamDate.getTime()) && (isBefore(streamDate, now) || streamDate.getTime() === now.getTime());
      });
  
      setAllStreams(sortedStreams);
      setUpcomingStreams(upcoming);
      setPastStreams(past.reverse()); // Most recent first
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments')
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    if (!authorName) {
      setShowNameInput(true)
      return
    }

    // Save author name to localStorage
    localStorage.setItem("commentAuthor", authorName)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName,
          message: newComment
        })
      })

      if (response.ok) {
        setNewComment("")
        setShowNameInput(false)
        fetchComments()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div className="min-h-screen">
 

      <main className="container mx-auto px-4 py-8 space-y-16 mt-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge className="mx-auto" variant={"secondary"}>Streaming on X</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            vibe & code {' '}
            <span className="bg-[#8A63D2] text-white rounded-full px-4 py-[0.5] inline-block">
              farcaster
            </span>{' '}
            frames
          </h1>
          <p className="text-xl text-muted-foreground">
          Join me as I vibe code 39 different farcaster frames, livestreamed three times a week. No
          pressure, just vibes.
          </p>
        </section>

      
        {/* Streams */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold">Streams</h2>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {upcomingStreams.map((stream) => (
                <StreamItem key={stream.id} episode={stream} />
              ))}
            </TabsContent>

            <TabsContent value="past" className="mt-6 space-y-4">
              {pastStreams.map((stream) => (
                <StreamItem key={stream.id} episode={stream} />
              ))}
            </TabsContent>
          </Tabs>
        </section>

        {/* Commentary Box */}
        <section className="max-w-3xl mx-auto border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Vibe Commentary
          </h2>

          <div className="space-y-4">
            {showNameInput ? (
              <div className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="bg-background"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddComment} className="flex-1">
                    Save & Comment
                  </Button>
                  <Button variant="outline" onClick={() => setShowNameInput(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Drop a comment, suggestion, or just say hi..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-background"
                />
                <Button onClick={handleAddComment} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {comment.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(new Date(comment.timestamp))}</span>
                      </div>
                      <p className="text-sm">{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </section>

        {/* Project List */}
        <section className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">The 39 Farcaster Frames v2 Challenge</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {farcasterProjects.map((project, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground">{project.name}</h3>
                    {project.attribution && (
                      <div className="mt-1">
                        <Link
                          href={`https://farcaster.xyz/@${project.attribution}`}
                          target="_blank"
                          className="text-xs text-muted-foreground hover:text-primary"
                        >
                          <Badge variant="secondary" className="text-xs">
                            By {project.attribution}
                          </Badge>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

<footer className="border-t mt-16 bg-gradient-to-r from-primary/5 to-secondary/5">
  <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
    {/* Tagline with Icon */}
    <div className="flex items-center gap-2">

      <p className="text-sm text-muted-foreground">
  
        <span className="italic text-primary">vibe coding, just for fun.</span>
      </p>
    </div>

    {/* Social Links */}
    <div className="flex items-center gap-4">
      <Link
        href="https://x.com/0xSiddesh"
        target="_blank"
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <Twitter className="h-4 w-4" />
        <span className="text-sm font-medium">Siddesh</span>
      </Link>
     
      <Link
        href="https://warpcast.com/siddesh"
        target="_blank"
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">Farcaster</span>
      </Link> <Link
        href="https://x.com/basedindia"
        target="_blank"
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <Twitter className="h-4 w-4" />
        <span className="text-sm font-medium">BasedIndia</span>
      </Link>
    </div>
  </div>
</footer>
    </div>
  )
}

function StreamItem({ episode }: { episode: StreamData }) {
  const formattedDateTime = episode.date
    ? new Date(`${episode.date} ${episode.time.replace(' IST', '')}`).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }) + ' IST'
    : episode.time || 'TBD'; // Fallback if date is empty

  return (
    <div className={`pl-8 pr-4 py-4 border rounded-lg stream-item bg-card ${episode.status === "in-progress" ? "glow" : ""}`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{episode.title}</h3>
            <Badge variant="outline">#{episode.projectNumber}</Badge>
            {episode.status === "completed" && <Badge variant="default">Completed</Badge>}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDateTime}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {episode.links.map((link) => (
            <Button key={link.url} variant="ghost" size="sm" asChild className="h-8 px-2">
              <Link href={link.url} target="_blank" className="flex items-center gap-1">
                {link.type === "github" ? (
                  <Github className="h-3.5 w-3.5" />
                ) : link.type === "youtube" ? (
                  <Youtube className="h-3.5 w-3.5" />
                ) : link.type === "twitter" ? (
                  <Twitch className="h-3.5 w-3.5" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" />
                )}
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Types
type Comment = {
  id: number
  author: string
  message: string
  timestamp: string
}

// Farcaster Frames v2 Projects with Attributions
const farcasterProjects = [
  { name: "Decentralized community notes taken using rewards to submit accurate info", attribution: "topia" },
  { name: "PoolTogether-style deposit for onchain prize savings", attribution: "topia" },
  { name: "Tumble.eth, nonstop airdrop your USDC rewards to onchain prize savings", attribution: "tumble.eth" },
  { name: "Crypto mahjong", attribution: "topia" },
  { name: "Fartmart similar to Amazon/toktok shop", attribution: null },
  { name: "A high school yearbook but for farcaster PFP gallery of all users - give me a place to sign 'have a great summer'", attribution: "anoncast.eth" },
  { name: "Group buy mini-app", attribution: "dharmi" },
  { name: "Pop-up wu wu charm with minting", attribution: "dwr.eth" },
  { name: "Tinder onchain", attribution: "topia, dwr.eth" },
  { name: "In-app NFT gifting, another example of onchain tchotchkes", attribution: "dwr.eth" },
  { name: "Indy 500-style race with Farcaster user racers", attribution: null },
  { name: "Sol-based coin airdrop for FC accounts with SOL-connected wallets", attribution: "v2.xyz.eth" },
  { name: "Sims-like relationship airgraph for FC accounts measuring your standing with recently interacted people", attribution: null },
  { name: "Frame that allows you to post something and lock the content behind the paywall", attribution: null },
  { name: "Make it available only for some fids", attribution: "sol.eth" },
  { name: "Send voice messages", attribution: "mikad.eth" },
  { name: "A reverse bounty board where moonshot ideas requesting funding are posted like a grant", attribution: "anoncast.eth" },
  { name: "Chinese New Year Frame social graph", attribution: "mic.eth" },
  { name: "Governance app - Use the vote surfaced on Agora, identify if you're eligible for a vote", attribution: null },
  { name: "Charity of the week frame", attribution: "dwr.eth" },
  { name: "Onchain Powerlevel frame", attribution: "dwr.eth" },
  { name: "Bingo", attribution: "manuth" },
  { name: "Poker", attribution: "treeth" },
  { name: "Onchain time-based social game", attribution: "dwr.eth" },
  { name: "Escrow frame", attribution: "designed.eth" },
  { name: "Notifies if your frame expires soon", attribution: "designed.eth" },
  { name: "Guided meditations", attribution: "dwr.eth" },
  { name: "Space Trade or Drugs Wars game", attribution: "dwr.eth" },
  { name: "Farcady Longform Farcaster", attribution: "dwr.eth" },
  { name: "Escrow fishing mini-game", attribution: "bones.eth" },
  { name: "Onchain token launchers", attribution: "dwr.eth" },
  { name: "Listens for all FC native token launches", attribution: "dwr.eth" },
  { name: "GoFundMe for Farcaster", attribution: "shultz, snarf.eth" },
  { name: "A Turing Test app - join a group chat and guess who is the bot", attribution: "coccarella.eth" },
  { name: "Faro Party multiplayer in-frame minigames", attribution: "coccarella.eth" },
  { name: "Skribbl.io group drawing game where you guess a drawing from someone else", attribution: "dwr.eth" },
  { name: "Foursquare 2.0", attribution: "cryptonative.guru" },
  { name: "Sell a file frame", attribution: "cryptonative.guru" },
  { name: "Carousel frame - tap on the frame, display a grid of images like an Instagram profile", attribution: "dwr.eth" },
];