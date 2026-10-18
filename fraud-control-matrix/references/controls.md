# Controls

> Source: Persona Research, Identity Fraud Control Matrix — snapshot of https://labs.withpersona.com/fraud-controls as of October 2026. Generated from `data/matrix.json`.

24 controls in 8 layers. "Reach" lists the techniques each control is mapped to. Capture-only controls (C01–C08) cannot run when images come from the customer's own server (server-side upload), whatever their switch says.

| Id | Control | Layer | Techniques reached | Persona capabilities |
|---|---|---|---|---|
| C01 | Guided capture (capture-only) | Capture | 3 | 11 |
| C02 | Ordered frame retention (capture-only) | Capture | 4 | 3 |
| C03 | Capture-time challenge (capture-only) | Capture | 7 | 4 |
| C04 | Platform attestation (capture-only) | Capture integrity | 8 | 4 |
| C05 | Camera and driver enumeration (capture-only) | Capture integrity | 3 | 7 |
| C06 | Runtime environment assessment (capture-only) | Capture integrity | 6 | 7 |
| C07 | Sensor metadata plausibility (capture-only) | Capture integrity | 3 | 8 |
| C08 | Frame timing analysis (capture-only) | Capture integrity | 5 | 5 |
| C09 | Session binding | Transport | 3 | 14 |
| C10 | Transport protection | Transport | 1 | 4 |
| C11 | Document authenticity analysis | Evidence | 5 | 27 |
| C12 | Encoded data validation | Evidence | 3 | 5 |
| C13 | Cryptographic credential validation | Evidence | 4 | 8 |
| C14 | Authoritative source corroboration | Evidence | 4 | 49 |
| C15 | Face comparison | Binding | 3 | 9 |
| C16 | Liveness and PAD ensemble | Binding | 8 | 10 |
| C17 | Device and network context | Context | 8 | 28 |
| C18 | Velocity and repeated artifacts | Population | 7 | 24 |
| C19 | Link and graph analysis | Population | 6 | 41 |
| C20 | Risk intelligence matching | Population | 5 | 26 |
| C21 | Human review | Policy | 2 | 10 |
| C22 | Lifecycle monitoring | Policy | 4 | 20 |
| C23 | Proportionate step-up | Policy | 4 | 14 |
| C24 | Monitored exception path | Policy | 3 | 3 |

## C01 Guided capture

Layer: Capture · capture-only

Framing, distance, and lighting guidance so correctable problems are resolved before submission.

**Does not cover.** Requires a Persona-controlled capture surface. Does not apply to a server-supplied image.

**Reaches.** T2001 Printed photograph; T2002 Screen replay; T2006 Counterfeit document at camera

**In Persona (11).** K24 Processable submission (`id_unprocessable_submission_detection`); K34 Face covering (`selfie_face_covering_detection`); K35 Portrait quality (`selfie_portrait_quality_detection`); S28 Any uploaded (`verification/any-uploaded`); X01 Capture methods (`Capture Methods`); X02 Capture a new photo (`capture a new photo`); X03 Upload an existing image (`upload an existing image`); X07 Mobile SDK (`Mobile SDK`); X08 Hosted Flow (`Hosted Flow`); X09 Embedded Flow (`Embedded Flow`); X31 Permissions-Policy (`Permissions-Policy`)

## C02 Ordered frame retention

Layer: Capture · capture-only

Frames retained in order with relative timing, so motion and temporal analysis is possible at all.

**Does not cover.** A single-still integration removes this and the signal families that depend on it.

**Reaches.** T2001 Printed photograph; T2002 Screen replay; T2004 Three-dimensional face model; T2005 Generated face re-filmed

**In Persona (3).** K23 Video quality (`id_video_quality_detection`); K36 Video quality (`selfie_video_quality_detection`); X02 Capture a new photo (`capture a new photo`)

## C03 Capture-time challenge

Layer: Capture · capture-only

