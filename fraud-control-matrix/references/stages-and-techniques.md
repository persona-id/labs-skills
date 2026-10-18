# Stages and techniques

> Source: Persona Research, Identity Fraud Control Matrix — snapshot of https://labs.withpersona.com/fraud-controls as of October 2026. Generated from `data/matrix.json`.

Six stages a verification rests on, 31 adversary techniques. Each technique enters at one stage, has an effort level (low / moderate / high), named variants (display codes `<id>.001`, `.002`, …), the controls that address it, the signal families that surface it, a recommended response and the residual risk.

## AT01 Session and environment (Session)

*The runtime the verification opens in, before any capture.* Assumes: the device and session are what they claim to be.

Everything at this stage is asserted by the client. It is where an adversary prepares the ground for a later technique rather than attacking the evidence itself, which is why these signals are treated as risk indicators rather than proof.

### T1001 Emulated or virtualized device

- Effort: low
- Tell: Only in the capture path (Family H)
- Variants: `T1001.001` Mobile operating system emulator; `T1001.002` Desktop virtual machine; `T1001.003` Cloud device farm
- Controls: C06 Runtime environment assessment; C04 Platform attestation; C17 Device and network context
- Signal families: H Capture-path and device context
- Persona capabilities: S19 User agent spoof attempts; S35 Device name missing

The verification is completed inside an emulator or virtual machine rather than on physical consumer hardware, giving the adversary full control of what the runtime reports and an easy path to feeding prepared media to the camera interface.

**Response.** Treat as an elevated risk indicator rather than proof, since emulation is normal for developers and researchers. Where the flow requires it, block unsupported capture environments or step up to an alternate channel.

**Residual.** Attestation is unavailable in browser flows, so a web integration has materially weaker evidence here than a native one.

References: ENISA, Remote Identity Proofing: Attacks and Countermeasures.

### T1002 Rooted or jailbroken device

- Effort: low
- Tell: Only in the capture path (Family H)
- Controls: C06 Runtime environment assessment; C04 Platform attestation
- Signal families: H Capture-path and device context
- Persona capabilities: S14 Rooted device detected; S17 Google Play Integrity

Privilege escalation on real hardware, which lets the adversary intercept or replace the camera interface, disable client-side protections, and modify the application at runtime while otherwise presenting as a genuine device.

**Response.** Step up to stronger evidence or a cryptographic credential, or route to review under the customer's configured policy.

**Residual.** Detection is an arms race against concealment tooling built specifically to defeat it.

### T1003 Repackaged application

- Effort: moderate
- Tell: Only in the capture path (Family H)
- Variants: `T1003.001` Re-signed build; `T1003.002` Patched capture module
- Controls: C04 Platform attestation; C06 Runtime environment assessment
- Signal families: H Capture-path and device context
- Persona capabilities: S15 Device or app tampering; S16 Apple app attestation; S17 Google Play Integrity; S18 Bundle names; X07 Mobile SDK

The published application is modified and re-signed so that client-side capture logic, guidance, or integrity checks behave differently while the submission still appears to come from the expected app.

**Response.** Refuse submissions from application instances the platform will not attest to, where the integration supports attestation.

**Residual.** Any control that relies on the client honestly describing itself is defeated here. Only platform-signed attestation resists it.

### T1004 Instrumentation and hooking

- Effort: moderate
- Tell: Only in the capture path (Family H)
- Controls: C06 Runtime environment assessment; C04 Platform attestation; C08 Frame timing analysis
- Signal families: H Capture-path and device context
- Persona capabilities: S15 Device or app tampering; S20 Request spoof attempts; S24 Devtools open

A dynamic instrumentation framework attaches to the running process to intercept function calls, alter values in memory, or substitute the frames returned by a camera API without modifying the application binary.

**Response.** Elevated risk; combine with capture-path provenance so that substituted frames are also assessed against what a real stream looks like.

**Residual.** Runtime detection and runtime concealment evolve together, and neither side stays ahead for long.

### T1005 Anonymized network origin

