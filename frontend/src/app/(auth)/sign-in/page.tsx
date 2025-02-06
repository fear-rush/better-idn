import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In - BetterIDN",
  description: "Sign in to your account to join the conversation",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Hero Image (desktop only) */}
      <div className="relative hidden md:flex md:w-1/2">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25 z-10" />
        
        <Image
          src="/auth-hero.jpg"
          alt="Mount Bromo sunrise view with fog rolling over the valley"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        
        <div className="relative z-20 flex flex-col justify-center px-12">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="mt-4 text-xl text-gray-200/90 max-w-md">
            Continue your contribution to Indonesia's transformation through better policies and ideas
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
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
                <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
              <SignInForm />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link 
                  href="/sign-up"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 