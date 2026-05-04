"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col items-center justify-center p-4`}>
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Something went radically wrong</h1>
                    <p className="text-muted-foreground text-sm">
                        We encountered a critical error while trying to process your request.
                        Our team has been notified.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                        <Button onClick={() => reset()} variant="default" className="w-full sm:w-auto">
                            Try again
                        </Button>
                        <Link href="/" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full">
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
