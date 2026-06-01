import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export const metadata = {
  title: 'Cover Letter — Rixora',
  description: 'View and edit your generated cover letter.',
};

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <div className="container mx-auto py-6 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button type="button" variant="link" className="gap-2 pl-0 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-5xl md:text-6xl font-bold gradient-title mb-6 pb-4">
          {coverLetter?.jobTitle} <span className="text-slate-500 font-medium text-4xl">at</span> {coverLetter?.companyName}
        </h1>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <CoverLetterPreview content={coverLetter?.content} />
      </div>
    </div>
  );
}
