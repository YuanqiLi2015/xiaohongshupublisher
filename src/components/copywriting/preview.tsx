"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, MessageSquare, Sparkles, Layout, Type } from "lucide-react";

interface CopywritingData {
    title: string;
    body: string;
}

interface CopywritingPreviewProps {
    data: CopywritingData;
}

export function CopywritingPreview({ data: initialData }: CopywritingPreviewProps) {
    const [data, setData] = useState(initialData);
    const [copiedTitle, setCopiedTitle] = useState(false);
    const [copiedBody, setCopiedBody] = useState(false);
    const [isiOS, setIsiOS] = useState(false);

    useEffect(() => {
        setData(initialData);
        const isiOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsiOS(isiOSDevice);
    }, [initialData]);

    const handleCopyTitle = () => {
        navigator.clipboard.writeText(data.title);
        setCopiedTitle(true);
        setTimeout(() => setCopiedTitle(false), 2000);
    };

    const handleCopyBody = () => {
        navigator.clipboard.writeText(data.body);
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
    };

    return (
        <div className="glass rounded-[2rem] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative border border-white/5 space-y-6 lg:col-span-2 xl:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">爆款文案生成</h3>
            </div>

            {/* Title Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Type className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">爆款标题</span>
                    </div>
                    <button
                        onClick={handleCopyTitle}
                        className="flex items-center gap-2 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                    >
                        {copiedTitle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedTitle ? "已复制" : "复制标题"}
                    </button>
                </div>
                <input
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500/30 transition-all font-sans"
                />
            </div>

            {/* Body Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Layout className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">笔记正文</span>
                    </div>
                    <button
                        onClick={handleCopyBody}
                        className="flex items-center gap-2 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                    >
                        {copiedBody ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedBody ? "已复制" : "复制正文"}
                    </button>
                </div>
                <textarea
                    value={data.body}
                    onChange={(e) => setData({ ...data, body: e.target.value })}
                    rows={10}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-4 text-slate-300 leading-relaxed text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/30 transition-all font-sans resize-none"
                />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                <div className="flex items-center gap-2 text-rose-400">
                    <Sparkles className="w-4 h-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">已注入引流关键词</p>
                </div>
                {isiOS ? (
                    <button
                        onClick={() => {
                            // Open XHS App via URL scheme
                            window.location.href = "xhsdiscover://";
                            // Fallback to web if app not installed
                            setTimeout(() => {
                                window.open("https://www.xiaohongshu.com", "_blank");
                            }, 1500);
                        }}
                        className="btn-primary py-2 px-6 text-sm cursor-pointer"
                    >
                        前往小红书发布
                    </button>
                ) : (
                    <a
                        href="https://creator.xiaohongshu.com/publish/publish"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-2 px-6 text-sm no-underline inline-flex items-center justify-center cursor-pointer"
                    >
                        前往小红书发布
                    </a>
                )}
            </div>
        </div>
    );
}
