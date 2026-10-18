#!/usr/bin/env node
// Query Persona Atlas (https://atlas.withpersona.com), the public database of age assurance and child online
// safety laws and digital ID coverage. Live JSON endpoints, no auth. Node 20+, no deps.
//
//   node scripts/atlas.mjs laws [filters]            legislation, one block per law
//       --country FR        ISO code, country name or alias (GB, UK, United Kingdom; DE, Germany; US; EU)
//       --region CA         US state or subnational region, code or name (CA, California; use with --country US)
//       --status active     active | proposed | in_progress | blocked
//       --topic social_media           e.g. social_media, explicit_adult_content, ai_chatbots, app_stores_and_operating_systems
//       --policy age_assurance         e.g. age_assurance, data_protection, consumer_protection
//       --party app_stores             responsible party, e.g. social_media, adult_content_sites, online_services
//       --q "parental consent"         words that must all appear in name/summary/penalties
//       --national | --subnational     only laws without / with a region
//       --brief                        one line per law
//   node scripts/atlas.mjs law <name words>          the best-matching law in full, then other matches
//   node scripts/atlas.mjs countries [--q text]      jurisdictions with law counts and tags
//   node scripts/atlas.mjs states                    US states: has law, status, target ages
//   node scripts/atlas.mjs digital-ids [--country FR] [--q text] [--eudi]   digital ID schemes per country
//   node scripts/atlas.mjs facets                    every value of status / policy / topic / party, with counts
//   add --json for machine-readable output, --base <url> to point at another host

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const VALUED = ['country', 'region', 'status', 'topic', 'policy', 'party', 'q', 'base'];
const pos = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]?.replace(/^--/, '')));
const [cmd, ...rest] = pos;
const BASE = (opt('base') ?? 'https://atlas.withpersona.com').replace(/\/$/, '');
const json = flag('json');
const NOTE = `Atlas summaries are informational, not legal advice; check each law's primary source. Data fetched live from ${BASE} on ${new Date().toISOString().slice(0, 10)}.`;

class UserError extends Error {}

