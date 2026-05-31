import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";


export const metadata = {
  title: 'New Cover Letter — Rixora',
  description: 'Generate a new cover letter for a specific job posting.',
};

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-y-">
        <Link href="/ai-cover-letter">
          <Button type="button" variant="link" className="gap-2 pl-0">
            <ArrowLeft className="size-" />
            Back to Cover Letters
          </Button>
        </Link>

        <div className="pb-6">
          <h1 className="text-6xl font-bold gradient-title">
            Create Cover Letter
          </h1>
          <p className="text-muted-foreground">
            Generate a tailored cover letter for your job application
          </p>
        </div>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}

