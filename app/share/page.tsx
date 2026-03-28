import { Metadata } from "next";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const primary = params.primary || "#6B5CE7";
  const secondary = params.secondary || "#E056A0";
  const tertiary = params.tertiary || "#F5A623";
  const emotionLabel = params.emotion_label || "オーラ";
  const comment = params.comment || "";
  const personalityMode = params.personality_mode || "";

  const ogParams = new URLSearchParams({
    primary,
    secondary,
    tertiary,
    emotion_label: emotionLabel,
    comment,
    personality_mode: personalityMode,
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aura-app-ecru.vercel.app";

  return {
    title: `${emotionLabel} - Aura`,
    description: comment || "気分を一言入力するだけで、あなただけのオーラカードを生成します。",
    openGraph: {
      title: `今日のオーラは「${emotionLabel}」`,
      description: comment || "あなたのオーラは何色？",
      images: [`${baseUrl}/api/og?${ogParams.toString()}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `今日のオーラは「${emotionLabel}」`,
      description: comment || "あなたのオーラは何色？",
      images: [`${baseUrl}/api/og?${ogParams.toString()}`],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const primary = params.primary || "#6B5CE7";
  const secondary = params.secondary || "#E056A0";
  const tertiary = params.tertiary || "#F5A623";
  const emotionLabel = params.emotion_label || "オーラ";
  const comment = params.comment || "";
  const input = params.input || "";

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-10">
      <div className="w-full max-w-md">
        {input && (
          <p className="text-sm text-white/40 text-center mb-6">
            「{input}」
          </p>
        )}

        {/* Aura Orb */}
        <div className="flex justify-center mb-6">
          <div
            className="w-48 h-48 rounded-full"
            style={{
              background: `radial-gradient(circle at 45% 40%, ${primary}cc, ${secondary}88 50%, ${tertiary}44 80%, #0a0a0a)`,
              boxShadow: `0 0 80px ${primary}30, 0 0 160px ${secondary}15`,
            }}
          />
        </div>

        {/* Emotion Label */}
        <h1 className="text-3xl font-bold text-center mb-2">
          {emotionLabel}
        </h1>
        <p className="text-sm text-white/50 text-center mb-8">
          {comment}
        </p>

        {/* Color palette */}
        <div className="flex justify-center gap-4 mb-8">
          {[primary, secondary, tertiary].map((color, i) => (
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
