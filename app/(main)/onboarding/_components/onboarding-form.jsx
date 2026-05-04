"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingSchema } from "@/app/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openSubIndustry, setOpenSubIndustry] = useState(false);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");
  const watchSubIndustry = watch("subIndustry");

  return (
    <div className="flex items-center justify-center bg-background min-h-[calc(100vh-140px)]">
      <Card className="w-full max-w-lg mx-4 sm:mx-0 my-10 shadow-lg border-primary/20 bg-card rounded-2xl form-border-animation">
        <CardHeader className="space-y-3">
          <CardTitle className="gradient-title text-4xl text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Popover open={openIndustry} onOpenChange={setOpenIndustry}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openIndustry}
                    className="w-full justify-between border-input text-left font-normal"
                  >
                    <span className="truncate">
                      {watchIndustry
                        ? industries.find((ind) => ind.id === watchIndustry)?.name
                        : "Search and select an industry..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 z-[999] bg-background border shadow-md rounded-md"
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  avoidCollisions={false}
                >
                  <Command>
                    <CommandInput placeholder="Search industry..." />
                    <CommandList>
                      <CommandEmpty>No industry found.</CommandEmpty>
                      <CommandGroup>
                        {industries.map((ind) => (
                          <CommandItem
                            key={ind.id}
                            value={ind.name}
                            onSelect={() => {
                              setValue("industry", ind.id);
                              setSelectedIndustry(ind);
                              setValue("subIndustry", ""); // Reset sub-industry
                              setOpenIndustry(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watchIndustry === ind.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {ind.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.industry && (
                <p className="text-sm text-destructive">{errors.industry.message}</p>
              )}
            </div>

            {/* Sub-Industry */}
            {watchIndustry && selectedIndustry && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Popover open={openSubIndustry} onOpenChange={setOpenSubIndustry}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSubIndustry}
                      className="w-full justify-between border-input text-left font-normal"
                    >
                      <span className="truncate">
                        {watchSubIndustry
                          ? watchSubIndustry
                          : "Search your specialization..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 z-[999] bg-background border shadow-md rounded-md"
                    align="start"
                    side="bottom"
                    sideOffset={6}
                    avoidCollisions={false}
                  >
                    <Command>
                      <CommandInput placeholder="Search specialization..." />
                      <CommandList>
                        <CommandEmpty>No specialization found.</CommandEmpty>
                        <CommandGroup>
                          {selectedIndustry.subIndustries.map((sub) => (
                            <CommandItem
                              key={sub}
                              value={sub}
                              onSelect={() => {
                                setValue("subIndustry", sub);
                                setOpenSubIndustry(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watchSubIndustry === sub ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {sub}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.subIndustry && (
                  <p className="text-sm text-destructive">{errors.subIndustry.message}</p>
                )}
              </div>
            )}

            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience", { valueAsNumber: true })}
                className="w-full"
              />
              {errors.experience && (
                <p className="text-sm text-destructive">{errors.experience.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-destructive">{errors.skills.message}</p>
              )}
            </div>

            {/* Professional Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background and goals..."
                className="h-32 resize-none"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full font-medium" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Translating profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