- Effort: low
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T1005.001` Commercial VPN; `T1005.002` Hosting provider address; `T1005.003` Residential proxy network
- Controls: C17 Device and network context; C18 Velocity and repeated artifacts; C19 Link and graph analysis
- Signal families: none
- Persona capabilities: S01 VPN detected; S02 Proxy detected; S03 Tor detected; S04 Network threat level; S07 IP connection types; S09 Session ASNs; S10 Country comparison; S11 Impossible travel geolocation; S12 Geolocation language mismatch; G03 IP address; M09 Mastercard Identity

The connection is routed to obscure the true origin or to place it in a geography consistent with the claimed identity, often as part of a wider effort to make many attempts appear unrelated.

**Response.** Weak on its own, because privacy tools are ordinary. Informative in convergence: volume from one provider, or geography inconsistent with the phone number, document country, and address at once.

**Residual.** Residential proxy networks present as ordinary consumer connections and are hard to distinguish from them.

### T1006 Automation harness

- Effort: low
- Tell: Only in the capture path (Family H)
- Controls: C17 Device and network context; C18 Velocity and repeated artifacts; C23 Proportionate step-up
- Signal families: H Capture-path and device context
- Persona capabilities: S04 Network threat level; S05 Risk level; S06 IP burst; S19 User agent spoof attempts; S22 Curl request detected; S23 Incognito browsing detected; S24 Devtools open; S37 Bot score; S38 Behaviour threat level; S42 Time to complete; S58 Inquiry velocity; S59 Failed inquiries count; G02 Browser fingerprint; X08 Hosted Flow; X09 Embedded Flow; X11 Create inquiries via API; X12 Block client-side inquiry creation

A script or browser automation driver completes the flow, allowing many attempts to be submitted quickly and allowing the adversary to probe systematically for the boundary of a control.

**Response.** Rate-limit, require step up, and preserve the attempt pattern for analysis. Retry behavior is distinctively informative here.

**Residual.** A patient adversary pacing attempts below threshold produces a pattern that only a long window surfaces.

## AT02 Presentation at capture (Presentation)

*Artifacts held up in front of a real camera.* Assumes: the face or document in front of the camera is real.

This is the stage ISO/IEC 30107-3 addresses. The sensor is genuinely the source of the image, so sample-analysis signals apply in full and a laboratory result is meaningful evidence about this column.

### T2001 Printed photograph

- Effort: low
- Tell: In the image (Families A–E, G)
- Variants: `T2001.001` Flat print; `T2001.002` Cut-out with apertures; `T2001.003` Curved print to imply depth
- Controls: C16 Liveness and PAD ensemble; C03 Capture-time challenge; C01 Guided capture; C02 Ordered frame retention
- Signal families: A Material and texture response; D Depth, parallax, and geometry; E Motion and temporal consistency
- Persona capabilities: K26 Selfie liveness; K27 Suspicious entity; K28 Multiple faces; K29 Pose position; K35 Portrait quality; X04 Selfie poses: centre, left, and right; X05 Centre-only checks

A printed image of the target face is held in front of the camera. The lowest-cost presentation attack, and still common because the source image is often freely available from social media or a stolen document.

**Response.** Retry with guided capture where the result is ambiguous; decline or review where the outcome is confident and the flow requires it.

**Residual.** Very low-resolution or heavily compressed captures suppress exactly the texture cues this depends on.

References: ISO/IEC 30107-3:2023.

### T2002 Screen replay

- Effort: low
- Tell: In the image (Families A–E, G)
- Variants: `T2002.001` Phone or tablet display; `T2002.002` Desktop monitor; `T2002.003` Looped video of the target
- Controls: C16 Liveness and PAD ensemble; C03 Capture-time challenge; C02 Ordered frame retention; C01 Guided capture
- Signal families: B Display and frequency artifacts; A Material and texture response; C Illumination and reflection consistency; D Depth, parallax, and geometry; E Motion and temporal consistency; F Anomalous signals
- Persona capabilities: K13 Electronic replica; K26 Selfie liveness; K29 Pose position; K30 Pose repeat; K36 Video quality; S36 Max selfie liveness risk level; X04 Selfie poses: centre, left, and right; X05 Centre-only checks; X19 Required checks

A photograph or video of the target is replayed on a second display and filmed by the capture device, which can satisfy naive motion checks because the replayed subject genuinely moves and blinks.

**Response.** Decline or route to review under policy. Where the signal is weak, a capture-time challenge the recording cannot anticipate resolves it.

**Residual.** A high-density, high-refresh display at a controlled angle with the bezel cropped out suppresses the strongest cues in family B.

References: ISO/IEC 30107-3:2023.

### T2003 Wearable mask

- Effort: moderate
- Tell: In the image (Families A–E, G)
- Variants: `T2003.001` Paper mask with eye and mouth apertures; `T2003.002` Silicone, resin, or latex mask
- Controls: C16 Liveness and PAD ensemble; C15 Face comparison
- Signal families: A Material and texture response; C Illumination and reflection consistency
- Persona capabilities: K18 ID-to-selfie comparison; K26 Selfie liveness; K32 Selfie-to-ID comparison; K34 Face covering; K35 Portrait quality

The adversary wears a representation of the target face, which defeats depth and parallax analysis because the instrument is genuinely three-dimensional and genuinely moves with a living wearer.

**Response.** Decline where confident. Step up to a cryptographic credential with holder binding where the flow supports it.

**Residual.** The family that resists this best is material and texture response, which weakens under poor optics, distance, and aggressive compression.

References: ISO/IEC 30107-3:2023.

### T2004 Three-dimensional face model

- Effort: high
- Tell: In the image (Families A–E, G)
- Variants: `T2004.001` Mannequin or bust; `T2004.002` Printed 3D model
- Controls: C16 Liveness and PAD ensemble; C03 Capture-time challenge; C02 Ordered frame retention
- Signal families: A Material and texture response; C Illumination and reflection consistency; E Motion and temporal consistency
- Persona capabilities: K26 Selfie liveness; K29 Pose position; X04 Selfie poses: centre, left, and right

A physical model of the target head is presented to the camera. Higher effort than a mask and less flexible, but it satisfies geometry checks and can be reused across many attempts.

**Response.** Decline. A static model fails temporal and motion analysis even when it satisfies depth.

**Residual.** Rare in practice because the effort is poorly matched to the return, but relevant for high-value targeted attacks.

References: ISO/IEC 30107-3:2023.

### T2005 Generated face re-filmed

- Effort: moderate
- Tell: In the image (Families A–E, G)
- Controls: C16 Liveness and PAD ensemble; C03 Capture-time challenge; C02 Ordered frame retention
- Signal families: G Generative and manipulation artifacts; B Display and frequency artifacts; A Material and texture response; C Illumination and reflection consistency; F Anomalous signals
- Persona capabilities: K26 Selfie liveness; K37 Public figure; S36 Max selfie liveness risk level; S48 Selfie visual cluster score; X25 Conditional step

A synthesized or face-swapped video is rendered, displayed, and filmed by the real capture device. This combines the flexibility of generative media with a genuine camera path, so capture-integrity signals show nothing wrong.

**Response.** Step up to stronger evidence or a cryptographic credential, review, or decline. Population signals often reveal reuse across attempts.

**Residual.** Generative artifact detection degrades as generators improve, and this technique deliberately hides behind a legitimate capture path.

References: ENISA, Remote Identity Proofing: Attacks and Countermeasures.

### T2006 Counterfeit document at camera

- Effort: moderate
- Tell: In the image (Families A–E, G)
- Variants: `T2006.001` Printed reproduction; `T2006.002` Screen-displayed document image
- Controls: C11 Document authenticity analysis; C12 Encoded data validation; C13 Cryptographic credential validation; C14 Authoritative source corroboration; C01 Guided capture
- Signal families: A Material and texture response; B Display and frequency artifacts
- Persona capabilities: K01 Government ID; K02 Extracted properties; K09 ID image tampering; K11 Colour; K12 Paper detection; K13 Electronic replica; K14 Double side; K27 Suspicious entity; S28 Any uploaded; X01 Capture methods; X02 Capture a new photo

A fabricated or altered document is presented to the camera during document capture, relying on the fact that visual analysis can only assess what the camera can see.

**Response.** Request recapture where quality is the issue; step up to issuing source or chip validation where authenticity is the question.

**Residual.** A well-made counterfeit reproduces the visible design faithfully. Cryptographic or source validation is what introduces evidence the forger does not control.

## AT03 Capture path compromise (Capture path)

*The camera is bypassed or replaced.* Assumes: the image is what the camera saw.

This stage invalidates the assumption every sample-analysis family rests on: that the image is what the camera saw. A presentation attack detection result says nothing about this column, however strong it is.

### T3001 Virtual camera driver

- Effort: low
- Tell: Only in the capture path (Family H)
- Variants: `T3001.001` Desktop virtual webcam; `T3001.002` Mobile virtual camera module
- Controls: C05 Camera and driver enumeration; C04 Platform attestation; C07 Sensor metadata plausibility; C08 Frame timing analysis; C09 Session binding
- Signal families: H Capture-path and device context
- Persona capabilities: S26 Virtual camera risk level; S27 Virtual camera detected; S29 Camera count; S30 All camera labels; S31 Camera frame rate; S32 Camera facing mode; S33 Gyroscope factor; S34 First image dimensions

Software registers itself as a camera device and supplies prepared media to any application that opens it. The most accessible injection technique, because consumer tools for it exist for legitimate streaming purposes.

**Response.** Block unsupported capture paths, step up to an alternate channel, or decline. Content analysis alone does not address this.

**Residual.** Where the integration supplies a finished image with no capture context, none of the family H signals exist at all.

References: CEN/TS 18099:2024.

### T3002 Hooked camera API

- Effort: moderate
- Tell: Only in the capture path (Family H)
- Controls: C04 Platform attestation; C06 Runtime environment assessment; C08 Frame timing analysis; C07 Sensor metadata plausibility
- Signal families: H Capture-path and device context
- Persona capabilities: S14 Rooted device detected; S15 Device or app tampering; S16 Apple app attestation; S27 Virtual camera detected; X07 Mobile SDK

On a compromised device, calls to the platform camera interface are intercepted and the returned frames replaced, so the application receives adversary-supplied media through what appears to be the normal path.

**Response.** Refuse or step up where the platform will not attest to the device and application instance.

**Residual.** This is precisely the case platform attestation exists for, and precisely the case where a browser integration cannot obtain it.

References: CEN/TS 18099:2024.

### T3003 Hardware capture device

- Effort: high
- Tell: Only in the capture path (Family H)
- Controls: C07 Sensor metadata plausibility; C08 Frame timing analysis; C03 Capture-time challenge; C04 Platform attestation
- Signal families: H Capture-path and device context
- Persona capabilities: K23 Video quality; K36 Video quality; S30 All camera labels; S31 Camera frame rate; S33 Gyroscope factor

A physical device presents itself to the host as a webcam while replaying prepared video, defeating software-only inspection because the operating system genuinely sees a hardware camera.

**Response.** Assess sensor metadata plausibility and frame cadence; a capture-time challenge the prepared media cannot anticipate is the strongest single control.

**Residual.** The most resistant injection technique to software inspection, and the reason capture-time challenge values matter.

References: CEN/TS 18099:2024.

### T3004 Real-time face swap

- Effort: moderate
- Tell: In the image (Families A–E, G)
- Variants: `T3004.001` Live swap onto the operator's face; `T3004.002` Fully generated live puppet
- Controls: C05 Camera and driver enumeration; C04 Platform attestation; C16 Liveness and PAD ensemble; C03 Capture-time challenge
- Signal families: G Generative and manipulation artifacts; H Capture-path and device context; F Anomalous signals
- Persona capabilities: K32 Selfie-to-ID comparison; S26 Virtual camera risk level; S36 Max selfie liveness risk level

Generative software transforms the operator's live video into the target identity in real time and injects the result, so the media responds to instructions and challenges as they are issued.

**Response.** Step up to a cryptographic credential with holder binding, review, or decline. Combine generative artifact analysis with capture-path evidence.

**Residual.** The fastest-evolving technique in the matrix. Detection that recognizes current generators degrades predictably as new ones appear.

References: ENISA, Remote Identity Proofing: Attacks and Countermeasures; CEN/TS 18099:2024.

### T3005 Emulator fed prepared media

- Effort: low
- Tell: Only in the capture path (Family H)
- Controls: C06 Runtime environment assessment; C05 Camera and driver enumeration; C08 Frame timing analysis
- Signal families: H Capture-path and device context
- Persona capabilities: S26 Virtual camera risk level

An emulated device is configured so that its virtual camera returns a prepared video file, combining the environment technique at AT01 with injection at AT03 into a single low-cost workflow.

**Response.** Block unsupported environments where the flow requires a trustworthy capture path.

**Residual.** Cheap, scriptable, and easy to run at volume, which makes velocity and graph signals unusually productive against it.

References: CEN/TS 18099:2024.

## AT04 Transport and submission (Transport)

*Between the client and the service.* Assumes: what arrives is what this session captured.

Attacks here do not need to produce convincing media at all. They reuse or substitute media that was already accepted. Session binding rather than image analysis is what closes them.

### T4001 Payload substitution in transit

- Effort: moderate
- Tell: Only in the capture path (Family H)
- Controls: C10 Transport protection; C09 Session binding
- Signal families: H Capture-path and device context
- Persona capabilities: S13 TLS certificate fingerprint; S20 Request spoof attempts; S25 Unrecognised referer; X30 Domain allowlist; X32 Sandbox attributes

The captured media is replaced between the client and the service, so a genuine capture session produces a submission the adversary chose.

**Response.** Reject submissions that are not integrity-bound to the session that produced them.

**Residual.** Transport protection moves the problem to the client; a compromised client remains the more common route.

### T4002 Session replay

- Effort: low
- Tell: Only in the capture path (Family H)
- Controls: C09 Session binding; C03 Capture-time challenge; C18 Velocity and repeated artifacts
- Signal families: H Capture-path and device context
- Persona capabilities: K30 Pose repeat; S21 Mismatched user agent count; S25 Unrecognised referer; S40 Session count; S41 Sessions geolocation delta; X11 Create inquiries via API; X14 Inquiry one-time links; X15 Inquiry session limit; X16 Expiration from inquiry pending; X17 One-time link expiry; X18 Device handoff link; X30 Domain allowlist

A previously successful submission is resubmitted, either in a new session or against a different identity, on the assumption that media accepted once will be accepted again.

**Response.** Bind media server-side to its session and treat recurrence of an identical artifact across identities as a population signal.

**Residual.** Requires the adversary to have obtained a valid prior submission, which itself indicates a separate compromise.

### T4003 Direct submission with no capture

- Effort: low
- Tell: In the image (Families A–E, G)
- Controls: C16 Liveness and PAD ensemble; C11 Document authenticity analysis; C17 Device and network context
- Signal families: G Generative and manipulation artifacts; A Material and texture response; B Display and frequency artifacts
- Persona capabilities: K01 Government ID; K24 Processable submission; K42 Image suspicious metadata; S28 Any uploaded; S34 First image dimensions; S35 Device name missing; X01 Capture methods; X02 Capture a new photo; X03 Upload an existing image; X10 Transactions-based integration; X31 Permissions-Policy

A finished image is supplied to the service through an integration path that does not involve a Persona-controlled capture, so no capture context exists to describe.

**Response.** Content analysis still applies. Injection resistance in the sense used here does not, and any claim about it should be qualified accordingly.

**Residual.** This is the single most consequential configuration choice for injection resistance, and it is a customer decision.

### T4004 Cross-identity media reuse

- Effort: low
- Tell: Only across many submissions (Family F)
- Controls: C18 Velocity and repeated artifacts; C19 Link and graph analysis; C20 Risk intelligence matching
- Signal families: F Anomalous signals
- Persona capabilities: K16 Repeat; K17 Inconsistent repeat; K31 Selfie repeat; S48 Selfie visual cluster score; S49 Selfie visual cluster size; S52 Government ID inconsistent repeat count; G01 Device fingerprint; G04 Government ID number; G11 Linked via; X13 Reference ID; X23 Reject IDs previously submitted by other accounts

The same face capture or document image is submitted against multiple distinct claimed identities, often across accounts or over an extended period to stay below velocity thresholds.

**Response.** Recurrence of a biometric reference or document number across distinct identities is far more diagnostic than recurrence of a network address; thresholds should reflect that.

**Residual.** Only visible across transactions. A single submission carries no evidence of it.

## AT05 Evidence and identity (Evidence)

*What is claimed, not how it was captured.* Assumes: the evidence is genuine, and it belongs to them.

A technique at this stage can pass every capture and biometric control, because nothing about the capture is wrong. The evidence itself is what is false, or belongs to someone else.

### T5001 Fabricated document

- Effort: moderate
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T5001.001` Template-generated card; `T5001.002` Wholly invented issuer
- Controls: C11 Document authenticity analysis; C12 Encoded data validation; C14 Authoritative source corroboration; C20 Risk intelligence matching
- Signal families: none
- Persona capabilities: K02 Extracted properties; K03 Extraction inconsistency; K04 Barcode inconsistency; K05 MRZ inconsistency; K06 ID number format inconsistency; K07 Valid dates; K08 Fabrication; K11 Colour; K25 Allowed ID type; K38 Enhanced fraud detection; K39 Synthetic content detection; K40 Template detection; K44 PDF editor detection; K48 PKI validation; K52 Allowed issuer; K55 Identity comparison; K61 AAMVA identity comparison; K73 Business identity comparison; R01 Profile Report; S50 ID vision cluster score; S57 Address street entropy; M01 LexisNexis InstantID; X06 NFC verification; X19 Required checks; X20 Non-required checks; X21 Acceptable countries; X22 Acceptable ID types; X24 Require both sides of the ID

