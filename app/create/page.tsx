"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import type { AuraResult, AuraHistoryItem, DateTimeContext } from "@/lib/types";

function drawAuraCard(
  canvas: HTMLCanvasElement,
  colors: { primary: string; secondary: string; tertiary: string },
  emotionLabel: string,
  comment: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);

  const centerX = w / 2;
  const centerY = h * 0.42;
  const radius = w * 0.35;

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, colors.primary + "cc");
  gradient.addColorStop(0.4, colors.secondary + "99");
  gradient.addColorStop(0.7, colors.tertiary + "66");
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  const gradient2 = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.2, 0, centerX, centerY, radius * 0.8);
  gradient2.addColorStop(0, colors.secondary + "88");
  gradient2.addColorStop(1, "transparent");
  ctx.fillStyle = gradient2;
  ctx.fillRect(0, 0, w, h);

  const gradient3 = ctx.createRadialGradient(centerX + radius * 0.4, centerY + radius * 0.3, 0, centerX, centerY, radius * 0.6);
  gradient3.addColorStop(0, colors.tertiary + "66");
  gradient3.addColorStop(1, "transparent");
  ctx.fillStyle = gradient3;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 28px 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(emotionLabel, centerX, h * 0.78);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "12px 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = "center";
  const maxWidth = w * 0.8;
  const words = comment.split("");
  let line = "";
  let lineY = h * 0.83;
  for (const char of words) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, centerX, lineY);
      line = char;
      lineY += 18;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, centerX, lineY);

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = "11px 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText(dateStr, centerX, h * 0.94);

  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.font = "10px 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText("Aura", centerX, h * 0.98);
}

function getDateTimeContext(): DateTimeContext {
  const now = new Date();
  const days = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const month = now.getMonth() + 1;
  const hour = now.getHours();
  const season = month >= 3 && month <= 5 ? "春" : month >= 6 && month <= 8 ? "夏" : month >= 9 && month <= 11 ? "秋" : "冬";
  const timeOfDay = hour < 6 ? "深夜" : hour < 10 ? "朝" : hour < 12 ? "午前" : hour < 15 ? "午後" : hour < 18 ? "夕方" : hour < 22 ? "夜" : "深夜";
  return { dayOfWeek: days[now.getDay()], timeOfDay, season };
}

