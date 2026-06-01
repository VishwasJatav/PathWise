"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon, Activity, BarChart2, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function RixoraLogo({ className = "" }) {
  return (
    <m.div 
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      initial="initial"
      whileHover="hover"
      animate="animate"
    >
      <m.div 
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] overflow-hidden"
        variants={{
          hover: { scale: 1.05, rotate: -3, boxShadow: "0 0 20px rgba(59,130,246,0.6)" },
          initial: { scale: 1, rotate: 0 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {/* Animated Background Shine */}
        <m.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent w-[200%] h-[200%] -left-[100%] -top-[100%]"
          variants={{
            hover: { x: ["0%", "100%"], y: ["0%", "100%"] }
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          className="w-full h-full relative z-10"
        >
          <m.path
            d="M10 10 L10 30 M10 10 L24 10 Q30 10 30 16 Q30 22 24 22 L10 22 M18 22 L29 31"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={{
              initial: { pathLength: 0, opacity: 0 },
              animate: { pathLength: 1, opacity: 1 }
            }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
          />
        </svg>
      </m.div>
      
      <div className="flex items-center text-[26px] tracking-tight">
        <m.span 
          className="font-extrabold text-foreground"
          variants={{
            initial: { opacity: 0, y: 5 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Rix
        </m.span>
        <m.span 
          className="font-light text-primary"
          variants={{
            initial: { opacity: 0, y: 5 },
            animate: { opacity: 1, y: 0 },
            hover: { textShadow: "0 0 10px rgba(59,130,246,0.5)" }
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          ora
        </m.span>
      </div>
    </m.div>
  );
}

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <RixoraLogo className="transition-transform group-hover:scale-105" />
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-x-4 md:gap-x-6">
          <SignedIn>
            <Button type="button"
              asChild
              variant="outline"
              className="items-center gap-2"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="size-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Link>
            </Button>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" className="flex items-center gap-2">
                  <StarsIcon className="size-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="size-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="size-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="size-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/api-usage" className="flex items-center gap-2">
                    <BarChart2 className="size-4" />
                    API Usage
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" asChild>
              <Button type="button" variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