A value chosen by the server after the session opens, such as a lighting pattern, a movement, or an on-screen target, which prepared media cannot have anticipated.

**Does not cover.** Adds friction and needs an accessible alternative. Simple challenges can be performed live by current tooling.

**Reaches.** T2001 Printed photograph; T2002 Screen replay; T2004 Three-dimensional face model; T2005 Generated face re-filmed; T3003 Hardware capture device; T3004 Real-time face swap; T4002 Session replay

**In Persona (4).** K29 Pose position (`selfie_pose_detection`); K30 Pose repeat (`selfie_pose_repeat_detection`); X04 Selfie poses: centre, left, and right (`Images of individual selfie poses looking center, left, and right`); X05 Centre-only checks (`center-only checks`)

## C04 Platform attestation

Layer: Capture integrity · capture-only

A signed statement from the operating system or app ecosystem about device integrity and application authenticity.

**Does not cover.** Requires a native app on a supported platform. Not available in a browser flow.

**Reaches.** T1001 Emulated or virtualized device; T1002 Rooted or jailbroken device; T1003 Repackaged application; T1004 Instrumentation and hooking; T3001 Virtual camera driver; T3002 Hooked camera API; T3003 Hardware capture device; T3004 Real-time face swap

**In Persona (4).** S16 Apple app attestation (`inquiry/apple-app-attestation`); S17 Google Play Integrity (`inquiry/google-play-integrity`); S18 Bundle names (`inquiry/bundle-names`); X07 Mobile SDK (`Mobile SDK`)

## C05 Camera and driver enumeration

Layer: Capture integrity · capture-only

Enumeration of camera devices and identification of virtual, redirected, or software-backed sources.

**Does not cover.** Determined adversaries can present a virtual source that reports plausibly.

**Reaches.** T3001 Virtual camera driver; T3004 Real-time face swap; T3005 Emulator fed prepared media

**In Persona (7).** S26 Virtual camera risk level (`inquiry/virtual-camera-risk-level`); S27 Virtual camera detected (`verification/any-virtual-camera-detected`); S28 Any uploaded (`verification/any-uploaded`); S29 Camera count (`verification/camera-count`); S30 All camera labels (`verification/all-camera-labels`); S32 Camera facing mode (`verification/camera-facing-mode`); X01 Capture methods (`Capture Methods`)

## C06 Runtime environment assessment

Layer: Capture integrity · capture-only

Indicators of emulation, virtualization, rooting or jailbreaking, instrumentation frameworks, and repackaged applications.

**Does not cover.** Normal for researchers, developers, and some privacy-conscious users. A risk indicator, not proof.

**Reaches.** T1001 Emulated or virtualized device; T1002 Rooted or jailbroken device; T1003 Repackaged application; T1004 Instrumentation and hooking; T3002 Hooked camera API; T3005 Emulator fed prepared media

**In Persona (7).** S14 Rooted device detected (`inquiry/rooted-device-detected`); S15 Device or app tampering (`inquiry/device-or-app-tampering`); S18 Bundle names (`inquiry/bundle-names`); S19 User agent spoof attempts (`inquiry/user-agent-spoof-attempts`); S20 Request spoof attempts (`inquiry/request-spoof-attempts`); S22 Curl request detected (`inquiry/curl-request-detected`); S24 Devtools open (`inquiry/devtools-open`)

## C07 Sensor metadata plausibility

Layer: Capture integrity · capture-only

Whether declared resolution, optical characteristics, and encoding are mutually consistent and consistent with the claimed device.

**Does not cover.** Metadata can be forged; strength comes from internal consistency across many fields at once.

**Reaches.** T3001 Virtual camera driver; T3002 Hooked camera API; T3003 Hardware capture device

