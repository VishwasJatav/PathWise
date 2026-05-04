"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorBoundary({ error, reset }) {
    useEffect(() => {
        console.error("Segment Error Caught:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
            <Card className="max-w-md w-full border-red-500/20 bg-red-500/5">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-xl font-bold">Unexpected Error Occurred</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                        {error?.message || "We encountered an issue loading this section. Please try again or refresh the page."}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => reset()} variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20">
                        Try again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
