"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UploadZone } from "@/components/upload/upload-zone";
import { Sparkles, Loader2, CheckCircle2, ChevronRight, ImageIcon } from "lucide-react";
import { recognizeProduct } from "@/app/actions/recognize";
import { generateCopywriting, CopywritingData } from "@/app/actions/copywriting";
import { generateCoverImage } from "@/app/actions/image-gen";
import { ProductMetadata } from "@/types";
import { CopywritingPreview } from "@/components/copywriting/preview";
import { ImagePreview } from "@/components/image-gen/preview";
import { EditableResult } from "@/components/recognition/editable-result";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [recognitionResult, setRecognitionResult] = useState<ProductMetadata | null>(null);
  const [confirmedResult, setConfirmedResult] = useState<ProductMetadata | null>(null);
  const [copyResult, setCopyResult] = useState<CopywritingData | null>(null);
  const [imageResult, setImageResult] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleRecognize = async () => {
    if (!selectedFile) return;
    setIsRecognizing(true);
    setRecognitionResult(null);
    setConfirmedResult(null);
    setCopyResult(null);
    setImageResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const metadata = await recognizeProduct(base64);
        setRecognitionResult(metadata);
        setIsRecognizing(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      alert(err.message);
      setIsRecognizing(false);
    }
  };

  const handleGenerateCopy = async () => {
    if (!confirmedResult) return;
    setIsGeneratingCopy(true);
    try {
      const data = await generateCopywriting(confirmedResult);
      setCopyResult(data);
      setIsGeneratingCopy(false);
    } catch (err: any) {
      alert(err.message);
      setIsGeneratingCopy(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!confirmedResult) return;
    setIsGeneratingImage(true);
    try {
      const url = await generateCoverImage(confirmedResult);
      setImageResult(url);
      setIsGeneratingImage(false);
    } catch (err: any) {
      alert(err.message);
      setIsGeneratingImage(false);
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-10 pb-32">
      {/* Header */}
      <header className="flex justify-between items-center bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="inline-block overflow-hidden rounded-2xl shadow-2xl">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover" />
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
            小红书发布专家
          </h1>
        </div>
        <button onClick={() => signOut(auth)} className="text-xs font-bold uppercase tracking-wider bg-white/5 px-4 py-2 rounded-xl text-slate-400 transition-colors hover:text-white hover:bg-white/10">退出登录</button>
      </header>

      <div className="space-y-10">
        {/* Module 2: Image Upload & Recognition */}
        <section className="glass rounded-[2.5rem] p-6 md:p-10">
          <div className="h-[300px] md:h-[400px]">
            <UploadZone onImageSelect={setSelectedFile} />
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white mb-1 tracking-wide uppercase">① 准备素材</p>
              <p className="text-xs text-slate-500">上传产品原图，由 AI 深度解析核心卖点</p>
            </div>
            <button
              onClick={handleRecognize}
              disabled={!selectedFile || isRecognizing}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 min-w-[180px] py-4 disabled:opacity-50"
            >
              {isRecognizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isRecognizing ? "解析中..." : "开始智能识别"}
            </button>
          </div>
        </section>

        {/* Editable Recognition Results */}
        {recognitionResult && !confirmedResult && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <EditableResult
              initialData={recognitionResult}
              onConfirm={(updatedData) => setConfirmedResult(updatedData)}
              isGenerating={isGeneratingCopy || isGeneratingImage}
            />
          </section>
        )}

        {/* Action Row - Visible only after confirmation */}
        {confirmedResult && (
          <section className="flex flex-col sm:flex-row gap-6 p-8 glass rounded-[2.5rem] animate-in fade-in fill-mode-both duration-500">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-black text-white mb-1 uppercase tracking-widest">② 确认参数</p>
              <p className="text-xs text-slate-500">点击下方按钮全自动产出爆款图文</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy}
                className="bg-rose-500 text-white px-10 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-500/30 active:scale-95 disabled:opacity-50"
              >
                {isGeneratingCopy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                生成智能文案
              </button>
              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-95 disabled:opacity-50"
              >
                {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                生成高清配图
              </button>
            </div>
          </section>
        )}

        {/* Results Section - Vertical Stack */}
        <div className="space-y-10">
          {/* Module 4: Image Preview (Shows first if exists as it's the "Cover") */}
          {imageResult && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ImagePreview imageUrl={imageResult} />
            </div>
          )}

          {/* Module 3: Copywriting Preview */}
          {copyResult && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <CopywritingPreview data={copyResult} />
            </div>
          )}
        </div>

        {/* Trends & Persona - Moved to main flow for vertical scrolling */}
        {confirmedResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
            <div className="glass rounded-[2rem] p-8">
              <h3 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest text-slate-400">
                当前生成人设
              </h3>
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-sm">时尚达人 OOTD</p>
                  <p className="text-[10px] text-slate-500 font-medium">精致 / 种草 / 亲和力</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8">
              <h3 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest text-slate-400">
                实时爆款趋势
              </h3>
              <div className="flex flex-wrap gap-2">
                {['#好物推荐', '#OOTD', '#精致生活', '#博主日常'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
