#!/usr/bin/env node
/**
 * Negativkontroll: inga kronbelopp utan källhänvisning.
 *
 * Bakgrund: sidorna innehöll avgifts- och kostnadstabeller med påhittade
 * belopp – ibland med en falsk källa satt under ("Källa: Boverkets
 * taxa-vägledning"). Bygglovsavgiften sätts av varje kommuns taxa och kan
 * inte anges som ett rikspris. Den här kontrollen ser till att de inte
 * kryper tillbaka.
 *
 * Regel: en rad som innehåller ett kronbelopp måste också innehålla en
 * källhänvisning – en länk (http/markdown) eller en paragrafhänvisning (§).
 *
 * Kör: node scripts/kontrollera-belopp.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const GRANSKADE = ["content/guider", "content/atgarder"].flatMap((dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => join(dir, f))
);

// "4 000 kr", "50 000 kronor", "1 100 kr/kvm", "60 öre/kWh"
// Negative lookahead på bokstav i stället för \b: JS \b är ASCII-baserad och
// skulle annars läsa "kr" i "krävs" som en valutaenhet.
const BELOPP = /\d[\d\s\u00a0]*(kr|kronor|öre)(?!\p{L})/iu;
const KALLA = /(https?:\/\/|\]\(|§)/;

let brott = 0;
for (const fil of GRANSKADE) {
  const rader = readFileSync(fil, "utf-8").split("\n");
  rader.forEach((rad, i) => {
    if (BELOPP.test(rad) && !KALLA.test(rad)) {
      console.error(`✗ ${fil}:${i + 1}\n  ${rad.trim()}`);
      brott++;
    }
  });
}

if (brott > 0) {
  console.error(`\n${brott} kronbelopp utan källhänvisning.`);
  process.exit(1);
}
console.log(`✓ ${GRANSKADE.length} filer: inga kronbelopp utan källhänvisning.`);
