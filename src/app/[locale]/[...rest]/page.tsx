import { notFound } from "next/navigation";

// Unknown paths under a valid locale render the localized [locale]/not-found.tsx inside the layout.
export default function CatchAll() {
  notFound();
}
