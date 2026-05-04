"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/app/lib/schema";

const ResumeContext = createContext(null);

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
};

export const ResumeProvider = ({ children, initialData }) => {
    const [template, setTemplate] = useState("classic");
    const [zoom, setZoom] = useState(75);
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [sectionOrder, setSectionOrder] = useState([
        "summary",
        "skills",
        "experience",
        "education",
        "projects",
    ]);

    const {
        control,
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: initialData || {
            contactInfo: {},
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
        },
    });

    const resumeData = watch();

    return (
        <ResumeContext.Provider
            value={{
                resumeData,
                initialData,
                template,
                setTemplate,
                zoom,
                setZoom,
                lastSavedAt,
                setLastSavedAt,
                sectionOrder,
                setSectionOrder,
                control,
                register,
                handleSubmit,
                watch,
                getValues,
                setValue,
                reset,
                errors,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
};
