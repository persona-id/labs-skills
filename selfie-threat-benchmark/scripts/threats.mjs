#!/usr/bin/env node
// Query A Digital Taxonomy of Fraud at https://threats.withpersona.com: labelled selfie presentation and injection
// attack samples. Live data: /gallery-index.json (every sample with its category, attack tags and complexity),
// minus the samples the gallery itself hides. Taxonomy and attack paths come from data/taxonomy.json, a copy of
// the gallery's taxonomy. No auth. Node 20+, no deps.
//
//   node scripts/threats.mjs summary                       totals by category, subcategory, variant, complexity, tag
//   node scripts/threats.mjs list [filters] [--limit 20]   samples, with image URLs
//       --category synthetic   dolls_and_mannequins | masks | replicas | synthetic
//       --subcategory face_swap               e.g. full_face_synthesis, partial_modification, screen_replays, id_portraits/physical
//       --variant imagen4                     e.g. diffusion_flux, gan_stylegan2, openai_gpt_image_2, background_outpainting
//       --tag AR-05 [--tag DL-03]             every tag must be present
//       --complexity High                     Low | Moderate | High
//       --q "camera noise"                    words in the description or tag names (e.g. "screen replay", "injection")
//   node scripts/threats.mjs item <id>                     one sample (id as in the index, e.g. masks/fake-1.jpg)
//   node scripts/threats.mjs codes [ST|AP|AR|DL]           the taxonomy: stages, techniques, sub-techniques, sample counts
//   node scripts/threats.mjs paths                         the attack paths, with how many samples match each
//   node scripts/threats.mjs match AP-02,AR-07,DL-03       which attack path a tag set follows, and its nearest paths
//   add --json for machine-readable output, --base <url> to point at another host

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TAX = JSON.parse(fs.readFileSync(path.join(here, '..', 'data', 'taxonomy.json'), 'utf8'));
const argv = process.argv.slice(2);
const VALUED = ['category', 'subcategory', 'variant', 'tag', 'complexity', 'q', 'limit', 'base'];
const flag = (n) => argv.includes(`--${n}`);
const opt = (n) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const opts = (n) => argv.flatMap((a, i) => (a === `--${n}` ? [argv[i + 1]] : []));
const pos = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]?.replace(/^--/, '')));
const [cmd, ...rest] = pos;
const BASE = (opt('base') ?? 'https://threats.withpersona.com').replace(/\/$/, '');
const DATASET = 'withpersona/persona-fas-bench-v1';
const json = flag('json');

class UserError extends Error {}

// One retry on a network error, timeout, 429 or 5xx; 15 s per attempt.
async function get(p) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 2000));
    try {
      const res = await fetch(`${BASE}${p}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (res.status === 429 || res.status >= 500) {
        last = `HTTP ${res.status}`;
        continue;
      }
      return await check(res, p);
    } catch (e) {
      if (e instanceof UserError) throw e;
      last = e.name === 'TimeoutError' ? 'timed out after 15 s' : e.cause?.code ?? e.message;
    }
  }
  throw new UserError(`could not reach ${new URL(BASE).host} (${last}, tried twice). Check your network or try again later.`);
}

async function check(res, p) {
  if (!res.ok) throw new UserError(`${BASE}${p} returned HTTP ${res.status}`);
  if (!(res.headers.get('content-type') ?? '').includes('json')) throw new UserError(`${BASE}${p} did not return JSON (has the data moved?)`);
  return res.json();
}

// The gallery hides the ids listed at /api/flags; do the same. If that list is unavailable, show everything.
async function load() {
  const [index, hide] = await Promise.all([get('/gallery-index.json'), get('/api/flags').catch(() => ({ items: [] }))]);
  const hidden = new Set((hide.items ?? []).map((f) => f.id));
  return { index, items: index.items.filter((i) => !hidden.has(i.id)) };
}

// "/gallery/masks/fake-1.jpg" → dataset path "masks/fake-1.jpg"; served resized at /gallery/{thumb|card}/<path>.webp
const datasetPath = (url) => url.replace(/^.*\/gallery\//, '').replace(/^.*\/resolve\/main\//, '');
const urls = (item) => {
  const p = datasetPath(item.imageUrl);
  const webp = p.replace(/\.[^./]+$/, '.webp');
  return {
    thumb: `${BASE}/gallery/thumb/${webp}`,
    card: `${BASE}/gallery/card/${webp}`,
    original: `https://huggingface.co/datasets/${DATASET}/resolve/main/${p}`,
  };
};
const CODE = Object.fromEntries(TAX.stages.flatMap((s) => s.techniques.map((t) => [t.id, { ...t, stage: s.stage }])));
const name = (c) => (CODE[c] ? `${c} ${CODE[c].name}` : c);
// "mule" is how the gallery describes AP-06 Identity Muling (attack path s1: "An identity mule completes verification").
const SAME = { mule: 'muling', mules: 'muling' };
const matches = (hay, q) => q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.toLowerCase().includes(SAME[w] ?? w));
const tally = (list, f) => {
  const t = {};
  for (const x of list) for (const v of [].concat(f(x) ?? '(none)')) t[v] = (t[v] ?? 0) + 1;
  return Object.fromEntries(Object.entries(t).sort((a, b) => b[1] - a[1]));
};
const out = (obj, text) => console.log(json ? JSON.stringify(obj, null, 2) : text);

