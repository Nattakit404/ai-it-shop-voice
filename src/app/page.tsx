"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";

interface ISpeechRecognition extends EventTarget {
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

type ApiResult = {
  transcript?: string;
  answer?: string;
  error?: string;
};

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Tap to Start");
  const [result, setResult] = useState<ApiResult>({});

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition() as ISpeechRecognition;
    rec.lang = "th-TH";
    rec.onstart = () => { setIsListening(true); setStatus("Listening"); };
    rec.onend = () => { setIsListening(false); setStatus("Tap to Start"); };
    rec.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setResult({ transcript });
      setStatus("Processing");
      const resp = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await resp.json();
      setResult(data);
    };
    recognitionRef.current = rec;
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8F9] text-slate-950 font-sans flex flex-col items-center justify-center p-8 relative">
      
      {/* 🌸 Subtle Ambient Light - ช่วยให้ไม่โล่งแบบมีมิติ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-rose-100/40 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Minimal Header */}
        <header className="mb-20 text-center space-y-2">
          <h1 className="text-xs font-black tracking-[0.8em] uppercase text-rose-300">
            IT SHOP VOICE
          </h1>
          <div className="h-[1px] w-4 bg-rose-200 mx-auto" />
        </header>

        {/* The Hub - Microphone */}
        <div className="relative mb-24">
          {isListening && (
            <div className="absolute inset-0 bg-rose-200 rounded-full blur-2xl animate-pulse opacity-50" />
          )}
          
          <button 
            onClick={() => isListening ? recognitionRef.current?.stop() : (setResult({}), recognitionRef.current?.start())}
            className={`relative w-32 h-32 rounded-full transition-all duration-700 ease-in-out flex items-center justify-center ${
              isListening 
              ? "bg-rose-500 shadow-[0_0_50px_-10px_rgba(244,63,94,0.5)] scale-110" 
              : "bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.1)]"
            }`}
          >
            <Mic 
              size={32} 
              className={`transition-colors duration-500 ${isListening ? "text-white" : "text-rose-400"}`} 
              strokeWidth={1.5} 
            />
          </button>
          
          <p className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 ${
            isListening ? "text-rose-500 tracking-[0.6em]" : "text-slate-300"
          }`}>
            {status}
          </p>
        </div>

        {/* Content Flow - เรียบแต่เด่นด้วยสีข้อความ */}
        <div className="w-full space-y-12 transition-all duration-1000">
          
          {/* User Input Section */}
          <div className="text-center group">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-200 group-hover:text-rose-400 transition-colors">You Said</span>
            <p className="mt-3 text-lg font-medium text-slate-400 leading-relaxed italic px-4">
              {result.transcript ? `"${result.transcript}"` : "—"}
            </p>
          </div>

          {/* System Response Section */}
          <div className={`text-center transition-all duration-1000 ${result.answer ? "opacity-100 translate-y-0" : "opacity-20 translate-y-4"}`}>
            <div className="w-8 h-[2px] bg-rose-100 mx-auto mb-6" />
            <p className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {result.answer || "Listening for your voice..."}
            </p>
          </div>

        </div>

        {/* Footer Credit */}
        <footer className="fixed bottom-12 opacity-20 hover:opacity-100 transition-opacity">
          <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-slate-900">
            Teekit Kianlee
          </p>
        </footer>

      </div>
    </main>
  );
}