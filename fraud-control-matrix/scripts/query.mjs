#!/usr/bin/env node
// Answer questions against the Identity Fraud Control Matrix (data/matrix.json). Node 20+, no deps.
//
//   node scripts/query.mjs technique <T3001 | text>     one technique: controls, signals, Persona capabilities
//   node scripts/query.mjs control <C05 | text>         one control: what it reaches, its limit, Persona capabilities
//   node scripts/query.mjs stage <AT03 | text>          one stage and its techniques
//   node scripts/query.mjs stack <stop | C01,C02,…> [--upload] [--add C17,C18] [--remove C16]
//                                                        status of every technique under a control stack
//   node scripts/query.mjs capability <K01 | ref | text> one Persona capability, or a search over the register
//   node scripts/query.mjs cover <T1001,T3001,…>         controls and Persona capabilities that cover a set of techniques
//   node scripts/query.mjs search <text>                 search everything
//   node scripts/query.mjs list <stages|controls|techniques|signals|ladder|capabilities>
//
// Add --json to any command for machine-readable output.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(here, '..', 'data', 'matrix.json'), 'utf8'));

const argv = process.argv.slice(2);
const json = argv.includes('--json');
const upload = argv.includes('--upload');
const opt = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const positional = argv.filter((a, i) => !a.startsWith('--') && !['--add', '--remove'].includes(argv[i - 1]));
const [cmd, ...rest] = positional;
const q = rest.join(' ');

const T = Object.fromEntries(M.techniques.map((t) => [t.id, t]));
const C = Object.fromEntries(M.controls.map((c) => [c.id, c]));
const S = Object.fromEntries(M.signals.map((s) => [s.id, s]));
const ST = Object.fromEntries(M.stages.map((s) => [s.id, s]));
const CAPS = M.persona.capabilities;
const capsFor = (key, id) => CAPS.filter((k) => k[key].includes(id));
const ids = (s) => (s ?? '').split(/[\s,]+/).filter(Boolean).map((x) => x.toUpperCase());

const norm = (s) => s.toLowerCase();
function find(list, query, fields) {
  const exact = list.find((x) => norm(x.id) === norm(query));
  if (exact) return [exact];
  const words = norm(query).split(/\s+/).filter(Boolean);
  return list.filter((x) => {
    const hay = norm(fields.map((f) => [].concat(x[f] ?? '').join(' ')).join(' '));
    return words.every((w) => hay.includes(w));
  });
}
function one(list, query, fields, kind) {
  let hits = find(list, query, fields);
  if (hits.length > 1) {
    const byName = find(hits, query, ['name']);
    if (byName.length) hits = byName;
  }
  if (hits.length === 1) return hits[0];
  if (!hits.length) fail(`no ${kind} matches "${query}"`);
  fail(`"${query}" matches ${hits.length} ${kind}s: ${hits.map((h) => `${h.id} ${h.name}`).join('; ')}`);
}
function fail(msg) {
  console.error(msg);
  process.exit(1);
}
const SNAPSHOT = `Matrix: snapshot of ${M.source.url} as of ${M.source.snapshot}.`;
const print = (obj, text) => console.log(json ? JSON.stringify(obj, null, 2) : `${text}\n\n${SNAPSHOT}`);
const controlList = () => M.controls.map((c) => `${c.id} ${c.name}`).join('; ');
// Explain an id that is not a control: a Persona capability id gets its controls, anything else the list.
function notAControl(id) {
  const k = CAPS.find((x) => x.id === id);
  if (k) fail(`${id} is a Persona capability (${k.name}), not a control. It implements: ${k.controls.map((c) => `${c} ${C[c].name}`).join('; ') || 'no control'}. Use control ids (C01–C24) in a stack.`);
  fail(`unknown control "${id}". Use a preset (${M.ladder.map((s) => s.id).join(', ')}) or control ids: ${controlList()}`);
}
const capLine = (k) => `  ${k.id} ${k.name}${k.ref ? ` [${k.ref}]` : ''} (${k.kind}) — ${k.desc}`;

function effective(set) {
  return upload ? new Set([...set].filter((c) => !C[c].captureOnly)) : set;
}
function status(t, eff) {
  const on = t.controls.filter((c) => eff.has(c));
  return { on, status: on.length >= 2 ? 'backed' : on.length === 1 ? 'single' : 'exposed' };
}