// The gallery's own matching rule: ST and AP must equal the path's; every AR tag must be on the
// path; at least one DL tag must be on the path. Empty groups are not constrained.
const split = (tags) => ({
  ST: tags.find((t) => t.startsWith('ST-')) ?? null,
  AP: tags.find((t) => t.startsWith('AP-')) ?? null,
  AR: tags.filter((t) => t.startsWith('AR-')),
  DL: tags.filter((t) => t.startsWith('DL-')),
});
function follows(p, tags) {
  const g = split(tags);
  const on = (pre) => p.techniques.filter((t) => t.startsWith(pre));
  if (g.ST && !on('ST-').includes(g.ST)) return false;
  if (g.AP && !on('AP-').includes(g.AP)) return false;
  if (g.AR.length && !g.AR.every((t) => on('AR-').includes(t))) return false;
  if (g.DL.length && !g.DL.some((t) => on('DL-').includes(t))) return false;
  return true;
}
const pathOf = (tags) => TAX.paths.find((p) => !p.signalOnly && follows(p, tags)) ?? null;

async function summary() {
  const { index, items } = await load();
  const r = {
    generatedAt: index.generatedAt,
    total: items.length,
    indexTotal: index.total,
    hidden: index.total - items.length,
    category: tally(items, (i) => i.category),
    subcategory: tally(items, (i) => `${i.category}/${i.subcategory ?? '-'}`),
    variant: tally(items.filter((i) => i.variant), (i) => `${i.subcategory}/${i.variant}`),
    complexity: tally(items, (i) => i.complexity),
    refinementsPerSample: tally(items, (i) => String(i.arCount ?? 0)),
    tags: Object.fromEntries(Object.entries(tally(items, (i) => i.tags)).map(([k, v]) => [name(k), v])),
  };
  if (json) return out(r);
  console.log(`${r.total} samples shown (index ${r.indexTotal}, ${r.hidden} hidden by the gallery), index generated ${r.generatedAt}`);
  for (const k of ['category', 'subcategory', 'variant', 'complexity', 'refinementsPerSample', 'tags'])
    console.log(`\n${k}:\n${Object.entries(r[k]).map(([a, b]) => `  ${a}: ${b}`).join('\n')}`);
}

async function list() {
  const { items } = await load();
  let L = items;
  const valid = (f) => [...new Set(items.flatMap((i) => [].concat(f(i) ?? [])))].sort();
  const oneOf = (n, v, allowed) => {
    if (v != null && !allowed.includes(v)) throw new UserError(`unknown --${n} "${v}". Valid values: ${allowed.join(', ')}`);
    return v;
  };
  const category = oneOf('category', opt('category'), valid((i) => i.category));
  const subcategory = oneOf('subcategory', opt('subcategory'), valid((i) => i.subcategory));
  const variant = oneOf('variant', opt('variant'), valid((i) => i.variant));
  const complexity = oneOf('complexity', opt('complexity') && opt('complexity')[0].toUpperCase() + opt('complexity').slice(1).toLowerCase(), valid((i) => i.complexity));
  const tags = opts('tag').map((t) => oneOf('tag', t.toUpperCase(), Object.keys(CODE).sort()));
  if (category) L = L.filter((i) => i.category === category);
  if (subcategory) L = L.filter((i) => i.subcategory === subcategory);
  if (variant) L = L.filter((i) => i.variant === variant);
  for (const t of tags) L = L.filter((i) => i.tags.includes(t));
  if (complexity) L = L.filter((i) => i.complexity === complexity);
  if (opt('q')) L = L.filter((i) => matches(`${i.description} ${i.tags.map(name).join(' ')} ${i.category} ${i.subcategory ?? ''} ${i.variant ?? ''}`.replaceAll('_', ' '), opt('q')));
  const limit = Number(opt('limit') ?? 20);
  const shown = L.slice(0, limit).map((i) => ({ ...i, urls: urls(i), path: pathOf(i.tags)?.id ?? null }));
  if (json) return out({ count: L.length, items: shown });
  console.log(`${L.length} sample(s)${L.length > limit ? `, first ${limit}` : ''}`);
  for (const i of shown) console.log(`- ${i.id} [${i.complexity}] ${i.description}\n    tags ${i.tags.join(' ')}${i.path ? ` · path ${i.path}` : ''} · ${i.urls.card}`);
}

