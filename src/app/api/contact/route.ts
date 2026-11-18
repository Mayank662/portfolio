import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PROJECT_TYPES = ["Backend Engineering", "AI / LLM Application", "Architecture & Consulting", "Something else"] as const;

type Payload = {
  name: string;
  email: string;
  type: (typeof PROJECT_TYPES)[number];
  message: string;
  website?: string; // honeypot
};

/* Tiny in-memory limiter: 5 requests / 10 min per IP (per server instance). */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

function clean(s: unknown, max: number) {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured: tell the client to fall back to mailto.
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  let body: Partial<Payload>;
  try {
    body = (await req.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  if (body.website) {
    // Honeypot filled — pretend success.
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);
  const type = PROJECT_TYPES.includes(body.type as Payload["type"]) ? (body.type as Payload["type"]) : "Something else";

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 422 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "mayankgoyal662@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  const html = `
    <div style="font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111">
      <p><strong>New inquiry from the portfolio</strong></p>
      <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
         <strong>Email:</strong> ${escapeHtml(email)}<br/>
         <strong>Project type:</strong> ${escapeHtml(type)}</p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Portfolio] ${type} — ${name}`,
      html,
      text: `New inquiry\n\nName: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error", res.status, detail);
    return NextResponse.json({ ok: false, reason: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
