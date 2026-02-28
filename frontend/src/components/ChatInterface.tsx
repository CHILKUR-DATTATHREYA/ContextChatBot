"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Menu, X, Paperclip, Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";
import { useRagBackend } from "@/hooks/useRagBackend";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { UploadZone } from "@/components/UploadZone";
import { MessageBubble } from "@/components/MessageBubble";
import { QuickActions } from "@/components/QuickActions";

export function ChatInterface() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);        // mobile overlay
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // desktop toggle
    const [isChatActive, setIsChatActive] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const { messages, isTyping, sendMessage } = useRagBackend();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        setIsChatActive(true);
        sendMessage(text);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(inputValue);
        }
    };

    return (
        <BackgroundWrapper>
            <div className="flex flex-1 w-full overflow-hidden relative">

                {/* ═══ Mobile Sidebar Overlay ═══ */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSidebarOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            />
                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                                className="fixed top-0 left-0 h-full w-80 cosmic-glass-strong border-r border-white/[0.06] z-50 flex"
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <UploadZone />
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ═══ Desktop Sidebar (collapsible) ═══ */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarCollapsed ? 0 : 320,
                        opacity: isSidebarCollapsed ? 0 : 1,
                    }}
                    transition={{ type: "spring", damping: 28, stiffness: 200 }}
                    className="hidden lg:flex relative flex-shrink-0 h-full cosmic-glass-strong border-r border-white/[0.06] z-30 overflow-hidden"
                >
                    <UploadZone />
                </motion.aside>

                {/* ═══ Main Content Area ═══ */}
                <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">

                    {/* Header Bar — always visible */}
                    <header className="relative top-0 left-0 right-0 h-14 flex items-center px-4 lg:px-6 z-20 bg-black/20 backdrop-blur-xl border-b border-white/[0.04] shrink-0">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all mr-2"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Desktop sidebar toggle */}
                        <button
                            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                            className="hidden lg:flex p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all mr-3"
                            title={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
                        >
                            {isSidebarCollapsed
                                ? <PanelLeft className="w-5 h-5" />
                                : <PanelLeftClose className="w-5 h-5" />
                            }
                        </button>

                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-semibold tracking-wide text-slate-300">
                                Rag<span className="text-violet-400">Bot</span>
                            </span>
                        </div>
                    </header>

                    {/* Flex Layout Container */}
                    <div className={`flex flex-col w-full mx-auto transition-all duration-700 ease-out ${isChatActive ? "flex-1 min-h-0 px-6 lg:px-12" : "h-full justify-center px-4 lg:px-8"}`}>

                        {/* ═══ Landing Hero ═══ */}
                        <AnimatePresence>
                            {!isChatActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95, overflow: "hidden" }}
                                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="flex flex-col items-center justify-center w-full mb-10 shrink-0"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1, duration: 0.6 }}
                                        className="mb-6"
                                    >
                                        <div className="w-16 h-16 rounded-2xl cosmic-glass flex items-center justify-center border border-white/[0.08]">
                                            <Sparkles className="w-8 h-8 text-violet-400" />
                                        </div>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, duration: 0.5 }}
                                        className="text-5xl md:text-7xl font-bold tracking-tight cosmic-title mb-4 text-center"
                                    >
                                        RagBot
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.5 }}
                                        className="text-base md:text-lg text-slate-500 font-normal tracking-wide text-center max-w-md"
                                    >
                                        Your intelligent document companion — upload, ask, understand.
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ═══ Chat Messages Area ═══ */}
                        <AnimatePresence>
                            {isChatActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="flex-1 w-full overflow-hidden flex flex-col pt-4 min-h-0"
                                >
                                    <div className="flex-1 w-full pr-2 overflow-y-auto min-h-0 scroll-smooth">
                                        {messages.map((msg) => (
                                            <MessageBubble key={msg.id} message={msg} />
                                        ))}

                                        {/* Typing Indicator */}
                                        {isTyping && !messages.find(m => m.isStreaming) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex w-full justify-start mb-6"
                                            >
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-8 h-8 rounded-full cosmic-glass border border-white/[0.08] flex items-center justify-center">
                                                        <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                                                    </div>
                                                    <div className="flex gap-1.5 px-4 py-3 cosmic-glass rounded-2xl">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        <div ref={endOfMessagesRef} className="h-4" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ═══ Input Island ═══ */}
                        <motion.div
                            layout
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className={`w-full shrink-0 z-20 relative flex flex-col items-center ${!isChatActive ? "max-w-2xl mx-auto" : "pb-4"}`}
                        >
                            {/* Subtle divider above input when chat is active */}
                            {isChatActive && (
                                <div className="w-full h-px cosmic-divider mb-3" />
                            )}

                            <div className="relative w-full group">
                                {/* Glow layer — pulses when AI is thinking */}
                                <div className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-violet-600/30 via-indigo-500/20 to-violet-600/30 blur-xl transition-opacity duration-700 z-0 ${isTyping ? "opacity-80 input-glow-pulse" : "opacity-0 group-hover:opacity-40"}`} />

                                {/* Input container */}
                                <div className="relative z-10 cosmic-glass-panel rounded-2xl flex flex-col p-1.5 focus-within:shadow-[0_8px_40px_rgba(139,92,246,0.3)] focus-within:border-violet-500/50 transition-all duration-300">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask about your documents..."
                                        className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 border-none outline-none resize-none px-4 pt-3 pb-2 min-h-[52px] max-h-[160px] text-[0.98rem] leading-relaxed font-medium"
                                        rows={1}
                                    />

                                    <div className="flex items-center justify-between px-2 pb-1">
                                        <button
                                            onClick={() => {
                                                // On mobile open overlay, on desktop toggle sidebar
                                                if (window.innerWidth < 1024) {
                                                    setSidebarOpen(true);
                                                } else {
                                                    setSidebarCollapsed(false);
                                                }
                                            }}
                                            className="p-2 text-slate-500 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-all duration-200"
                                            title="Attach documents"
                                        >
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleSend(inputValue)}
                                            disabled={!inputValue.trim() || isTyping}
                                            className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] disabled:from-white/[0.04] disabled:to-white/[0.02] disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions (only on landing) */}
                            <AnimatePresence>
                                {!isChatActive && (
                                    <motion.div
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <QuickActions
                                            onActionClick={handleSend}
                                            onUploadClick={() => {
                                                if (window.innerWidth < 1024) {
                                                    setSidebarOpen(true);
                                                } else {
                                                    setSidebarCollapsed(false);
                                                }
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                    </div>
                </main>
            </div>
        </BackgroundWrapper>
    );
}
