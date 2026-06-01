"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { m, AnimatePresence } from "framer-motion";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className="border-white/5 bg-background/50 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">No Cover Letters Yet</CardTitle>
            <CardDescription className="text-slate-400">
              Create your first cover letter to get started
            </CardDescription>
          </CardHeader>
        </Card>
      </m.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {coverLetters.map((letter) => (
          <m.div
            key={letter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="group relative border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1 backdrop-blur-md overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl gradient-title mb-1">
                      {letter.jobTitle} <span className="text-slate-400 font-medium text-lg">at</span> {letter.companyName}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Created {format(new Date(letter.createdAt), "PPP")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-x-2">
                    {/* Wrap Eye button in motion.div for hover effect */}
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="button"
                        variant="outline"
                        size="icon"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors"
                        onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </m.div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button type="button" variant="outline" size="icon" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                            <Trash2 className="size-4" />
                          </Button>
                        </m.div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white text-xl">Delete Cover Letter?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently
                            delete your cover letter for <span className="font-bold text-white">{letter.jobTitle}</span> at <span className="font-bold text-white">{letter.companyName}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(letter.id)}
                            className="bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-300/80 text-sm line-clamp-3 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  {letter.jobDescription}
                </div>
              </CardContent>
            </Card>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
