// Fails if en.json and ru.json differ in key structure or contain empty strings.
import { readFileSync } from "node:fs";

const load = (l) => JSON.parse(readFileSync(new URL(`../src/messages/${l}.json`, import.meta.url), "utf8"));
const paths = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? paths(v, `${p}${k}.`) : [`${p}${k}`]));
const empty = (o, l) => paths(o).filter((k) => !String(k.split(".").reduce((a, s) => a[s], o)).trim()).map((k) => `${l}: ${k}`);

const en = load("en");
const ru = load("ru");
const [e, r] = [new Set(paths(en)), new Set(paths(ru))];
const errors = [
  ...[...e].filter((k) => !r.has(k)).map((k) => `missing in ru: ${k}`),
  ...[...r].filter((k) => !e.has(k)).map((k) => `missing in en: ${k}`),
  ...empty(en, "en"),
  ...empty(ru, "ru"),
];

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`i18n OK: ${e.size} keys in en and ru`);
