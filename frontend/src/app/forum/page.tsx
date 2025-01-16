import { PostCard } from "@/components/forum/post-card";
import { PostFilter } from "@/components/forum/post-filter";
import { PostSearch } from "@/components/forum/post-search";
import { PostTags } from "@/components/forum/post-tags";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum - BetterIDN",
  description: "Join the conversation about improving Indonesian policies. Discuss and suggest ideas across various categories including politics, economy, technology, and more.",
  keywords: [
    "indonesian policy",
    "policy discussion",
    "indonesian forum",
    "policy improvement",
    "indonesian government",
    "public policy",
  ],
  openGraph: {
    title: "Forum - BetterIDN",
    description: "Join the conversation about improving Indonesian policies. Discuss and suggest ideas across various categories including politics, economy, technology, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forum - BetterIDN",
    description: "Join the conversation about improving Indonesian policies. Discuss and suggest ideas across various categories including politics, economy, technology, and more.",
  },
};

// Temporary mock data
const mockPosts = [
  {
    id: "1",
    title: "Reduce regulatory burden for startups in Europe",
    description:
      "Europe should reduce the regulatory burden for businesses, streamlining the process of starting and growing companies, and encouraging innovation. By exempting businesses with...",
    upvotes: 1700,
    commentCount: 45,
    tags: ["Economy", "Technology"],
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "2",
    title: "Make skilled immigration 10x easier, unskilled 10x harder",
    description:
      "Make immigration rules such that it becomes very easy for highly skilled workers and Entrepreneurs to come live in any European country with their families with attractive tax rat...",
    upvotes: 1500,
    commentCount: 32,
    tags: ["Politics", "Economy"],
    createdAt: new Date("2024-02-23"),
  },
  {
    id: "3",
    title: "Abrogate the EU cookie laws",
    description:
      "The directive that requires websites to get consent before dropping cookies on a user's device should be abrogated – or at very least heavily updated. The ePrivacy Directive (ePD) has...",
    upvotes: 1100,
    commentCount: 28,
    tags: ["Technology", "Politics"],
    createdAt: new Date("2024-02-20"),
  },
];

export default function ForumPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filter = searchParams.filter as string || "trending";
  const search = searchParams.search as string;
  const tag = searchParams.tag as string;

  // Filter posts based on all parameters
  let filteredPosts = [...mockPosts];

  // Apply tag filter
  if (tag && tag !== "All") {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
  }

  // Apply search filter if exists
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting based on filter
  switch (filter) {
    case "new":
      filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "top":
      filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
      break;
    case "trending":
    default:
      // For trending, we'll use a combination of recency and upvotes
      // This is a simple example - in a real app, you might want a more sophisticated algorithm
      filteredPosts.sort((a, b) => {
        const aScore = a.upvotes * (1 + 1 / (new Date().getTime() - a.createdAt.getTime()));
        const bScore = b.upvotes * (1 + 1 / (new Date().getTime() - b.createdAt.getTime()));
        return bScore - aScore;
      });
      break;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-screen-xl space-y-8 p-4 pt-24 md:p-6 md:pt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {/* Left sidebar with tags */}
          <div className="w-full md:w-64 flex-shrink-0">
            <PostTags />
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <PostFilter />
                <PostSearch />
              </div>
              <Button asChild>
                {/* TODO:  add new post functionality
                
                1. remember to use least package as possible
                2. use next form for form handling 
                3. use server components for form handling (optional)
                4. use optimistic rendering if the form sucessfully submitted
                5. read this blog post for RSC (react-server components) https://tkdodo.eu/blog/you-might-not-need-react-query
                6. use react-query IF and ONLY IF we need to fetch from client-side
                */}
                <Link href="/forum/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