// One retry on a network error, timeout, 429 or 5xx; 15 s per attempt.
async function get(p, params = {}, { allow404 = false } = {}) {
  const url = new URL(p, BASE);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 2000));
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (allow404 && res.status === 404) return null;
      if (res.status === 429 || res.status >= 500) {
        last = `HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) throw new UserError(`${url} returned HTTP ${res.status}`);
      if (!(res.headers.get('content-type') ?? '').includes('json')) throw new UserError(`${url} did not return JSON (has the API moved?)`);
      return await res.json();
    } catch (e) {
      if (e instanceof UserError) throw e;
      last = e.name === 'TimeoutError' ? 'timed out after 15 s' : e.cause?.code ?? e.message;
    }
  }
  throw new UserError(`could not reach ${new URL(BASE).host} (${last}, tried twice). Check your network or try again later.`);
}

const words = (s) => (s ?? '').toLowerCase().split(/\s+/).filter(Boolean);
// Both phrasings are used on the Atlas site; a search for one also finds the other.
const SAME = [['age verification', 'age assurance']];
const has = (hay, q) => {
  const h = hay.toLowerCase();
  const query = (q ?? '').toLowerCase();
  const pair = SAME.find((g) => g.some((t) => query.includes(t)));
  if (pair) return pair.some((t) => words(query.replace(pair.find((x) => query.includes(x)), t)).every((w) => h.includes(w)));
  return words(query).every((w) => h.includes(w));
};
const human = (s) => (s ?? '').replaceAll('_', ' ');
const where = (l) => (l.region ? `${l.region}, ${l.country}` : l.country);
const out = (obj, text) => {
  if (json) console.log(JSON.stringify(obj, null, 2));
  else console.log(`${text}\n\n${NOTE}`);
};
function oneOf(name, value, allowed) {
  if (value == null || allowed.includes(value)) return value;
  throw new UserError(`unknown --${name} "${value}". Valid values: ${allowed.join(', ')}`);
}

// Country codes, names and a few common aliases.
const ALIASES = { UK: 'GB', 'GREAT BRITAIN': 'GB', BRITAIN: 'GB', ENGLAND: 'GB', USA: 'US', 'UNITED STATES OF AMERICA': 'US', AMERICA: 'US', KOREA: 'KR', TURKEY: 'TR' };
function resolveCountry(input, list) {
  if (!input) return undefined;
  const key = input.trim().toUpperCase();
  const code = ALIASES[key] ?? list.find((c) => c.code === key || c.name.toUpperCase() === key)?.code;
  if (code && list.some((c) => c.code === code)) return code;
  throw new UserError(`no ${list.label} tracked for "${input}". Use an ISO code or name from: ${list.map((c) => `${c.code} ${c.name}`).join(', ')}`);
}
async function lawCountries() {
  const list = (await get('/api/countries')).countries.map(({ code, name }) => ({ code, name }));
  list.label = 'laws';
  return list;
}

function lawBlock(l) {
  return [
    `${l.name} — ${where(l)} [${l.enactment_status}${l.effective_date ? `, effective ${l.effective_date}` : ''}]`,
    `  Policy: ${l.policy_types.map(human).join(', ')} · Topics: ${(l.topics ?? []).map(human).join(', ') || '—'} · Applies to: ${l.responsible_parties.map(human).join(', ')}`,
    `  ${l.summary}`,
    l.penalties ? `  Penalties: ${l.penalties.max_fine ?? l.penalties.description}${l.penalties.criminal_penalties ? ' (criminal penalties)' : ''}` : '',
    l.url ? `  Source: ${l.url}` : '',
    ...(l.resources ?? []).filter((r) => r.url !== l.url).map((r) => `  Resource: ${r.label ? `${r.label} — ` : ''}${r.url}`),
  ].filter(Boolean).join('\n');
}
const brief = (l) => `- ${l.name} — ${where(l)} [${l.enactment_status}${l.effective_date ? `, ${l.effective_date}` : ''}]`;
const values = (L, f) => [...new Set(L.flatMap((l) => [].concat(f(l) ?? [])))].sort();

async function laws() {
  const country = resolveCountry(opt('country'), await lawCountries());
  const all = (await get('/api/legislations')).legislations;
  let L = all;
  if (country) L = L.filter((l) => l.country_code === country);
  const region = opt('region');
  if (region) {
    const regions = [...new Map(L.filter((l) => l.region_code).map((l) => [l.region_code, l.region])).entries()];
    const hit = regions.find(([c, n]) => c.toUpperCase() === region.toUpperCase() || n?.toUpperCase() === region.toUpperCase());
    if (!hit) throw new UserError(`no laws tracked for region "${region}"${country ? ` in ${country}` : ''}. Regions with laws: ${regions.map(([c, n]) => `${c} ${n}`).sort().join(', ') || 'none'}`);
    L = L.filter((l) => l.region_code === hit[0]);
  }
  const status = oneOf('status', opt('status'), values(all, (l) => l.enactment_status));
  const topic = oneOf('topic', opt('topic'), values(all, (l) => l.topics));
  const policy = oneOf('policy', opt('policy'), values(all, (l) => l.policy_types));
  const party = oneOf('party', opt('party'), values(all, (l) => l.responsible_parties));
  if (status) L = L.filter((l) => l.enactment_status === status);
  if (topic) L = L.filter((l) => (l.topics ?? []).includes(topic));
  if (policy) L = L.filter((l) => l.policy_types.includes(policy));
  if (party) L = L.filter((l) => l.responsible_parties.includes(party));
  if (flag('national')) L = L.filter((l) => !l.region_code);
  if (flag('subnational')) L = L.filter((l) => l.region_code);
  if (opt('q')) L = L.filter((l) => has(`${l.name} ${l.summary} ${l.penalties?.description ?? ''}`, opt('q')));
  out({ count: L.length, note: NOTE, legislations: L }, `${L.length} law(s)${L.length ? '' : ' match these filters'}\n${L.map((l) => (flag('brief') ? brief(l) : `\n${lawBlock(l)}`)).join('\n')}`);
}

async function law() {
  const q = rest.join(' ').trim();
  if (!q) throw new UserError('give part of a law name, e.g. law Online Safety Act');
  const { legislations: L } = await get('/api/legislations');
  const lq = q.toLowerCase();
  const score = (l) => {
    const n = l.name.toLowerCase();
    if (n === lq) return 4;
    if (n.startsWith(lq)) return 3;
    if (n.includes(lq)) return 2;
    return has(`${l.name} ${where(l)}`, q) ? 1 : 0;
  };
  const hits = L.map((l) => ({ l, s: score(l) })).filter((x) => x.s).sort((a, b) => b.s - a.s || a.l.name.length - b.l.name.length).map((x) => x.l);
  if (!hits.length) throw new UserError(`no law matches "${q}". Try fewer words, or: laws --q "${q}"`);
  out({ note: NOTE, best: hits[0], others: hits.slice(1) }, `${lawBlock(hits[0])}${hits.length > 1 ? `\n\nOther matches (${hits.length - 1}):\n${hits.slice(1).map(brief).join('\n')}` : ''}`);
}

async function countries() {
  const { countries: C } = await get('/api/countries');
  const list = opt('q') ? C.filter((c) => has(`${c.name} ${c.code}`, opt('q'))) : C;
  out({ note: NOTE, countries: list }, `${list.length} jurisdiction(s) with laws tracked\n${list
    .map((c) => `- ${c.code} ${c.name}: ${c.legislationCount} national law(s) [${(c.legislationStatuses ?? []).join(', ')}]${c.hasRegionalLaws ? `, regional laws in ${Object.keys(c.perRegionLegislationTagCounts ?? {}).length} region(s)` : ''} · tags ${Object.entries(c.legislationTagCounts ?? {}).map(([k, v]) => `${human(k)} ${v}`).join(', ')}`)
    .join('\n')}`);
}

async function states() {
  const { states: S } = await get('/api/states');
  out({ note: NOTE, states: S }, S.map((s) => `- ${s.code} ${s.name}: ${s.hasLaw ? `${s.status}, target ages ${s.targetAges.join(' ') || '—'}` : 'no law tracked'}`).join('\n'));
}

// Fields shown per digital ID. Anything else in the API record is left out.
const ID_FIELDS = ['name', 'idType', 'issuingAuthority', 'levelOfAssurance', 'countryStatus', 'launchDate', 'estimatedCoverage', 'fieldsReturned', 'useCases', 'eudiWalletStatus', 'summary', 'regulatoryContext', 'officialDocUrl'];
async function digitalIds() {
  const all = (await get('/api/digital-ids/regions')).regions;
  let regions = all;
  if (opt('country')) {
    const list = all.map(({ code, name }) => ({ code, name }));
    list.label = 'digital IDs';
    const code = resolveCountry(opt('country'), list);
    regions = all.filter((r) => r.code === code);
  }
  let rows = regions.flatMap((r) => (r.digitalIds ?? []).map((d) => ({ country: r.code, countryName: r.name, lastUpdated: r.lastUpdated, ...Object.fromEntries(ID_FIELDS.filter((k) => d[k] != null).map((k) => [k, d[k]])) })));
  if (opt('q')) rows = rows.filter((d) => has(`${d.name} ${d.countryName} ${d.idType} ${d.summary}`, opt('q')));
  if (flag('eudi')) rows = rows.filter((d) => d.eudiWalletStatus);
  const text = [`${rows.length} digital ID scheme(s)`];
  for (const d of rows) {
    text.push(`\n${d.name} — ${d.countryName} (${d.country}), updated ${d.lastUpdated ?? '—'}`);
    text.push(`  Type: ${d.idType ?? '—'} · Issuer: ${d.issuingAuthority ?? '—'} · Assurance: ${d.levelOfAssurance ?? '—'} · Status: ${d.countryStatus ?? '—'}${d.launchDate ? ` · Launched ${d.launchDate}` : ''}${d.estimatedCoverage ? ` · Coverage ${d.estimatedCoverage}` : ''}`);
    if (d.eudiWalletStatus) text.push(`  EUDI wallet: ${d.eudiWalletStatus}`);
    if (d.fieldsReturned?.length) text.push(`  Fields returned: ${d.fieldsReturned.join(', ')}`);
    if (d.useCases?.length) text.push(`  Use cases: ${d.useCases.join(', ')}`);
    text.push(`  ${d.summary}`);
    for (const r of d.regulatoryContext ?? []) text.push(`  Regulation (${r.category}${r.effectiveDate ? `, ${r.effectiveDate}` : ''}): ${r.summary}${r.source ? ` — ${r.source}` : ''}`);
    if (d.officialDocUrl) text.push(`  Official: ${d.officialDocUrl}`);
  }
  out({ note: NOTE, digitalIds: rows }, text.join('\n'));
}

async function facets() {
  const { legislations: L } = await get('/api/legislations');
  const tally = (f) => {
    const t = {};
    for (const l of L) for (const v of [].concat(f(l) ?? '(none)')) t[v] = (t[v] ?? 0) + 1;
    return Object.fromEntries(Object.entries(t).sort((a, b) => b[1] - a[1]));
  };
  const r = {
    laws: L.length,
    jurisdictions: new Set(L.map((l) => l.country_code)).size,
    subnational: L.filter((l) => l.region_code).length,
    status: tally((l) => l.enactment_status),
    policy_types: tally((l) => l.policy_types),
    topics: tally((l) => l.topics),
    responsible_parties: tally((l) => l.responsible_parties),
  };
  out({ note: NOTE, ...r }, JSON.stringify(r, null, 2));
}

const cmds = { laws, law, countries, states, 'digital-ids': digitalIds, facets };
if (!cmds[cmd]) {
  const help = (await import('node:fs')).readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 20);
  console.error(help.map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(cmd ? 1 : 0);
}
try {
  await cmds[cmd]();
} catch (e) {
  console.error(`atlas: ${e instanceof UserError ? e.message : e.stack}`);
  process.exit(1);
}