export default function CreatePage() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuraResult | null>(null);
  const [auraId, setAuraId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { user, supabase } = useAuth();

  // sessionStorageから結果を復元
  useEffect(() => {
    const saved = sessionStorage.getItem("aura_latest_result");
    const savedMood = sessionStorage.getItem("aura_latest_mood");
    const savedId = sessionStorage.getItem("aura_latest_id");
    if (saved) {
      setResult(JSON.parse(saved));
      if (savedMood) setMood(savedMood);
      if (savedId) setAuraId(savedId);
    }
  }, []);

  // 結果が変わったらcanvas描画 + sessionStorage保存
  useEffect(() => {
    if (result && canvasRef.current) {
      drawAuraCard(
        canvasRef.current,
        { primary: result.primary, secondary: result.secondary, tertiary: result.tertiary },
        result.emotion_label,
        result.comment
      );
      sessionStorage.setItem("aura_latest_result", JSON.stringify(result));
      sessionStorage.setItem("aura_latest_mood", mood);
      if (auraId) sessionStorage.setItem("aura_latest_id", auraId);
    }
  }, [result]);

  const getHistory = async (): Promise<AuraHistoryItem[]> => {
    if (user && supabase) {
      const { data } = await supabase
        .from("auras")
        .select("created_at, emotion_label, input, primary_color")
        .order("created_at", { ascending: false })
        .limit(7);
      if (data) {
        return data.map((row) => ({
          date: new Date(row.created_at).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
          emotion_label: row.emotion_label,
          input: row.input,
          primary_color: row.primary_color,
        }));
      }
    }
    const saved = JSON.parse(localStorage.getItem("aura_history") || "[]");
    return saved.slice(0, 7).map((e: { date: string; emotion_label: string; input: string; primary: string }) => ({
      date: new Date(e.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
      emotion_label: e.emotion_label,
      input: e.input,
      primary_color: e.primary,
    }));
  };

  const handleGenerate = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const history = await getHistory();
      const datetime = getDateTimeContext();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: mood.trim(), history, datetime }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }

      const data: AuraResult = await res.json();
      const now = new Date().toISOString();

      // Supabaseに保存（ログイン時）
      let savedId: string | null = null;
      if (user && supabase) {
        const { data: inserted } = await supabase.from("auras").insert({
          user_id: user.id,
          input: mood.trim(),
          primary_color: data.primary,
          secondary_color: data.secondary,
          tertiary_color: data.tertiary,
          emotion_label: data.emotion_label,
          comment: data.comment,
          lucky_action: data.lucky_action,
          compatible_color: data.compatible_color,
          compatible_hex: data.compatible_hex,
          compatible_message: data.compatible_message,
          personality_mode: data.personality_mode,
          personality_detail: data.personality_detail,
          advice: data.advice,
          trend: data.trend,
          weather_temp: null,
          weather_condition: null,
        }).select("id").single();
        savedId = inserted?.id ?? null;
      }
      setAuraId(savedId);

      // ローカルストレージにも保存
      const saved = JSON.parse(localStorage.getItem("aura_history") || "[]");
      const entry = {
        ...data,
        input: mood.trim(),
        date: now,
        id: crypto.randomUUID(),
      };
      saved.unshift(entry);
      localStorage.setItem("aura_history", JSON.stringify(saved.slice(0, 100)));
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const [showShareMenu, setShowShareMenu] = useState(false);

  const getShareUrl = () =>
    auraId ? `https://aura-app-ecru.vercel.app/share/${auraId}` : "https://aura-app-ecru.vercel.app";

  const getShareText = () =>
    `今日のオーラは「${result?.emotion_label}」でした ✨ 相性の良い色は${result?.compatible_color}`;

  const getCanvasBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      if (!canvasRef.current) return resolve(null);
      canvasRef.current.toBlob((blob) => resolve(blob), "image/png");
    });

  const downloadImage = async () => {
    const blob = await getCanvasBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aura-card.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareToLine = () => {
    const text = encodeURIComponent(getShareText() + "\n\n" + getShareUrl());
    window.open(`https://line.me/R/share?text=${text}`, "_blank");
    setShowShareMenu(false);
  };

  const shareToX = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setShowShareMenu(false);
  };

  const shareToInstagram = async () => {
    const blob = await getCanvasBlob();
    if (!blob) return;

    // スマホ: Web Share APIでInstagramを含む共有メニューを表示
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], "aura-card.png", { type: "image/png" });
      const shareData = { files: [file] };
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData).catch(() => {});
        setShowShareMenu(false);
        return;
      }
    }

    // PC/非対応: 画像をダウンロード
    await downloadImage();
    alert("画像を保存しました。Instagramアプリを開いてストーリーに投稿してください。");
    setShowShareMenu(false);
  };

  const handleReset = () => {
    setMood("");
    setResult(null);
    setAuraId(null);
    setError("");
    setShowShareMenu(false);
    sessionStorage.removeItem("aura_latest_result");
    sessionStorage.removeItem("aura_latest_mood");
    sessionStorage.removeItem("aura_latest_id");
  };

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-10">
      <div className="w-full max-w-md mb-8 relative z-50">
        <Link href="/" className="inline-block text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer py-2 pr-4">
          ← 戻る
        </Link>
      </div>

      {!result ? (
        <div className="flex flex-col items-center flex-1 justify-center w-full max-w-md -mt-20">
          <h2 className="text-2xl font-bold mb-2">今日の気分は？</h2>
          <p className="text-sm text-white/40 mb-8">一言で教えてください</p>

          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="例：なんか疲れた、ちょっとワクワクしてる"
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-center text-lg focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            disabled={loading}
            autoFocus
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !mood.trim()}
            className="mt-6 w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                オーラを読み取り中...
              </span>
            ) : (
              "オーラを見る"
            )}
          </button>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md">
          <p className="text-sm text-white/40 mb-4">今日のあなたのオーラ</p>

          {/* Aura Card */}
          <canvas
            ref={canvasRef}
            width={400}
            height={520}
            className="rounded-3xl shadow-2xl mb-6 w-full max-w-[280px]"
          />

          {/* Color palette */}
          <div className="flex gap-3 mb-8">
            {[result.primary, result.secondary, result.tertiary].map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-white/30">{color}</span>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="w-full space-y-3 mb-8">
            {/* Personality Mode - Hero card */}
            <div
              className="relative rounded-3xl p-6 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${result.primary}20, ${result.secondary}15, ${result.tertiary}10)`,
              }}
            >
              <div className="absolute inset-0 backdrop-blur-xl" />
              <div className="relative z-10">
                <p className="text-[11px] font-medium tracking-widest uppercase text-white/30 mb-3">Today&apos;s Mode</p>
                <p className="text-2xl font-bold tracking-tight">{result.personality_mode}</p>
                <p className="text-sm text-white/60 mt-3 leading-relaxed">{result.personality_detail}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-2">Trend</p>
                  <p className="text-sm text-white/50 leading-relaxed">{result.trend}</p>
                </div>
              </div>
            </div>

            {/* Two column grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Lucky Action */}
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${result.primary}12, transparent)`,
                  border: `1px solid ${result.primary}20`,
                }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ background: `${result.primary}20` }}>
                  <span className="text-sm">🍀</span>
                </div>
                <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-2">Lucky Action</p>
                <p className="text-[13px] leading-snug text-white/80">{result.lucky_action}</p>
              </div>

              {/* Advice */}
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${result.tertiary}12, transparent)`,
                  border: `1px solid ${result.tertiary}20`,
                }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ background: `${result.tertiary}20` }}>
                  <span className="text-sm">✨</span>
                </div>
                <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-2">Message</p>
                <p className="text-[13px] leading-snug text-white/80">{result.advice}</p>
              </div>
            </div>

            {/* Compatible Color - Special card */}
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${result.secondary}10, ${result.primary}08)`,
                border: `1px solid ${result.secondary}15`,
              }}
            >
              <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-4">Soul Match</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                {/* Your aura */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-full shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${result.primary}, ${result.secondary})`,
                      boxShadow: `0 4px 20px ${result.primary}30`,
                    }}
                  />
                  <span className="text-[11px] text-white/40">あなた</span>
                </div>

                {/* Connection line */}
                <div className="flex items-center gap-1 px-2">
                  <div className="w-6 h-[1px]" style={{ background: `linear-gradient(to right, ${result.primary}60, transparent)` }} />
                  <span className="text-white/20 text-xs">×</span>
                  <div className="w-6 h-[1px]" style={{ background: `linear-gradient(to left, ${result.secondary}60, transparent)` }} />
                </div>

                {/* Match aura */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-full shadow-lg"
                    style={{
                      background: `radial-gradient(circle, ${result.compatible_hex}, ${result.compatible_hex}88)`,
                      boxShadow: `0 4px 20px ${result.compatible_hex}40`,
                    }}
                  />
                  <span className="text-[11px] text-white/40">{result.compatible_color}</span>
                </div>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed text-center">{result.compatible_message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="w-full py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
            >
              シェアする
            </button>

            {showShareMenu && (
              <div className="flex gap-3 w-full animate-slide-up">
                {/* LINE */}
                <button
                  onClick={shareToLine}
                  className="flex-1 py-3 rounded-full bg-[#06C755] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  LINE
                </button>

                {/* Instagram */}
                <button
                  onClick={shareToInstagram}
                  className="flex-1 py-3 rounded-full text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Story
                </button>

                {/* X */}
                <button
                  onClick={shareToX}
                  className="flex-1 py-3 rounded-full bg-black border border-white/20 text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </button>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              もう一度
            </button>
          </div>

          {/* Gallery link */}
          <Link
            href="/gallery"
            className="mt-4 w-full py-3 rounded-full bg-white/5 border border-white/10 text-white/50 font-medium text-center text-sm hover:bg-white/10 transition-colors"
          >
            ギャラリーを見る
          </Link>

          {/* Login prompt */}
          {!user && (
            <Link
              href="/auth"
              className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors text-center"
            >
              ログインするとオーラの記録が保存されます
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
