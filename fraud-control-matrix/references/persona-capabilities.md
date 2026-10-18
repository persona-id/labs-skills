# Persona capabilities

> Source: Persona Research, Identity Fraud Control Matrix — snapshot of https://labs.withpersona.com/fraud-controls as of October 2026. Generated from `data/matrix.json`.

The register maps product-level Persona capabilities onto the abstract controls and the techniques they bear on. `Ref` is the capability's machine name, API identifier or documented option name, where it has one. Doc links go to Persona's public help center and API docs.

239 capabilities in 6 registers.

## Verification checks (`check`)

*The per-submission checks that decide whether a verification passes.* Each check is configured as required or non-required per template, so the same check contributes differently in two deployments. Results are Passed, Failed, or Not Applicable.

Docs: [Verification checks](https://docs.withpersona.com/verification-checks), [Verification types](https://docs.withpersona.com/verification-types), [Verifications](https://docs.withpersona.com/verifications), [Checks that improve other checks](https://help.withpersona.com/articles/1r1p4vM8O6uJXbJw1hO8WP/), [Legacy verification checks](https://docs.withpersona.com/legacy-verification-checks)

### Government ID

Docs: [Government ID Verification](https://help.withpersona.com/articles/5vXD7S7pQCq8Q9Z4RztxLw/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K01 | Government ID | `id_entity_detection` | C11 | T2006 T4003 | Detects whether the submission contains a government ID at all. |
| K02 | Extracted properties | `id_extracted_properties_detection` | C11 | T2006 T5001 | Detects whether the ID details the template requires were successfully extracted. |
| K03 | Extraction inconsistency | `id_extraction_inconsistency_detection` | C11 C12 | T5002 T5001 | Detects disagreement between details read from the front of the ID and details read from the barcode. |
| K04 | Barcode inconsistency | `id_barcode_inconsistency_detection` | C12 | T5001 T5002 | Detects inconsistencies in the barcode carried on the ID. |
| K05 | MRZ inconsistency | `id_mrz_inconsistency_detection` | C12 | T5001 T5002 | Detects whether the machine-readable zone is well formed for the document type. |
| K06 | ID number format inconsistency | `id_number_format_inconsistency_detection` | C12 | T5001 | Detects whether the identification number is well formed for its issuing authority. |
| K07 | Valid dates | `id_valid_dates_detection` | C11 | T5001 T5002 | Detects dates that violate the issuing authority’s own rules, such as a layout retired before its stated issue date. |
| K08 | Fabrication | `id_fabrication_detection` | C11 | T5001 | Detects IDs likely to be fabricated based on format and design, including camouflage passports. |
| K09 | ID image tampering | `id_tamper_detection` | C11 | T5002 T2006 | Detects submissions altered in a photo editor. |
| K10 | ID physical tampering | `id_physical_tamper_detection` | C11 | T5002 | Detects physical alteration of the document itself, which leaves different traces than digital editing. |
| K11 | Colour | `id_color_inconsistency_detection` | C11 | T5001 T2006 | Detects colours on the ID that differ from those expected for the document type. |
| K12 | Paper detection | `id_paper_detection` | C11 C16 | T2006 | Detects a paper copy presented in place of the physical document. |
| K13 | Electronic replica | `id_electronic_replica_detection` | C16 C11 | T2006 T2002 | Detects a document replayed from another screen or device rather than presented physically. |
| K14 | Double side | `id_double_side_detection` | C11 | T2006 | Detects the same side of an ID submitted as both front and back. |
| K15 | Compromised submission | `id_compromised_detection` | C20 | T5004 T5003 | Detects submissions traceable to a publicly available source, meaning specimens and circulating template images. |
| K16 | Repeat | `id_repeat_detection` | C18 | T4004 T5003 | Detects an ID whose details and portrait match a previously submitted one. |
| K17 | Inconsistent repeat | `id_inconsistent_repeat_detection` | C18 C19 | T4004 T6004 | Detects reuse of an ID image or portrait carrying different identity details, meaning the same document under two identities. |
| K18 | ID-to-selfie comparison | `id_selfie_comparison` | C15 | T5003 T2003 | Compares the portrait on the ID against the selfie. |
| K19 | Portrait age | `id_age_inconsistency_detection` | C11 C15 | T5002 | Detects a mismatch between the age printed on the ID and the age estimated from its portrait. |
| K20 | Public figure | `id_public_figure_detection` | C20 | T5004 | Detects an ID portrait matching a known public figure. |
| K21 | Inquiry comparison | `id_inquiry_comparison` | C11 | T5002 T5005 | Compares ID details such as name and birthdate against what was claimed on the inquiry. |
| K22 | Account comparison | `id_account_comparison` | C22 | T6002 T6003 | Compares ID details against the account they are presented for, which is a reverification rather than a first-inquiry control. |
| K23 | Video quality | `id_video_quality_detection` | C02 C08 | T3003 | Assesses whether captured video meets the quality the downstream analysis needs. |
| K24 | Processable submission | `id_unprocessable_submission_detection` | C01 | T4003 | Detects submissions that cannot be processed, which is the usual result of an upload path with no capture behind it. |
| K25 | Allowed ID type | `id_disallowed_type_detection` | C11 C23 | T5001 | Rejects document types the template does not accept, which retires out-of-circulation layouts as well. |

### Selfie and biometric

Docs: [Selfie Verification](https://help.withpersona.com/articles/1l0WTbR5UsfiggNDPWbnUp/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K26 | Selfie liveness | `selfie_liveness_detection` | C16 | T2001 T2002 T2003 T2004 T2005 | Detects whether the selfie is a live individual rather than a recording, a picture, or another spoof. |
| K27 | Suspicious entity | `selfie_suspicious_entity_detection` | C16 | T2001 T2006 | Detects a government ID held up where a face should be. |
| K28 | Multiple faces | `selfie_multiple_faces_detection` | C16 C15 | T2001 T6001 | Detects different faces across the captured poses. |
| K29 | Pose position | `selfie_pose_detection` | C03 C16 | T2001 T2002 T2004 | Detects whether the face is correctly positioned across every requested pose, which is the response to a capture-time instruction. |
| K30 | Pose repeat | `selfie_pose_repeat_detection` | C03 C16 | T2002 T4002 | Detects poses that are exact repeats of one another, as prepared media tends to be. |
| K31 | Selfie repeat | `selfie_repeat_detection` | C18 C19 | T4004 T6004 | Detects a selfie already on file against a different account. |
| K32 | Selfie-to-ID comparison | `selfie_id_comparison` | C15 | T5003 T2003 T3004 | Compares the selfie against the portrait on the government ID. |
| K33 | Account comparison | `selfie_account_comparison` | C22 C15 | T6002 T6003 | Compares the selfie against the portrait already held for the account. |
| K34 | Face covering | `selfie_face_covering_detection` | C01 C16 | T2003 | Detects a covered face, which suppresses the texture and geometry cues everything else depends on. |
| K35 | Portrait quality | `selfie_portrait_quality_detection` | C01 | T2001 T2003 | Assesses whether the face portrait is clear and in focus; it conditions almost every other selfie check. |
| K36 | Video quality | `selfie_video_quality_detection` | C02 C08 | T3003 T2002 | Assesses selfie video integrity and quality, without which motion and temporal analysis has nothing to read. |
| K37 | Public figure | `selfie_public_figure_detection` | C20 | T5004 T2005 | Detects a selfie matching a known public figure. |

### Document AI

Docs: [Document AI](https://help.withpersona.com/articles/2ipL09vsPcus5OXuOXdeO9/), [Document AI Enhanced](https://help.withpersona.com/articles/77WsxmlXGQNgCfvn3B4cgr/), [Document verifications API](https://docs.withpersona.com/api-reference/verifications/document-verifications)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K38 | Enhanced fraud detection ([doc](https://help.withpersona.com/articles/77WsxmlXGQNgCfvn3B4cgr/)) | `document_enhanced_fraud_detection` | C11 | T5001 T5002 | Aggregates the enhanced document fraud indicators into one result alongside a composite risk score. |
| K39 | Synthetic content detection | `document_synthetic_content_detection` | C11 | T5001 T5004 | Detects placeholder entities and mock details of the kind that appear on demonstration and test documents. |
| K40 | Template detection | `document_template_detection` | C11 C20 | T5001 T5004 | Detects a document built from a fraudulent template circulating online. |
| K41 | Copy-move detection | `document_image_copy_move_detection` | C11 | T5002 | Detects evidence of copy-move forgery, where a region of the document has been duplicated over another. |
| K42 | Image suspicious metadata | `document_image_suspicious_metadata_detection` | C07 C11 | T5002 T4003 | Detects irregular or post-hoc modification timestamps on a submitted image. |
| K43 | JPEG original image detection | `document_jpeg_original_image_detection` | C07 C11 | T5002 | Detects JPEG compression inconsistencies that indicate the image was modified after capture. |
| K44 | PDF editor detection | `document_pdf_editor_detection` | C11 | T5002 T5001 | Detects traces of a document editor in a submitted PDF. |
| K45 | PDF abnormal font detection | `document_pdf_abnormal_font_detection` | C11 | T5002 | Detects fonts that are outliers relative to the rest of the document, a common sign an editor was used. |
| K46 | Recency | `document_recency_detection` | C11 | T5003 | Detects whether the document is recent enough for the use case, which an old but genuine document is not. |
| K47 | Document selfie comparison | `document_selfie_comparison` | C15 | T5003 | Compares a portrait carried on a supporting document against the selfie. |

### Chip, NFC, and digital credential

Docs: [Collecting passports and other IDs using NFC](https://help.withpersona.com/articles/1iu1Fak8y9RiOE2FddXrHJ/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K48 | PKI validation | `id_nfc_pki_failure_detection` | C13 | T5001 T5002 | Validates the document-signing and certificate-authority chain behind an NFC credential. |
| K49 | Data tampering | `id_nfc_tamper_detection` | C13 | T5002 | Validates chip authentication and the data-group hashes on an ICAO-compliant travel document. |
| K50 | Compromised NFC document | `id_nfc_compromised_detection` | C13 C20 | T5006 T5003 | Detects unambiguous compromise signals: risky-list matches, hash integrity failures, a missing expected CSCA, revoked certificates. |
| K51 | Attribute comparison | `id_nfc_attribute_comparison` | C13 C11 | T5002 | Compares chip-held details such as name and birthdate against what was claimed. |
| K52 | Allowed issuer | `verifiable_credential_allowed_issuer_detection` | C13 | T5001 T5006 | Validates that a verifiable credential was issued by a trusted issuer and, for Persona-issued credentials, that its binding claims match the allowlist. |
| K53 | Credential account comparison | `verifiable_credential_account_comparison` | C13 C22 | T6002 | Compares claims carried in a verifiable credential against the account’s own fields. |
| K54 | SIM verification ([doc](https://help.withpersona.com/articles/5tWkS5L9FJclUINe6kZtz7/)) | `phone_number_silent_network_authentication_sim_verified_detection` | C13 C23 | T6003 T6002 | Confirms the SIM behind a phone number through silent network authentication, without a code the user could forward. |

### Authoritative and database

Docs: [Database Verification](https://help.withpersona.com/articles/7dcdaIsMttmPUZ2ZelRbZD/), [Database verifications API](https://docs.withpersona.com/api-reference/verifications/database-verifications)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K55 | Identity comparison | `database_identity_comparison` | C14 | T5001 T5005 | Detects whether the claimed identity matches a record in an authoritative or issuing database. |
| K56 | 2+2 detection | `database_two_plus_two_detection` | C14 | T5005 T5006 | Requires claimed attributes to corroborate across more than one independent source rather than one. |
| K57 | Alive detection | `database_deceased_detection` | C14 C20 | T5003 T5005 | Detects whether the person on the matched record is living. |
| K58 | Database face comparison | `database_face_comparison` | C15 C14 | T5002 T5003 | Compares the submitted selfie against a portrait held by the database source, which is a reference the presenter does not control. |
| K59 | Inquiry comparison | `database_inquiry_comparison` | C14 | T5005 | Detects inconsistency between attributes on the inquiry and those submitted for lookup. |
| K60 | Deliverable address | `database_address_deliverable_detection` | C14 | T5005 | Detects whether the claimed address is deliverable, which a fabricated one frequently is not. |
| K61 | AAMVA identity comparison ([doc](https://help.withpersona.com/articles/1wiQ7wAhmnKh6mesCGopKl/)) | `aamva_identity_comparison` | C14 | T5001 T5002 | Compares licence attributes against participating US motor-vehicle records. |
| K62 | eCBSV record matched ([doc](https://docs.withpersona.com/api-reference/verifications/ecbsv-database-verifications)) | `database_ecbsv_record_match` | C14 | T5005 | Matches name, birthdate, and social security number against Social Security Administration records. |
| K63 | eCBSV death record ([doc](https://docs.withpersona.com/api-reference/verifications/ecbsv-database-verifications)) | `database_ecbsv_death_record` | C14 C20 | T5005 T5003 | Detects that the matched social security number belongs to a deceased person. |
| K64 | TIN name comparison ([doc](https://help.withpersona.com/articles/2lGG2fqJwUO9ziVAFZNeTG/)) | `database_tin_name_comparison` | C14 | T5005 | Confirms a legal name against IRS taxpayer-identification records. |
| K65 | Serpro face comparison ([doc](https://docs.withpersona.com/api-reference/verifications/serpro-database-verifications)) | `database_serpro_face_comparison` | C15 C14 | T5003 | Compares the submitted face against Brazil’s Serpro records. |
| K66 | Aadhaar face comparison ([doc](https://docs.withpersona.com/api-reference/verifications/retrieve-a-verification)) | `database_aadhaar_face_comparison` | C15 C14 | T5003 | Compares the submitted selfie against the portrait held in the Aadhaar database. |
| K67 | Carrier last name ([doc](https://help.withpersona.com/articles/7nbNgynP75u1YE4pLcV75L/)) | `database_phone_carrier_name_last_comparison` | C14 | T5005 T6003 | Compares the claimed surname against telecommunications-carrier records for the number. |
| K68 | Carrier age threshold ([doc](https://help.withpersona.com/articles/7nbNgynP75u1YE4pLcV75L/)) | `database_phone_carrier_age_threshold_comparison` | C14 | T5005 | Tests carrier-derived age against a configured threshold. |

### Phone and email possession

Docs: [Phone Number Verification](https://help.withpersona.com/articles/5tWkS5L9FJclUINe6kZtz7/), [Email (2FA) Verification](https://help.withpersona.com/articles/2FauPy2tquCwnyeMjtpVly/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K69 | Phone code confirmation | `phone_number_confirmation_code_comparison` | C23 | T6003 T5005 | Confirms possession of the number by comparing the submitted code against the one sent to it. |
| K70 | Phone deliverability | `phone_number_deliverable_detection` | C14 | T5005 | Detects delivery problems for the number, including landlines where a mobile is required. |
| K71 | Email code confirmation | `email_address_confirmation_code_comparison` | C23 | T6003 | Confirms control of the address by comparing the submitted code against the one emailed to it. |
| K72 | Confirmation code timeout | `phone_number_timeout_detection` | C09 C23 | T6003 | Requires the confirmation code to be submitted inside the allotted window, which bounds relay and guessing. |

### Business and brand

Docs: [Business Registry Verification](https://help.withpersona.com/articles/3pkLBWKg5wIQJru7PATxBc/), [Business Website Verification](https://help.withpersona.com/articles/6YMwMNVZpOYO4n6bpUhokY/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| K73 | Business identity comparison | `database_business_identity_comparison` | C14 | T5001 T5005 | Detects whether the claimed business matches a record in an authoritative registry. |
| K74 | Active business detection | `database_business_active_business_detection` | C14 | T5005 | Detects whether the business is legally active rather than dissolved or lapsed. |
| K75 | Associated persons comparison | `database_business_associated_persons_comparison` | C14 C19 | T5005 T6004 | Detects whether the declared officers and owners appear on the authoritative record. |
| K76 | Registered agent address | `database_business_registered_agent_address_detection` | C14 C19 | T5005 T6004 | Detects a submitted business address that is really the registered agent’s, a recurring shell-company pattern. |
| K77 | Business footprint identity comparison ([doc](https://help.withpersona.com/articles/1y9RqYAemIZn2jFK1HlEgS/)) | `database_business_footprint_identity_comparison` | C14 | T5005 | Corroborates a business against commercial and digital-presence data rather than registry data alone. |
| K78 | Domain age detection ([doc](https://help.withpersona.com/articles/6YMwMNVZpOYO4n6bpUhokY/)) | `business_website_domain_age_detection` | C14 | T5005 | Detects a domain too young for the claimed trading history, because tenure is what an adversary cannot create on demand. |
| K79 | Malicious website detection ([doc](https://help.withpersona.com/articles/6YMwMNVZpOYO4n6bpUhokY/)) | `business_website_malicious_website_detection` | C20 | T5005 | Detects whether the business website is malicious. |
| K80 | Website identity comparison ([doc](https://help.withpersona.com/articles/6YMwMNVZpOYO4n6bpUhokY/)) | `business_website_identity_comparison` | C14 | T5005 | Compares information extracted from the business website against what the applicant submitted. |
| K81 | Trademark ownership detection ([doc](https://help.withpersona.com/articles/2idIkprjWl5OBRAb5iOvZ6/)) | `brand_asset_trademark_ownership_detection` | C20 | T5005 | Detects potential trademark conflicts in a submitted brand asset, which is how impersonation of a known brand surfaces. |

## Reports (`report`)

*Lookups against external and authoritative data, run beside a verification.* A report describes a record, not the person in front of the camera. Coverage varies by geography and by how thin the subject file is.

Docs: [Reports](https://docs.withpersona.com/reports), [Create a report](https://docs.withpersona.com/api-reference/reports/create-a-report)

### Identity and contact

Docs: [Create a report](https://docs.withpersona.com/api-reference/reports/create-a-report)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| R01 | Profile Report | `report/profile` | C14 | T5005 T5001 | Matches authoritative identity records and returns names, birthdates, addresses, social security numbers, phones, and emails. |
| R02 | Profile Non-Authoritative Report | `report/profile-non-authoritative` | C14 | T5005 | Returns non-authoritative identity, contact, and address information, useful for corroboration but not for proof. |
| R03 | Phone Risk Report | `report/phone-number` | C14 C17 | T6003 T6002 T5005 | Returns carrier, line type, location, risk score, and SIM-swap risk for a phone number. |
| R04 | Email Address Report | `report/email-address` | C14 C17 | T5005 | Assesses validity, deliverability, domain age, breach exposure, disposability, and reputation for an email address. |
| R05 | Address Lookup Report | `report/address-lookup` | C14 | T5005 | Standardises an address and reports deliverability, vacancy, activity, and addressee matching. |
| R06 | Social Media Report | `report/social-media` | C14 | T5005 | Finds social profiles associated with an individual, which is one way a cultivated identity’s thin history shows. |

### Screening

Docs: [Create a report](https://docs.withpersona.com/api-reference/reports/create-a-report)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| R07 | Watchlist Report | `report/watchlist` | C20 | T5003 T6004 | Screens an individual against configured watchlists and returns the matched lists and entity details. |
| R08 | Politically Exposed Person Report | `report/politically-exposed-person` | C20 | T5003 | Finds politically exposed person matches with positions, associates, affiliations, and sources. |
| R09 | Adverse Media Report | `report/adverse-media` | C20 | T5003 T6004 | Finds media associated with an individual and returns sources, names, countries, and match types. |
| R10 | Crypto Address Watchlist Report | `report/crypto-address-watchlist` | C20 | T6004 | Screens a cryptocurrency wallet address for watchlist matches. |

### Fraud scoring

Docs: [Create a report](https://docs.withpersona.com/api-reference/reports/create-a-report)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| R11 | Synthetic Report | `report/synthetic` | C14 C19 | T5005 T6001 | Returns abuse, first-party synthetic, and third-party synthetic identity scores. |
| R12 | SentiLink Scores Report | `report/integration/sentilink-scores` | C20 C14 | T5005 | Returns third-party score names, values, versions, and reason codes for the application. |

### Business

Docs: [Create a report](https://docs.withpersona.com/api-reference/reports/create-a-report)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| R13 | Business Lookup Report ([doc](https://docs.withpersona.com/business-lookup-report)) | `report/business-lookup` | C14 | T5005 | Retrieves registered-entity details, identifiers, status, addresses, officers, and registration authority data. |
| R14 | Business Registrations Lookup Report | `report/business-registrations-lookup` | C14 | T5005 | Returns formation details and registry records, including registration numbers, authorities, and statuses. |
| R15 | Business Associated Persons Report | `report/business-associated-persons` | C14 C19 | T5005 T6004 | Returns associated people, positions, owners, and ownership roles for a business. |
| R16 | Business Watchlist Report | `report/business-watchlist` | C20 | T5005 T6004 | Screens a business against configured sanctions, warning, fitness, and probity lists. |
| R17 | Business Adverse Media Report | `report/business-adverse-media` | C20 | T5005 | Finds adverse-media sources associated with a business search term. |

## Signals (`signal`)

*Environment, behaviour, and population measurements exposed per inquiry.* Signals are evidence, not decisions. Most are individually weak and only become diagnostic in convergence, which is why they are exposed as values rather than as verdicts.

Docs: [Inquiry signals](https://docs.withpersona.com/inquiry-signals), [Signals overview](https://help.withpersona.com/articles/3aYYkI9NMDsyVqx5V3IT3G/), [Interpreting signals](https://help.withpersona.com/articles/59xyT8o5Did16ovuqSIUDj/), [How to use signals](https://help.withpersona.com/articles/O9RVEgZvOTj2D47FGJJSb/)

### Network and origin

Docs: [Inquiry signals](https://docs.withpersona.com/inquiry-signals)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| S01 | VPN detected | `inquiry/vpn-detected` | C17 | T1005 | Whether any inquiry session was conducted through a VPN. |
| S02 | Proxy detected | `inquiry/proxy-detected` | C17 | T1005 | Whether any session ran through a proxy or other anonymising network. |
| S03 | Tor detected | `inquiry/tor-detected` | C17 | T1005 | Whether any session was detected using Tor. |
| S04 | Network threat level | `inquiry/threat-level` | C17 | T1005 T1006 | Network risk scored from IP metadata, reported low, medium, or high. |
| S05 | Risk level | `inquiry/risk-level` | C17 C18 | T1006 T6004 | Risk from the volume of recent activity observed on the IP address. |
| S06 | IP burst | `inquiry/ip-burst` | C18 C19 | T6004 T1006 | How many other completed inquiries share the same IP address inside a two-hour window. |
| S07 | IP connection types | `inquiry/ip-connection-types` | C17 | T1005 | Connection types across sessions, such as residential, corporate, and mobile, which is how residential proxying tends to show. |
| S08 | IP prefix /24 | `inquiry/ip-prefix24` | C19 C18 | T6004 | The /24 network prefix of the most recent session address, which groups attempts a single address would not. |
| S09 | Session ASNs | `inquiry/session-asns` | C17 C19 | T1005 T6004 | Autonomous system numbers collected from session IP addresses, which identify hosting and proxy infrastructure. |
| S10 | Country comparison | `inquiry/country-comparison` | C17 | T1005 T5005 | Whether every session occurred in the same country as the address stated on the inquiry. |
| S11 | Impossible travel geolocation | `inquiry/gps-impossible-travel` | C17 C19 | T6004 T1005 | Probability that two session locations are too far apart to have been travelled between in the elapsed time. |
| S12 | Geolocation language mismatch | `inquiry/gps-language-mismatch` | C17 | T1005 T6001 | Whether the locale chosen in the last session disagrees with the country inferred from session location. |
| S13 | TLS certificate fingerprint | `inquiry/tls-cert-fingerprint` | C10 | T4001 | Fingerprint of the TLS certificate the client observed, which surfaces interception between client and service. |

### Device and app integrity

Docs: [Inquiry signals](https://docs.withpersona.com/inquiry-signals)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| S14 | Rooted device detected | `inquiry/rooted-device-detected` | C06 | T1002 T3002 | Whether the user holds root access on the device used for verification. |
| S15 | Device or app tampering | `inquiry/device-or-app-tampering` | C06 | T1003 T1004 T3002 | Whether technologies used to modify the app, SDK, or operating system were detected in any session. |
| S16 | Apple app attestation | `inquiry/apple-app-attestation` | C04 | T1003 T3002 | Verifies iOS app integrity, flagging requests that come from a suspicious app version. |
| S17 | Google Play Integrity | `inquiry/google-play-integrity` | C04 | T1003 T1002 | Verifies Android app integrity and reports the highest device integrity level across sessions. |
| S18 | Bundle names | `inquiry/bundle-names` | C04 C06 | T1003 | Application bundle identifiers seen across sessions, flagged as anomalous where the template pins one. |
| S19 | User agent spoof attempts | `inquiry/user-agent-spoof-attempts` | C06 C07 | T1006 T1001 | Count of sessions whose device or browser information was masked, altered, or falsified. |
| S20 | Request spoof attempts | `inquiry/request-spoof-attempts` | C06 C10 | T4001 T1004 | Count of requests showing tampering or manipulation across all sessions. |
| S21 | Mismatched user agent count | `inquiry/mismatched-user-agent-count` | C09 | T4002 | Distinct user agents differing from the original session’s, where a non-zero value suggests the session token moved devices. |
| S22 | Curl request detected | `inquiry/curl-request-detected` | C06 | T1006 | Whether a device that accessed the inquiry looks like a command-line HTTP client rather than a browser. |
| S23 | Incognito browsing detected | `inquiry/incognito-browsing-detected` | C17 | T1006 | Whether any browser used in the inquiry was in private browsing mode. |
| S24 | Devtools open | `inquiry/devtools-open` | C06 | T1004 T1006 | Whether browser developer tools were open during the flow. |
| S25 | Unrecognised referer | `inquiry/unrecognized-referer` | C09 | T4002 T4001 | Whether a session arrived from a referer outside the domains allowed on the template. |

### Capture path

Docs: [Inquiry signals](https://docs.withpersona.com/inquiry-signals)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| S26 | Virtual camera risk level | `inquiry/virtual-camera-risk-level` | C05 | T3001 T3004 T3005 | Likelihood a virtual camera supplied pre-recorded or generated media during selfie or document capture. |
| S27 | Virtual camera detected | `verification/any-virtual-camera-detected` | C05 | T3001 T3002 | Whether any virtual-camera indication was raised during the verification. |
| S28 | Any uploaded | `verification/any-uploaded` | C01 C05 | T4003 T2006 | Whether any image was uploaded as a file rather than captured through a live camera. |
| S29 | Camera count | `verification/camera-count` | C05 | T3001 | Total cameras the device reported during capture, which is how an added virtual source surfaces. |
| S30 | All camera labels | `verification/all-camera-labels` | C05 | T3001 T3003 | Device labels of every camera enumerated during the capture sequence. |
| S31 | Camera frame rate | `verification/camera-frame-rate` | C08 C07 | T3003 T3001 | Frames per second of the selected camera, which injected media frequently reports implausibly. |
| S32 | Camera facing mode | `verification/camera-facing-mode` | C05 C07 | T3001 | Which way the camera used for capture was facing. |
| S33 | Gyroscope factor | `verification/gyroscope-factor` | C07 C08 | T3001 T3003 | Average gyroscope movement during capture, because a real handheld capture is never perfectly still. |
| S34 | First image dimensions | `verification/first-image-dimensions` | C07 | T3001 T4003 | Pixel dimensions of the first captured image, checked for consistency with the claimed device. |
| S35 | Device name missing | `verification/device-name-missing` | C07 | T4003 T1001 | Whether the session has no device name, which can indicate the verification did not come from a real device. |
| S36 | Max selfie liveness risk level | `inquiry/selfie-liveness-risk-level` | C16 | T2002 T2005 T3004 | Highest liveness risk across the inquiry’s verifications, signalling media that may be fake, altered, or generated. |

### Behaviour and session

Docs: [Signals overview](https://help.withpersona.com/articles/3aYYkI9NMDsyVqx5V3IT3G/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| S37 | Bot score | `inquiry/bot-score` | C17 | T1006 | Score from 0 to 100 for the likelihood the inquiry was submitted by a bot. |
| S38 | Behaviour threat level | `inquiry/behavior-threat-level` | C17 | T1006 T6001 | Behaviour risk summarised from network, device, and user-behaviour evidence. |
| S39 | Behaviour anomaly | `inquiry/behavior-anomaly` | C18 C19 | T6004 | Unsupervised modelling that flags groups of inquiries anomalous at population level rather than individually. |
| S40 | Session count | `inquiry/session-count` | C09 C18 | T4002 T6001 | How many sessions were started before the inquiry completed; three or more can mean several devices. |
| S41 | Sessions geolocation delta | `inquiry/sessions-geolocation-delta` | C17 C09 | T6001 T4002 | Largest distance between two session locations on the same inquiry. |
| S42 | Time to complete | `verification/time-to-complete` | C08 | T1006 | Seconds between verification creation and submission; very short durations suggest automated submission. |
| S43 | Shortcut pastes | `inquiry/shortcut-pastes` | C17 | T5005 T6001 | Count of keyboard paste events across sessions, which is how a supplied identity dossier is usually entered. |
| S44 | Distraction events | `inquiry/distraction-events` | C17 | T6001 | How many times the user left the flow window during the inquiry. |
| S45 | Hesitation ratio | `inquiry/hesitation-ratio` | C17 | T6001 | Share of total flow time in which the user made no input. |
| S46 | Off-hours session | `inquiry/off-hours-session` | C17 | T6004 | Local start time of the latest session, converted using the timezone inferred from IP geolocation. |
| S47 | Reusable persona used | `inquiry/reusable-persona-used` | C22 | T6002 | Whether the end user authenticated into an existing persona rather than establishing a new one. |

### Population and repetition

Docs: [Inquiry signals](https://docs.withpersona.com/inquiry-signals)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| S48 | Selfie visual cluster score | `verification/selfie-visual-cluster-v2-score` | C18 C19 | T4004 T6004 T2005 | How visually similar the submitted selfie is to selfies already on file. |
| S49 | Selfie visual cluster size | `verification/selfie-visual-cluster-v2-size` | C18 C19 | T4004 T6004 | How many other selfies on file look visually identical to this one. |
| S50 | ID vision cluster score | `verification/id-visual-cluster-v2-score` | C18 C20 | T5001 T5004 T6004 | How closely the submitted ID resembles other IDs seen with the same layout. |
| S51 | ID vision cluster size | `verification/id-visual-cluster-v2-size` | C18 C19 | T5004 T6004 | How many IDs on file look visually identical to this one, which is the signature of one template used at volume. |
| S52 | Government ID inconsistent repeat count | `inquiry/government-id-inconsistent-repeat-mismatch-count` | C18 | T4004 | How many mismatches the inconsistent-repeat check found for the document. |
| S53 | IP impossible travel | `verification/ip-impossible-travel` | C19 C17 | T6004 T6001 | Risk that activity linked to the matched identity occurred in places too far apart for the elapsed time. |
| S54 | Devices count | `verification/devices-count` | C19 C18 | T6004 T6001 | How many distinct devices are linked to the matched identity. |
| S55 | First seen days ago | `verification/first-seen-days-ago` | C19 C14 | T5005 | Days since the earliest recorded activity for the matched identity, which is tenure a cultivated identity has to buy. |
| S56 | Public figure name detected | `verification/public-figure-name-detected` | C20 | T5004 | Whether the verification’s full name exactly matches a known public figure. |
| S57 | Address street entropy | `verification/address-street-entropy` | C11 C14 | T5001 T5005 | Entropy of the street address on an ID; repeating or sequential digits suggest a fabricated address. |

### Account lifecycle

Docs: [Inquiry signals](https://docs.withpersona.com/inquiry-signals)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| S58 | Inquiry velocity | `account/inquiry-velocity` | C18 C22 | T1006 T6004 | Inquiries created on the account inside a configured window; high velocity suggests automated abuse. |
| S59 | Failed inquiries count | `account/failed-inquiries-count` | C18 C22 | T1006 | How many inquiries on the account were declined, which is how boundary-probing shows. |
| S60 | Device count | `account/device-count` | C22 C19 | T6002 T6001 | How many distinct devices are associated with the account. |
| S61 | Address update count | `account/address-update-count` | C22 | T6002 T6003 | How many times account address fields changed inside a configured window. |
| S62 | List match count | `account/list-match-count` | C20 C22 | T6004 | Watchlist, sanctions, and block-list matches associated directly with the account. |
| S63 | New mobile device used during reverification | `inquiry/new-mobile-device-used-during-reverification` | C22 C17 | T6002 T6003 | Whether a device in this inquiry has not appeared in the account’s five most recent completed inquiries. |

## Graph (`graph`)

*Relationships between accounts and the properties they share.* Graph identifies relationships, not culpability. The first account in a cluster has no cluster to belong to yet.

Docs: [Graph](https://docs.withpersona.com/graph), [Graph glossary](https://help.withpersona.com/articles/mDyQ4BlICWkXzVyUQyFwo/), [Graph query reference](https://help.withpersona.com/articles/2dlG9Q9liRn43wUIxHntRT/)

### Property nodes

Docs: [Graph query reference](https://help.withpersona.com/articles/2dlG9Q9liRn43wUIxHntRT/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| G01 | Device fingerprint |  | C19 C17 | T6004 T4004 | Any device fingerprint collected during one of the account’s inquiries. |
| G02 | Browser fingerprint |  | C19 C17 | T6004 T1006 | Any browser fingerprint collected during one of the account’s inquiries. |
| G03 | IP address |  | C19 C17 | T6004 T1005 | Any IP address used while completing one of the account’s inquiries. |
| G04 | Government ID number |  | C19 C18 | T4004 T5003 T6004 | Any ID number read from a government ID collected during an account inquiry. |
| G05 | Social security number |  | C19 C14 | T5005 T6004 | Any social security number collected during one of the account’s inquiries. |
| G06 | Phone number |  | C19 | T6004 T6003 | Any phone number collected during one of the account’s inquiries. |
| G07 | Email address |  | C19 | T6004 | Any email address collected during one of the account’s inquiries. |
| G08 | Address |  | C19 C14 | T6004 T5005 | Any primary address associated with the account’s inquiries, normalised and validated before it enters Graph. |
| G09 | Name |  | C19 | T6004 | The account’s full name. |
| G10 | Birthdate |  | C19 | T5005 T6004 | The account’s birthdate. |

### Structure and traversal

Docs: [Graph glossary](https://help.withpersona.com/articles/mDyQ4BlICWkXzVyUQyFwo/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| G11 | Linked via |  | C19 | T6004 T4004 | An edge joining two account nodes that share a property, which is the structure a ring produces and a single attempt cannot. |
| G12 | Linked to |  | C19 | T6004 | An edge joining an account node to a property node the account has. |
| G13 | Cluster |  | C19 C18 | T6004 | A group of account nodes all linked to the same property node, which is the star pattern that can be blocked at its hub. |
| G14 | Cluster size |  | C19 C18 | T6004 | The number of nodes in a cluster, which is what separates a household from a ring. |
| G15 | Hops |  | C19 | T6004 | Distance from a connected node to a starting node, counted in edges; a chain needs more hops than a star. |
| G16 | Starting nodes |  | C19 | T6004 | The initial accounts of interest in a query, which is the seed set the traversal expands from. |

### Query surfaces

Docs: [Graph Explorer interface](https://help.withpersona.com/articles/7DbcO4qiCbn4aY0Oc5iO8W/), [Running graph queries](https://docs.withpersona.com/running-graph-queries), [Graph query templates](https://docs.withpersona.com/graph-query-templates)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| G17 | Graph Explorer ([doc](https://help.withpersona.com/articles/7DbcO4qiCbn4aY0Oc5iO8W/)) |  | C19 C21 | T6004 T6001 | The visual interface for running a query and exploring its results on the canvas. |
| G18 | Query ([doc](https://docs.withpersona.com/running-graph-queries)) |  | C19 | T6004 | A search defining which accounts to surface, specified by at least one property and value. |
| G19 | Query template ([doc](https://docs.withpersona.com/graph-query-templates)) |  | C19 C22 | T6004 | A preconfigured query saved for reuse, which is how a confirmed ring pattern becomes a standing check. |
| G20 | Maximum hops ([doc](https://docs.withpersona.com/running-graph-queries)) |  | C19 | T6004 | The furthest edge distance a connected account may sit from a starting node, which bounds the traversal. |

## Marketplace integrations (`marketplace`)

*Third-party services called from a workflow.* Listed here is the fraud- and identity-relevant subset of the catalogue. Marketplace integrations are available to Enterprise and managed Growth customers, and each carries its own coverage and contract.

Docs: [Marketplace and third-party integrations](https://help.withpersona.com/marketplace-and-3rd-party-integrations/), [Using Marketplace integrations](https://help.withpersona.com/articles/6YaRAGHHcXb6MQ0c6CGvbJ/)

### Identity and contact intelligence

Docs: [Marketplace and third-party integrations](https://help.withpersona.com/marketplace-and-3rd-party-integrations/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| M01 | LexisNexis InstantID ([doc](https://help.withpersona.com/articles/2IR16yImBHyc2D5ayvs87C/)) |  | C14 | T5005 T5001 | Retrieves identity information to corroborate a claimed identity and strengthen fraud detection. |
| M02 | Prove ([doc](https://help.withpersona.com/articles/rzENHOKhBM9MGjCAYdMqe/)) |  | C14 C23 | T6003 T5005 | Adds phone-centric identity and possession signals to a workflow. |
| M03 | AtData ([doc](https://help.withpersona.com/articles/11HL0QKjwst0cno05JDbrW/)) |  | C14 C17 | T5005 | Enriches an email identity with deliverability, activity, and fraud-risk signals. |
| M04 | Clearbit ([doc](https://help.withpersona.com/articles/oFXiN9UhYPJ8QACppAds0/)) |  | C14 | T5005 | Enriches people and companies from an email address or domain. |
| M05 | FullContact ([doc](https://help.withpersona.com/articles/vH4zT2kN9mQ7pL6xR3cB8s/)) |  | C14 | T5005 | Enriches an identity profile with person and contact information. |
| M06 | MX ([doc](https://help.withpersona.com/articles/3ypIdJ9UFqWt44nlyKF3WZ/)) |  | C14 | T5005 T6001 | Verifies a bank account and compares the account-holder name against the claimed identity. |
| M07 | VerifyMy ([doc](https://help.withpersona.com/articles/4jQlPiE68KcLjNTLox1tsc/)) |  | C14 C23 | T5005 | Adds age-assurance and identity-verification capability to a workflow. |

### Fraud and credit scoring

Docs: [Marketplace and third-party integrations](https://help.withpersona.com/marketplace-and-3rd-party-integrations/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| M08 | SentiLink ([doc](https://help.withpersona.com/articles/2aYEhpHKbRvd2GWieHIbkv/)) |  | C20 C14 | T5005 T6001 | Returns synthetic-identity, identity-theft, and first-party fraud risk scores. |
| M09 | Mastercard Identity ([doc](https://help.withpersona.com/articles/4SFGm3QeBmV8b67i790uW7/)) |  | C20 C17 | T5005 T1005 | Returns identity, network, and IP risk scores from submitted identity signals. |
| M10 | CRS Credit ([doc](https://help.withpersona.com/articles/hViKfl505UuxUG9rcTGZO/)) |  | C14 | T5005 | Retrieves credit and identity data for verification and risk decisions. |
| M11 | Nova Credit ([doc](https://help.withpersona.com/articles/4ii9GelrUPReTcOQERMH8f/)) |  | C14 C24 | T5005 | Retrieves cross-border credit data, which reaches recent arrivals a domestic file does not cover. |
| M12 | PhotoDNA ([doc](https://help.withpersona.com/articles/1GLwOKRvCzuaphwwUD0E7s/)) |  | C20 | T5004 | Detects known harmful imagery by comparing image hashes against PhotoDNA data. |

### Crypto and financial crime

Docs: [Marketplace and third-party integrations](https://help.withpersona.com/marketplace-and-3rd-party-integrations/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| M13 | Chainalysis ([doc](https://help.withpersona.com/articles/7ykrjzOJl668pf6QFThNWH/)) |  | C20 C22 | T6004 T6001 | Screens cryptocurrency addresses and transactions for risk from inside a workflow. |
| M14 | TRM Labs ([doc](https://help.withpersona.com/articles/5yal3xQnhclQIsXxWYVBR7/)) |  | C20 C22 | T6004 | Screens cryptocurrency wallets and transactions for financial-crime risk. |
| M15 | Notabene ([doc](https://help.withpersona.com/articles/6KcpCwgRpYu6DW6PynmvkI/)) |  | C22 | T6004 | Supports Travel Rule compliance by exchanging counterparty information for a transfer. |

### Workforce and access

Docs: [Marketplace and third-party integrations](https://help.withpersona.com/marketplace-and-3rd-party-integrations/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| M16 | Okta ([doc](https://help.withpersona.com/articles/4w8cDQLPuaPAadq4LzhO40/)) |  | C23 C22 | T6002 T6003 | Triggers workforce verification, retrieves user data, and automates account actions in identity management. |
| M17 | Microsoft Entra ([doc](https://help.withpersona.com/articles/76oPGnRkduS3sHbEpLNSku/)) |  | C23 C22 | T6002 T6003 | Adds employee profile data and identity verification to access-management workflows. |
| M18 | Cisco Duo ([doc](https://help.withpersona.com/articles/3X6a18zEROUh8In5Oeo23O/)) |  | C23 C21 | T6003 | Verifies workforce identity during helpdesk interactions and remote employee onboarding. |
| M19 | Auth0 ([doc](https://help.withpersona.com/articles/22gZwB4z1ZFdAfFVwiP2P5/)) |  | C22 C17 | T6002 | Retrieves user profiles, verified contacts, login activity, and identities for an access decision. |
| M20 | Stytch ([doc](https://help.withpersona.com/articles/6sFPzB8Ud8AVR9WsuvQM4c/)) |  | C22 | T6002 | Retrieves authentication profiles, verified contacts, OAuth identities, and passkey registrations. |
| M21 | Yardstik ([doc](https://help.withpersona.com/articles/2cvnPIzAcuxukLQE3UsMw9/)) |  | C20 C21 | T6001 | Connects workforce background-screening information to a Persona workflow. |

### Review operations

Docs: [Marketplace and third-party integrations](https://help.withpersona.com/marketplace-and-3rd-party-integrations/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| M22 | Twilio ([doc](https://help.withpersona.com/articles/2iPLwfpHPTg8kYnvLjVubA/)) |  | C14 C23 | T6003 | Retrieves SMS, messaging, and account data for use inside a workflow. |
| M23 | Slack ([doc](https://help.withpersona.com/articles/7FlnOvBKFu6k7sunbzQH0K/)) |  | C21 C22 | T6004 | Sends targeted identity-event alerts to a channel or an individual reviewer. |
| M24 | Shopify ([doc](https://help.withpersona.com/articles/6aE5mm1xjsPkhPpoaujzVq/)) |  | C22 | T6002 T6001 | Pushes Persona identity signals into order-risk assessment. |
| M25 | Anthropic ([doc](https://help.withpersona.com/articles/4ItMteIsKhrKaEyBIg76l8/)) |  | C21 | T6004 | Generates summaries and decision support for a reviewer from workflow data. |
| M26 | OpenAI ([doc](https://help.withpersona.com/articles/47mo9PsRf2qgP95wFk1NVQ/)) |  | C21 | T6004 | Generates text from workflow data through an action step. |

## Inquiry configuration (`config`)

*Template and integration settings that move the attack surface.* These are the choices a customer makes, not capabilities Persona applies on their behalf. Several of them decide whether an entire signal family exists at all.

Docs: [Inquiry templates](https://docs.withpersona.com/inquiry-templates), [Choosing an integration method](https://docs.withpersona.com/choosing-an-integration-method)

### Capture

Docs: [Capture methods](https://help.withpersona.com/articles/7JQ78WDWLj5L63qXEu7AqJ/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| X01 | Capture methods | `Capture Methods` | C01 C05 | T4003 T2006 | Chooses, per device type, whether the user may capture a new photo or upload an existing image. |
| X02 | Capture a new photo | `capture a new photo` | C01 C02 | T4003 T2006 | Restricting to live camera capture is what produces motion, behavioural, device, and real-time metadata at all. |
| X03 | Upload an existing image | `upload an existing image` | C01 | T4003 T5002 | Permitting file upload admits images that can be reused, shared, spoofed, or edited before submission. |
| X04 | Selfie poses: centre, left, and right ([doc](https://help.withpersona.com/articles/1l0WTbR5UsfiggNDPWbnUp/)) | `Images of individual selfie poses looking center, left, and right` | C03 C16 | T2001 T2002 T2004 | Collects the default three poses, which is what liveness and three-point comparison read. |
| X05 | Centre-only checks ([doc](https://help.withpersona.com/articles/1l0WTbR5UsfiggNDPWbnUp/)) | `center-only checks` | C03 | T2001 T2002 | Using the centre-facing selfie alone removes the pose challenge and the parallax it produces. |
| X06 | NFC verification ([doc](https://help.withpersona.com/articles/1iu1Fak8y9RiOE2FddXrHJ/)) | `NFC Verification` | C13 | T5001 T5002 | Reads the chip on ICAO-compliant passports and supported identity documents through a mobile SDK integration. |

### Integration model

Docs: [Choosing an integration method](https://docs.withpersona.com/choosing-an-integration-method), [Creating inquiries](https://docs.withpersona.com/creating-inquiries), [Prevent multiple inquiries](https://docs.withpersona.com/prevent-users-from-creating-multiple-inquiries)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| X07 | Mobile SDK | `Mobile SDK` | C04 C01 | T1003 T3002 | A native integration, and the only model in which platform attestation is available at all. |
| X08 | Hosted Flow ([doc](https://docs.withpersona.com/hosted-flow)) | `Hosted Flow` | C01 | T1006 | Redirects the user to a Persona-hosted verification page. |
| X09 | Embedded Flow ([doc](https://docs.withpersona.com/embedded-flow)) | `Embedded Flow` | C01 | T1006 | Embeds the Persona interface in a website iframe; template-generated inquiries can duplicate on reload. |
| X10 | Transactions-based integration | `Transactions-based integration` | C09 | T4003 | Uses the customer’s own capture interface, which is the configuration that removes capture context entirely. |
| X11 | Create inquiries via API ([doc](https://docs.withpersona.com/creating-inquiries)) | `Creating inquiries via API` | C09 C18 | T1006 T4002 | Creating server-side prevents arbitrary mass creation and supports immutable prefilled fields. |
| X12 | Block client-side inquiry creation ([doc](https://docs.withpersona.com/creating-inquiries)) | `Block client-side Inquiry creation` | C09 C18 | T1006 | Disables client-side creation for a template, so an adversary cannot open unlimited attempts. |
| X13 | Reference ID ([doc](https://docs.withpersona.com/reference-ids)) | `Reference ID` | C18 C19 | T4004 T6004 | Associates every inquiry for one user with the same account, which is what makes repeat detection possible. |

### Links, sessions, and expiry

Docs: [Inquiry one-time links](https://docs.withpersona.com/inquiry-one-time-links), [Inquiry expiration](https://docs.withpersona.com/inquiry-expiration), [Inquiry sessions](https://docs.withpersona.com/inquiry-sessions)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| X14 | Inquiry one-time links ([doc](https://docs.withpersona.com/inquiry-one-time-links)) | `Inquiry One-Time Links (OTL)` | C09 | T4002 | Grants single-use access to resume an inquiry, rather than a reusable link anyone holding it can open. |
| X15 | Inquiry session limit ([doc](https://docs.withpersona.com/inquiry-sessions)) | `Inquiry Session Limit` | C09 C18 | T4002 T6001 | Caps how many sessions one inquiry may open, 25 by default, which bounds a captured link passed between devices. |
| X16 | Expiration from inquiry pending ([doc](https://docs.withpersona.com/inquiry-expiration)) | `meta.expiration_after_start_interval_seconds` | C09 | T4002 | Shortens the window a started inquiry stays open, limiting how long a leaked link remains usable. |
| X17 | One-time link expiry ([doc](https://docs.withpersona.com/inquiry-expiration)) | `meta.one_time_link_expiration_seconds` | C09 | T4002 | Sets how long an authenticated access link stays valid. |
| X18 | Device handoff link ([doc](https://docs.withpersona.com/inquiry-expiration)) | `Device Handoff Link` | C09 | T4002 T6001 | Sets expiry for links that move an inquiry between devices, which should be as short as the use case tolerates. |

### Check policy and geography

Docs: [Verification checks](https://docs.withpersona.com/verification-checks), [Country select options](https://help.withpersona.com/articles/4KMGvVHubf36mLfciUX6Nh/)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| X19 | Required checks | `required` | C23 | T5001 T2002 | A required check must pass for the verification to pass; the same check set behaves differently once it is non-required. |
| X20 | Non-required checks | `non-required` | C23 C21 | T5001 | Records a check as context without failing the verification on it, useful while calibrating but risky as a resting state. |
| X21 | Acceptable countries ([doc](https://help.withpersona.com/articles/5vXD7S7pQCq8Q9Z4RztxLw/)) | `acceptable countries` | C11 | T5001 | Restricts government ID verification to selected issuing countries. |
| X22 | Acceptable ID types ([doc](https://help.withpersona.com/articles/5vXD7S7pQCq8Q9Z4RztxLw/)) | `acceptable ID types` | C11 | T5001 | Restricts which document types the verification accepts, which retires known-weak layouts. |
| X23 | Reject IDs previously submitted by other accounts | `Whether to reject IDs that were previously submitted by other accounts in your Persona organization` | C18 C19 | T4004 T5003 | Rejects a document already associated with a different account in the organisation. |
| X24 | Require both sides of the ID | `Whether to require both the front side and back side of the ID to be submitted` | C12 | T5001 T5002 | Collecting the back is what makes barcode and encoded-zone checks applicable rather than not applicable. |

### Workflow and review

Docs: [Workflows](https://docs.withpersona.com/workflows)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| X25 | Conditional step | `Conditional step` | C23 | T2005 T5005 | Branches on inquiry, report, case, or account data, so a step-up fires only where risk is elevated. |
| X26 | Run Report | `Run Report` | C14 C20 | T5005 T5003 | Runs a report when configured conditions are met, adding evidence the capture itself cannot supply. |
| X27 | Mark Inquiry for Review | `Mark Inquiry for Review` | C21 C24 | T5006 T5003 | Routes an uncertain inquiry to human judgment rather than forcing an automated decision. |
| X28 | Create Case | `Create Case` | C21 C19 | T6004 T6001 | Opens a case for investigation, which is where a cluster rather than a single attempt gets adjudicated. |
| X29 | Teams ([doc](https://help.withpersona.com/articles/2Ucor7PGqindbKCAEVoTRV/)) | `Teams` | C21 C24 | T5006 | Groups reviewers and drives case-assignment policy, so review has defined ownership and an audit trail. |

### Embed security

Docs: [Embedded Flow security](https://docs.withpersona.com/embedded-flow-security)

| Id | Capability | Ref | Controls | Techniques | What it does |
|---|---|---|---|---|---|
| X30 | Domain allowlist | `domain allowlist` | C09 C10 | T4001 T4002 | Restricts which domains may boot the embedded flow; subdomains must be listed separately. |
| X31 | Permissions-Policy | `Permissions-Policy` | C01 | T4003 | Controls whether the parent document grants camera access; blocking it prevents ID and selfie capture outright. |
| X32 | Sandbox attributes | `sandboxAttributes` | C10 | T4001 | Overrides the default iframe sandbox; loosening it can impair the flow’s own security guarantees. |

