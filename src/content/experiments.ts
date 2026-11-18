/**
 * The Playground — experiments, prototypes and explorations.
 * Add a new entry here and it appears as a tile. `size` controls the grid span.
 */
export type Experiment = {
  id: string;
  title: string;
  note: string;
  tag: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  /** Built-in live demo rendered inside the tile. */
  demo?: "lattice" | "tokens" | "orbit" | "noise";
};

export const experiments: Experiment[] = [
  {
    id: "lattice",
    title: "Reactive Lattice",
    note: "A grid of nodes that bend toward your pointer. Pure canvas, no deps.",
    tag: "Canvas",
    size: "lg",
    demo: "lattice",
  },
  {
    id: "tokens",
    title: "Token Stream",
    note: "Click to stream. What an LLM response feels like at the transport layer — chunk by chunk.",
    tag: "LLM",
    size: "md",
    demo: "tokens",
  },
  {
    id: "orbit",
    title: "Orbit Scheduler",
    note: "A job queue as orbiting bodies — click to enqueue. Retries pull closer to the core.",
    tag: "Systems",
    size: "md",
    demo: "orbit",
  },
  {
    id: "noise",
    title: "Signal / Noise",
    note: "Layered noise field — hover to ripple it. The hero backdrop before it moved to WebGL.",
    tag: "Shader",
    size: "sm",
    demo: "noise",
  },
  {
    id: "terminal",
    title: "Hidden Terminal",
    note: "Press the ` key anywhere on this page. Try `help`.",
    tag: "Easter egg",
    size: "sm",
  },
];