function technique() {
  const t = one(M.techniques, q, ['name', 'subs', 'desc'], 'technique');
  const caps = capsFor('techniques', t.id);
  print({ ...t, stageName: ST[t.stage].name, capabilities: caps }, [
    `${t.id} ${t.name}  [${ST[t.stage].id} ${ST[t.stage].name} · effort ${t.effort} · ${M.tells[t.tell].label}]`,
    t.desc,
    t.subs.length ? `Variants: ${t.subs.map((s, i) => `${t.id}.${String(i + 1).padStart(3, '0')} ${s}`).join('; ')}` : '',
    `Controls (${t.controls.length}):`,
    ...t.controls.map((c) => `  ${c} ${C[c].name} (${C[c].layer})`),
    `Signal families: ${t.signals.map((s) => `${s} ${S[s].name}`).join('; ') || 'none'}`,
    `Response: ${t.response}`,
    `Residual: ${t.residual}`,
    `Persona capabilities (${caps.length}):`,
    ...(caps.length ? caps.map(capLine) : ['  No generally available Persona capability is mapped to this technique yet.']),
    t.refs.length ? `Refs: ${t.refs.join('; ')}` : '',
  ].filter(Boolean).join('\n'));
}

function control() {
  const c = one(M.controls, q, ['name', 'layer', 'desc'], 'control');
  const reach = M.techniques.filter((t) => t.controls.includes(c.id));
  const caps = capsFor('controls', c.id);
  print({ ...c, reach: reach.map((t) => t.id), capabilities: caps }, [
    `${c.id} ${c.name}  [${c.layer}${c.captureOnly ? ' · capture-only' : ''}]`,
    c.desc,
    `Does not cover: ${c.limit}`,
    `Reaches ${reach.length} techniques:`,
    ...reach.map((t) => `  ${t.id} ${t.name} (${t.stage}, ${t.controls.length} controls mapped)`),
    `In Persona (${caps.length}):`,
    ...(caps.length ? caps.map(capLine) : ['  No generally available Persona capability maps to this control. It sits in your own process or policy.']),
  ].join('\n'));
}

function stage() {
  const s = one(M.stages, q, ['name', 'short', 'blurb'], 'stage');
  const ts = M.techniques.filter((t) => t.stage === s.id);
  print({ ...s, techniques: ts.map((t) => t.id) }, [
    `${s.id} ${s.name} (${s.short}) — ${s.blurb}`,
    `Assumes: ${s.assumes}`,
    s.note,
    `Techniques (${ts.length}):`,
    ...ts.map((t) => `  ${t.id} ${t.name} · ${t.effort} · controls ${t.controls.join(' ')}`),
  ].join('\n'));
}

function stack() {
  const stop = M.ladder.find((s) => s.id === norm(rest[0] ?? ''));
  let set = new Set(stop ? stop.set : ids(q));
  for (const c of ids(opt('--add'))) set.add(c);
  for (const c of ids(opt('--remove'))) set.delete(c);
  if (!set.size && !stop && rest[0]) notAControl(rest[0].toUpperCase());
  for (const c of set) if (!C[c]) notAControl(c);
  const eff = effective(set);
  const rows = M.techniques.map((t) => ({ id: t.id, name: t.name, stage: t.stage, effort: t.effort, ...status(t, eff) }));
  const tally = { backed: 0, single: 0, exposed: 0 };
  for (const r of rows) tally[r.status]++;
  const label = stop ? stop.label : 'Custom stack';
  const dropped = [...set].filter((c) => !eff.has(c));
  const group = (st) => rows.filter((r) => r.status === st);
  print({ label, controls: [...set], effective: [...eff], upload, tally, techniques: rows }, [
    `${label}${upload ? ', images from your server' : ''}: ${[...set].sort().join(' ') || '(no controls)'}`,
    dropped.length ? `Not effective with server-side upload: ${dropped.join(' ')}` : '',
    `Backed ${tally.backed} · Single ${tally.single} · Exposed ${tally.exposed}  (planning counts of mapped controls, not detection rates)`,
    '',
    `Exposed (${tally.exposed}):`,
    ...group('exposed').map((r) => `  ${r.id} ${r.name} (${r.stage}, ${r.effort}) — add one of: ${T[r.id].controls.join(' ')}`),
    `Single control (${tally.single}):`,
    ...group('single').map((r) => `  ${r.id} ${r.name} (${r.stage}) — only ${r.on[0]}; backups: ${T[r.id].controls.filter((c) => c !== r.on[0]).join(' ') || 'none'}`),
    `Backed (${tally.backed}):`,
    ...group('backed').map((r) => `  ${r.id} ${r.name} — ${r.on.join(' ')}`),
  ].filter((l) => l !== null).join('\n'));
}

