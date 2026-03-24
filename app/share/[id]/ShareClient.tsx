"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AuraResult } from "@/lib/types";

interface ShareAura extends AuraResult {
  id: string;
  input: string;
  created_at: string;
}

export default function ShareClient({ id }: { id: string }) {
  const [aura, setAura] = useState<ShareAura | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/aura/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setAura(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!aura) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-4">
        <p className="text-white/40 mb-4">このオーラは見つかりませんでした</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
        >
          Aura を始める
        </Link>
      </div>
    );
  }

  const date = new Date(aura.created_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-10">
      <div className="w-full max-w-md">
        {/* Date */}
        <p className="text-sm text-white/30 text-center mb-2">{date}</p>
        <p className="text-sm text-white/40 text-center mb-6">
          「{aura.input}」
        </p>

        {/* Aura Orb */}
        <div className="flex justify-center mb-6">
          <div
            className="w-48 h-48 rounded-full"
            style={{
              background: `radial-gradient(circle at 45% 40%, ${aura.primary}cc, ${aura.secondary}88 50%, ${aura.tertiary}44 80%, #0a0a0a)`,
              boxShadow: `0 0 80px ${aura.primary}30, 0 0 160px ${aura.secondary}15`,
            }}
          />
        </div>

        {/* Emotion Label */}
        <h1 className="text-3xl font-bold text-center mb-2">
          {aura.emotion_label}
        </h1>
        <p className="text-sm text-white/50 text-center mb-8">
          {aura.comment}
        </p>

        {/* Color palette */}
        <div className="flex justify-center gap-4 mb-8">
          {[aura.primary, aura.secondary, aura.tertiary].map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-white/25">{color}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/create"
          className="block w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg text-center shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
        >
          あなたのオーラを見る
        </Link>

        <p className="mt-4 text-xs text-white/20 text-center">
          Aura — 今日のあなたの色は、何色ですか。
        </p>
      </div>
    </div>
  );
}