**In Persona (8).** K42 Image suspicious metadata (`document_image_suspicious_metadata_detection`); K43 JPEG original image detection (`document_jpeg_original_image_detection`); S19 User agent spoof attempts (`inquiry/user-agent-spoof-attempts`); S31 Camera frame rate (`verification/camera-frame-rate`); S32 Camera facing mode (`verification/camera-facing-mode`); S33 Gyroscope factor (`verification/gyroscope-factor`); S34 First image dimensions (`verification/first-image-dimensions`); S35 Device name missing (`verification/device-name-missing`)

## C08 Frame timing analysis

Layer: Capture integrity · capture-only

Injected media frequently has a cadence too regular, too fast, or otherwise inconsistent with a live sensor under real conditions.

**Does not cover.** Needs a frame sequence. Poor network conditions produce legitimate irregularity.

**Reaches.** T1004 Instrumentation and hooking; T3001 Virtual camera driver; T3002 Hooked camera API; T3003 Hardware capture device; T3005 Emulator fed prepared media

**In Persona (5).** K23 Video quality (`id_video_quality_detection`); K36 Video quality (`selfie_video_quality_detection`); S31 Camera frame rate (`verification/camera-frame-rate`); S33 Gyroscope factor (`verification/gyroscope-factor`); S42 Time to complete (`verification/time-to-complete`)

## C09 Session binding

Layer: Transport

Media bound server-side to the session it was captured in, so a valid submission cannot be reused in another session or against another identity.

**Does not cover.** Closes replay, not first-use submission of prepared media.

**Reaches.** T3001 Virtual camera driver; T4001 Payload substitution in transit; T4002 Session replay

**In Persona (14).** K72 Confirmation code timeout (`phone_number_timeout_detection`); S21 Mismatched user agent count (`inquiry/mismatched-user-agent-count`); S25 Unrecognised referer (`inquiry/unrecognized-referer`); S40 Session count (`inquiry/session-count`); S41 Sessions geolocation delta (`inquiry/sessions-geolocation-delta`); X10 Transactions-based integration (`Transactions-based integration`); X11 Create inquiries via API (`Creating inquiries via API`); X12 Block client-side inquiry creation (`Block client-side Inquiry creation`); X14 Inquiry one-time links (`Inquiry One-Time Links (OTL)`); X15 Inquiry session limit (`Inquiry Session Limit`); X16 Expiration from inquiry pending (`meta.expiration_after_start_interval_seconds`); X17 One-time link expiry (`meta.one_time_link_expiration_seconds`); X18 Device handoff link (`Device Handoff Link`); X30 Domain allowlist (`domain allowlist`)

## C10 Transport protection

Layer: Transport

Integrity and confidentiality protection in transit, so substitution requires compromising the client rather than the connection.

**Does not cover.** Does not address a compromised client, which is the more common case.

**Reaches.** T4001 Payload substitution in transit

**In Persona (4).** S13 TLS certificate fingerprint (`inquiry/tls-cert-fingerprint`); S20 Request spoof attempts (`inquiry/request-spoof-attempts`); X30 Domain allowlist (`domain allowlist`); X32 Sandbox attributes (`sandboxAttributes`)

## C11 Document authenticity analysis

Layer: Evidence

Classification, template and layout consistency, typography, security elements, and digital or physical tamper detection.

**Does not cover.** Can only assess what a camera can see. A well-made counterfeit reproduces exactly that.

**Reaches.** T2006 Counterfeit document at camera; T4003 Direct submission with no capture; T5001 Fabricated document; T5002 Altered genuine document; T5004 Specimen or published template

