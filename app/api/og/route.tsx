import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const primary = searchParams.get("primary") || "#6B5CE7";
  const secondary = searchParams.get("secondary") || "#E056A0";
  const tertiary = searchParams.get("tertiary") || "#F5A623";
  const emotionLabel = searchParams.get("emotion_label") || "オーラ";
  const comment = searchParams.get("comment") || "";
  const personalityMode = searchParams.get("personality_mode") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Aura glow - primary */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${primary}cc, ${secondary}88 50%, ${tertiary}44 75%, transparent)`,
          }}
        />
        {/* Secondary glow */}
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "45%",
            transform: "translateX(-50%)",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${secondary}88, transparent)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            marginTop: "120px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "16px",
            }}
          >
            {emotionLabel}
          </div>
          {comment && (
            <div
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.5)",
                maxWidth: "800px",
                textAlign: "center",
                lineHeight: "1.5",
              }}
            >
              {comment.length > 60 ? comment.slice(0, 60) + "..." : comment}
            </div>
          )}
          {personalityMode && (
            <div
              style={{
                fontSize: "20px",
                color: "rgba(255,255,255,0.3)",
                marginTop: "16px",
              }}
            >
              {personalityMode}
            </div>
          )}
        </div>

        {/* Color palette */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {[primary, secondary, tertiary].map((color, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 20px ${color}60`,
                }}
              />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
                {color}
              </span>
            </div>
          ))}
        </div>

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "50px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Aura
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