A document that was never legitimately issued, produced from a template or generated to order. Quality ranges from obviously wrong to close reproductions of current designs.

**Response.** Request alternate evidence or source corroboration, then review or decline. Version consistency is productive: a layout retired before the stated issue date is wrong however well made.

**Residual.** Visual analysis cannot establish with certainty that a physical document was legitimately issued.

### T5002 Altered genuine document

- Effort: moderate
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T5002.001` Portrait substitution; `T5002.002` Field alteration; `T5002.003` Physical lamination replacement
- Controls: C11 Document authenticity analysis; C12 Encoded data validation; C13 Cryptographic credential validation; C14 Authoritative source corroboration
- Signal families: none
- Persona capabilities: K03 Extraction inconsistency; K04 Barcode inconsistency; K05 MRZ inconsistency; K07 Valid dates; K09 ID image tampering; K10 ID physical tampering; K19 Portrait age; K21 Inquiry comparison; K38 Enhanced fraud detection; K41 Copy-move detection; K42 Image suspicious metadata; K43 JPEG original image detection; K44 PDF editor detection; K45 PDF abnormal font detection; K48 PKI validation; K49 Data tampering; K51 Attribute comparison; K58 Database face comparison; K61 AAMVA identity comparison; X03 Upload an existing image; X06 NFC verification; X24 Require both sides of the ID

A real document modified so that it supports a different identity or different attributes, most commonly a replaced portrait or an altered date, name, or number.

**Response.** Step up to issuing source or chip validation, which compares the visible page against signed data the forger cannot alter.

**Residual.** Digital and physical alteration leave different traces; a deployment that assesses only one covers only part of this technique.

References: ICAO Doc 9303.

### T5003 Stolen genuine document

- Effort: low
- Tell: In the image (Families A–E, G)
- Controls: C15 Face comparison; C16 Liveness and PAD ensemble; C13 Cryptographic credential validation; C20 Risk intelligence matching
- Signal families: A Material and texture response; D Depth, parallax, and geometry; E Motion and temporal consistency
- Persona capabilities: K15 Compromised submission; K16 Repeat; K18 ID-to-selfie comparison; K32 Selfie-to-ID comparison; K46 Recency; K47 Document selfie comparison; K50 Compromised NFC document; K57 Alive detection; K58 Database face comparison; K63 eCBSV death record; K65 Serpro face comparison; K66 Aadhaar face comparison; R07 Watchlist Report; R08 Politically Exposed Person Report; R09 Adverse Media Report; G04 Government ID number; X23 Reject IDs previously submitted by other accounts; X26 Run Report; X27 Mark Inquiry for Review

Authentic, unaltered evidence belonging to another person. Every document control returns a correct result, because there is nothing wrong with the document.

**Response.** Binding is the control that matters. Require face comparison against the document or chip portrait, and check compromised-evidence intelligence.

**Residual.** A document recorded as compromised may be presented by its rightful holder, which argues for review rather than automatic decline.

### T5004 Specimen or published template

- Effort: low
- Tell: Only across many submissions (Family F)
- Controls: C20 Risk intelligence matching; C11 Document authenticity analysis; C18 Velocity and repeated artifacts
- Signal families: F Anomalous signals
- Persona capabilities: K15 Compromised submission; K20 Public figure; K37 Public figure; K39 Synthetic content detection; K40 Template detection; S50 ID vision cluster score; S51 ID vision cluster size; S56 Public figure name detected; M12 PhotoDNA

A specimen document published by an issuer for reference purposes, or a widely circulated template image, submitted as if it were a real credential.

**Response.** Decline. These circulate widely and are a recurring source of low-effort attempts, often in volume from one source.

**Residual.** Intelligence about circulating artifacts ages, and a new specimen circulates before it is recorded.

### T5005 Synthetic identity

- Effort: high
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T5005.001` Real attributes recombined; `T5005.002` Cultivated identity with history
- Controls: C14 Authoritative source corroboration; C17 Device and network context; C18 Velocity and repeated artifacts; C19 Link and graph analysis; C23 Proportionate step-up; C24 Monitored exception path
- Signal families: none
- Persona capabilities: K21 Inquiry comparison; K55 Identity comparison; K56 2+2 detection; K57 Alive detection; K59 Inquiry comparison; K60 Deliverable address; K62 eCBSV record matched; K63 eCBSV death record; K64 TIN name comparison; K67 Carrier last name; K68 Carrier age threshold; K69 Phone code confirmation; K70 Phone deliverability; K73 Business identity comparison; K74 Active business detection; K75 Associated persons comparison; K76 Registered agent address; K77 Business footprint identity comparison; K78 Domain age detection; K79 Malicious website detection; K80 Website identity comparison; K81 Trademark ownership detection; R01 Profile Report; R02 Profile Non-Authoritative Report; R03 Phone Risk Report; R04 Email Address Report; R05 Address Lookup Report; R06 Social Media Report; R11 Synthetic Report; R12 SentiLink Scores Report; R13 Business Lookup Report; R14 Business Registrations Lookup Report; R15 Business Associated Persons Report; R16 Business Watchlist Report; R17 Business Adverse Media Report; S10 Country comparison; S43 Shortcut pastes; S55 First seen days ago; S57 Address street entropy; G05 Social security number; G08 Address; G10 Birthdate; M01 LexisNexis InstantID; M02 Prove; M03 AtData; M04 Clearbit; M05 FullContact; M06 MX; M07 VerifyMy; M08 SentiLink; M09 Mastercard Identity; M10 CRS Credit; M11 Nova Credit; X25 Conditional step; X26 Run Report

