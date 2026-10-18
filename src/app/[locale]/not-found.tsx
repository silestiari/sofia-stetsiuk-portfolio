import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="p-4">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <Link href="/">{t("backHome")}</Link>
    </section>
  );
}