async function item() {
  const { items } = await load();
  const id = rest.join(' ');
  const i = items.find((x) => x.id === id || datasetPath(x.imageUrl) === id);
  if (!i) throw new UserError(`no sample "${id}". Sample ids look like masks/fake-1.jpg; find them with: list --category masks`);
  const p = pathOf(i.tags);
  const r = { ...i, urls: urls(i), path: p };
  out(r, [
    `${i.id} — ${i.description}`,
    `Category ${i.category}${i.subcategory ? ` / ${i.subcategory}` : ''}${i.variant ? ` / ${i.variant}` : ''} · complexity ${i.complexity}`,
    ...i.tags.map((t) => `  ${name(t)} (${CODE[t]?.stage ?? '?'})`),
    p ? `Attack path ${p.id}: ${p.desc} (sophistication ${p.sophistication})` : 'Attack path: none of the defined paths',
    `Images: ${r.urls.card} (card), ${r.urls.thumb} (thumb), ${r.urls.original} (dataset)`,
  ].filter(Boolean).join('\n'));
}

async function codes() {
  const { items } = await load();
  const counts = tally(items, (i) => i.tags);
  const want = rest[0]?.toUpperCase();
  const stages = TAX.stages.filter((s) => !want || s.id === want);
  out(stages.map((s) => ({ ...s, techniques: s.techniques.map((t) => ({ ...t, samples: counts[t.id] ?? 0 })) })),
    stages.map((s) => `${s.id} ${s.stage} — ${s.description}\n${s.techniques
      .map((t) => `  ${t.id} ${t.name} (${counts[t.id] ?? 0} samples): ${t.desc}${t.subtechniques.length ? `\n      sub-techniques: ${t.subtechniques.join(', ')}` : ''}`)
      .join('\n')}`).join('\n\n'));
}

async function paths() {
  const { items } = await load();
  const n = {};
  for (const i of items) {
    const p = pathOf(i.tags);
    n[p?.id ?? 'none'] = (n[p?.id ?? 'none'] ?? 0) + 1;
  }
  out(TAX.paths.map((p) => ({ ...p, samples: n[p.id] ?? 0 })).concat([{ id: 'none', samples: n.none ?? 0 }]),
    TAX.paths.map((p) => `${p.id} [${p.sophistication}]${p.signalOnly ? ' (signal-only: no image tell)' : ''} ${p.desc}\n    ${p.techniques.map(name).join(' → ')}${p.signalOnly ? '' : ` · ${n[p.id] ?? 0} samples`}`).join('\n') +
    `\nSamples matching no defined path: ${n.none ?? 0}`);
}

function match() {
  const tags = rest.join(',').split(/[\s,]+/).filter(Boolean).map((t) => t.toUpperCase());
  const exact = pathOf(tags);
  const near = TAX.paths
    .filter((p) => !p.signalOnly && p !== exact)
    .map((p) => ({ id: p.id, desc: p.desc, score: p.techniques.filter((t) => tags.includes(t)).length }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  out({ tags, path: exact, nearest: near }, [
    `Tags: ${tags.map(name).join(', ')}`,
    exact ? `Follows ${exact.id} [${exact.sophistication}]: ${exact.desc}\n  ${exact.techniques.map(name).join(' → ')}` : 'Follows none of the defined paths.',
    near.length ? `Nearest: ${near.map((p) => `${p.id} (${p.score} shared) ${p.desc}`).join(' | ')}` : '',
  ].filter(Boolean).join('\n'));
}

const cmds = { summary, list, item, codes, paths, match };
if (!cmds[cmd]) {
  console.error(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 21).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(cmd ? 1 : 0);
}
try {
  await cmds[cmd]();
} catch (e) {
  console.error(`threats: ${e instanceof UserError ? e.message : e.stack}`);
  process.exit(1);
}
