"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon, Activity, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function RixoraLogo({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 48"
      className={className}
      style={{ height: '36px', width: 'auto' }}
      role="img"
      aria-label="Rixora — AI Career and Study Hub"
    >
      <defs>
        <linearGradient id="hGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED"/>
          <stop offset="100%" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
      <rect x="0" y="2" width="40" height="40" rx="9" fill="url(#hGrad)"/>
      <path
        d="M9 11 L9 33 M9 11 L25 11 Q31 11 31 17 Q31 23 25 23 L9 23 M19 23 L31 33"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="48" y="27"
        fontFamily="Inter,system-ui,sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="#7C3AED"
        letterSpacing="-0.5"
      >Rix</text>
      <text
        x="86" y="27"
        fontFamily="Inter,system-ui,sans-serif"
        fontSize="22"
        fontWeight="300"
        fill="#4F46E5"
        letterSpacing="-0.5"
      >ora</text>
    </svg>
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
        <div className="flex items-center gap-x- md:gap-x-">
          <SignedIn>
            <Button type="button"
              asChild
              variant="outline"
              className="items-center gap-2"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="size-" />
                <span className="hidden md:block">Industry Insights</span>
              </Link>
            </Button>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" className="flex items-center gap-2">
                  <StarsIcon className="size-" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="size-" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="size-" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="size-" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="size-" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/api-usage" className="flex items-center gap-2">
                    <BarChart2 className="size-" />
                    API Usage
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
                  avatarBox: "size-",
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
