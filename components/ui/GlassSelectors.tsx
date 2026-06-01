"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Moon, Sun, Sunset, Cloud, Wind, Snowflake, Flame, Droplets } from "lucide-react";

interface GlassSelectorsProps {
    theme?: "dark" | "light";
    compact?: boolean;
    accentColor?: string;
}

const darkTheme = {
    bg: "bg-[#06060e]",
    text: "text-zinc-100",
    cardBg: "border-white/[0.06]",
    cardTitle: "text-zinc-600",
    sectionTitle: "text-zinc-500",
    sectionBorder: "border-zinc-900",
    eyebrow: "text-zinc-700",
    heading: "text-white",
    subheading: "text-zinc-600",
};

const lightTheme = {
    bg: "bg-[#eef2ff]",
    text: "text-zinc-900",
    cardBg: "border-white/80",
    cardTitle: "text-zinc-400",
    sectionTitle: "text-zinc-500",
    sectionBorder: "border-indigo-100",
    eyebrow: "text-zinc-400",
    heading: "text-zinc-900",
    subheading: "text-zinc-500",
};

// ─── Real glass card — gradient backdrop so blur effects actually show ───────
const GlassCard = ({ title, children, cardTitle, isDark }: {
    title: string;
    children: React.ReactNode;
    cardTitle: string;
    isDark: boolean;
}) => (
    <div
        className="relative overflow-hidden rounded-2xl border p-6"
        style={{
            background: isDark
                ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)",
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            boxShadow: isDark
                ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.4)"
                : "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(99,102,241,0.08)",
        }}
    >
        {/* Top-edge light — the real glassmorphism detail */}
        <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
                background: isDark
                    ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)",
            }}
        />
        <h3 className={cn("mb-5 text-xs font-medium uppercase tracking-widest", cardTitle)}>{title}</h3>
        <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
);

// ─── 1. Frosted Depth — three-layer proper glassmorphism ────────────────────
function FrostedDepth({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(1);
    const opts = ["Mist", "Frost", "Crystal"];
    return (
        <div
            className="inline-flex rounded-2xl p-1"
            style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
                backdropFilter: "blur(16px)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.8)",
                boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "inset 0 1px 0 rgba(255,255,255,1)",
            }}
        >
            {opts.map((opt, i) => (
                <button key={opt} onClick={() => setActive(i)} className="relative rounded-xl px-5 py-2 text-xs font-medium">
                    {active === i && (
                        <motion.div
                            layoutId="frost-active"
                            className="absolute inset-0 rounded-xl"
                            style={{
                                background: isDark
                                    ? "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)"
                                    : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)",
                                backdropFilter: "blur(8px)",
                                boxShadow: isDark
                                    ? `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)`
                                    : `inset 0 1px 0 rgba(255,255,255,1), 0 4px 12px rgba(99,102,241,0.12), 0 0 0 1px rgba(255,255,255,0.6)`,
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                    )}
                    <span
                        className="relative z-10 transition-colors duration-300"
                        style={{ color: active === i ? (isDark ? "rgba(255,255,255,0.9)" : "#18181b") : isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}
                    >
                        {opt}
                    </span>
                </button>
            ))}
        </div>
    );
}

// ─── 2. Liquid Morph — bouncy spring creates stretching liquid feel ──────────
function LiquidMorph({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(0);
    const opts = ["Surface", "Depth", "Void", "Abyss"];
    return (
        <div
            className="inline-flex rounded-full p-1 gap-0.5"
            style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)",
                border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.7)",
            }}
        >
            {opts.map((opt, i) => (
                <button key={opt} onClick={() => setActive(i)} className="relative rounded-full px-4 py-1.5 text-xs font-semibold">
                    {active === i && (
                        <motion.div
                            layoutId="liquid-bg"
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: isDark
                                    ? `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`
                                    : `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                                boxShadow: `0 0 20px -4px ${accentColor}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
                            }}
                            transition={{ type: "spring", stiffness: 600, damping: 22 }}
                        />
                    )}
                    <span
                        className="relative z-10 transition-colors duration-200"
                        style={{ color: active === i ? (isDark ? "#fff" : "#18181b") : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}
                    >
                        {opt}
                    </span>
                </button>
            ))}
        </div>
    );
}

