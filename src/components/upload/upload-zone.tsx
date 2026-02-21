"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface UploadZoneProps {
    onImageSelect: (file: File) => void;
}

export function UploadZone({ onImageSelect }: UploadZoneProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full h-full min-h-[400px]">
            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group"
                >
                    <div className="p-4 rounded-full bg-rose-500/10 mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">上传产品照片</h2>
                    <p className="text-slate-400 mb-8 max-w-xs text-center px-4">
                        拖拽图片到这里，或点击浏览文件<br />支持 PNG, JPG, WEBP
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
            ) : (
                <div className="relative w-full h-full rounded-3xl overflow-hidden group">
                    <img
                        src={preview}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
                        >
                            <Upload className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={clearImage}
                            className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 backdrop-blur-md transition-all"
                        >
                            <X className="w-6 h-6 text-rose-400" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