**In Persona (27).** K01 Government ID (`id_entity_detection`); K02 Extracted properties (`id_extracted_properties_detection`); K03 Extraction inconsistency (`id_extraction_inconsistency_detection`); K07 Valid dates (`id_valid_dates_detection`); K08 Fabrication (`id_fabrication_detection`); K09 ID image tampering (`id_tamper_detection`); K10 ID physical tampering (`id_physical_tamper_detection`); K11 Colour (`id_color_inconsistency_detection`); K12 Paper detection (`id_paper_detection`); K13 Electronic replica (`id_electronic_replica_detection`); K14 Double side (`id_double_side_detection`); K19 Portrait age (`id_age_inconsistency_detection`); K21 Inquiry comparison (`id_inquiry_comparison`); K25 Allowed ID type (`id_disallowed_type_detection`); K38 Enhanced fraud detection (`document_enhanced_fraud_detection`); K39 Synthetic content detection (`document_synthetic_content_detection`); K40 Template detection (`document_template_detection`); K41 Copy-move detection (`document_image_copy_move_detection`); K42 Image suspicious metadata (`document_image_suspicious_metadata_detection`); K43 JPEG original image detection (`document_jpeg_original_image_detection`); K44 PDF editor detection (`document_pdf_editor_detection`); K45 PDF abnormal font detection (`document_pdf_abnormal_font_detection`); K46 Recency (`document_recency_detection`); K51 Attribute comparison (`id_nfc_attribute_comparison`); S57 Address street entropy (`verification/address-street-entropy`); X21 Acceptable countries (`acceptable countries`); X22 Acceptable ID types (`acceptable ID types`)

## C12 Encoded data validation

Layer: Evidence

MRZ and barcode structure, checksums, formatting, and consistency between visible and machine-readable zones.

**Does not cover.** Present only on documents that carry an encoded zone.

**Reaches.** T2006 Counterfeit document at camera; T5001 Fabricated document; T5002 Altered genuine document

**In Persona (5).** K03 Extraction inconsistency (`id_extraction_inconsistency_detection`); K04 Barcode inconsistency (`id_barcode_inconsistency_detection`); K05 MRZ inconsistency (`id_mrz_inconsistency_detection`); K06 ID number format inconsistency (`id_number_format_inconsistency_detection`); X24 Require both sides of the ID (`Whether to require both the front side and back side of the ID to be submitted`)

## C13 Cryptographic credential validation

Layer: Evidence

Chip or wallet credential signature verified against a trust chain rooted in the issuing authority, with data-group integrity checked.

**Does not cover.** Confirms issuance, not issuance quality, current status, or who is presenting it.

**Reaches.** T2006 Counterfeit document at camera; T5002 Altered genuine document; T5003 Stolen genuine document; T5006 Compromised authoritative data

**In Persona (8).** K48 PKI validation (`id_nfc_pki_failure_detection`); K49 Data tampering (`id_nfc_tamper_detection`); K50 Compromised NFC document (`id_nfc_compromised_detection`); K51 Attribute comparison (`id_nfc_attribute_comparison`); K52 Allowed issuer (`verifiable_credential_allowed_issuer_detection`); K53 Credential account comparison (`verifiable_credential_account_comparison`); K54 SIM verification (`phone_number_silent_network_authentication_sim_verified_detection`); X06 NFC verification (`NFC Verification`)

## C14 Authoritative source corroboration

Layer: Evidence

Claimed attributes compared against records held by an issuing authority or another source reliable for the use case.

**Does not cover.** Coverage is thinner for younger people, recent arrivals, and thin-file populations. Breached attributes may also be known to an attacker.

**Reaches.** T2006 Counterfeit document at camera; T5001 Fabricated document; T5002 Altered genuine document; T5005 Synthetic identity

