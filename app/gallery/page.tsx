"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import AuthButton from "@/components/AuthButton";
import type { AuraEntry } from "@/lib/types";

function MiniAuraOrb({ primary, secondary, tertiary }: { primary: string; secondary: string; tertiary: string }) {
  return (
    <div
      className="w-full aspect-square rounded-2xl relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 45% 40%, ${primary}cc, ${secondary}88 50%, ${tertiary}44 80%, #0a0a0a)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${secondary}66, transparent 60%)`,
        }}
      />
    </div>
  );
}

export default function GalleryPage() {
  const [entries, setEntries] = useState<AuraEntry[]>([]);
  const [selected, setSelected] = useState<AuraEntry | null>(null);
  const { user, supabase, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (user && supabase) {
      supabase
        .from("auras")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)
        .then(({ data }) => {
          if (data) {
            setEntries(
              data.map((row) => ({
                id: row.id,
                input: row.input,
                primary: row.primary_color,
                secondary: row.secondary_color,
                tertiary: row.tertiary_color,
                emotion_label: row.emotion_label,
                comment: row.comment,
                lucky_action: row.lucky_action,
                compatible_color: row.compatible_color,
                compatible_hex: row.compatible_hex,
                compatible_message: row.compatible_message,
                personality_mode: row.personality_mode,
                personality_detail: row.personality_detail ?? "",
                advice: row.advice,
                trend: row.trend,
                date: row.created_at,
              }))
            );
          }
        });
    } else {
      const saved = JSON.parse(localStorage.getItem("aura_history") || "[]");
      setEntries(saved);
    }
  }, [user, supabase, authLoading]);

  const handleDelete = async (entry: AuraEntry) => {
    if (!confirm("このオーラを削除しますか？")) return;

    if (user && supabase) {
      await supabase.from("auras").delete().eq("id", entry.id);
    }

    // localStorageからも削除
    const saved = JSON.parse(localStorage.getItem("aura_history") || "[]");
    const filtered = saved.filter((e: AuraEntry) => e.id !== entry.id);
    localStorage.setItem("aura_history", JSON.stringify(filtered));

    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    setSelected(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatDay = (dateStr: string) => {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  return (
    <div className="flex flex-col items-center min-h-dvh px-6 py-12">
      {/* Header */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          &larr; 戻る
        </Link>
        <h1 className="text-lg font-bold">Gallery</h1>
        <AuthButton />
      </div>

      {!user && entries.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <Link
            href="/auth"
            className="block w-full text-center text-xs text-white/30 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            ログインするとオーラの記録が全デバイスで同期されます
          </Link>
        </div>
      )}

      {entries.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center flex-1 -mt-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6">
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-white/40 text-sm mb-2">まだオーラカードがありません</p>
          <p className="text-white/25 text-xs mb-8">最初の1枚を作ってみましょう</p>
          <Link
            href="/create"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            オーラを見る
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-md">
          {/* Stats */}
          <div className="flex items-center justify-between mb-6 px-2">
            <p className="text-sm text-white/30">{entries.length}枚のオーラ</p>
            <Link
              href="/create"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              + 今日のオーラ
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-3">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelected(entry)}
                className="flex flex-col text-left hover:opacity-80 transition-opacity"
              >
                <MiniAuraOrb
                  primary={entry.primary}
                  secondary={entry.secondary}
                  tertiary={entry.tertiary}
                />
                <div className="mt-2 px-1">
                  <p className="text-[11px] font-medium truncate">{entry.emotion_label}</p>
                  <p className="text-[10px] text-white/40 truncate mt-0.5">「{entry.input}」</p>
                  <p className="text-[10px] text-white/20 mt-0.5">
                    {formatDate(entry.date)}（{formatDay(entry.date)}）
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Modal */}
          {selected && (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <div
                className="w-full max-w-md max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-[#111] px-6 pt-6 pb-10 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle */}
                <div className="flex justify-center mb-6">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Date & Input */}
                <div className="text-center mb-6">
                  <p className="text-sm text-white/30">
                    {new Date(selected.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
                  </p>
                  <p className="text-white/50 text-sm mt-1">「{selected.input}」</p>
                </div>

                {/* Aura Orb */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-40 h-40 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 45% 40%, ${selected.primary}cc, ${selected.secondary}88 50%, ${selected.tertiary}44 80%, #0a0a0a)`,
                      boxShadow: `0 0 60px ${selected.primary}30, 0 0 120px ${selected.secondary}15`,
                    }}
                  />
                </div>

                {/* Emotion Label */}
                <div className="text-center mb-2">
                  <p className="text-2xl font-bold">{selected.emotion_label}</p>
                </div>
                <p className="text-sm text-white/50 text-center mb-6">{selected.comment}</p>

                {/* Color palette */}
                <div className="flex justify-center gap-3 mb-8">
                  {[selected.primary, selected.secondary, selected.tertiary].map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full shadow-lg" style={{ backgroundColor: color }} />
                      <span className="text-[9px] text-white/25">{color}</span>
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="space-y-3">
                  {/* Personality Mode */}
                  <div
                    className="relative rounded-3xl p-5 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${selected.primary}20, ${selected.secondary}15, ${selected.tertiary}10)`,
                    }}
                  >
                    <div className="absolute inset-0 backdrop-blur-xl" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-medium tracking-widest uppercase text-white/30 mb-2">Today&apos;s Mode</p>
                      <p className="text-xl font-bold tracking-tight">{selected.personality_mode}</p>
                      <p className="text-xs text-white/50 mt-2 leading-relaxed">{selected.trend}</p>
                    </div>
                  </div>

                  {/* Two column */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="rounded-2xl p-4 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, ${selected.primary}12, transparent)`,
                        border: `1px solid ${selected.primary}20`,
                      }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2" style={{ background: `${selected.primary}20` }}>
                        <span className="text-xs">🍀</span>
                      </div>
                      <p className="text-[9px] font-medium tracking-widest uppercase text-white/25 mb-1">Lucky Action</p>
                      <p className="text-[12px] leading-snug text-white/80">{selected.lucky_action}</p>
                    </div>

                    <div
                      className="rounded-2xl p-4 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, ${selected.tertiary}12, transparent)`,
                        border: `1px solid ${selected.tertiary}20`,
                      }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2" style={{ background: `${selected.tertiary}20` }}>
                        <span className="text-xs">✨</span>
                      </div>
                      <p className="text-[9px] font-medium tracking-widest uppercase text-white/25 mb-1">Message</p>
                      <p className="text-[12px] leading-snug text-white/80">{selected.advice}</p>
                    </div>
                  </div>

                  {/* Soul Match */}
                  <div
                    className="rounded-3xl p-5 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${selected.secondary}10, ${selected.primary}08)`,
                      border: `1px solid ${selected.secondary}15`,
                    }}
                  >
                    <p className="text-[10px] font-medium tracking-widest uppercase text-white/25 mb-4">Soul Match</p>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-12 h-12 rounded-full shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${selected.primary}, ${selected.secondary})`,
                            boxShadow: `0 4px 16px ${selected.primary}30`,
                          }}
                        />
                        <span className="text-[10px] text-white/30">あなた</span>
                      </div>
                      <div className="flex items-center gap-1 px-1">
                        <div className="w-5 h-[1px]" style={{ background: `linear-gradient(to right, ${selected.primary}60, transparent)` }} />
                        <span className="text-white/15 text-[10px]">×</span>
                        <div className="w-5 h-[1px]" style={{ background: `linear-gradient(to left, ${selected.compatible_hex || selected.secondary}60, transparent)` }} />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-12 h-12 rounded-full shadow-lg"
                          style={{
                            background: `radial-gradient(circle, ${selected.compatible_hex || selected.secondary}, ${selected.compatible_hex || selected.secondary}88)`,
                            boxShadow: `0 4px 16px ${selected.compatible_hex || selected.secondary}40`,
                          }}
                        />
                        <span className="text-[10px] text-white/30">{selected.compatible_color}</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-white/50 leading-relaxed text-center">{selected.compatible_message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-3 rounded-full bg-white/10 text-white/60 text-sm font-medium hover:bg-white/15 transition-colors"
                  >
                    閉じる
                  </button>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="py-3 px-5 rounded-full bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
