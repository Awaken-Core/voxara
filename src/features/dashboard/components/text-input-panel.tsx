"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AudioLines, Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";

export function TextInputPanel() {
    const [text, setText] = useState("");
    const router = useRouter();

    const handleGenerate = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        router.push(`/text-to-speech?text=${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="rounded-[22px] border border-white/20 bg-white/[0.07] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_20px_50px_-28px_rgba(0,0,0,.9)] backdrop-blur-2xl">
            <div className="rounded-[17px] border border-white/10 bg-black/20 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] sm:px-5 sm:py-4">
                <div className="space-y-3">
                    <Textarea
                        aria-label="Text to turn into speech"
                        placeholder="What would you like Voxara to say?"
                        className="min-h-16 resize-none border-0 bg-transparent p-0 text-base text-white shadow-none placeholder:text-white/45 focus-visible:ring-0 sm:min-h-18 dark:bg-transparent"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={TEXT_MAX_LENGTH}
                    />

                    <div className="flex flex-col gap-3 border-t border-white/8 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
                            <span className="inline-flex items-center gap-1.5">
                                <Coins className="size-3.5" />
                                {text.length === 0 ? (
                                    "Start typing to estimate"
                                ) : (
                                    <>
                                        <span className="tabular-nums">
                                            ${(text.trim().length * 0.0003).toFixed(4)}
                                        </span>{" "}
                                        estimated
                                    </>
                                )}
                            </span>
                            <span>{text.trim().length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()}</span>
                        </div>
                        <Button
                            size="sm"
                            disabled={!text.trim()}
                            onClick={handleGenerate}
                            className="h-9 rounded-md border border-white/15 bg-white px-4 text-[#171717] shadow-[0_1px_1px_rgba(0,0,0,.2)] hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30"
                        >
                            {text.trim() ? <AudioLines /> : <Sparkles />}
                            Generate speech
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