An identity assembled from a mix of real and fabricated attributes, sometimes cultivated over months so that it accumulates a plausible data footprint before it is used.

**Response.** Corroborate against authoritative sources, weigh phone and email tenure, and examine relationship structure. Thin or conflicting history is the usual tell.

**Residual.** A patiently cultivated identity can satisfy attribute corroboration. Tenure is what an adversary cannot create on demand, and what a cultivated identity buys.

References: NIST SP 800-63A r4.

### T5006 Compromised authoritative data

- Effort: high
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Controls: C13 Cryptographic credential validation; C15 Face comparison; C19 Link and graph analysis; C21 Human review; C24 Monitored exception path
- Signal families: none
- Persona capabilities: K50 Compromised NFC document; K52 Allowed issuer; K56 2+2 detection; X27 Mark Inquiry for Review; X29 Teams

The record a verification corroborates against is itself wrong, either because an issuing process was compromised or because breached personal data allows an adversary to satisfy knowledge-style checks.

**Response.** Do not treat corroboration as proof that the presenter is the rightful individual. Require binding, and route conflicts to human judgment.

**Residual.** If an issuing process was compromised, the resulting document is authentic. Cryptography confirms issuance and cannot assess the quality of it.

References: NIST SP 800-63A r4.

## AT06 Post-decision lifecycle (Lifecycle)

