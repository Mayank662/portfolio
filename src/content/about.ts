/**
 * About copy, timeline, education and recognition. Sourced from Mayank's CV.
 */
export const aboutIntro = [
  "I'm Mayank — an AI and backend engineer with 4+ years of building systems that have to work under real load: HRTech platforms, FinTech decision engines, B2B marketplaces, and now GST compliance at enterprise scale.",
  "My work sits where applied AI meets backend engineering. One week that's a LangGraph agent with proper tracing, evals and an observability dashboard so you can tell whether it actually got better; the next it's a PostgreSQL schema migration for a monolith being split into services.",
  "I care about the unglamorous parts — observability, latency budgets, retraining pipelines that trigger themselves — because that's what makes an AI feature survive contact with production. Outside work I prototype constantly; some of it lands in the Playground below.",
];

export const principles = [
  { k: "Correctness first", v: "Fast is nice. Right is required." },
  { k: "Boring infrastructure", v: "Novelty budget goes to the product, not the plumbing." },
  { k: "Observable by default", v: "If you can't trace it, you can't fix it." },
  { k: "AI with guardrails", v: "Models decide; schemas, evals and humans verify." },
];

export type Milestone = {
  period: string;
  title: string;
  org: string;
  note: string;
  current?: boolean;
};

export const timeline: Milestone[] = [
  {
    period: "Jun 2026 — Present",
    title: "AI & Backend Engineer",
    org: "MastersIndia · Noida",
    note: "Building an AI root-cause-analysis agent that reads Jira defects and uses GitLab and database MCPs to inspect code, changes and data. Alongside it, migrating a legacy monolith to microservices (Python, Django, PostgreSQL migrations).",
    current: true,
  },
  {
    period: "Jun 2024 — May 2026",
    title: "GenAI & Backend Engineer",
    org: "UKG · Noida",
    note: "Built an Intent Classification agent (Python, LangGraph) with a self-developed NER microservice and RAG pipeline; added end-to-end LLM observability with OpenTelemetry, LangChain and Arize; migrated a Flask service to async FastAPI, cutting median latency by over 40%.",
  },
  {
    period: "Oct 2023 — Jun 2024",
    title: "Backend Engineer, Django",
    org: "Kalolytic (FinTech) · Noida",
    note: "Automated credit and loan decision platform for a Thailand government initiative, with a team of five. Django on Linux with PostgreSQL in production, plus custom observability middleware for logging, tracing and latency.",
  },
  {
    period: "Mar 2022 — Jul 2023",
    title: "Software Engineer",
    org: "TradeIndia (B2B marketplace) · Noida",
    note: "Django REST APIs for a scalable B2B platform, asynchronous email notification services with Celery and Redis, and Dockerised microservices.",
  },
];

export const education = {
  degree: "B.Tech, Information Technology",
  school: "IMS Engineering College, Ghaziabad (AKTU)",
  period: "2017 — 2021",
};

export const recognition = [
  "Awarded in an internal innovation challenge for resolving a high-impact AI agent system issue",
  "Employee of the Month, twice, at TradeIndia",
  "Global rank 665 in TCS CodeVita Round 2",
];

/** Full skills inventory, grouped (used by the About section and terminal). */
export const skills = {
  "Languages & Backend": ["Python", "FastAPI", "Django", "Flask", "REST APIs", "Celery", "Async / Concurrency"],
  "AI Systems": ["LLMs", "AI Agents", "LangGraph", "LangChain", "RAG", "Embeddings", "Vector Search", "MCP", "Prompt Engineering", "Model Evaluation", "Kubeflow Pipelines"],
  "Data, Messaging & Infra": ["PostgreSQL", "MongoDB", "Redis", "Vector DBs", "Kafka", "RabbitMQ", "Docker", "Nginx", "GCP", "AWS", "Terraform", "CI/CD"],
  "Observability": ["OpenTelemetry", "Grafana", "Arize AI", "BigQuery", "Distributed Tracing", "Structured Logging"],
} as const;
