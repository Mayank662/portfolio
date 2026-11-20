/**
 * Experience — real projects from Mayank's professional experience.
 * Metrics quoted are the ones stated on his CV. Employer-internal details are
 * kept at the level already public on his profile.
 *
 * Entries with status "example" are illustrative engagements (how a typical
 * freelance project would run). They are labelled as such on the card and must
 * never claim a real client, real metrics or real outcomes.
 */
export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string;
  approach: string[];
  stack: string[];
  status: "concept" | "in-progress" | "shipped" | "example";
  links?: { label: string; href: string }[];
  /** Which abstract diagram to render on the card. */
  diagram: "agent" | "workflow" | "services" | "devtools" | "rag" | "agent-dash" | "service-dash";
};

export const projects: Project[] = [
  {
    slug: "intent-classification-agent",
    index: "01",
    title: "Intent Classification Agent",
    kicker: "UKG · AI Agent · Enterprise HCM",
    summary:
      "A LangGraph agent that routes enterprise queries through multi-step reasoning and tool orchestration, backed by a self-built NER microservice and RAG pipeline — with evals and tracing wired in from day one.",
    problem:
      "Enterprise users ask ambiguous, company-specific questions. Routing them correctly needs entity extraction, retrieval of tenant context and a decision — and you need to prove the agent is getting better, not just different.",
    approach: [
      "Intent-detection and retrieval platform: NER microservice + RAG pipeline feeding agent decisions",
      "Evaluation framework integrated into Kubeflow pipelines to benchmark routing accuracy with custom metrics",
      "End-to-end LLM observability with OpenTelemetry, LangChain and Arize — hierarchical traces, prompts, cost, latency, tool execution",
      "Grafana dashboards for p50/p99 latency, agent accuracy and tool performance",
      "Automated retraining with self-triggering pipelines lifted NER accuracy by over 30%",
      "Flask → async FastAPI migration with reusable observability middleware cut median API latency by over 40%",
    ],
    stack: ["Python", "LangGraph", "LangChain", "FastAPI", "RAG", "Kubeflow Pipelines", "OpenTelemetry", "Arize AI", "Grafana"],
    status: "shipped",
    diagram: "agent",
  },
  {
    slug: "agent-observability-dashboards",
    index: "02",
    title: "Agent Performance & Cost Dashboards",
    kicker: "UKG · LLM Observability · Dashboards",
    summary:
      "Live dashboards that show how an AI agent really behaves — latency percentiles, accuracy, tool performance, token spend and cost per run — so the team can see whether a change made it better, slower or more expensive.",
    problem:
      "LLM agents fail quietly. A prompt tweak adds a second of latency, a tool starts timing out, or a model change doubles the token bill — and without per-step visibility nobody notices until users or finance do.",
    approach: [
      "OpenTelemetry instrumentation on every agent step — prompts, tool calls and retries — exported as hierarchical traces",
      "Grafana dashboards for p50/p99 latency, agent accuracy and tool performance",
      "Token usage and cost per run, broken down by tool and model, to catch expensive regressions early",
      "Trace waterfalls that show exactly where a slow or failed run spent its time",
    ],
    stack: ["Grafana", "Prometheus", "OpenTelemetry", "Arize AI", "LangChain", "Python"],
    status: "shipped",
    diagram: "agent-dash",
  },
  {
    slug: "service-health-dashboards",
    index: "03",
    title: "Service Health Dashboards",
    kicker: "UKG · Platform Observability",
    summary:
      "Real-time views of the services behind the product — memory and garbage collection, network and request traffic, and the number of pods serving it — so problems show up on a graph before they show up in a ticket.",
    problem:
      "Services degrade gradually: memory creeps up between GC cycles, traffic spikes outgrow the pods serving them, and network saturation hides behind 'it's just slow today'. Logs alone don't show the trend.",
    approach: [
      "Memory and garbage-collection panels to spot leaks and GC pressure early",
      "Network in/out and request-traffic panels per service",
      "Pod counts shown side by side with load, so scaling problems are visible at a glance",
      "Prometheus metrics with OpenTelemetry instrumentation, visualised in Grafana",
    ],
    stack: ["Grafana", "Prometheus", "OpenTelemetry"],
    status: "shipped",
    diagram: "service-dash",
  },
  {
    slug: "rca-agent",
    index: "04",
    title: "Root Cause Analysis Agent",
    kicker: "MastersIndia · AI Agent · MCP",
    summary:
      "An agent that takes a Jira defect and works out why it happened — reading the code, recent changes and live data through GitLab and database MCP servers.",
    problem:
      "Triage eats the first hour of every defect: find the service, read the diff, query the data, form a theory. Most of that is mechanical — and all of it is interruptible.",
    approach: [
      "Jira defect in, ranked root-cause hypotheses out — each with the evidence attached",
      "GitLab MCP for code, commits and merge requests; database MCP for inspecting the data the bug touched",
      "Hypothesis → evidence loop with an explicit confidence budget",
      "Human-in-the-loop: the agent explains, engineers decide",
    ],
    stack: ["Python", "LLM tool use", "MCP", "GitLab", "PostgreSQL", "MongoDB"],
    status: "in-progress",
    diagram: "devtools",
  },
  {
    slug: "monolith-to-microservices",
    index: "05",
    title: "Monolith → Microservices Migration",
    kicker: "MastersIndia · Backend · GST Compliance",
    summary:
      "Carving a legacy GST-compliance monolith into services without breaking filings for the enterprises that depend on it.",
    problem:
      "A monolith that grew with the business blocks teams on each other and makes every deploy a risk — but the data model underneath it is the system of record for tax filings, so nothing can go subtly wrong.",
    approach: [
      "Service boundaries drawn around data ownership; shared-nothing at the storage layer",
      "Incremental PostgreSQL schema and data migrations, each reversible and verified against production shapes",
      "New backend services and APIs in Python/Django beside the legacy paths, cut over domain by domain",
      "Boring, well-indexed storage; novelty budget spent on correctness, not plumbing",
    ],
    stack: ["Python", "Django", "PostgreSQL", "MongoDB", "Docker"],
    status: "in-progress",
    diagram: "services",
  },
  {
    slug: "credit-decision-platform",
    index: "06",
    title: "Automated Credit & Loan Decisioning",
    kicker: "Kalolytic · FinTech · Government Initiative",
    summary:
      "An automated credit and loan decision platform built for a Thailand government initiative — Django services in production on Linux and PostgreSQL, with observability built into the request path.",
    problem:
      "Loan decisions need to be fast, auditable and consistent across thousands of applicants. Every decision has to be explainable later, and the service can't quietly degrade.",
    approach: [
      "Decision workflow as explicit, auditable steps with full input/output logging",
      "Django services deployed on Linux with PostgreSQL as the transactional source of truth",
      "Custom observability middleware for logging, tracing and latency monitoring on every request",
      "Delivered with a five-engineer team on a fixed public-sector timeline",
    ],
    stack: ["Python", "Django", "PostgreSQL", "Linux", "Observability"],
    status: "shipped",
    diagram: "workflow",
  },
  {
    slug: "example-ai-support-copilot",
    index: "07",
    title: "AI Support Copilot for a SaaS Help Desk",
    kicker: "AI Agent · Python Backend · RAG",
    summary:
      "How I'd run a typical four-week freelance build: an in-product assistant that answers customers from your docs and account data — a FastAPI backend, retrieval you can measure, and a trace behind every answer.",
    problem:
      "A B2B SaaS team with a few thousand help-centre articles and a support queue full of repeat questions. They want an assistant inside the product that answers from their own docs, looks up the customer's account when it needs to, cites its sources, and hands off to a human when it isn't sure — without adopting another platform to babysit.",
    approach: [
      "Week 1 — Discovery: map the top ticket types, turn a sample of real questions into an evaluation set, and agree target metrics up front (answer accuracy, citation rate, p95 latency)",
      "Week 2 — Data pipeline: FastAPI + Celery ingestion of docs into PostgreSQL with pgvector, hybrid keyword + vector search, and re-indexing whenever the docs change",
      "Week 3 — Agent: a LangGraph flow with retrieval, an account-lookup tool on the existing API, cited answers, and a confidence gate that routes to a human",
      "Week 4 — Production: OpenTelemetry tracing per answer, evals that run on every change, Docker deploy, runbook and a handover session with the team",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "RAG", "PostgreSQL", "pgvector", "Celery", "Redis", "OpenTelemetry", "Docker"],
    status: "example",
    diagram: "rag",
  },
];
