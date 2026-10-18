import type { Locale } from "@/i18n/routing";

/** A value provided for every supported locale. */
export type Localized<T = string> = Record<Locale, T>;

export type ProjectCategory = "web" | "roblox";

/** "unconfirmed" = status not verified by sources; never guess. */
export type ProjectStatus = "released" | "in-development" | "prototype" | "unconfirmed";

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface ProjectMedia {
  type: "image" | "video";
  /** Path under /public, e.g. /projects/<slug>/cover.webp */
  src: string;
  alt: Localized;
  width?: number;
  height?: number;
  poster?: string;
}

export interface ProjectLink {
  kind: "live" | "repo" | "roblox" | "video" | "other";
  href: string;
  label: Localized;
}

export interface ProjectMetric {
  value: string;
  label: Localized;
  /** Source/caveat, e.g. "Lighthouse lab data" */
  note?: Localized;
}

export interface Project {
  slug: string;
  /** Short label for compact tables (Skills matrix headers) */
  short: string;
  /** Secondary title, e.g. working title */
  subtitle?: Localized;
  /** Context disclaimer shown near the title */
  note?: Localized;
  /** QA/engineering numbers taken from project docs only */
  metrics: ProjectMetric[];
  category: ProjectCategory;
  status: ProjectStatus;
  title: Localized;
  summary: Localized;
  role: Localized;
  caseStudy: Localized<CaseStudySection[]>;
  tech: string[];
  features: Localized<string[]>;
  challenges: Localized<string[]>;
  media: ProjectMedia[];
  links: ProjectLink[];
}

export interface Model3D {
  id: string;
  projectSlug: Project["slug"];
  /** Optimized .glb path under /public */
  file: string;
  /** Static image shown before/instead of the 3D canvas */
  poster: string;
  title: Localized;
  description: Localized;
  /** Triangle count of the exported .glb */
  triangles: number;
  /** .glb file size */
  sizeKB: number;
  /** Original asset the copy was exported from (relative to the workspace) */
  source: string;
  /** Animation clip names available in the .glb */
  animations: string[];
}
