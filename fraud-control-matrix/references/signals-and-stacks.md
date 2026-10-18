# Signal families and control stacks

> Source: Persona Research, Identity Fraud Control Matrix — snapshot of https://labs.withpersona.com/fraud-controls as of October 2026. Generated from `data/matrix.json`.

## Signal families

### A Material and texture response

Living skin scatters light beneath its surface and produces a characteristic distribution of fine texture, pore structure, and diffuse and specular reflection. Paper, glass, and silicone do not reproduce this faithfully at close range.

**Weakens when** resolution is low, compression is aggressive, the capture is distant, or the attacker picks matte materials and flattening light.

Surfaces 8 techniques.

### B Display and frequency artifacts

A screen replayed to a camera introduces artifacts a real scene does not: interference between the display grid and the sensor grid, banding from refresh rate against exposure, uneven backlight, clipped blacks, and bezel geometry.

**Weakens when** the attacker uses a high-density, high-refresh display, controls the angle, or crops out every device edge.

Surfaces 4 techniques.

### C Illumination and reflection consistency

Corneal highlights, shadow geometry across nose and brow, and light falloff are mutually consistent on a real face in a lit room. Where the flow controls the screen it can illuminate with a value chosen at capture time and check the reflected response.

**Weakens when** ambient light is very low or very strong, or the user wears glasses. Needs calibration across skin tones so sensitivity does not vary by group.

Surfaces 4 techniques.

### D Depth, parallax, and geometry

A flat artifact yields a flat scene. Small natural head movement produces relative displacement between near and far landmarks and a defocus gradient across the face; both are absent or wrong for a print or a screen.

**Weakens when** only a single still exists, no depth data is available, or the instrument is genuinely three-dimensional, as a fitted mask is.

Surfaces 3 techniques.

### E Motion and temporal consistency

Across ordered frames a live capture shows coherent landmark trajectories, continuous involuntary micro-motion, and plausible blink dynamics. Replayed and edited media often show loop points, duplicated frames, cuts, or motion too smooth to be human.

**Weakens when** the integration submits a single image rather than a sequence, which removes this family entirely.

Surfaces 4 techniques.

### F Anomalous signals

Anomaly detection identifies clusters of similar visual features across transactions and populations to reveal unusual or coordinated patterns. Effective against emerging synthetic media engines and new spoofing techniques, because it detects repeated characteristics without requiring every attack type to have been observed in advance.

**Weakens when** attacks are isolated, occur at low volume, or are distributed across long periods, conditions that reduce the clustering density needed to separate a coordinated pattern from normal variation.

Surfaces 5 techniques.

### G Generative and manipulation artifacts

Synthesized and swapped media leave traces of construction: blending seams at jaw and hairline, inconsistent detail in eyes and teeth, flicker in high-frequency regions, identity drift over a sequence, and statistical signatures from upsampling.

**Weakens when** the generator is newer than the detector. The fastest-moving family, which is why it must be paired with H.

Surfaces 3 techniques.

### H Capture-path and device context

Not image analysis at all. Which cameras the platform reports, whether a virtual driver is present, whether the runtime shows emulation or instrumentation, whether the platform will attest, whether metadata is plausible, and whether frames arrived in order.

**Weakens when** the integration supplies a finished image with no capture context, in which case none of these signals exist.

Surfaces 12 techniques.

## What gives a technique away ("tell")

Derived from its signal families: `image` if any of A–E or G; else `path` if H; else `across` if F; else `none`.

- **In the image** (Families A–E, G): 9 — T2001, T2002, T2003, T2004, T2005, T2006, T3004, T4003, T5003
- **Only across many submissions** (Family F): 2 — T4004, T5004
- **Only in the capture path** (Family H): 11 — T1001, T1002, T1003, T1004, T1006, T3001, T3002, T3003, T3005, T4001, T4002
- **No face or camera trace** (Document, data, population, lifecycle): 9 — T1005, T5001, T5002, T5005, T5006, T6001, T6002, T6003, T6004

## Control stacks (the ladder)

Each stop adds one layer of controls; named stops double as presets. Status per technique: **backed** (2+ effective controls on), **single** (exactly 1), **exposed** (none). These are planning counts of mapped controls, never detection rates. With server-side upload, C01–C08 drop out of the effective set.

| Stop | Label | Adds | Controls on | Backed | Single | Exposed |
|---|---|---|---|---|---|---|
| `live` (preset) | Selfie liveness only | C02 C16 | 2 | 4 | 4 | 23 |
| `docsel` (preset) | Document and selfie | C01 C10 C11 C12 C15 | 7 | 10 | 4 | 17 |
| `integrity` | + Capture checks | C03 C05 C06 C07 C08 C09 | 13 | 18 | 5 | 8 |
| `sources` | + Evidence sources | C13 C14 | 15 | 19 | 5 | 7 |
| `context` | + Context and population | C17 C18 C19 C20 | 19 | 27 | 4 | 0 |
| `web` (preset) | Full stack, web | C21 C22 C23 C24 | 23 | 29 | 2 | 0 |
| `native` (preset) | Full stack, native app | C04 | 24 | 31 | 0 | 0 |

- `live` — Frame retention and a liveness check. No document capture.
- `docsel` — Adds guided capture, document authenticity, encoded data, and face comparison, over a protected connection.
- `integrity` — Adds a capture-time challenge, camera and runtime checks, frame timing, and session binding.
- `sources` — Adds chip and wallet credential validation and authoritative source checks.
- `context` — Adds device and network context, velocity, link analysis, and risk intelligence.
- `web` — Every control a browser flow supports. Platform attestation needs a native app.
- `native` — All 24 controls, including platform attestation.

Run `node scripts/query.mjs stack <stop|ids> [--upload]` for the per-technique breakdown.
