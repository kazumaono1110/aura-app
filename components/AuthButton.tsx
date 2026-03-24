"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function AuthButton() {
  const { user, supabase, loading } = useAuth();

  if (loading || !supabase) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-white/40 truncate max-w-[140px]">
          {user.email}
        </span>
        <button
          onClick={() => supabase?.auth.signOut()}
          className="text-white/40 hover:text-white/70 transition-colors"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      className="text-sm text-white/40 hover:text-white/70 transition-colors"
    >
      ログイン
    </Link>
  );
}
