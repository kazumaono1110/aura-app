import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import ShareClient from "./ShareClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerClient();

  if (!supabase) {
    return { title: "Aura" };
  }

  const { data } = await supabase
    .from("auras")
    .select("emotion_label, comment, primary_color, secondary_color, tertiary_color, personality_mode")
    .eq("id", id)
    .single();

  if (!data) {
    return { title: "Aura" };
  }

  const ogParams = new URLSearchParams({
    primary: data.primary_color,
    secondary: data.secondary_color,
    tertiary: data.tertiary_color,
    emotion_label: data.emotion_label,
    comment: data.comment,
    personality_mode: data.personality_mode,
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aura-app-ecru.vercel.app";

  return {
    title: `${data.emotion_label} - Aura`,
    description: data.comment,
    openGraph: {
      title: `今日のオーラは「${data.emotion_label}」`,
      description: data.comment,
      images: [`${baseUrl}/api/og?${ogParams.toString()}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `今日のオーラは「${data.emotion_label}」`,
      description: data.comment,
      images: [`${baseUrl}/api/og?${ogParams.toString()}`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  return <ShareClient id={id} />;
}
