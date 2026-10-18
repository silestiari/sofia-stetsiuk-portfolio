import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import type { ProjectMedia } from "@/content/types";

/** One screenshot (next/image) or clip (<video>, nothing downloads before play). Natural aspect ratio, never cropped. */
export function MediaItem({
  item,
  locale,
  sizes,
  className = "",
  preload = false,
}: {
  item: ProjectMedia;
  locale: Locale;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  const alt = item.alt[locale];
  const cls = `block h-auto max-w-full ${className}`;

  if (item.type === "video") {
    return (
      <video
        controls
        muted
        playsInline
        preload="none"
        poster={item.poster}
        width={item.width}
        height={item.height}
        aria-label={alt}
        className={cls}
      >
        <source src={item.src} type="video/mp4" />
      </video>
    );
  }
  return (
    <Image
      src={item.src}
      alt={alt}
      width={item.width ?? 1600}
      height={item.height ?? 900}
      sizes={sizes}
      preload={preload}
      loading={preload ? "eager" : undefined}
      className={cls}
    />
  );
}

/** Items for this locale: untagged ones plus those tagged with it. */
export const mediaIn = (media: ProjectMedia[], locale: Locale) => media.filter((m) => !m.locale || m.locale === locale);

/** Card preview: prefer a landscape screenshot, then any media. */
export const previewOf = (media: ProjectMedia[], locale: Locale) => {
  const own = mediaIn(media, locale);
  return own.find((m) => m.type === "image" && (m.width ?? 0) >= (m.height ?? 0)) ?? own[0];
};
