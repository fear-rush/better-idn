import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Comment {
  id: string;
  author: string;
  content: string;
  upvotes: number;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  commentCount: number;
  tags: string[];
  createdAt: Date;
  comments: Comment[];
}

type PostsDatabase = {
  [key: string]: Post;
};

// Mock database of posts
const mockPosts: PostsDatabase = {
  "reduce-regulatory-burden-for-startups-in-europe": {
    id: "1",
    title: "Reduce regulatory burden for startups in Europe",
    description:
      "Europe should reduce the regulatory burden for businesses, streamlining the process of starting and growing companies, and encouraging innovation. By exempting businesses with annual revenues below €10 million from complex regulations like VATMOSS, GDPR, and the EU AI Act, we empower entrepreneurs to focus on creating great products and reaching market success without being weighed down by compliance.",
    upvotes: 1700,
    commentCount: 13,
    tags: ["Economy", "Technology"],
    createdAt: new Date("2024-02-20"),
    comments: [
      {
        id: "1",
        author: "Semantic Scarlet Eagle",
        content:
          "as a job requirement, an EU regulator or tax authority should have practical real world experience with running a startup or small business and understanding how various filings impact the entrepreneur",
        upvotes: 5,
        createdAt: new Date("2024-02-20"),
      },
      {
        id: "2",
        author: "Proper Lime Gazelle",
        content:
          "Complaining about rules by asking for exemptions is the same as asking for more rules. If you are serious about deregulation you cannot split the difference. Gradualism does not work. Exemptions create more rules and more unintended consequences. Do you want to become a political client or do you want to set the market free?\n\nRevert and Repeal asinine laws, no exemptions",
        upvotes: 7,
        createdAt: new Date("2024-02-21"),
      },
    ],
  },
  "make-skilled-immigration-10x-easier-unskilled-10x-harder": {
    id: "2",
    title: "Make skilled immigration 10x easier, unskilled 10x harder",
    description:
      "Make immigration rules such that it becomes very easy for highly skilled workers and Entrepreneurs to come live in any European country with their families with attractive tax rates. This will help Europe compete globally for talent and drive innovation. The process should be streamlined with minimal bureaucracy for those who meet the skills criteria.",
    upvotes: 1500,
    commentCount: 8,
    tags: ["Politics", "Economy"],
    createdAt: new Date("2024-02-20"),
    comments: [
      {
        id: "1",
        author: "Logical Bronze Wolf",
        content:
          "This is a great idea. The current system is too bureaucratic and slow. We need to make it easier for talented people to come and contribute to our economy. The competition for global talent is fierce, and Europe needs to step up its game.",
        upvotes: 12,
        createdAt: new Date("2024-02-20"),
      },
      {
        id: "2",
        author: "Dynamic Silver Fox",
        content:
          "We should also consider creating special visa programs for startup founders and tech workers. Many other countries are already doing this successfully.",
        upvotes: 8,
        createdAt: new Date("2024-02-21"),
      },
      {
        id: "3",
        author: "Curious Jade Dragon",
        content:
          "How would you define 'skilled' vs 'unskilled'? This needs to be very clear to avoid confusion and potential abuse of the system.",
        upvotes: 15,
        createdAt: new Date("2024-02-21"),
      },
    ],
  },
  "abrogate-the-eu-cookie-laws": {
    id: "3",
    title: "Abrogate the EU cookie laws",
    description:
      "The directive that requires websites to get consent before dropping cookies on a user's device should be abrogated – or at very least heavily updated. The ePrivacy Directive (ePD) has created a poor user experience with constant pop-ups while doing little to protect actual privacy. Modern browsers already provide better cookie controls, making this law redundant.",
    upvotes: 1100,
    commentCount: 6,
    tags: ["Technology", "Politics"],
    createdAt: new Date("2024-02-20"),
    comments: [
      {
        id: "1",
        author: "Efficient Ruby Hawk",
        content:
          "The cookie law has become more of an annoyance than a protection. It's created banner fatigue where users just click 'accept all' without reading, defeating its purpose.",
        upvotes: 23,
        createdAt: new Date("2024-02-20"),
      },
      {
        id: "2",
        author: "Strategic Emerald Lion",
        content:
          "Instead of pop-ups, we should focus on making browsers better at protecting privacy by default. Firefox and Safari are already doing this well.",
        upvotes: 18,
        createdAt: new Date("2024-02-21"),
      },
      {
        id: "3",
        author: "Analytical Sapphire Eagle",
        content:
          "We should replace this with a standardized browser API that allows users to set their privacy preferences once, and have them automatically applied across all websites.",
        upvotes: 31,
        createdAt: new Date("2024-02-22"),
      },
    ],
  },
};

// Generate metadata for each post page
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = mockPosts[params.slug];

  // If post doesn't exist, return default metadata
  if (!post) {
    return {
      title: "Post Not Found - BetterIDN",
      description: "The requested post could not be found.",
    };
  }

  // Get the first 155 characters of the description for SEO
  const metaDescription = post.description.length > 155
    ? `${post.description.slice(0, 155)}...`
    : post.description;

  return {
    title: `${post.title} - BetterIDN Forum`,
    description: metaDescription,
    keywords: [
      ...post.tags,
      "indonesian policy",
      "policy discussion",
      "indonesian forum",
    ],
    openGraph: {
      title: post.title,
      description: metaDescription,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.createdAt.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: metaDescription,
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = mockPosts[params.slug];

  // If post doesn't exist, return 404
  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-screen-xl space-y-8 p-4 pt-24 md:p-6 md:pt-24">
        {/* Main post content */}
        <div className="grid gap-8 md:grid-cols-[1fr,300px]">
          <div className="space-y-8">
            <div>
              <h1 className="mb-4 text-2xl font-bold md:text-3xl">{post.title}</h1>
              <p className="text-muted-foreground">{post.description}</p>
            </div>

            {/* View similar posts */}
            <div className="flex items-center gap-2 border-y py-4">
              <Button variant="ghost" className="text-sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                View all similar posts
              </Button>
            </div>

            {/* Comments section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Comments</h2>
                <Button variant="outline">Sign in to comment</Button>
              </div>

              {/* Comments list */}
              <div className="space-y-4">
                {post.comments.map((comment: Comment) => (
                  <Card key={comment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{comment.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{comment.content}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ArrowBigUp className="mr-1 h-4 w-4" />
                          {comment.upvotes}
                        </Button>
                        <Button variant="ghost" size="sm">Reply</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Post Info</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ArrowBigUp className="mr-1 h-4 w-4" />
                    {post.upvotes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {post.commentCount}
                  </Button>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Posted</div>
                  <div>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <div
                        key={tag}
                        className="rounded-full bg-secondary px-2 py-1 text-xs"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 