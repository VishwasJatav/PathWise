"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2, GripVertical } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

function SortableEntryCard({ item, index, handleDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 group relative">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-800 rounded-lg shrink-0"
      >
        <GripVertical className="h-4 w-4 text-slate-500" />
      </div>
      <Card className="flex-1 bg-[#0f0f12] border-slate-800 shadow-lg group-hover:border-slate-700 transition-all rounded-xl overflow-hidden ring-1 ring-slate-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-slate-200">
              {item.title} <span className="text-slate-500 font-medium px-1">@</span> {item.organization}
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {item.current
                ? `${item.startDate} - Present`
                : `${item.startDate} - ${item.endDate}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={() => handleDelete(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-2">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [sortableEntries, setSortableEntries] = useState([]);

  // Hydrate items with unique IDs for dnd-kit
  useEffect(() => {
    if (entries) {
      setSortableEntries(entries.map((e, i) => ({ ...e, id: e.id || `entry-${i}-${Date.now()}` })));
    }
  }, [entries]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sortableEntries.findIndex((item) => item.id === active.id);
      const newIndex = sortableEntries.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(sortableEntries, oldIndex, newIndex);
      onChange(newOrder); // Update parent form values
    }
  };

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      id: `entry-${Date.now()}`,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableEntries.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sortableEntries.map((item, index) => (
              <SortableEntryCard
                key={item.id}
                item={item}
                index={index}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isAdding ? (
        <Card className="bg-[#0f0f12] border-slate-700 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-slate-900/50 border-b border-slate-800 p-6 pb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" />
              Add New {type}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Title / Position</label>
                <Input
                  className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-11 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium"
                  placeholder="Software Engineer"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Organization / Company</label>
                <Input
                  className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-11 rounded-xl text-slate-200 placeholder:text-slate-800 font-medium"
                  placeholder="Google"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Start Date</label>
                <Input
                  type="month"
                  className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-11 rounded-xl text-slate-200 color-scheme-dark invert-icons"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">End Date</label>
                <Input
                  type="month"
                  className="bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 h-11 rounded-xl text-slate-200 color-scheme-dark invert-icons disabled:opacity-30 transition-opacity"
                  {...register("endDate")}
                  disabled={current}
                />
                {errors.endDate && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-[#0a0a0c] p-3 px-4 rounded-xl border border-slate-800 w-max hover:border-slate-700 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
                className="accent-blue-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="current" className="cursor-pointer select-none font-bold text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-slate-300">I currently work here</label>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Description / Key Achievements</label>
              <div className="relative group">
                <Textarea
                  placeholder={`E.g. Developed and optimized features for a high-traffic e-commerce platform...`}
                  className="min-h-[160px] bg-[#0a0a0c] border-slate-800 focus:border-blue-500/50 resize-none text-slate-300 placeholder:text-slate-800 leading-relaxed rounded-xl transition-all duration-300"
                  {...register("description")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleImproveDescription}
                  disabled={isImproving || !watch("description")}
                  className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-widest text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-blue-500/10 bg-[#0a0a0c]/80 backdrop-blur"
                >
                  {isImproving ? (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-2" />
                  )}
                  Improve with AI
                </Button>
              </div>
              {errors.description && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between space-x-2 bg-slate-900/50 border-t border-slate-800 p-8 rounded-b-2xl">
            <Button
              type="button"
              variant="ghost"
              className="text-[11px] uppercase font-bold tracking-widest text-slate-500 hover:text-white"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 px-8 font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              Add {type}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="w-full flex flex-col items-center justify-center h-24 border-dashed border-2 border-slate-800 hover:border-blue-500/50 bg-slate-900/10 hover:bg-blue-500/5 transition-all rounded-2xl group"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-6 w-6 mb-2 text-slate-600 group-hover:text-blue-500 transition-colors" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-slate-300">Add New {type}</span>
        </Button>
      )}
    </div>
  );
}
