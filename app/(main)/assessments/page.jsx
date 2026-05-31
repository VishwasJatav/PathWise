import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Assessments — Rixora",
  description: "Track your interview assessment scores and performance history.",
};

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto mt-24 mb-20 px-5 gap-y-">
      <div className="flex flex-col gap-y-">
        <h1 className="text-5xl font-bold gradient-title">Assessments</h1>
        <p className="text-muted-foreground text-lg">
          Review your past interview performance and track your progress over time.
        </p>
      </div>

      <Card className="border-dashed border-2 border-border/60">
        <CardHeader className="text-center pb-2">
          <div className="size- rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="size- text-primary" />
          </div>
          <CardTitle className="text-2xl">No assessments yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center gap-y-">
          <p className="text-muted-foreground max-w-sm mx-auto">
            Take a mock interview to generate your first assessment report and start tracking your readiness.
          </p>
          <Link href="/interview/mock">
            <Button type="button" size="lg" className="gap-2">
              <GraduationCap className="size-" />
              Start Mock Interview
              <ArrowRight className="size-" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
