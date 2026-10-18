import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tMeta = await getTranslations("meta");

  return (
    <section className="p-4">
      {/* Nested not-found.tsx can't export metadata; React 19 hoists <title> into <head>. */}
      <title>{`${t("title")} — ${tMeta("siteName")}`}</title>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <Link href="/">{t("backHome")}</Link>
    </section>
  );
}
