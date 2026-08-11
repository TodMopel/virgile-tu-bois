// Vite always emits the entry <script> as type="module" crossorigin in <head>,
// even with an IIFE rollup output — WebKit under file:// (iOS Safari, opened
// from the Files app) fails to execute an inline module script, causing a
// blank page. The bundle has no import.meta / top-level await, so it's safe
// as a classic script — but classic scripts in <head> run immediately
// (modules are implicitly deferred), before <div id="root"> exists, so the
// tag also has to move to the end of <body>.
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../dist/index.html", import.meta.url);
const html = readFileSync(path, "utf8");

const scriptMatch = html.match(/<script type="module" crossorigin>[\s\S]*?<\/script>\n?/);
if (!scriptMatch) {
  throw new Error("strip-module-script: no module script tag found in dist/index.html");
}

const classicScript = scriptMatch[0].replace('<script type="module" crossorigin>', "<script>");
// Replacer functions, not strings: the bundle is 1.6MB of minified JS and can
// contain "$&"/"$`"/"$'" by chance, which String.replace treats as special
// patterns (whole match / text before / text after) when given a string.
const withoutScript = html.replace(scriptMatch[0], () => "");
const patched = withoutScript.replace("</body>", () => `  ${classicScript}</body>`);

writeFileSync(path, patched);
