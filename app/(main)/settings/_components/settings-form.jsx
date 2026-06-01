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
import { Loader2, Check, ChevronsUpDown, ShieldAlert, BadgeCheck, Mail, Save, X, Sparkles, AlertCircle, Bell, Crown, Settings } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
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

const SettingsForm = ({ userProfile, industries }) => {
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "account" | "billing"

  // Load ATS strictness from localStorage if available, default to "balanced"
  const [atsStrictness, setAtsStrictness] = useState("balanced");
  
  useEffect(() => {
    const saved = localStorage.getItem("rixora_ats_strictness");
    if (saved) setAtsStrictness(saved);
  }, []);

  const handleStrictnessChange = (mode) => {
    setAtsStrictness(mode);
    localStorage.setItem("rixora_ats_strictness", mode);
    toast.success(`ATS Strictness set to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
  };

  // Parse industry from DB format "tech-software-development"
  let initialIndustryId = "";
  let initialSubIndustryName = "";
  let initialIndustryObj = null;

  if (userProfile.industry) {
    const matchedInd = industries.find((ind) => userProfile.industry.startsWith(ind.id + "-"));
    if (matchedInd) {
      initialIndustryId = matchedInd.id;
      initialIndustryObj = matchedInd;
      
      const suffix = userProfile.industry.slice(matchedInd.id.length + 1); // e.g. "software-development"
      const matchedSub = matchedInd.subIndustries.find(
        (sub) => sub.toLowerCase().replace(/ /g, "-") === suffix
      );
      if (matchedSub) {
        initialSubIndustryName = matchedSub;
      }
    }
  }

  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustryObj);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openSubIndustry, setOpenSubIndustry] = useState(false);

  // Key Skills Interactive Tag Input States
  const [skillsList, setSkillsList] = useState(userProfile.skills || []);
  const [skillInput, setSkillInput] = useState("");

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
    defaultValues: {
      industry: initialIndustryId,
      subIndustry: initialSubIndustryName,
      experience: userProfile.experience ?? 0,
      skills: userProfile.skills ? userProfile.skills.join(", ") : "",
      bio: userProfile.bio ?? "",
    },
  });

  // Handle adding skill tags
  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/,/g, "");
      if (trimmed && !skillsList.includes(trimmed)) {
        const newList = [...skillsList, trimmed];
        setSkillsList(newList);
        setValue("skills", newList.join(", ")); // update form default value
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newList = skillsList.filter((s) => s !== skillToRemove);
    setSkillsList(newList);
    setValue("skills", newList.join(", ")); // update form default value
  };

  const onSubmit = async (values) => {
    try {
      let finalSkills = [...skillsList];
      const trimmedInput = skillInput.trim().replace(/,/g, "");
      if (trimmedInput && !finalSkills.includes(trimmedInput)) {
        finalSkills.push(trimmedInput);
        setSkillsList(finalSkills);
      }

      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        skills: finalSkills.join(", "), // pass back to let schema transform it
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Settings update error:", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Settings updated successfully!");
      router.refresh();
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");
  const watchSubIndustry = watch("subIndustry");

  const tabs = [
    { id: "profile", label: "Career Profile" },
    { id: "account", label: "Account Details" },
    { id: "billing", label: "Billing & Plans" }
  ];

  return (
    <div className="w-full relative py-6">
      {/* Decorative ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/5 filter blur-[80px]" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-blue-600/5 filter blur-[80px]" />
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-white/[0.08] pb-6">
          <h1 className="text-4xl font-light tracking-tight text-white animate-fade-in flex items-center gap-2">
            Settings <Settings className="size-6 text-primary animate-pulse" />
          </h1>
          <p className="text-sm text-muted-foreground animate-fade-in stagger-1">
            Manage your professional profile, system preferences, and account configurations.
          </p>
        </div>

        {/* Custom Uilora Frosted Tab Selector */}
        <div className="flex justify-start animate-fade-in stagger-2">
          <div
            className="inline-flex rounded-2xl p-1"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative rounded-xl px-5 py-2 text-xs font-semibold transition-colors duration-200"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settings-tab-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 transition-colors duration-300",
                    activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 animate-fade-in stagger-3">
          <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Career Profile Card */}
                <Card className="shadow-lg border-white/[0.08] bg-card rounded-2xl form-border-animation">
                  <CardHeader>
                    <CardTitle className="gradient-title text-2xl">
                      Career Interests & Profile
                    </CardTitle>
                    <CardDescription>
                      These settings calibrate your Rixora Dashboard insights, tailor ATS scoring algorithms, and customize AI interview scenarios.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      
                      {/* Grid for Industry & Specialization */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Industry */}
                        <div className="space-y-2">
                          <Label htmlFor="industry">Primary Industry</Label>
                          <Popover open={openIndustry} onOpenChange={setOpenIndustry}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                aria-expanded={openIndustry}
                                className="w-full justify-between border-input text-left font-normal bg-background/50 backdrop-blur-sm"
                              >
                                <span className="truncate">
                                  {watchIndustry
                                    ? industries.find((ind) => ind.id === watchIndustry)?.name
                                    : "Search and select an industry..."}
                                </span>
                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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
                                            "mr-2 size-4",
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
                        <div className="space-y-2">
                          <Label htmlFor="subIndustry">Role Specialization</Label>
                          <Popover open={openSubIndustry} onOpenChange={setOpenSubIndustry}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={!watchIndustry || !selectedIndustry}
                                aria-expanded={openSubIndustry}
                                className="w-full justify-between border-input text-left font-normal bg-background/50 backdrop-blur-sm disabled:opacity-50"
                              >
                                <span className="truncate">
                                  {watchSubIndustry
                                    ? watchSubIndustry
                                    : "Search your specialization..."}
                                </span>
                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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
                                    {selectedIndustry?.subIndustries.map((sub) => (
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
                                            "mr-2 size-4",
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

                      </div>

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
                          className="w-full bg-background/50 border-white/10 text-white"
                        />
                        {errors.experience && (
                          <p className="text-sm text-destructive">{errors.experience.message}</p>
                        )}
                      </div>

                      {/* Key Skills Interactive Tag Input */}
                      <div className="space-y-2">
                        <Label className="flex justify-between items-end">
                          <span>Core Competencies &amp; Skills</span>
                          <span className="text-[10px] text-muted-foreground">Press Enter or type comma to add</span>
                        </Label>
                        <div className="w-full min-h-[46px] bg-background/50 border border-input rounded-md p-2 focus-within:border-primary transition-colors flex flex-wrap gap-2">
                          {/* Render Skill Tags */}
                          {skillsList.map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-white font-medium text-xs skill-badge-hover"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-muted-foreground hover:text-white transition-colors"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                          {/* Hidden actual input for react-hook-form schema compatibility */}
                          <input type="hidden" {...register("skills")} />
                          {/* User tag input field */}
                          <input
                            type="text"
                            placeholder={skillsList.length === 0 ? "Add your core skills..." : "Add skill..."}
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            className="bg-transparent border-none outline-none flex-1 min-w-[120px] text-white text-sm placeholder:text-muted-foreground focus:ring-0"
                          />
                        </div>
                        {errors.skills && (
                          <p className="text-sm text-destructive">{errors.skills.message}</p>
                        )}
                      </div>

                      {/* Professional Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Briefly describe your career trajectory and current focus..."
                          className="h-32 resize-none bg-background/50 border-white/10 text-white"
                          {...register("bio")}
                        />
                        {errors.bio && (
                          <p className="text-sm text-destructive">{errors.bio.message}</p>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            router.refresh();
                            toast.info("Changes canceled.");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="font-semibold gap-1.5" disabled={updateLoading}>
                          {updateLoading ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="size-4" />
                              Save Profile Settings
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Bento Grid: Extra Preference Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* ATS Strictness Card */}
                  <div className="bg-card border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                        <Sparkles className="size-5 text-primary" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-muted-foreground text-[10px] uppercase tracking-wider font-semibold border border-white/[0.05]">
                        AI Engine
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">ATS Parsing Strictness</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Determine how aggressively the AI formats your documents for Applicant Tracking Systems.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/[0.04]">
                      {["strict", "balanced", "creative"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleStrictnessChange(mode)}
                          className={cn(
                            "py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-[0.98]",
                            atsStrictness === mode
                              ? "bg-primary/10 text-primary border-primary"
                              : "bg-transparent text-muted-foreground border-white/5 hover:bg-white/[0.02]"
                          )}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Alerts Preferences Card */}
                  <div className="bg-card border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                        <Bell className="size-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Alerts & Notifications</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Manage reminders for interview prep, credit balances, and resume analysis status.
                      </p>
                    </div>
                    <div className="mt-auto pt-2">
                      <button
                        type="button"
                        onClick={() => toast.info("Alert notifications configurations will be syncable soon!")}
                        className="text-primary hover:text-white transition-colors text-xs font-medium flex items-center gap-1 group"
                      >
                        Configure Alerts
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : activeTab === "account" ? (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="shadow-lg border-white/[0.08] bg-card rounded-2xl overflow-hidden relative">
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Account Details</CardTitle>
                    <CardDescription>
                      Personal credentials and sync status.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {clerkLoaded && clerkUser ? (
                      <div className="space-y-8">
                        {/* Profile header */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <img
                            src={clerkUser.imageUrl}
                            alt={clerkUser.fullName || "User Avatar"}
                            className="size-20 rounded-full border-2 border-primary/50 shadow-lg"
                          />
                          <div className="text-center sm:text-left space-y-1.5">
                            <h3 className="text-xl font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
                              {clerkUser.fullName}
                              <BadgeCheck className="size-5 text-primary fill-primary/10" />
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                              <Mail className="size-4" />
                              {clerkUser.primaryEmailAddress?.emailAddress}
                            </p>
                          </div>
                        </div>

                        {/* Detailed details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                            <span className="text-xs text-muted-foreground block mb-1">Provider ID (Clerk)</span>
                            <span className="text-sm font-mono text-white/90 break-all">{clerkUser.id}</span>
                          </div>
                          <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                            <span className="text-xs text-muted-foreground block mb-1">Sync Status</span>
                            <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                              Synced with Rixora DB
                            </span>
                          </div>
                        </div>

                        {/* Notice for editing details */}
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex gap-3 items-start leading-relaxed">
                          <AlertCircle className="size-5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block mb-0.5">Authentication Notice</span>
                            Email, password, and profile picture modifications must be performed through our authentication dashboard. Use your Clerk user profile settings to manage security settings.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center py-12">
                        <Loader2 className="size-8 animate-spin text-primary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="shadow-lg border-white/[0.08] bg-card rounded-2xl overflow-hidden relative">
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      Billing &amp; Subscription <Crown className="size-5 text-amber-400 fill-amber-400/20" />
                    </CardTitle>
                    <CardDescription>
                      View and manage your pricing tier, subscription renew state, and usage limits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-6 rounded-xl border border-white/[0.05] bg-white/[0.01] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Active Plan</span>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          Rixora Standard Plan
                        </h3>
                        <p className="text-xs text-muted-foreground">Unlimited ATS Resumes · 5 AI Mock Interviews / month · Custom insights</p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => toast.success("You are already on the standard plan! Upgrade boxes are coming soon.")}
                        className="bg-primary hover:bg-primary/95 text-black font-bold text-xs px-6 py-2.5 rounded-lg shrink-0"
                      >
                        Upgrade to Pro
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-xs text-muted-foreground block mb-1">Pricing</span>
                        <span className="text-lg font-semibold text-white">$0.00 / Free tier</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-xs text-muted-foreground block mb-1">Renewal Date</span>
                        <span className="text-lg font-semibold text-white">Lifetime Access</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-xs text-muted-foreground block mb-1">API Credit Usage</span>
                        <span className="text-lg font-semibold text-emerald-400">Within limits</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;