**In Persona (49).** K55 Identity comparison (`database_identity_comparison`); K56 2+2 detection (`database_two_plus_two_detection`); K57 Alive detection (`database_deceased_detection`); K58 Database face comparison (`database_face_comparison`); K59 Inquiry comparison (`database_inquiry_comparison`); K60 Deliverable address (`database_address_deliverable_detection`); K61 AAMVA identity comparison (`aamva_identity_comparison`); K62 eCBSV record matched (`database_ecbsv_record_match`); K63 eCBSV death record (`database_ecbsv_death_record`); K64 TIN name comparison (`database_tin_name_comparison`); K65 Serpro face comparison (`database_serpro_face_comparison`); K66 Aadhaar face comparison (`database_aadhaar_face_comparison`); K67 Carrier last name (`database_phone_carrier_name_last_comparison`); K68 Carrier age threshold (`database_phone_carrier_age_threshold_comparison`); K70 Phone deliverability (`phone_number_deliverable_detection`); K73 Business identity comparison (`database_business_identity_comparison`); K74 Active business detection (`database_business_active_business_detection`); K75 Associated persons comparison (`database_business_associated_persons_comparison`); K76 Registered agent address (`database_business_registered_agent_address_detection`); K77 Business footprint identity comparison (`database_business_footprint_identity_comparison`); K78 Domain age detection (`business_website_domain_age_detection`); K80 Website identity comparison (`business_website_identity_comparison`); R01 Profile Report (`report/profile`); R02 Profile Non-Authoritative Report (`report/profile-non-authoritative`); R03 Phone Risk Report (`report/phone-number`); R04 Email Address Report (`report/email-address`); R05 Address Lookup Report (`report/address-lookup`); R06 Social Media Report (`report/social-media`); R11 Synthetic Report (`report/synthetic`); R12 SentiLink Scores Report (`report/integration/sentilink-scores`); R13 Business Lookup Report (`report/business-lookup`); R14 Business Registrations Lookup Report (`report/business-registrations-lookup`); R15 Business Associated Persons Report (`report/business-associated-persons`); S55 First seen days ago (`verification/first-seen-days-ago`); S57 Address street entropy (`verification/address-street-entropy`); G05 Social security number; G08 Address; M01 LexisNexis InstantID; M02 Prove; M03 AtData; M04 Clearbit; M05 FullContact; M06 MX; M07 VerifyMy; M08 SentiLink; M10 CRS Credit; M11 Nova Credit; M22 Twilio; X26 Run Report (`Run Report`)

## C15 Face comparison

Layer: Binding

Similarity between the live capture and a trusted reference, assessed at an operating point chosen for the use case.

**Does not cover.** Inherits the assurance of the reference. A comparison against a forgery confirms a resemblance to a forgery.

**Reaches.** T2003 Wearable mask; T5003 Stolen genuine document; T5006 Compromised authoritative data

**In Persona (9).** K18 ID-to-selfie comparison (`id_selfie_comparison`); K19 Portrait age (`id_age_inconsistency_detection`); K28 Multiple faces (`selfie_multiple_faces_detection`); K32 Selfie-to-ID comparison (`selfie_id_comparison`); K33 Account comparison (`selfie_account_comparison`); K47 Document selfie comparison (`document_selfie_comparison`); K58 Database face comparison (`database_face_comparison`); K65 Serpro face comparison (`database_serpro_face_comparison`); K66 Aadhaar face comparison (`database_aadhaar_face_comparison`)

## C16 Liveness and PAD ensemble

Layer: Binding

Specialized components across signal families A to G, combined into a calibrated result with reason categories.

**Does not cover.** Assumes the image is what the camera saw. Not an injection control.

**Reaches.** T2001 Printed photograph; T2002 Screen replay; T2003 Wearable mask; T2004 Three-dimensional face model; T2005 Generated face re-filmed; T3004 Real-time face swap; T4003 Direct submission with no capture; T5003 Stolen genuine document

**In Persona (10).** K12 Paper detection (`id_paper_detection`); K13 Electronic replica (`id_electronic_replica_detection`); K26 Selfie liveness (`selfie_liveness_detection`); K27 Suspicious entity (`selfie_suspicious_entity_detection`); K28 Multiple faces (`selfie_multiple_faces_detection`); K29 Pose position (`selfie_pose_detection`); K30 Pose repeat (`selfie_pose_repeat_detection`); K34 Face covering (`selfie_face_covering_detection`); S36 Max selfie liveness risk level (`inquiry/selfie-liveness-risk-level`); X04 Selfie poses: centre, left, and right (`Images of individual selfie poses looking center, left, and right`)