*After the verification has completed.* Assumes: the person who verified still holds the account.

Outside the verification event entirely. Every control in the earlier columns returned a correct result; what changed is who controls the account. Only lifecycle monitoring reaches this stage.

### T6001 Identity muling

- Effort: low
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T6001.001` Paid participant; `T6001.002` Coerced participant
- Controls: C22 Lifecycle monitoring; C19 Link and graph analysis; C17 Device and network context
- Signal families: none
- Persona capabilities: K28 Multiple faces; R11 Synthetic Report; S12 Geolocation language mismatch; S38 Behaviour threat level; S40 Session count; S41 Sessions geolocation delta; S43 Shortcut pastes; S44 Distraction events; S45 Hesitation ratio; S53 IP impossible travel; S54 Devices count; S60 Device count; G17 Graph Explorer; M06 MX; M08 SentiLink; M13 Chainalysis; M21 Yardstik; M24 Shopify; X15 Inquiry session limit; X18 Device handoff link; X28 Create Case

A real person completes the verification with their own genuine evidence, then transfers control of the account. Every capture, document, and biometric control returns a correct result.

**Response.** Address after the fact through lifecycle monitoring, transaction controls, and investigation of related activity.

**Residual.** The structural limit of biometric binding. A genuinely present, genuinely matching person cannot be detected at the verification event.

References: Persona Research, Identity muling and second-party fraud.

### T6002 Account takeover

- Effort: moderate
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Controls: C22 Lifecycle monitoring; C17 Device and network context; C23 Proportionate step-up
- Signal families: none
- Persona capabilities: K22 Account comparison; K33 Account comparison; K53 Credential account comparison; K54 SIM verification; R03 Phone Risk Report; S47 Reusable persona used; S60 Device count; S61 Address update count; S63 New mobile device used during reverification; M16 Okta; M17 Microsoft Entra; M19 Auth0; M20 Stytch; M24 Shopify

Control of an existing verified account is obtained through credential compromise, session theft, or social engineering, inheriting the assurance of the original verification.

**Response.** Step up authentication or identity verification on device novelty, geography change, and recent SIM swap indicators.

**Residual.** Identity proofing establishes a link at one moment. It does not describe who controls the account afterwards.

References: NIST SP 800-63A r4.

### T6003 Recovery path abuse

- Effort: moderate
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T6003.001` SIM swap then recovery; `T6003.002` Support-channel social engineering
- Controls: C23 Proportionate step-up; C22 Lifecycle monitoring; C17 Device and network context; C21 Human review; C24 Monitored exception path
- Signal families: none
- Persona capabilities: K22 Account comparison; K33 Account comparison; K54 SIM verification; K67 Carrier last name; K69 Phone code confirmation; K71 Email code confirmation; K72 Confirmation code timeout; R03 Phone Risk Report; S61 Address update count; S63 New mobile device used during reverification; G06 Phone number; M02 Prove; M16 Okta; M17 Microsoft Entra; M18 Cisco Duo; M22 Twilio

