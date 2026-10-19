import { existsSync } from "node:fs";
import { join } from "node:path";

const PHOTO = "/media/about/photo.webp";
// Checked at build time, so a missing photo never turns into a 404: the "SS" monogram stands in.
const photo = existsSync(join(process.cwd(), "public", PHOTO)) ? PHOTO : null;

/** Round portrait with a white ring and a bg-coloured gap (docs/REDESIGN_UX_SPEC.md 3.11). Server-only. */
export function Avatar({ alt, className = "" }: { alt: string; className?: string }) {
  return (
    <span className={`block shrink-0 rounded-full border-2 border-text bg-bg p-1 ${className}`}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- pre-sized 800×800 webp, shown at ≤ 144px
        <img src={photo} alt={alt} width={800} height={800} loading="lazy" decoding="async" className="aspect-square size-full rounded-full object-cover" />
      ) : (
        <span role="img" aria-label={alt} className="grid aspect-square size-full place-items-center rounded-full bg-surface-2 font-display text-h2 font-extrabold">
          <span aria-hidden="true">SS</span>
        </span>
      )}
    </span>
  );
}
