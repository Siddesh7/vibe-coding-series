import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Github, Twitter, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About the Vibe Coding Series</h1>
          <p className="text-xl text-muted-foreground">
            Building 39 fullstack Next.js applications, one stream at a time.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Creator photo"
              width={400}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The Journey</h2>
            <p>
              I discovered a list of 39 interesting app ideas aggregated from across social media and decided to turn it
              into a challenge: build all of them, live on stream, three times a week.
            </p>
            <p>
              Each livestream is a complete journey from concept to deployment, showing the entire development process
              including planning, coding, debugging, and deploying fullstack Next.js applications.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="https://twitter.com/username" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="https://github.com/username" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="https://youtube.com/username" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">The 39 Project Challenge</h2>
          <p>
            Each project is a complete fullstack application built with Next.js and various supporting technologies.
            Here's the complete list of projects I'll be tackling throughout this series:
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectList.map((project, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <h3 className="font-medium">{project}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">The Tech Stack</h2>
          <p>
            While each project may use different technologies based on its specific needs, here's the core tech stack
            I'll be using throughout the series:
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="font-medium">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted p-6">
          <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold">Ready to join the journey?</h3>
              <p className="text-muted-foreground">Check out the upcoming schedule and catch the next livestream.</p>
            </div>
            <Button asChild>
              <Link href="/#upcoming" className="flex items-center gap-2">
                View Schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const projectList = [
  "Twitter Clone",
  "E-commerce Platform",
  "Task Management App",
  "Job Board",
  "Recipe Sharing Platform",
  "Event Management System",
  "Real-time Chat Application",
  "Blog Platform",
  "Expense Tracker",
  "Learning Management System",
  "Fitness Tracker",
  "Weather App",
  "Movie Database",
  "Portfolio Website",
  "Booking System",
  "Music Streaming Service",
  "Social Media Dashboard",
  "Cryptocurrency Tracker",
  "Note Taking App",
  "File Sharing Platform",
  "Survey Creator",
  "Restaurant Reservation System",
  "Podcast Platform",
  "Real Estate Listings",
  "Travel Planner",
  "Inventory Management",
  "Subscription Service",
  "Auction Website",
  "Dating App",
  "Freelance Marketplace",
  "Meal Planning App",
  "Habit Tracker",
  "Language Learning App",
  "Virtual Classroom",
  "Appointment Scheduler",
  "Crowdfunding Platform",
  "Stock Trading Simulator",
  "AI Image Generator",
  "Video Conferencing App",
]

const techStack = [
  {
    name: "Next.js",
    description: "React framework for building full-stack web applications",
    icon: "N",
  },
  {
    name: "TypeScript",
    description: "Strongly typed programming language that builds on JavaScript",
    icon: "TS",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development",
    icon: "T",
  },
  {
    name: "Prisma",
    description: "Next-generation ORM for Node.js and TypeScript",
    icon: "P",
  },
  {
    name: "PostgreSQL",
    description: "Powerful, open source object-relational database system",
    icon: "PG",
  },
  {
    name: "Vercel",
    description: "Platform for frontend frameworks and static sites",
    icon: "V",
  },
]