## C17 Device and network context

Layer: Context

Device profile and novelty, connection origin, anonymization services, hosting providers, and consistency with prior sessions.

**Does not cover.** Probabilistic. Legitimate users travel, use privacy tools, and share infrastructure.

**Reaches.** T1001 Emulated or virtualized device; T1005 Anonymized network origin; T1006 Automation harness; T4003 Direct submission with no capture; T5005 Synthetic identity; T6001 Identity muling; T6002 Account takeover; T6003 Recovery path abuse

**In Persona (28).** R03 Phone Risk Report (`report/phone-number`); R04 Email Address Report (`report/email-address`); S01 VPN detected (`inquiry/vpn-detected`); S02 Proxy detected (`inquiry/proxy-detected`); S03 Tor detected (`inquiry/tor-detected`); S04 Network threat level (`inquiry/threat-level`); S05 Risk level (`inquiry/risk-level`); S07 IP connection types (`inquiry/ip-connection-types`); S09 Session ASNs (`inquiry/session-asns`); S10 Country comparison (`inquiry/country-comparison`); S11 Impossible travel geolocation (`inquiry/gps-impossible-travel`); S12 Geolocation language mismatch (`inquiry/gps-language-mismatch`); S23 Incognito browsing detected (`inquiry/incognito-browsing-detected`); S37 Bot score (`inquiry/bot-score`); S38 Behaviour threat level (`inquiry/behavior-threat-level`); S41 Sessions geolocation delta (`inquiry/sessions-geolocation-delta`); S43 Shortcut pastes (`inquiry/shortcut-pastes`); S44 Distraction events (`inquiry/distraction-events`); S45 Hesitation ratio (`inquiry/hesitation-ratio`); S46 Off-hours session (`inquiry/off-hours-session`); S53 IP impossible travel (`verification/ip-impossible-travel`); S63 New mobile device used during reverification (`inquiry/new-mobile-device-used-during-reverification`); G01 Device fingerprint; G02 Browser fingerprint; G03 IP address; M03 AtData; M09 Mastercard Identity; M19 Auth0

## C18 Velocity and repeated artifacts

Layer: Population

How often an attribute, document, biometric reference, device, or derived artifact recurs within a defined window.

**Does not cover.** Base rates vary by population. Households, public terminals, and assisted onboarding all produce legitimate recurrence.

**Reaches.** T1005 Anonymized network origin; T1006 Automation harness; T4002 Session replay; T4004 Cross-identity media reuse; T5004 Specimen or published template; T5005 Synthetic identity; T6004 Coordinated ring at scale

**In Persona (24).** K16 Repeat (`id_repeat_detection`); K17 Inconsistent repeat (`id_inconsistent_repeat_detection`); K31 Selfie repeat (`selfie_repeat_detection`); S05 Risk level (`inquiry/risk-level`); S06 IP burst (`inquiry/ip-burst`); S08 IP prefix /24 (`inquiry/ip-prefix24`); S39 Behaviour anomaly (`inquiry/behavior-anomaly`); S40 Session count (`inquiry/session-count`); S48 Selfie visual cluster score (`verification/selfie-visual-cluster-v2-score`); S49 Selfie visual cluster size (`verification/selfie-visual-cluster-v2-size`); S50 ID vision cluster score (`verification/id-visual-cluster-v2-score`); S51 ID vision cluster size (`verification/id-visual-cluster-v2-size`); S52 Government ID inconsistent repeat count (`inquiry/government-id-inconsistent-repeat-mismatch-count`); S54 Devices count (`verification/devices-count`); S58 Inquiry velocity (`account/inquiry-velocity`); S59 Failed inquiries count (`account/failed-inquiries-count`); G04 Government ID number; G13 Cluster; G14 Cluster size; X11 Create inquiries via API (`Creating inquiries via API`); X12 Block client-side inquiry creation (`Block client-side Inquiry creation`); X13 Reference ID (`Reference ID`); X15 Inquiry session limit (`Inquiry Session Limit`); X23 Reject IDs previously submitted by other accounts (`Whether to reject IDs that were previously submitted by other accounts in your Persona organization`)

