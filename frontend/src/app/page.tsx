import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <GradientBackground />
      <div className="mx-auto flex max-w-screen-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="animate-in fade-in slide-in-from-bottom-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            BetterIDN - For Better Indonesia
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-4 text-lg text-muted-foreground sm:text-xl">
            A platform for discussing and suggesting improvements to Indonesian
            policies. Join the conversation and help shape a better Indonesia
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/forum">Join the conversation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#">
                <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
