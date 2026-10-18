# Persona Atlas data endpoints

> Source: live site https://atlas.withpersona.com, inspected 2026-10-17. `/api/legislations` is the endpoint the site itself links as its public API (header "More info" menu). The other endpoints were found in the site's map script (`/assets/world-map-globe.js`) and its inline `globe-bootstrap` JSON. No authentication; all return `application/json`. Counts below are from that date and will drift.

Atlas covers age assurance and child online safety law and digital IDs, not KYC/AML regulation. It describes itself as "an open database tracking age assurance laws and digital ID coverage across 50+ countries". The site has three views (header switch): **Age Assurance** (legislation), **Digital IDs** and **EUDI Wallets**. The HTML pages (`/country/us/region/ca`, …) are rendered by the app; outside the app they redirect to `/`, so use the JSON.

## `GET /api/legislations`

Returns `{ count, legislations: Legislation[] }` — 203 laws across 66 jurisdiction codes (88 subnational, mostly US states), 2026-10-17.

Server-side query parameters (others are ignored and return everything; re-filter locally):

| Param | Effect |
|---|---|
| `country=FR` | Laws whose `country_code` **or** `region_code` is `FR`. `country=EU` returns EU-level laws plus member-state laws filed under the EU. `country=US` returns federal and state laws. |
| `status=active` | Filters `enactment_status`. Combines with `country`. |

`region`, `topic`, `policy_type`, `country_code` are **not** honoured by the server.

`Legislation` fields:

| Field | Notes |
|---|---|
| `name` | Law or bill name. |
| `country`, `country_code` | ISO 3166-1 alpha-2, or `EU`. |
| `region`, `region_code` | Present for subnational laws (US states: postal code) and for member-state laws filed under `EU`. |
| `enactment_status` | `active` (102), `proposed` (68), `in_progress` (29, enacted but not yet in force), `blocked` (4, e.g. enjoined). |
| `effective_date` | Free text: "June 12, 2026", "December 2025", "2004", "April 15, 2026 (announced)". Missing for many proposals. |
| `policy_types[]` | `age_assurance` (175), `data_protection` (29), `consumer_protection`, `content_moderation`, `reporting`. |
| `topics[]` | `social_media` (83), `general_child_online_safety` (46), `explicit_adult_content` (39), `digital_identity_age_verification` (16), `harmful_content` (15), `ai_chatbots` (13), `data_protection` (12), `app_stores_and_operating_systems` (9), `online_gaming` (3). Missing on 3 laws. |
| `responsible_parties[]` | `social_media` (87), `online_services` (68), `adult_content_sites` (37), `video_platforms` (17), `app_stores` (11), `online_gaming` (8), `app_developers`, `internet_service_providers` (6 each), `operating_systems`, `data_controllers` (4 each), `online_gambling` (2). |
| `summary` | Editorial summary: who it applies to, age thresholds, accepted or banned age-assurance methods, data retention rules. |
| `penalties` | `{ criminal_penalties: bool, description, max_fine }` (`max_fine` is free text, often equal to `description`). |
| `url` | Primary source. Some are Google redirect URLs (`google.com/url?q=…`); the real target is the `q` parameter. |
| `resources[]` | `{ label?, url }` — statutes, regulator guidance, analysis, sometimes Persona blog posts. |

**Duplicates.** Some EU member-state laws appear twice: once with `country_code: EU, region_code: <member>` and once under the member's own code (e.g. France's SREN Law, Italy's Legge 132/2025). De-duplicate by `name` when counting.

## `GET /api/countries`

`{ count, countries[] }` — one row per jurisdiction with national laws (66): `code`, `name`, `hasLaw`, `hasRegionalLaws`, `legislationCount` (national only), `legislationStatuses[]`, `legislationTagCounts` (topic → count), `perRegionLegislationTagCounts` (region → topic → count).

## `GET /api/states`

`{ count, states[] }` — the 50 US states plus DC: `code`, `name`, `hasLaw`, `status` (`active`, `none`, …), `targetAges[]` (e.g. `"<16"`, `"<18"`).

## `GET /api/digital-ids/regions` and `/api/digital-ids/regions/{CC}`

All: `{ count, regions[] }` (99 countries, 154 schemes). One country: a single region object (`CC` case-insensitive). Region: `code`, `name`, `lastUpdated` (`YYYY-MM`), `digitalIds[]`:

| Field | Notes |
|---|---|
| `name`, `idType`, `issuingAuthority` | e.g. "France Identité", "National eID + EUDI Wallet", "Government". |
| `levelOfAssurance` | e.g. "eIDAS Substantial, eIDAS High", "National Standard". |
| `countryStatus` | Rollout in the country: "GA (early adoption)", "In Development", … |
| `launchDate`, `estimatedCoverage` | Free text, often missing. |
| `fieldsReturned[]` | Attributes the scheme can share (First Name, Date of Birth, Portrait…). |
| `useCases[]` | IDV, Government Services, Age Assurance, Digital Signing… |
| `eudiWalletStatus` | EU Digital Identity Wallet readiness, where tracked (31): Announced, Sandbox available, Repo only, Existing app — upgrade confirmed / unconfirmed. |
| `summary` | Description of the scheme. |
| `regulatoryContext[]` | `{ category (AML, Other…), summary, effectiveDate, source }` — regulation that drives adoption (e.g. eIDAS 2.0). |
| `officialDocUrl` | Scheme's official site. |

## Other paths seen

- `/data/dots-330.json`, `/data/region-render.json` (16 MB) — map geometry, not regulatory data.
- `/api/intake` — the site's submission form endpoint. Do not call it.
- `robots.txt` carries Cloudflare's content-signal preamble with no signals set (as of 2026-10-17).
