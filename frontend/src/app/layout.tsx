import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/providers/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetterIDN",
  description:
    "A platform for discussing and suggesting improvements to Indonesian policies. Join the conversation and help shape a better Indonesia",
  keywords: [
    "feedback",
    "indonesian policy",
    "indonesian forum",
    "indonesian government",
  ],
  openGraph: {
    title: "BetterIDN",
    description:
      "A platform for discussing and suggesting improvements to Indonesian policies. Join the conversation and help shape a better Indonesia",
    type: "website",
    // url: "https://feedbase.example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "BetterIDN",
    description:
      "A platform for discussing and suggesting improvements to Indonesian policies. Join the conversation and help shape a better Indonesia",
  },
};

/* 
TODO: add error boundary
1. add error boundary to catch global error such as 404, 500, etc
2. instead of using next.js default global error page
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <Navbar />
            {children}
          </ErrorBoundary>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
