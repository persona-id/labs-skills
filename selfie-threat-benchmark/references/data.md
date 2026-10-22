# threats.withpersona.com data

> Source: live site https://threats.withpersona.com ("A Digital Taxonomy of Fraud", app version 1.001), as of 2026-10-17. No authentication. Counts are from that date and will drift.

The gallery shows labelled selfie presentation and injection attack samples from the Hugging Face dataset `withpersona/persona-fas-bench-v1` (`https://huggingface.co/datasets/withpersona/persona-fas-bench-v1`). Each sample is an attack image labelled with the threat taxonomy (`references/taxonomy.md`). The images remain subject to the terms of the gallery and the dataset; this repository's license does not cover them. Contact on the site: research@withpersona.com.

The gallery is a subset of that dataset: about 3,800 of its roughly 21,000 attack images (the dataset README says 21,056 in this release; the data card says 21,121). Physical categories are nearly complete in the gallery; most of the gap is synthetic. Counts here describe the gallery, not the dataset.

## `GET /gallery-index.json`

`{ generatedAt, total, items[], codes[] }` — 3,841 samples, generated 2026-09-14.

| Field | Notes |
|---|---|
| `id` | Dataset path, e.g. `masks/fake-1.jpg`, `synthetic/full_face_synthesis/imagen4/fake-12.jpg`. Unique key. |
| `category` | `synthetic` (2,600), `replicas` (601), `masks` (532), `dolls_and_mannequins` (108). |
| `subcategory` | Synthetic: `full_face_synthesis` (1,568), `partial_modification` (671), `face_swap` (361). Replicas: `screen_replays` (338), `id_portraits/physical` (94), `ai_generated` (61), `kyc_video` (48), `id_portraits/screen_replay` (47), `physical_photo` (13). Missing for masks and dolls. |
| `variant` | Generator or refinement, synthetic only. Full-face synthesis: `imagen4` (488), `diffusion_flux` (365), `gan_stylegan2` (360), `openai_gpt_image_2` (83), `openai_gpt_image_1_5` (63), `openai_gpt_image_1` (50), none (159). Partial modification: `background_outpainting` (338), `face_inpainting` (333). Face swap: `color_lighting_matching` (194), `resolution_format_matching` (90), `artifact_suppression` (40), `noise_injection` (18), `unrefined` (10), `compression_manipulation` (9). |
| `complexity` | `Low` (1,410), `Moderate` (1,377), `High` (1,054). |
| `description` | Generated from the path, e.g. "Face swap synthesis with face inpainting, blending seams removed, camera noise added, compression applied". |
| `tags[]` | Taxonomy codes (ST, AP, AR, DL). Synthetic samples carry DL-02…DL-05 together (screen replay and the three injection routes). |
| `arSet[]`, `arCount` | The AR refinements applied and how many (0–6). |
| `imageUrl`, `thumbnailUrl` | `/gallery/<id>`. Not fetchable as-is; see images below. |

`codes[]` lists all 27 codes with `stage` and `name`.

## Hidden samples

The gallery hides a small list of samples (`/api/flags`); `threats.mjs` hides the same ones.

## Images

The app rewrites `/gallery/<id>` to resized WebP renditions on the same host:

- `https://threats.withpersona.com/gallery/thumb/<id without extension>.webp` — 224×296
- `https://threats.withpersona.com/gallery/card/<id without extension>.webp` — 800×800
- original: `https://huggingface.co/datasets/withpersona/persona-fas-bench-v1/resolve/main/<id>`

## Not in the API

- The taxonomy's descriptions and sub-techniques and the 24 attack paths are part of the site's pages, not served as JSON. `data/taxonomy.json` is a copy as of 2026-10-17.
- There are no per-model detection scores, APCER/BPCER figures or leaderboards on the site as of 2026-10-17. It is a labelled attack-sample gallery; do not present it as a measured benchmark result.
