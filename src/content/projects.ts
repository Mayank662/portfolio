/**
 * Selected Work — real projects from Mayank's professional experience.
 * Metrics quoted are the ones stated on his CV. Employer-internal details are
 * kept at the level already public on his profile.
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
  status: "concept" | "in-progress" | "shipped";
  links?: { label: string; href: string }[];
  /** Which abstract diagram to render on the card. */
  diagram: "agent" | "workflow" | "services" | "devtools";
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
    slug: "rca-agent",
    index: "02",
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
    index: "03",
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
    index: "04",
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
];