// ─── 3. Mirror Sweep — light beam drags across glass surface ────────────────
function MirrorSweep({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(1);
    const [sweeping, setSweeping] = useState(false);
    const opts = ["Obsidian", "Smoke", "Pearl", "Chalk"];

    const handleClick = (i: number) => {
        setActive(i);
        setSweeping(true);
        setTimeout(() => setSweeping(false), 600);
    };

    return (
        <div className="flex flex-col gap-px overflow-hidden rounded-xl"
            style={{
                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.6)",
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.7)",
            }}
        >
            {opts.map((opt, i) => (
                <button
                    key={opt}
                    onClick={() => handleClick(i)}
                    className="group relative overflow-hidden px-5 py-3 text-left text-xs font-medium transition-colors duration-200"
                    style={{ color: active === i ? (isDark ? "#fff" : "#18181b") : isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)" }}
                >
                    {active === i && (
                        <>
                            <motion.div
                                layoutId="mirror-bg"
                                className="absolute inset-0"
                                style={{
                                    background: isDark
                                        ? "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)"
                                        : "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                            {/* Sweep beam */}
                            <AnimatePresence>
                                {sweeping && (
                                    <motion.div
                                        className="absolute inset-y-0 w-16"
                                        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                                        initial={{ left: "-4rem" }}
                                        animate={{ left: "100%" }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                )}
                            </AnimatePresence>
                        </>
                    )}
                    <span className="relative z-10">{opt}</span>
                </button>
            ))}
        </div>
    );
}

// ─── 4. Prism Edge — rotating iridescent conic-gradient border ──────────────
function PrismEdge({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(0);
    const [rotation, setRotation] = useState(0);
    const opts = ["Refract", "Scatter", "Diffuse"];

    useEffect(() => {
        const id = setInterval(() => setRotation(r => (r + 1.2) % 360), 16);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex gap-3">
            {opts.map((opt, i) => (
                <button
                    key={opt}
                    onClick={() => setActive(i)}
                    className="relative rounded-2xl p-px text-xs font-semibold transition-all"
                    style={active === i ? {
                        background: `conic-gradient(from ${rotation}deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff, #ff6b6b)`,
                    } : {
                        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                    }}
                >
                    <div
                        className="relative flex items-center justify-center rounded-[14px] px-4 py-2.5"
                        style={{
                            background: isDark ? "rgba(6,6,14,0.95)" : "rgba(238,242,255,0.95)",
                            color: active === i ? (isDark ? "#fff" : "#18181b") : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                        }}
                    >
                        {opt}
                    </div>
                </button>
            ))}
        </div>
    );
}

// ─── 5. Ice Tiles — frosted vertical list with crystalline borders ───────────
function IceTiles({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(0);
    const opts = [
        { label: "Glacial", icon: Snowflake },
        { label: "Vapour", icon: Cloud },
        { label: "Flame", icon: Flame },
        { label: "Torrent", icon: Droplets },
    ];
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {opts.map(({ label, icon: Icon }, i) => (
                <motion.button
                    key={label}
                    onClick={() => setActive(i)}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left text-xs font-medium transition-colors duration-300"
                    style={
                        active === i
                            ? {
                                background: isDark
                                    ? "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)"
                                    : "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)",
                                border: isDark
                                    ? "1px solid rgba(255,255,255,0.15)"
                                    : "1px solid rgba(255,255,255,0.9)",
                                boxShadow: isDark
                                    ? `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.3)`
                                    : `inset 0 1px 0 rgba(255,255,255,1), 0 4px 12px rgba(99,102,241,0.1)`,
                                color: isDark ? "#fff" : "#18181b",
                            }
                            : {
                                background: "transparent",
                                border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)",
                                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)",
                            }
                    }
                >
                    {/* Diagonal shimmer on active */}
                    {active === i && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
                            }}
                            animate={{ x: ["0%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        />
                    )}
                    <Icon
                        className="relative z-10 h-4 w-4 flex-shrink-0 transition-all duration-300"
                        strokeWidth={active === i ? 1.5 : 1}
                        style={{ opacity: active === i ? 1 : 0.3 }}
                    />
                    <span className="relative z-10">{label}</span>
                </motion.button>
            ))}
        </div>
    );
}

// ─── 6. Glass Orb — 3D sphere look with top-left highlight ──────────────────
function GlassOrb({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(1);
    const opts = [
        { label: "Dawn", icon: Sunset },
        { label: "Noon", icon: Sun },
        { label: "Dusk", icon: Wind },
        { label: "Night", icon: Moon },
    ];
    return (
        <div className="flex gap-4">
            {opts.map(({ label, icon: Icon }, i) => (
                <button key={label} onClick={() => setActive(i)} className="flex flex-col items-center gap-2">
                    <motion.div
                        className="relative flex h-11 w-11 items-center justify-center rounded-full"
                        animate={active === i ? { scale: 1.08 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={
                            active === i
                                ? {
                                    background: isDark
                                        ? `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25) 0%, ${accentColor}30 40%, ${accentColor}10 100%)`
                                        : `radial-gradient(circle at 35% 35%, rgba(255,255,255,1) 0%, ${accentColor}30 50%, ${accentColor}15 100%)`,
                                    border: isDark
                                        ? `1px solid rgba(255,255,255,0.2)`
                                        : `1px solid rgba(255,255,255,0.9)`,
                                    boxShadow: isDark
                                        ? `0 8px 24px -4px ${accentColor}40, inset 0 -2px 4px rgba(0,0,0,0.2)`
                                        : `0 8px 24px -4px ${accentColor}30, inset 0 -2px 4px rgba(0,0,0,0.05)`,
                                }
                                : {
                                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)",
                                    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.6)",
                                }
                        }
                    >
                        {/* Specular highlight */}
                        {active === i && (
                            <div
                                className="absolute top-1.5 left-2 h-2.5 w-2 rounded-full"
                                style={{
                                    background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 100%)",
                                    filter: "blur(2px)",
                                }}
                            />
                        )}
                        <Icon
                            className="relative z-10 h-4 w-4 transition-all duration-300"
                            strokeWidth={active === i ? 1.5 : 1}
                            style={{ color: active === i ? (isDark ? "#fff" : "#18181b") : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}
                        />
                    </motion.div>
                    <span
                        className="text-[10px] font-medium transition-colors duration-300"
                        style={{ color: active === i ? (isDark ? "rgba(255,255,255,0.7)" : "#18181b") : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.25)" }}
                    >
                        {label}
                    </span>
                </button>
            ))}
        </div>
    );
}

// ─── 7. Vapor Trail — ghost follows active on transition ─────────────────────
function VaporTrail({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const opts = ["Alpha", "Beta", "Gamma", "Delta"];

    const handleClick = (i: number) => {
        setPrev(active);
        setActive(i);
        setTimeout(() => setPrev(null), 500);
    };

    return (
        <div
            className="inline-flex rounded-2xl p-1 gap-0.5"
            style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.55)",
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
            }}
        >
            {opts.map((opt, i) => (
                <button key={opt} onClick={() => handleClick(i)} className="relative rounded-xl px-4 py-2 text-xs font-semibold">
                    {/* Ghost vapor trail */}
                    <AnimatePresence>
                        {prev === i && (
                            <motion.div
                                className="absolute inset-0 rounded-xl"
                                style={{
                                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
                                }}
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{ opacity: 0, scale: 1.15, filter: "blur(4px)" }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>
                    {active === i && (
                        <motion.div
                            layoutId="vapor-active"
                            className="absolute inset-0 rounded-xl"
                            style={{
                                background: isDark
                                    ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)"
                                    : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 100%)",
                                boxShadow: isDark
                                    ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.2)"
                                    : "inset 0 1px 0 rgba(255,255,255,1), 0 4px 12px rgba(99,102,241,0.08)",
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span
                        className="relative z-10 transition-colors duration-200"
                        style={{ color: active === i ? (isDark ? "#fff" : "#18181b") : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }}
                    >
                        {opt}
                    </span>
                </button>
            ))}
        </div>
    );
}

// ─── 8. Condensation Ring — moisture ring appears on active ─────────────────
function CondensationRing({ isDark, accentColor }: { isDark: boolean; accentColor: string }) {
    const [active, setActive] = useState(2);
    const opts = ["00", "25", "50", "75", "100"];
    return (
        <div className="flex items-end gap-3">
            {opts.map((opt, i) => (
                <button key={opt} onClick={() => setActive(i)} className="group flex flex-col items-center gap-2">
                    <motion.div
                        className="relative flex h-10 w-10 items-center justify-center rounded-full"
                        animate={active === i ? { scale: 1 } : { scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        style={
                            active === i
                                ? {
                                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)",
                                    boxShadow: isDark
                                        ? `0 0 0 1px rgba(255,255,255,0.15), 0 0 0 3px rgba(255,255,255,0.04), 0 0 0 6px rgba(255,255,255,0.02), 0 8px 20px rgba(0,0,0,0.3)`
                                        : `0 0 0 1px rgba(255,255,255,0.9), 0 0 0 3px rgba(255,255,255,0.5), 0 0 0 6px rgba(255,255,255,0.2), 0 8px 20px rgba(99,102,241,0.1)`,
                                }
                                : {
                                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.35)",
                                }
                        }
                    >
                        <span
                            className="font-mono text-[10px] font-bold transition-colors duration-300"
                            style={{ color: active === i ? (isDark ? "#fff" : "#18181b") : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}
                        >
                            {opt}
                        </span>
                    </motion.div>
                    <div
                        className="h-0.5 w-0.5 rounded-full transition-all duration-300"
                        style={{
                            background: active === i ? (isDark ? "rgba(255,255,255,0.5)" : accentColor) : "transparent",
                            width: active === i ? "16px" : "4px",
                        }}
                    />
                </button>
            ))}
        </div>
    );
}

const GridContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
);

export default function GlassSelectors({ theme = "dark", compact = false, accentColor = "#818cf8" }: GlassSelectorsProps) {
    const t = theme === "dark" ? darkTheme : lightTheme;
    const isDark = theme === "dark";
    const pad = compact ? "p-5" : "p-8";
    const spacing = compact ? "space-y-8" : "space-y-12";

    const card = (title: string, children: React.ReactNode) => (
        <GlassCard title={title} cardTitle={t.cardTitle} isDark={isDark}>{children}</GlassCard>
    );

    return (
        <div className={cn("min-h-screen w-full font-sans", t.bg, t.text, pad)}>
            {/* Ambient gradient orbs — gives glass effects something to blur through */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -left-40 h-96 w-96 rounded-full"
                    style={{ background: isDark ? `${accentColor}15` : `${accentColor}20`, filter: "blur(80px)" }}
                />
                <div
                    className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full"
                    style={{ background: isDark ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.15)", filter: "blur(80px)" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: isDark ? "rgba(244,63,94,0.05)" : "rgba(244,63,94,0.08)", filter: "blur(60px)" }}
                />
            </div>

            <div className={cn("relative mx-auto max-w-6xl", spacing)}>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", t.eyebrow)}>Uilora</span>
                        <span className={cn("text-[10px]", t.eyebrow)}>·</span>
                        <span className={cn("text-[10px] font-medium uppercase tracking-[0.12em]", t.eyebrow)}>Selector System</span>
                    </div>
                    <h1 className={cn("text-3xl font-light tracking-tight", t.heading)}>Glass Selectors</h1>
                    <p className={cn("text-sm", t.subheading)}>Glassmorphism selectors with real depth, liquid spring physics, and material light.</p>
                </div>

                {!compact && (
                    <section>
                        <h2 className={cn("mb-6 border-b pb-2 text-sm font-semibold", t.sectionTitle, t.sectionBorder)}>01 — Surface & Depth</h2>
                        <GridContainer>
                            {card("Frosted Depth", <FrostedDepth isDark={isDark} accentColor={accentColor} />)}
                            {card("Liquid Morph", <LiquidMorph isDark={isDark} accentColor={accentColor} />)}
                            {card("Mirror Sweep", <MirrorSweep isDark={isDark} accentColor={accentColor} />)}
                        </GridContainer>
                    </section>
                )}

                <section>
                    <h2 className={cn("mb-6 border-b pb-2 text-sm font-semibold", t.sectionTitle, t.sectionBorder)}>
                        {compact ? "01" : "02"} — Light & Material
                    </h2>
                    <GridContainer>
                        {card("Prism Edge", <PrismEdge isDark={isDark} accentColor={accentColor} />)}
                        {card("Ice Tiles", <IceTiles isDark={isDark} accentColor={accentColor} />)}
                        {card("Glass Orb", <GlassOrb isDark={isDark} accentColor={accentColor} />)}
                    </GridContainer>
                </section>

                <section>
                    <h2 className={cn("mb-6 border-b pb-2 text-sm font-semibold", t.sectionTitle, t.sectionBorder)}>
                        {compact ? "02" : "03"} — Physics & Trace
                    </h2>
                    <GridContainer>
                        {card("Vapor Trail", <VaporTrail isDark={isDark} accentColor={accentColor} />)}
                        {card("Condensation Ring", <CondensationRing isDark={isDark} accentColor={accentColor} />)}
                    </GridContainer>
                </section>
            </div>
        </div>
    );
}

export { GlassSelectors };
