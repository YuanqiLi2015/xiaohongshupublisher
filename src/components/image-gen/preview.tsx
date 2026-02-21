"use client";

import React from "react";
import { Download, Image as ImageIcon, Sparkles } from "lucide-react";

interface ImagePreviewProps {
    imageUrl: string;
}

export function ImagePreview({ imageUrl }: ImagePreviewProps) {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "xhs-cover.png";
        link.click();
    };

    return (
        <div className="glass rounded-[2rem] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">爆款封面生成</h3>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-all text-slate-300"
                >
                    <Download className="w-4 h-4" />
                    下载图片
                </button>
            </div>

            <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                    src={imageUrl}
                    alt="Generated cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-rose-400 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                <Sparkles className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">已生成 3:4 比例高清封面</p>
            </div>
        </div>
    );
}
