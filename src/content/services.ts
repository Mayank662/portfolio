export type Service = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  items: string[];
  tools: string[];
};

export const services: Service[] = [
  {
    id: "backend",
    index: "01",
    title: "Backend Engineering",
    blurb:
      "Systems that stay fast and correct when the data gets big and the edge cases get weird.",
    items: [
      "Scalable backend development",
      "REST API design & development",
      "Microservices & monolith migrations",
      "Database design & schema migrations",
      "Async processing & performance tuning",
      "Observability: tracing, metrics, dashboards",
    ],
    tools: ["Python", "FastAPI", "Django", "Flask", "PostgreSQL", "MongoDB", "Redis", "Celery", "Docker"],
  },
  {
    id: "ai",
    index: "02",
    title: "AI Engineering & Automation",
    blurb:
      "LLM-powered products that do real work — agents, tool use, retrieval and workflows with evals and guardrails.",
    items: [
      "AI agents & multi-step workflows",
      "RAG pipelines, embeddings & vector search",
      "LLM integrations & prompt engineering",
      "MCP & tool integrations",
      "Agent evaluation frameworks",
      "LLM observability (traces, cost, latency)",
    ],
    tools: ["LangGraph", "LangChain", "RAG", "MCP", "OpenTelemetry", "Arize AI", "Kubeflow Pipelines"],
  },
  {
    id: "consulting",
    index: "03",
    title: "Architecture & Technical Consulting",
    blurb:
      "A second brain for your hardest technical calls — before they turn into expensive rewrites.",
    items: [
      "Backend & service architecture",
      "System design reviews",
      "Cloud-native deployment planning",
      "Workflow orchestration",
      "Technical problem-solving & debugging",
    ],
    tools: ["GCP", "AWS", "Terraform", "Docker", "Grafana", "System Design"],
  },
];
