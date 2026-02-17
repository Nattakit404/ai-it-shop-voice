"use client";

import { useEffect, useRef, useState } from "react";

type ApiResult = {
  transcript?: string;
  answer?: string;
  error?: string;
};

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("🎤 กดเพื่ออู้");
  const [result, setResult] = useState<ApiResult>({});
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "th-TH";

    rec.onstart = () => {
      setIsListening(true);
      setStatus("🎧 เปิ้ลกะลังฟัง...");
    };

    rec.onend = () => {
      setIsListening(false);
      setStatus("🎤 กดเพื่ออู้");
    };

    rec.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setResult({ transcript });
      setStatus("💭 กะลังกึด...");

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
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 flex items-center justify-center p-6 relative overflow-hidden text-zinc-700 font-sans">

      {/* Background Glow */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300 rounded-full blur-[140px] opacity-30" />
      <div className="absolute -bottom-24 -right-20 w-[28rem] h-[28rem] bg-rose-300 rounded-full blur-[160px] opacity-30" />

      <div className="w-full max-w-xl relative z-10">

        <div className="bg-white/80 backdrop-blur-2xl border border-pink-100 rounded-[40px] p-10 shadow-[0_30px_80px_-15px_rgba(244,114,182,0.35)]">

          {/* Header */}
          <header className="flex justify-between items-center mb-14">
            <div>
              <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-pink-500">
                💗 IT Shop Voice Q&A
              </h1>
              <div className="h-[2px] w-10 bg-gradient-to-r from-pink-400 to-rose-400 mt-2 rounded-full" />
            </div>

            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isListening
                      ? "bg-pink-500 animate-bounce"
                      : "bg-pink-200"
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </header>

          {/* Voice Button */}
          <section className="flex flex-col items-center mb-14">
            <button
              onClick={() =>
                isListening
                  ? recognitionRef.current?.stop()
                  : (setResult({}), recognitionRef.current?.start())
              }
              className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                isListening
                  ? "bg-gradient-to-br from-pink-500 to-rose-500 scale-105 shadow-pink-400/40"
                  : "bg-white border border-pink-200 hover:scale-105 hover:shadow-pink-200/50"
              }`}
            >
              <span className="text-4xl">
                {isListening ? "💖" : "🎀"}
              </span>

              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-pink-200 animate-ping opacity-40" />
              )}
            </button>

            <p className="mt-6 text-xs font-semibold tracking-[0.2em] uppercase text-pink-500">
              {status}
            </p>
          </section>

          {/* Results */}
          <div className="space-y-8">

            {/* Transcript */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-md">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-pink-400 mb-3">
                📝 ข้อความตี่ได้ยิน
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600">
                {result.transcript || "🌸 ยังบ่าได้ยินอะหยังเลยจ้าว..."}
              </p>
            </div>

            {/* Answer */}
            <div
              className={`rounded-3xl p-6 transition-all duration-500 ${
                result.answer
                  ? "bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 shadow-lg"
                  : "bg-white border border-dashed border-pink-200"
              }`}
            >
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-pink-500 mb-3">
                💬 คำตอบ
              </h2>
              <p
                className={`text-base leading-relaxed ${
                  result.answer
                    ? "text-zinc-800 font-medium"
                    : "text-zinc-400"
                }`}
              >
                {result.answer || "💭 กะลังกึดคำตอบหื้อจ้าว..."}
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-[10px] tracking-[0.4em] font-semibold text-pink-400 uppercase">
          ✨ อ้ายธีร์กิต เคียนลี ✨
        </p>

      </div>
    </main>
  );
}