## C19 Link and graph analysis

Layer: Population

Relationships across accounts and transactions, such as a shared face under different identities, one document across accounts, or common infrastructure and backgrounds.

**Does not cover.** Identifies relationships, not culpability. A ring that keeps attempts separate produces fewer edges.

**Reaches.** T1005 Anonymized network origin; T4004 Cross-identity media reuse; T5005 Synthetic identity; T5006 Compromised authoritative data; T6001 Identity muling; T6004 Coordinated ring at scale

**In Persona (41).** K17 Inconsistent repeat (`id_inconsistent_repeat_detection`); K31 Selfie repeat (`selfie_repeat_detection`); K75 Associated persons comparison (`database_business_associated_persons_comparison`); K76 Registered agent address (`database_business_registered_agent_address_detection`); R11 Synthetic Report (`report/synthetic`); R15 Business Associated Persons Report (`report/business-associated-persons`); S06 IP burst (`inquiry/ip-burst`); S08 IP prefix /24 (`inquiry/ip-prefix24`); S09 Session ASNs (`inquiry/session-asns`); S11 Impossible travel geolocation (`inquiry/gps-impossible-travel`); S39 Behaviour anomaly (`inquiry/behavior-anomaly`); S48 Selfie visual cluster score (`verification/selfie-visual-cluster-v2-score`); S49 Selfie visual cluster size (`verification/selfie-visual-cluster-v2-size`); S51 ID vision cluster size (`verification/id-visual-cluster-v2-size`); S53 IP impossible travel (`verification/ip-impossible-travel`); S54 Devices count (`verification/devices-count`); S55 First seen days ago (`verification/first-seen-days-ago`); S60 Device count (`account/device-count`); G01 Device fingerprint; G02 Browser fingerprint; G03 IP address; G04 Government ID number; G05 Social security number; G06 Phone number; G07 Email address; G08 Address; G09 Name; G10 Birthdate; G11 Linked via; G12 Linked to; G13 Cluster; G14 Cluster size; G15 Hops; G16 Starting nodes; G17 Graph Explorer; G18 Query; G19 Query template; G20 Maximum hops; X13 Reference ID (`Reference ID`); X23 Reject IDs previously submitted by other accounts (`Whether to reject IDs that were previously submitted by other accounts in your Persona organization`); X28 Create Case (`Create Case`)

## C20 Risk intelligence matching

Layer: Population

Comparison against known compromised, specimen, fraudulent, or customer-supplied risk information.

**Does not cover.** Depends on freshness. A match describes an artifact, not necessarily the person presenting it.

**Reaches.** T4004 Cross-identity media reuse; T5001 Fabricated document; T5003 Stolen genuine document; T5004 Specimen or published template; T6004 Coordinated ring at scale

**In Persona (26).** K15 Compromised submission (`id_compromised_detection`); K20 Public figure (`id_public_figure_detection`); K37 Public figure (`selfie_public_figure_detection`); K40 Template detection (`document_template_detection`); K50 Compromised NFC document (`id_nfc_compromised_detection`); K57 Alive detection (`database_deceased_detection`); K63 eCBSV death record (`database_ecbsv_death_record`); K79 Malicious website detection (`business_website_malicious_website_detection`); K81 Trademark ownership detection (`brand_asset_trademark_ownership_detection`); R07 Watchlist Report (`report/watchlist`); R08 Politically Exposed Person Report (`report/politically-exposed-person`); R09 Adverse Media Report (`report/adverse-media`); R10 Crypto Address Watchlist Report (`report/crypto-address-watchlist`); R12 SentiLink Scores Report (`report/integration/sentilink-scores`); R16 Business Watchlist Report (`report/business-watchlist`); R17 Business Adverse Media Report (`report/business-adverse-media`); S50 ID vision cluster score (`verification/id-visual-cluster-v2-score`); S56 Public figure name detected (`verification/public-figure-name-detected`); S62 List match count (`account/list-match-count`); M08 SentiLink; M09 Mastercard Identity; M12 PhotoDNA; M13 Chainalysis; M14 TRM Labs; M21 Yardstik; X26 Run Report (`Run Report`)

