# labs-skills

Agent skills built from Persona Research work. Each directory is one self-contained skill in the [Agent Skills](https://agentskills.io) layout: a `SKILL.md` with `name` / `description` frontmatter that tells an agent when and how to use it, `references/*.md` it reads on demand, and zero-dependency Node scripts in `scripts/*.mjs` (plus `data/*.json` where the skill carries a dataset).

| Skill | What it does | Source |
|---|---|---|
| [`fraud-control-matrix`](fraud-control-matrix/SKILL.md) | Answers which controls cover an attack technique, what a control stack leaves exposed, and which Persona capability implements a control — 6 stages, 31 techniques, 24 controls, 8 signal families, 239 Persona capabilities. Asks a few questions about your setup to find your gaps. Works offline. | https://labs.withpersona.com/fraud-controls (snapshot, October 2026) |
| [`persona-atlas`](persona-atlas/SKILL.md) | Fetches live age assurance and child online safety laws, and digital IDs and EUDI wallets, from Persona Atlas by country, US state, status, topic or responsible party. Not a KYC/AML regulation source. | https://atlas.withpersona.com (live) |
| [`selfie-threat-benchmark`](selfie-threat-benchmark/SKILL.md) | Pulls live samples, counts, taxonomy codes and attack paths from the Persona FAS Gallery of selfie presentation and injection attacks. | https://threats.withpersona.com (live) |

Each `SKILL.md` has a list of example questions.

## Install

You need Node.js 20 or later. `persona-atlas` and `selfie-threat-benchmark` call their public sites, so they need outbound HTTPS to atlas.withpersona.com and threats.withpersona.com; `fraud-control-matrix` works offline.

Copy (or symlink) the skill directories you want into your agent's skills folder:

| Agent | Personal (all projects) | One project |
|---|---|---|
| Claude Code | `~/.claude/skills/<skill>` | `.claude/skills/<skill>` |
| Cursor | `~/.cursor/skills/<skill>` | `.cursor/skills/<skill>` |
| Codex | `~/.codex/skills/<skill>` | `.codex/skills/<skill>` |

```sh
git clone https://github.com/persona-id/labs-skills.git
mkdir -p ~/.claude/skills
cp -R labs-skills/fraud-control-matrix labs-skills/persona-atlas labs-skills/selfie-threat-benchmark ~/.claude/skills/
```

**Check a skill loaded.** Start a new session and ask the agent which skills it has, or ask a question from the skill's examples, e.g. "Which US states require app stores to verify age?", and check that it runs `scripts/atlas.mjs`. You can also run the scripts directly:

```sh
node fraud-control-matrix/scripts/query.mjs stack docsel
node persona-atlas/scripts/atlas.mjs laws --country US --region Texas --brief
node selfie-threat-benchmark/scripts/threats.mjs summary
```

## Data and disclaimer

- `fraud-control-matrix` is a point-in-time snapshot of https://labs.withpersona.com/fraud-controls (October 2026). It is a planning model: its counts are mapped controls, not detection rates.
- `persona-atlas` and `selfie-threat-benchmark` read the public sites live; answers reflect the sites on the day you ask, and each answer says so.
- Regulatory content is informational and is not legal advice. Check the primary source and your own counsel before relying on it.
- Sample images shown by `selfie-threat-benchmark` remain subject to the terms of threats.withpersona.com and of the dataset they come from. This repository's license does not cover them.
- Each skill tells your assistant to treat text from these sites as information only, never as instructions.
- Provided as is, without warranty; see the license.

## Support

Questions or corrections: research@withpersona.com. To report a security vulnerability, see [SECURITY.md](SECURITY.md).

## License

Apache License 2.0; see [LICENSE](LICENSE). Copyright 2026 Persona Identities, Inc. See [NOTICE](NOTICE).
