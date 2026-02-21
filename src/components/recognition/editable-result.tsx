"use client";

import React, { useState, useEffect } from "react";
import { ProductMetadata } from "@/types";
import { CheckCircle2, Save, Edit2, Plus, X } from "lucide-react";

interface EditableResultProps {
    initialData: ProductMetadata;
    onConfirm: (data: ProductMetadata) => void;
    isGenerating: boolean;
}

export function EditableResult({ initialData, onConfirm, isGenerating }: EditableResultProps) {
    const [data, setData] = useState<ProductMetadata>(initialData);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [newFeature, setNewFeature] = useState("");
    const [newTone, setNewTone] = useState("");

    useEffect(() => {
        setData(initialData);
        setIsConfirmed(false);
    }, [initialData]);

    const handleConfirm = () => {
        setIsConfirmed(true);
        onConfirm(data);
    };

    const removeItem = (field: 'key_features' | 'tone_keywords', index: number) => {
        setData({
            ...data,
            [field]: data[field].filter((_, i) => i !== index)
        });
    };

    const addItem = (field: 'key_features' | 'tone_keywords', value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setData({
            ...data,
            [field]: [...data[field], value.trim()]
        });
        setter("");
    };

    return (
        <div className="glass rounded-[2rem] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative border border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="text-xl font-bold text-white">
                        {isConfirmed ? "参数已锁定" : "识别结果建议"}
                    </h3>
                </div>
                {!isConfirmed && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                        可手动微调
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">品牌</label>
                            <input
                                disabled={isConfirmed}
                                value={data.brand}
                                onChange={(e) => setData({ ...data, brand: e.target.value })}
                                className="w-full bg-transparent text-lg font-semibold text-white focus:outline-none"
                            />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">型号</label>
                            <input
                                disabled={isConfirmed}
                                value={data.model}
                                onChange={(e) => setData({ ...data, model: e.target.value })}
                                className="w-full bg-transparent text-lg font-semibold text-white focus:outline-none"
                            />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">类目</label>
                            <input
                                disabled={isConfirmed}
                                value={data.product_category}
                                onChange={(e) => setData({ ...data, product_category: e.target.value })}
                                className="w-full bg-transparent text-slate-200 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Dynamic Lists */}
                <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-white/5 space-y-3 border border-white/5">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">核心卖点</label>
                        <div className="flex flex-wrap gap-2">
                            {data.key_features.map((f, i) => (
                                <span key={i} className="group px-3 py-1 bg-rose-500/10 text-rose-400 rounded-lg text-xs font-medium flex items-center gap-2">
                                    {f}
                                    {!isConfirmed && (
                                        <button onClick={() => removeItem('key_features', i)} className="opacity-0 group-hover:opacity-100 hover:text-rose-200 transition-all">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {!isConfirmed && (
                                <div className="flex items-center gap-1">
                                    <input
                                        placeholder="添加卖点..."
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addItem('key_features', newFeature, setNewFeature)}
                                        className="bg-white/5 rounded-lg px-2 py-1 text-xs text-white focus:outline-none w-24 border border-white/5"
                                    />
                                    <button onClick={() => addItem('key_features', newFeature, setNewFeature)} className="p-1 hover:text-rose-400">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 space-y-3 border border-white/5">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">人设调性</label>
                        <div className="flex flex-wrap gap-2">
                            {data.tone_keywords.map((k, i) => (
                                <span key={i} className="group px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-xs border border-white/10 flex items-center gap-2">
                                    {k}
                                    {!isConfirmed && (
                                        <button onClick={() => removeItem('tone_keywords', i)} className="opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {!isConfirmed && (
                                <div className="flex items-center gap-1">
                                    <input
                                        placeholder="添加调性..."
                                        value={newTone}
                                        onChange={(e) => setNewTone(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addItem('tone_keywords', newTone, setNewTone)}
                                        className="bg-white/5 rounded-lg px-2 py-1 text-xs text-white focus:outline-none w-24 border border-white/5"
                                    />
                                    <button onClick={() => addItem('tone_keywords', newTone, setNewTone)} className="p-1 hover:text-slate-300">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">目标受众</label>
                        <textarea
                            disabled={isConfirmed}
                            rows={2}
                            value={data.target_audience}
                            onChange={(e) => setData({ ...data, target_audience: e.target.value })}
                            className="w-full bg-transparent text-slate-300 text-sm leading-relaxed focus:outline-none resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-end gap-4">
                {isConfirmed ? (
                    <button
                        onClick={() => setIsConfirmed(false)}
                        className="flex items-center gap-2 px-6 py-2 text-sm text-slate-400 hover:text-white transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                        重新编辑
                    </button>
                ) : (
                    <button
                        onClick={handleConfirm}
                        className="btn-primary px-10 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        确认信息并继续
                    </button>
                )}
            </div>
        </div>
    );
}
