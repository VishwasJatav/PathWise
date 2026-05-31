import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import HeaderUserSync from "@/components/header-user-sync";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { LoadingProvider } from "@/components/providers/loading-provider";
import RouteTransitionLoader from "@/components/loaders/RouteTransitionLoader";
import { ClientLoggerProvider } from "@/components/providers/client-logger-provider";
import { LazyMotionProvider } from "@/components/providers/lazy-motion-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'Rixora — AI Career & Study Hub',
    template: '%s | Rixora',
  },
  description: 'Rise through knowledge with Rixora. AI-powered career coaching, resume building, mock interviews, cover letters, and personalized study paths.',
  keywords: ['AI career coaching', 'study hub', 'resume builder', 'mock interview', 'career guidance', 'ATS resume', 'Rixora'],
  authors: [{ name: 'Rixora' }],
  creator: 'Rixora',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/brand/rixora-icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Rixora',
    title: 'Rixora — AI Career & Study Hub',
    description: 'Rise through knowledge. AI career coaching, resume building, mock interviews & personalized study paths.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rixora — AI Career & Study Hub',
    description: 'Rise through knowledge with AI-powered career coaching.',
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>

      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${inter.className}`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ClientLoggerProvider>
              <LazyMotionProvider>
              <LoadingProvider>
                <RouteTransitionLoader />
              {/*header*/}
              <HeaderUserSync />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
              {/*footer*/}
              <footer className="bg-gray-950 text-gray-400 py-6 mt-10 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                  {/* Text */}
                  <p className="text-sm text-center md:text-left mb-4 md:mb-0">
                    Made with <span className="text-red-500">❤️</span> by Vishwas and His Team
                  </p>

                  {/* Social Icons */}
                  <div className="flex gap-x-">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 transition-colors"
                      aria-label="Visit Rixora on Facebook"
                    >
                      <Facebook className="size-" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-400 transition-colors"
                      aria-label="Visit Rixora on Twitter"
                    >
                      <Twitter className="size-" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pink-500 transition-colors"
                      aria-label="Visit Rixora on Instagram"
                    >
                      <Instagram className="size-" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-700 transition-colors"
                      aria-label="Visit Rixora on LinkedIn"
                    >
                      <Linkedin className="size-" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 mt-4">
                  <p className="text-xs text-gray-400 text-center">
                    © 2026 Rixora. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-500 font-medium tracking-wide">
                    Rise Through Knowledge
                  </p>
                </div>
              </footer>
            </LoadingProvider>
            </LazyMotionProvider>
            </ClientLoggerProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
