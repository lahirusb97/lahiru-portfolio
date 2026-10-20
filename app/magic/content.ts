// Each station is a rune the camera stops at. `t` is the position (0..1) along the camera path.
export type Station = {
  id: string;
  t: number;
  glyph: number;
  kicker: string;
  title: string;
  body: string;
  tags?: string[];
  side: "left" | "right" | "center";
  links?: { label: string; href: string }[];
};

export const stations: Station[] = [
  {
    id: "hero",
    t: 0.04,
    glyph: 0,
    kicker: "Hi, I am Lahiru Shiran",
    title: "Software Engineer",
    body: "Scroll to walk the path. Every rune you wake is a system I built.",
    side: "center",
  },
  {
    id: "about",
    t: 0.2,
    glyph: 1,
    kicker: "The Wanderer",
    title: "Who I Am",
    body: "Full-stack engineer building scalable, high-performance products for healthcare, retail and operations, from multi-branch ERPs to daily-use SaaS.",
    tags: ["Node.js", "Next.js", ".NET ASP", "Django", "Golang"],
    side: "left",
  },
  {
    id: "visionplus",
    t: 0.38,
    glyph: 2,
    kicker: "Rune I · Best Work",
    title: "Vision Plus ERP",
    body: "Multi-branch eye care practice platform: order processing cut 60%, inventory errors down 95%, 100% order visibility with factory tracking and financial reporting.",
    tags: ["Django", "React", "MySQL", "Hostinger KVM"],
    side: "right",
  },
  {
    id: "pos",
    t: 0.56,
    glyph: 3,
    kicker: "Rune II",
    title: "POS SaaS App",
    body: "A point-of-sale system for retail with real-time inventory, reporting and seamless payment processing.",
    tags: ["Electron.js", "Node.js", "MySQL / PostgreSQL"],
    side: "left",
  },
  {
    id: "eyecare",
    t: 0.74,
    glyph: 4,
    kicker: "Rune III",
    title: "Eye Care Practice SaaS",
    body: "Multi-tenant SaaS for clinic chains: org isolation, branch-level access, triple-layer prescription validation, 6-stage factory tracking and public patient booking.",
    tags: [".NET ASP", "React", "PostgreSQL", "Digital Ocean"],
    side: "right",
  },
  {
    id: "contact",
    t: 0.93,
    glyph: 5,
    kicker: "The Last Gate",
    title: "Speak the Word",
    body: "Have something to build? Send a message through the gate.",
    side: "center",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/lahirushiran/" },
      { label: "GitHub", href: "https://github.com/lahirusb97" },
      { label: "Classic site", href: "/classic" },
    ],
  },
];
