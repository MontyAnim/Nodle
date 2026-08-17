import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { TutorialModal } from "@/components/TutorialModal";
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
  title: "Nodle - Logic Deduction Game",
  description: "Guess the correct node based on multidimensional attributes. A daily challenge for tech artists and game developers.",
  openGraph: {
    title: "Nodle - Logic Deduction Game",
    description: "Guess the correct node based on multidimensional attributes. A daily challenge for tech artists and game developers.",
    url: "https://nodle.online",
    siteName: "Nodle",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nodle - Logic Deduction Game",
    description: "Guess the correct node based on multidimensional attributes. A daily challenge for tech artists and game developers.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <I18nProvider>
              <TutorialModal />
              <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              {children}
            </I18nProvider>
          </ThemeProvider>
          <Script
            async
            src="https://media.ethicalads.io/media/client/ethicalads.min.js"
            strategy="lazyOnload"
          />
        </PostHogProvider>
      </body>
    </html>
  );
}
