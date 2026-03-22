import { readFileSync, existsSync } from "fs";
import path from "path";

export type ShippingTariffRow = {
  city: string;
  fee: number;
};

const TARIF_FILENAME = "Tarif";

/**
 * Parses lines: `City Name 12` → city = "City Name", fee = 12 (last token numeric).
 * Empty lines and # comments are skipped.
 */
export function parseTariffFileContent(content: string): ShippingTariffRow[] {
  const out: ShippingTariffRow[] = [];
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split(/\s+/);
    const last = parts.pop();
    if (!last) continue;
    const fee = Number(last);
    if (!Number.isFinite(fee) || fee < 0) continue;
    const city = parts.join(" ").trim();
    if (!city) continue;
    out.push({ city, fee });
  }
  return out;
}

function tarifPath(): string {
  return path.join(process.cwd(), TARIF_FILENAME);
}

export function loadShippingTariffsFromDisk(): ShippingTariffRow[] {
  const p = tarifPath();
  if (!existsSync(p)) {
    console.warn(`[shipping] Missing ${TARIF_FILENAME} at project root`);
    return [];
  }
  const raw = readFileSync(p, "utf8");
  return parseTariffFileContent(raw);
}

export function getFeeForCity(
  tariffs: ShippingTariffRow[],
  city: string,
): number | null {
  const key = city.trim().replace(/\s+/g, " ");
  if (!key) return null;
  const row = tariffs.find((t) => t.city === key);
  return row ? row.fee : null;
}
