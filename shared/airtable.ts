/**
 * Minimal Airtable REST client (fetch only). Server-side use only: build scripts and Netlify
 * Functions. The token comes from the AIRTABLE_PAT environment variable and must never reach the
 * browser bundle, so nothing under src/ may import this file.
 */
import { DEFAULT_BASE_ID } from "./airtable-schema";

export interface AirtableConfig {
  pat: string;
  baseId: string;
}

export interface AirtableRecord {
  id: string;
  createdTime?: string;
  /** Keyed by field ID (requests always send returnFieldsByFieldId=true). */
  fields: Record<string, any>;
}

export const configFromEnv = (env: Record<string, string | undefined> = process.env): AirtableConfig | null => {
  const pat = env.AIRTABLE_PAT?.trim();
  if (!pat) return null;
  return { pat, baseId: env.AIRTABLE_BASE_ID?.trim() || DEFAULT_BASE_ID };
};

const API = "https://api.airtable.com/v0";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function call(cfg: AirtableConfig, path: string, init: RequestInit = {}, attempt = 0): Promise<any> {
  const res = await fetch(`${API}/${cfg.baseId}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.pat}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (res.status === 429 && attempt < 5) {
    await sleep(1000 * 2 ** attempt); // Airtable allows 5 req/s per base; back off on 429
    return call(cfg, path, init, attempt + 1);
  }
  const text = await res.text();
  if (!res.ok) {
    // Never include the token or request body (may hold customer data) in the error.
    throw new Error(`Airtable ${init.method || "GET"} ${path.split("?")[0]} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : {};
}

/** All records of a table, following pagination. `fields` restricts the response to those field IDs. */
export async function listRecords(
  cfg: AirtableConfig,
  tableId: string,
  opts: { fields?: string[]; filterByFormula?: string } = {},
): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const q = new URLSearchParams({ returnFieldsByFieldId: "true", pageSize: "100" });
    for (const f of opts.fields || []) q.append("fields[]", f);
    if (opts.filterByFormula) q.set("filterByFormula", opts.filterByFormula);
    if (offset) q.set("offset", offset);
    const page = await call(cfg, `${tableId}?${q.toString()}`);
    out.push(...page.records);
    offset = page.offset;
  } while (offset);
  return out;
}

export async function getRecord(cfg: AirtableConfig, tableId: string, recordId: string): Promise<AirtableRecord> {
  return call(cfg, `${tableId}/${recordId}?returnFieldsByFieldId=true`);
}

/** Creates records in batches of 10 (the API maximum). */
export async function createRecords(
  cfg: AirtableConfig,
  tableId: string,
  records: { fields: Record<string, any> }[],
  opts: { typecast?: boolean } = {},
): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  for (let i = 0; i < records.length; i += 10) {
    const res = await call(cfg, tableId, {
      method: "POST",
      body: JSON.stringify({ records: records.slice(i, i + 10), typecast: !!opts.typecast, returnFieldsByFieldId: true }),
    });
    out.push(...res.records);
  }
  return out;
}

export async function updateRecords(
  cfg: AirtableConfig,
  tableId: string,
  records: { id: string; fields: Record<string, any> }[],
  opts: { typecast?: boolean } = {},
): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  for (let i = 0; i < records.length; i += 10) {
    const res = await call(cfg, tableId, {
      method: "PATCH",
      body: JSON.stringify({ records: records.slice(i, i + 10), typecast: !!opts.typecast, returnFieldsByFieldId: true }),
    });
    out.push(...res.records);
  }
  return out;
}

/** Escapes a value for use inside an Airtable filterByFormula string literal. */
export const formulaString = (v: string) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
