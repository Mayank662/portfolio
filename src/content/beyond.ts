/**
 * Beyond the Terminal — imagery is served from Unsplash with explicit
 * attribution. Swap `src` for your own photos in /public/beyond when ready.
 */
export type Interest = {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  credit: { name: string; href: string };
  /** Grid placement hints for the editorial layout. */
  span: "tall" | "wide" | "square";
};

export const interests: Interest[] = [
  {
    id: "swimming",
    title: "Swimming",
    caption: "Finding my rhythm in the water.",
    src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80",
    alt: "A swimmer mid-stroke in a dark pool, light scattering across the water",
    credit: { name: "Unsplash", href: "https://unsplash.com/s/photos/swimming" },
    span: "tall",
  },
  {
    id: "music",
    title: "Music & Jamming",
    caption: "Sometimes the best ideas come with music.",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80",
    alt: "Hands on a guitar neck under warm studio light",
    credit: { name: "Unsplash", href: "https://unsplash.com/s/photos/jamming" },
    span: "wide",
  },
  {
    id: "cricket",
    title: "Cricket",
    caption: "A little competition never hurts.",
    src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1600&q=80",
    alt: "A cricket ground under dramatic evening light",
    credit: { name: "Unsplash", href: "https://unsplash.com/s/photos/cricket" },
    span: "square",
  },
];
