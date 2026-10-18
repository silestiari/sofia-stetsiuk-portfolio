// Fails if en.json and ru.json differ in key structure or contain empty strings.
// Warns (does not fail) when a ru value is a copy of en: Latin-only, longer than 12 chars.
// Same warning for `en: "...", ru: "..."` pairs in src/content/*.ts.
import { readdirSync, readFileSync } from "node:fs";

// Proper names, tools and products that legitimately stay in Latin in ru.
const allowlist = [
  /Sofia Stetsiuk/,
  /^Grand Mall Batumi$/,
  /^Petforge Arena$/,
  /^Cabin Chaos$/,
  /^PILLARS/,
  /^AI Workflow Lab$/,
  /^Next\.js/,
  /^Claude Code$/,
  /^Roblox Studio$/,
  /^> inspect /,
  /^\{[a-z]+\}: \{[a-z]+\}$/,
];

const load = (l) => JSON.parse(readFileSync(new URL(`../src/messages/${l}.json`, import.meta.url), "utf8"));
const paths = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? paths(v, `${p}${k}.`) : [`${p}${k}`]));
const get = (o, k) => k.split(".").reduce((a, s) => a[s], o);
const looksUntranslated = (enV, ruV) =>
  ruV === enV && ruV.replace(/\{\w+\}/g, "").trim().length > 12 && !/[а-яё]/i.test(ruV) && /[a-z]/i.test(ruV) && !allowlist.some((re) => re.test(ruV));

const en = load("en");
const ru = load("ru");
const [e, r] = [new Set(paths(en)), new Set(paths(ru))];
const empty = (o, l) => paths(o).filter((k) => !String(get(o, k)).trim()).map((k) => `${l}: ${k}`);
const errors = [
  ...[...e].filter((k) => !r.has(k)).map((k) => `missing in ru: ${k}`),
  ...[...r].filter((k) => !e.has(k)).map((k) => `missing in en: ${k}`),
  ...empty(en, "en"),
  ...empty(ru, "ru"),
];

const warnings = [...e]
  .filter((k) => r.has(k) && looksUntranslated(String(get(en, k)), String(get(ru, k))))
  .map((k) => `messages ${k}: "${get(ru, k)}"`);

const contentDir = new URL("../src/content/", import.meta.url);
for (const f of readdirSync(contentDir).filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(new URL(f, contentDir), "utf8");
  for (const [, enV, ruV] of src.matchAll(/en:\s*"((?:[^"\\]|\\.)*)",\s*ru:\s*"((?:[^"\\]|\\.)*)"/g)) {
    if (looksUntranslated(enV, ruV)) warnings.push(`content/${f}: "${ruV}"`);
  }
}

if (warnings.length) console.warn(`warning: possibly untranslated ru values:\n  ${warnings.join("\n  ")}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`i18n OK: ${e.size} keys in en and ru`);
