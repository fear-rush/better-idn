import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up - BetterIDN",
  description: "Create an account to join the conversation",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Hero Image (desktop only) */}
      <div className="relative hidden md:flex md:w-1/2">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-transparent z-10" />
        
        <Image
          src="/signout-page.jpg"
          alt="Broken Beach in Nusa Penida, showing a natural arch formation over crystal clear turquoise waters"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        
        <div className="relative z-20 flex flex-col justify-center px-12">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Join the Journey
          </h1>
          <p className="mt-4 text-xl text-gray-200/90 max-w-md">
            Dive into a community shaping Indonesia's future. Your ideas can create waves of positive change.
          </p>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex flex-1 flex-col">
        {/* Mobile back button */}
        <div className="p-4 md:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Forum
            </Link>
          </Button>
        </div>

        {/* Form container */}
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <Card className="w-full max-w-[400px] border-0 shadow-none md:border md:shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your information to create your account
                </p>
              </div>
              <SignUpForm />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/sign-in"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 