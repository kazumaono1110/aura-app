import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "DB not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("auras")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    input: data.input,
    primary: data.primary_color,
    secondary: data.secondary_color,
    tertiary: data.tertiary_color,
    emotion_label: data.emotion_label,
    comment: data.comment,
    personality_mode: data.personality_mode,
    compatible_color: data.compatible_color,
    created_at: data.created_at,
  });
}
