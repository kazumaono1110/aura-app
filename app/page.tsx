"use client";

import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6">
      {/* Background glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 mb-8 shadow-lg shadow-purple-500/20" />

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Aura
        </h1>
        <p className="text-lg text-white/60 mb-2">
          今日のあなたの色は、何色ですか。
        </p>
        <p className="text-sm text-white/40 mb-10 max-w-xs">
          気分を一言入力するだけで、あなただけのオーラカードを生成します。
        </p>

        {/* CTA */}
        <Link
          href="/create"
          className="w-full max-w-xs py-4 px-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 text-center"
        >
          オーラを見る
        </Link>

        {/* Sub links */}
        <div className="flex gap-6 mt-6 text-sm text-white/40">
          <Link href="/gallery" className="hover:text-white/70 transition-colors">
            ギャラリー
          </Link>
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
