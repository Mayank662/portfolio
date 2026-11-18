import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #09090d 0%, #111118 60%, #1a1326 100%)",
          color: "#f5f3fa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#92909f" }}>
          <span>MAYANK GOEL</span>
          <span>AI ENGINEER / BACKEND ENGINEER</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1, letterSpacing: -3 }}>I build intelligent</div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 600, lineHeight: 1, letterSpacing: -3 }}>
            things for the <span style={{ color: "#c4b5fd", marginLeft: 22 }}>real world.</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#92909f" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#a855f7" }} />
          {site.availability.toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
