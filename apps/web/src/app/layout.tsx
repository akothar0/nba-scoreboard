import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NBA Scoreboard",
  description: "Live NBA scores — your teams, front and center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          <TooltipProvider>
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
              <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight">
                    NBA Scoreboard
                  </span>
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