The account recovery flow is attacked instead of onboarding, because recovery is frequently configured as a weaker path while protecting an asset that has become more valuable.

**Response.** Recovery should not establish control of an account on evidence weaker than the evidence that opened it. Recent SIM swap is particularly significant here.

**Residual.** An adversary who cannot pass onboarding has an obvious incentive to attack recovery, and often finds a shorter path.

References: NIST SP 800-63A r4.

### T6004 Coordinated ring at scale

- Effort: high
- Tell: No face or camera trace (Document, data, population, lifecycle)
- Variants: `T6004.001` Star around a shared artifact; `T6004.002` Chain through sequential links; `T6004.003` Dense cluster from a shared toolkit
- Controls: C19 Link and graph analysis; C18 Velocity and repeated artifacts; C20 Risk intelligence matching; C22 Lifecycle monitoring
- Signal families: none
- Persona capabilities: K17 Inconsistent repeat; K31 Selfie repeat; K75 Associated persons comparison; K76 Registered agent address; R07 Watchlist Report; R09 Adverse Media Report; R10 Crypto Address Watchlist Report; R15 Business Associated Persons Report; R16 Business Watchlist Report; S05 Risk level; S06 IP burst; S08 IP prefix /24; S09 Session ASNs; S11 Impossible travel geolocation; S39 Behaviour anomaly; S46 Off-hours session; S48 Selfie visual cluster score; S49 Selfie visual cluster size; S50 ID vision cluster score; S51 ID vision cluster size; S53 IP impossible travel; S54 Devices count; S58 Inquiry velocity; S62 List match count; G01 Device fingerprint; G02 Browser fingerprint; G03 IP address; G04 Government ID number; G05 Social security number; G06 Phone number; G07 Email address; G08 Address; G09 Name; G10 Birthdate; G11 Linked via; G12 Linked to; G13 Cluster; G14 Cluster size; G15 Hops; G16 Starting nodes; G17 Graph Explorer; G18 Query; G19 Query template; G20 Maximum hops; M13 Chainalysis; M14 TRM Labs; M15 Notabene; M23 Slack; M25 Anthropic; M26 OpenAI; X13 Reference ID; X28 Create Case

Activity distributed across many people, accounts, devices, or documents so that no single submission is anomalous. The structure connecting the attempts is the finding, not any one of them.

**Response.** Restrict linked accounts, investigate the cluster, and refine policy. A star can often be blocked at the hub; a chain requires investigation to find its extent.

**Residual.** The first application in a cluster has no cluster to belong to yet. It becomes suspicious only when the fourth arrives.

