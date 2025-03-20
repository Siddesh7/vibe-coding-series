import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Github, Twitter, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CommunitySection } from "@/components/community-section"
import { NewsletterForm } from "@/components/newsletter-form"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = Number.parseInt(params.id)

  // Find the project by ID
  const project = projects.find((p) => p.id === projectId)

  // If project doesn't exist, return 404
  if (!project) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge>Project #{projectId}</Badge>
            <Badge variant={project.status === "completed" ? "default" : "secondary"}>
              {project.status === "completed" ? "Completed" : "In Progress"}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{project.title}</h1>

          <div className="flex items-center gap-2 mt-4 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{project.date}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Image
            src={project.thumbnail || "/placeholder.svg?height=500&width=1000"}
            width={1000}
            height={500}
            alt={project.title}
            className="w-full object-cover aspect-video"
          />
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p className="lead">{project.description}</p>

          <h2>Project Overview</h2>
          <p>{project.longDescription}</p>

          <h2>Key Features</h2>
          <ul>
            {project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <h2>Tech Stack</h2>
          <p>This project was built using the following technologies:</p>
          <ul>
            {project.techStack.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>

          {project.challenges && (
            <>
              <h2>Challenges & Solutions</h2>
              <p>{project.challenges}</p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {project.links.map((link, index) => (
            <Button key={index} variant="outline" asChild>
              <Link href={link.url} target="_blank" className="flex items-center gap-2">
                {link.type === "twitter" ? (
                  <Twitter className="h-4 w-4" />
                ) : link.type === "youtube" ? (
                  <Youtube className="h-4 w-4" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                {link.label}
              </Link>
            </Button>
          ))}
        </div>

        <Separator />

        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-6">Stay Updated</h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to get notified about upcoming streams and new episodes.
            </p>
            <NewsletterForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Next Project</h2>
            {project.nextProject ? (
              <div className="space-y-4">
                <h3 className="text-xl font-medium">{project.nextProject.title}</h3>
                <p className="text-muted-foreground">{project.nextProject.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.nextProject.date}</span>
                </div>
                <Button asChild>
                  <Link href={project.nextProject.link}>Set Reminder</Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Stay tuned for the next project announcement!</p>
            )}
          </div>
        </div>

        <Separator />

        <CommunitySection />
      </div>
    </div>
  )
}

// Sample data
const projects = [
  {
    id: 1,
    title: "Twitter Clone",
    date: "March 15, 2025",
    description: "Building a Twitter clone with real-time updates, user profiles, and tweet functionality.",
    longDescription:
      "In this project, we built a full-featured Twitter clone that allows users to create accounts, post tweets, follow other users, and engage with content through likes and retweets. The application features real-time updates using WebSockets to ensure users see new content as it's created.",
    status: "completed",
    thumbnail: "/placeholder.svg?height=500&width=1000",
    features: [
      "User authentication and profiles",
      "Tweet creation, editing, and deletion",
      "Real-time timeline updates",
      "Like and retweet functionality",
      "Follow/unfollow users",
      "Responsive design for mobile and desktop",
    ],
    techStack: [
      "Next.js 14 with App Router",
      "TypeScript",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL",
      "NextAuth.js for authentication",
      "Pusher for real-time updates",
    ],
    challenges:
      "One of the biggest challenges was implementing real-time updates without overloading the server or client. We solved this by using a combination of optimistic UI updates and efficient WebSocket connections that only send delta updates.",
    links: [
      { type: "twitter", label: "Watch Livestream", url: "https://twitter.com/username" },
      { type: "youtube", label: "View Recording", url: "https://youtube.com/watch?v=123" },
      { type: "github", label: "Source Code", url: "https://github.com/username/project-1" },
    ],
    nextProject: {
      title: "E-commerce Platform",
      description: "Creating a fullstack e-commerce platform with product listings, cart, and checkout.",
      date: "March 17, 2025",
      link: "https://twitter.com/username",
    },
  },
  {
    id: 2,
    title: "E-commerce Platform",
    date: "March 17, 2025",
    description: "Creating a fullstack e-commerce platform with product listings, cart, and checkout.",
    longDescription:
      "This project focused on building a complete e-commerce solution with product management, shopping cart functionality, secure checkout process, and order management. We implemented features like product search, filtering, and sorting to enhance the user experience.",
    status: "completed",
    thumbnail: "/placeholder.svg?height=500&width=1000",
    features: [
      "Product catalog with categories and search",
      "Shopping cart with persistent storage",
      "Secure checkout with Stripe integration",
      "User accounts and order history",
      "Admin dashboard for product management",
      "Responsive design with mobile-first approach",
    ],
    techStack: [
      "Next.js 14 with App Router",
      "TypeScript",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL",
      "NextAuth.js for authentication",
      "Stripe for payment processing",
    ],
    challenges:
      "Implementing a secure and seamless checkout process was challenging. We had to ensure that cart state was preserved across sessions while also handling edge cases like inventory changes between adding to cart and checkout.",
    links: [
      { type: "twitter", label: "Watch Livestream", url: "https://twitter.com/username" },
      { type: "youtube", label: "View Recording", url: "https://youtube.com/watch?v=123" },
      { type: "github", label: "Source Code", url: "https://github.com/username/project-2" },
    ],
    nextProject: {
      title: "Task Management App",
      description: "Building a Trello-inspired task management app with drag-and-drop functionality.",
      date: "March 19, 2025",
      link: "https://twitter.com/username",
    },
  },
  {
    id: 3,
    title: "Task Management App",
    date: "March 19, 2025",
    description: "Building a Trello-inspired task management app with drag-and-drop functionality.",
    longDescription:
      "In this project, we created a task management application inspired by Trello, featuring drag-and-drop functionality for task organization. Users can create boards, lists, and cards to organize their work and collaborate with team members.",
    status: "in-progress",
    thumbnail: "/placeholder.svg?height=500&width=1000",
    features: [
      "Drag-and-drop interface for tasks",
      "Board, list, and card creation",
      "Task assignment and due dates",
      "Labels and priority markers",
      "Team collaboration features",
      "Activity log and notifications",
    ],
    techStack: [
      "Next.js 14 with App Router",
      "TypeScript",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL",
      "NextAuth.js for authentication",
      "dnd-kit for drag-and-drop functionality",
    ],
    challenges:
      "Implementing a smooth drag-and-drop experience while maintaining state consistency between the client and server was challenging. We used optimistic updates with server validation to ensure a responsive yet accurate user experience.",
    links: [
      { type: "twitter", label: "Watch Livestream", url: "https://twitter.com/username" },
      { type: "github", label: "Source Code", url: "https://github.com/username/project-3" },
    ],
    nextProject: {
      title: "Job Board",
      description: "Creating a fullstack job board with search, filtering, and application tracking.",
      date: "March 22, 2025",
      link: "https://twitter.com/username",
    },
  },
]

