import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey || !lat || !lon) {
    return NextResponse.json(null);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${apiKey}`
    );

    if (!res.ok) {
      return NextResponse.json(null);
    }

    const data = await res.json();

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      condition: data.weather?.[0]?.description || data.weather?.[0]?.main || "",
    });
  } catch {
    return NextResponse.json(null);
  }
}
