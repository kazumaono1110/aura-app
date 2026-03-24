"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, supabase, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
