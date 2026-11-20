export const site = {
  name: "Mayank Goel",
  title: "AI & Backend Engineer",
  tagline: "I build intelligent things for the real world.",
  description:
    "Mayank Goel — AI & backend engineer with 4+ years building scalable backend systems and GenAI applications (Python, FastAPI, Django, LangGraph, RAG). Open to select freelance projects.",
  // Resolved in next.config.ts (explicit env → Vercel production domain → localhost).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "mayankgoyal662@gmail.com",
  phone: { display: "+91-9149121554", href: "tel:+919149121554", e164: "+919149121554" },
  whatsapp: `https://wa.me/919149121554?text=${encodeURIComponent(
    "Hi Mayank, I saw your portfolio and have a project in mind.",
  )}`,
  github: "https://github.com/mayank662",
  linkedin: "https://www.linkedin.com/in/mayank-goel-724932174/",
  location: "India · Remote-friendly",
  availability: "Open to select freelance projects",
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "What I Do", href: "#services" },
  { label: "Experience", href: "#work" },
  { label: "Playground", href: "#playground" },
  { label: "Beyond Code", href: "#beyond" },
  { label: "Contact", href: "#contact" },
] as const;

export const stack = [
  "LangGraph",
  "AI Agents",
  "RAG",
  "MCP",
  "Python",
  "FastAPI",
  "Django",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "RabbitMQ",
  "Celery",
  "Docker",
  "Nginx",
  "OpenTelemetry",
  "Kubeflow Pipelines",
  "GCP",
  "AWS",
] as const;