function capability() {
  const exact = CAPS.find((k) => norm(k.id) === norm(q) || (k.ref && norm(k.ref) === norm(q)));
  const hits = exact ? [exact] : find(CAPS, q, ['name', 'ref', 'desc', 'group', 'kind']);
  if (!hits.length) fail(`no capability matches "${q}"`);
  if (hits.length > 1) {
    print(hits, hits.map(capLine).join('\n'));
    return;
  }
  const k = hits[0];
  const g = M.persona.groups.find((x) => x.id === k.group);
  const doc = k.doc ?? g?.docs[0];
  print({ ...k, groupName: g?.name, docUrl: doc?.url }, [
    `${k.id} ${k.name}${k.ref ? ` [${k.ref}]` : ''} — ${k.kind} / ${g?.name ?? k.group}`,
    k.desc,
    `Implements: ${k.controls.map((c) => `${c} ${C[c].name}`).join('; ') || 'none'}`,
    `Bears on: ${k.techniques.map((t) => `${t} ${T[t].name}`).join('; ') || 'none'}`,
    doc ? `Docs: ${doc.label} — ${doc.url}` : '',
  ].filter(Boolean).join('\n'));
}

function cover() {
  const want = ids(q);
  if (!want.length) fail('give technique ids, e.g. cover T3001,T3004');
  for (const t of want) if (!T[t]) fail(`unknown technique "${t}". Use technique ids: ${M.techniques.map((x) => `${x.id} ${x.name}`).join('; ')}`);
  const controls = {};
  for (const t of want) for (const c of T[t].controls) (controls[c] ??= []).push(t);
  const ranked = Object.entries(controls).sort((a, b) => b[1].length - a[1].length);
  const caps = CAPS.filter((k) => k.techniques.some((t) => want.includes(t)));
  print({ techniques: want, controls: Object.fromEntries(ranked), capabilities: caps }, [
    `Controls covering ${want.join(' ')}:`,
    ...ranked.map(([c, ts]) => `  ${c} ${C[c].name} — ${ts.join(' ')}`),
    `Persona capabilities bearing on them (${caps.length}):`,
    ...caps.map((k) => `  ${k.id} ${k.name}${k.ref ? ` [${k.ref}]` : ''} — ${k.techniques.filter((t) => want.includes(t)).join(' ')}`),
  ].join('\n'));
}

// Terms that appear in the Persona Research sources but not in the matrix's own technique text, mapped to the
// techniques and signal family they describe. "deepfakes": the matrix's ENISA standard note ("presentation attacks,
// deepfakes, and injection"). "mule": threats.withpersona.com attack path s1 ("An identity mule completes verification").
const ALSO = {
  deepfake: { techniques: ['T2005', 'T3004'], signals: ['G'] },
  deepfakes: { techniques: ['T2005', 'T3004'], signals: ['G'] },
  mule: { techniques: ['T6001'] },
  mules: { techniques: ['T6001'] },
};
function search() {
  const extra = ALSO[norm(q).trim()] ?? {};
  const res = {
    stages: find(M.stages, q, ['name', 'blurb', 'note']),
    techniques: [...new Set([...(extra.techniques ?? []).map((id) => T[id]), ...find(M.techniques, q, ['name', 'subs', 'desc', 'response', 'residual'])])],
    controls: find(M.controls, q, ['name', 'desc', 'limit']),
    signals: [...new Set([...(extra.signals ?? []).map((id) => S[id]), ...find(M.signals, q, ['name', 'desc'])])],
    capabilities: find(CAPS, q, ['name', 'ref', 'desc']),
  };
  print(res, Object.entries(res)
    .filter(([, v]) => v.length)
    .map(([k, v]) => `${k} (${v.length}):\n${v.map((x) => `  ${x.id} ${x.name}${x.ref ? ` [${x.ref}]` : ''}`).join('\n')}`)
    .join('\n') || `nothing matches "${q}". Try a shorter word, or list techniques / list controls.`);
}

function list() {
  const what = rest[0];
  const L = {
    stages: () => M.stages.map((s) => `${s.id} ${s.name}`),
    controls: () => M.controls.map((c) => `${c.id} ${c.name} (${c.layer})`),
    techniques: () => M.techniques.map((t) => `${t.id} ${t.name} (${t.stage}, ${t.effort})`),
    signals: () => M.signals.map((s) => `${s.id} ${s.name}`),
    ladder: () => M.ladder.map((s) => `${s.id} ${s.label}: ${s.set.join(' ')}`),
    capabilities: () => CAPS.map((k) => `${k.id} ${k.name}${k.ref ? ` [${k.ref}]` : ''} (${k.kind})`),
  };
  if (!L[what]) fail(`list one of: ${Object.keys(L).join(', ')}`);
  const data = { stages: M.stages, controls: M.controls, techniques: M.techniques, signals: M.signals, ladder: M.ladder, capabilities: CAPS }[what];
  print(data, L[what]().join('\n'));
}

const cmds = { technique, control, stage, stack, capability, cover, search, list };
if (!cmds[cmd]) {
  console.error(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 15).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(cmd ? 1 : 0);
}
cmds[cmd]();
