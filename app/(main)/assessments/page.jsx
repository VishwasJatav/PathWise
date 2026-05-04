import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Assessments — PathWise",
  description: "Track your interview assessment scores and performance history.",
};

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto mt-24 mb-20 px-5 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-5xl font-bold gradient-title">Assessments</h1>
        <p className="text-muted-foreground text-lg">
          Review your past interview performance and track your progress over time.
        </p>
      </div>

      <Card className="border-dashed border-2 border-border/60">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">No assessments yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground max-w-sm mx-auto">
            Take a mock interview to generate your first assessment report and start tracking your readiness.
          </p>
          <Link href="/interview/mock">
            <Button size="lg" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Start Mock Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
