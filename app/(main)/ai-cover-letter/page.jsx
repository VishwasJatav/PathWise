import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";


export const metadata = {
  title: 'AI Cover Letter | Rixora',
  description: 'Generate compelling, personalized cover letters with AI in seconds.',
};

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button type="button">
            <Plus className="size- mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}

