"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  comment: z.string().min(3, { message: "Comment must be at least 3 characters." }),
})

type Comment = {
  id: number
  author: {
    name: string
    avatar?: string
  }
  content: string
  date: string
}

export function CommunitySection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "I loved the Twitter clone stream! Can't wait to see what you build next.",
      date: "2 days ago",
    },
    {
      id: 2,
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "The e-commerce project was super helpful. I learned a lot about handling payments with Stripe.",
      date: "1 day ago",
    },
    {
      id: 3,
      author: {
        name: "Jessica Williams",
      },
      content: "Would love to see a video streaming platform in one of the upcoming projects!",
      date: "12 hours ago",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newComment: Comment = {
      id: comments.length + 1,
      author: {
        name: "You",
      },
      content: values.comment,
      date: "Just now",
    }

    setComments([newComment, ...comments])
    setIsLoading(false)
    form.reset()

    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts, questions, or project ideas..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      </Form>

      <div className="space-y-6 pt-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

