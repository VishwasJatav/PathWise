import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Quiz from "../_components/quiz";


export const metadata = {
  title: 'Mock Interview — Rixora',
  description: 'Practice with AI-powered mock interviews tailored to your industry and role.',
};

const MockInterviewPage = () => {
  return (
    <div className="container mx-auto gap-y- py-6">
      <div className="flex flex-col gap-y- mx-2">
        <Link href={"/interview"}>
          <Button type="button" variant="link" className="gap-2 pl-0">
            <ArrowLeft className="size-" />
            Back to Interview Preparation
          </Button>
        </Link>
        <div>
          <h1 className="text-6xl font-bold gradient-title">Mock Interview</h1>
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific questions
          </p>
        </div>

      </div>
      <Quiz />
    </div>
  );
};

export default MockInterviewPage;