## C21 Human review

Layer: Policy

An escalation path for ambiguous, high-impact, or novel cases, with role-based access and auditable actions.

**Does not cover.** People are worse than models at judging well-made spoofs and borderline face matches. Scope review to judgments humans improve.

**Reaches.** T5006 Compromised authoritative data; T6003 Recovery path abuse

**In Persona (10).** G17 Graph Explorer; M18 Cisco Duo; M21 Yardstik; M23 Slack; M25 Anthropic; M26 OpenAI; X20 Non-required checks (`non-required`); X27 Mark Inquiry for Review (`Mark Inquiry for Review`); X28 Create Case (`Create Case`); X29 Teams (`Teams`)

## C22 Lifecycle monitoring

Layer: Policy

Post-verification behavior, reverification triggers, and transaction controls that can revise a completed outcome.

**Does not cover.** Detects after the fact. Requires the customer to define what happens on a downstream notification.

**Reaches.** T6001 Identity muling; T6002 Account takeover; T6003 Recovery path abuse; T6004 Coordinated ring at scale

**In Persona (20).** K22 Account comparison (`id_account_comparison`); K33 Account comparison (`selfie_account_comparison`); K53 Credential account comparison (`verifiable_credential_account_comparison`); S47 Reusable persona used (`inquiry/reusable-persona-used`); S58 Inquiry velocity (`account/inquiry-velocity`); S59 Failed inquiries count (`account/failed-inquiries-count`); S60 Device count (`account/device-count`); S61 Address update count (`account/address-update-count`); S62 List match count (`account/list-match-count`); S63 New mobile device used during reverification (`inquiry/new-mobile-device-used-during-reverification`); G19 Query template; M13 Chainalysis; M14 TRM Labs; M15 Notabene; M16 Okta; M17 Microsoft Entra; M19 Auth0; M20 Stytch; M23 Slack; M24 Shopify

## C23 Proportionate step-up

Layer: Policy

Requesting stronger or additional evidence when risk is elevated or existing evidence is insufficient for the transaction.

**Does not cover.** Friction has a measurable abandonment cost, distributed unevenly across a population.

**Reaches.** T1006 Automation harness; T5005 Synthetic identity; T6002 Account takeover; T6003 Recovery path abuse

**In Persona (14).** K25 Allowed ID type (`id_disallowed_type_detection`); K54 SIM verification (`phone_number_silent_network_authentication_sim_verified_detection`); K69 Phone code confirmation (`phone_number_confirmation_code_comparison`); K71 Email code confirmation (`email_address_confirmation_code_comparison`); K72 Confirmation code timeout (`phone_number_timeout_detection`); M02 Prove; M07 VerifyMy; M16 Okta; M17 Microsoft Entra; M18 Cisco Duo; M22 Twilio; X19 Required checks (`required`); X20 Non-required checks (`non-required`); X25 Conditional step (`Conditional step`)

## C24 Monitored exception path

Layer: Policy

A documented alternative route with human adjudication for people who cannot complete the standard flow, with its own controls and its own monitoring.

**Does not cover.** An unmonitored exception path tends to become the path attackers use, which is why it is listed as a control against the techniques that target it.

**Reaches.** T5005 Synthetic identity; T5006 Compromised authoritative data; T6003 Recovery path abuse

**In Persona (3).** M11 Nova Credit; X27 Mark Inquiry for Review (`Mark Inquiry for Review`); X29 Teams (`Teams`)

