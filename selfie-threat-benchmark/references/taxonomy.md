# Threat taxonomy and attack paths

> Source: https://threats.withpersona.com (Persona FAS Gallery, app version 1.001), as of 2026-10-17; the same content is in `data/taxonomy.json`. Index names are from `/gallery-index.json` → `codes`.

Every sample is tagged with codes from four stages an attacker moves through: choose a **Subject** (ST), obtain the selfie (**Asset Procurement**, AP), alter it (**Asset Refinement**, AR), and submit it (**Delivery**, DL). A sample has one ST and one AP, any number of AR (`arCount`; AR-01 means none) and one or more DL. Where the gallery index and the app use different names for a code, both are shown.

## ST Subject

The attacker chooses a subject.

| Code | Name | Description | Sub-techniques |
|---|---|---|---|
| ST-01 | Real Person | The face belongs to a real person | Victim’s face, Attacker’s face, Accomplice |
| ST-02 | Synthetic Person (index: Synthetic face) | The face is fully or partially generated | Fully AI-generated face, Face swap, Partially regenerated face |
| ST-03 | Non-Human (index: Nonhuman) | A doll, mannequin, or other physical object | Doll, Mannequin, Other non-human object |

## AP Asset Procurement

How the attacker obtains or creates a selfie.

| Code | Name | Description | Sub-techniques |
|---|---|---|---|
| AP-01 | No Change | Using a photo, video, or live capture without modification. | — |
| AP-02 | Face Swap | Swapping the target's face onto the attacker's face. | Static image face swap, Video face swap, Real-time face swap |
| AP-03 | AI Image Generation | Using AI to generate a face. | Diffusion-generated face, GAN-generated face, Prompt-generated identity |
| AP-04 | Phishing Flow | Sending victims phishing links to fake identity verification flows to collect selfies and ID images. | Fake IDV flow that impersonates a real provider, Fake business that requests a selfie during onboarding, Scam account verification requests, Scams that incidentally capture content |
| AP-05 | Unauthorized Access | Using the identity of a nearby person, such as a friend, family member, or sleeping subject. | Public or compromised photos, Stolen identity document, Unaware or sleeping victim |
| AP-06 | Identity Muling | Having a real person verify their identity and then share the account credentials. | Paid verification, Shared verified account, Credential transfer |
| AP-07 | Masked Face (index: Physical Disguise) | Altering the subject using a wig, makeup, drawn-on facial hair, glasses, or other disguise. | Silicone, Resin, 3D-printed, Fabric, Paper or cardboard, Prosthetic |

## AR Asset Refinement

The attacker uses different techniques to alter the selfie and attempt to evade detection.

| Code | Name | Description | Sub-techniques |
|---|---|---|---|
| AR-01 | No Refinement | The content isn't refined any further. | — |
| AR-02 | Physical Occlusion | The face is obscured with a physical object. | Glasses, Hat or hood, Scarf or face covering, Facial hair |
| AR-03 | Physical Printing | Printing an image or object that resembles a face. | Printed portrait, Paper mask, Mounted cutout |
| AR-04 | Artifact Suppression | Eliminating generation and fabrication artifacts that fraud detectors look for. | Seam removal, Edge blending, Texture cleanup, Inpainting defects |
| AR-05 | Noise Injection | Adding characteristics of real camera capture, such as sensor noise and lens effects. | Sensor noise, Film grain, Motion blur, Lens effects |
| AR-06 | Compression Manipulation | Exploiting lossy compression to destroy forensic traces. | JPEG recompression, Codec conversion, Multiple lossy generations |
| AR-07 | Colour AND Lighting Matching (index: Color and Lighting Matching) | Manipulating the color and lighting profile of the asset or physical environment to evade detection. | White-balance correction, Skin-tone matching, Shadow correction, Low-light capture |
| AR-08 | Resolution AND Format Matching (index: Resolution and Format Matching) | Adjusting technical characteristics, such as resolution and format, to match expected device output. | Downscaling, Aspect-ratio crop, Bit-depth adjustment, Orientation matching |
| AR-09 | Metadata Sanitization | Removing or forging non-visual metadata that could reveal the fraud. | EXIF stripping, Timestamp manipulation, Software fingerprint removal |
| AR-10 | Geometric Transformation | Applying small changes to an image in an attempt to evade hash-based detection. | Horizontal flip, Rotation, Crop or scale shift, Affine warp |
| AR-11 | Background Outpainting | Generating or extending the background around the subject. | Generated capture environment, Extended frame, Background replacement |
| AR-12 | Face Inpainting | Regenerating or replacing part of the face without changing the rest of the image. | Regional face replacement, Feature regeneration, Partial facial modification |

## DL Delivery

The attacker submits the selfie to the selfie verification request system..

| Code | Name | Description | Sub-techniques |
|---|---|---|---|
| DL-01 | Physical Presentation | Holding a physical object in front of the camera. | — |
| DL-02 | Screen Replay | Taking a picture or video of another screen that's displaying the selfie. | Phone display, Monitor or television, Tablet, Video-call feed |
| DL-03 | Virtual Camera Injection | Intercepting the camera feed and substituting selfie content. | Virtual camera software, Custom camera driver, Modified camera interface |
| DL-04 | API / SDK Injection | Submitting the content directly through or around the verification API or SDK. | Direct API request, Modified SDK, Payload replacement, Session replay |
| DL-05 | Device Compromise | Compromising the capture device to bypass integrity checks and camera API controls. | Rooted or jailbroken device, Emulator, Modified camera stack, API hooks |

## Attack paths

The app defines 24 named attack paths: an ordered set of codes with a sophistication level. Paths `s1`/`s2` are **signal-only**: a real face with nothing to see in the image (identity muling, a real lookalike), found only through other signals. A tag set follows a path when its ST and AP equal the path's, every AR tag is on the path and at least one DL tag is (the app's own rule). Most gallery samples carry several DL tags and AR-01, so they follow no named path; the paths describe the taxonomy, not the sample labels.

| Path | Sophistication | Description | Codes |
|---|---|---|---|
| p1 | Low | An unauthorized real-face asset is replayed from a screen. | ST-01 → AP-05 → DL-02 |
| p2 | Low | An unauthorized real-face asset is printed and physically presented. | ST-01 → AP-05 → AR-03 → DL-01 |
| p3 | Low | A fabricated non-human face is physically presented. | ST-03 → AP-01 → DL-01 |
| p4 | Low | A real identity obtained without authorization is physically presented. | ST-01 → AP-05 → DL-01 |
| p17 | Low | A real identity obtained without authorization is delivered through screen replay. | ST-01 → AP-05 → DL-02 |
| p5 | Low | A real identity is presented with physical occlusions. | ST-01 → AP-01 → AR-02 → DL-01 |
| p6 | Medium | A real identity uses a physical disguise and added occlusions. | ST-01 → AP-07 → AR-02 → DL-01 |
| p7 | Medium | A physical disguise is presented in lighting chosen to conceal its edges. | ST-01 → AP-07 → AR-07 → DL-01 |
| p8 | Medium | An unauthorized real-face asset is injected through a virtual camera. | ST-01 → AP-05 → DL-03 |
| p9 | Medium | An unauthorized real-face asset is submitted through API or SDK injection. | ST-01 → AP-05 → DL-04 |
| p15 | Medium | A phished real-face asset is injected through a virtual camera. | ST-01 → AP-04 → DL-03 |
| p16 | Medium | A phished real-face asset is submitted through API or SDK injection. | ST-01 → AP-04 → DL-04 |
| p10 | Medium | A face swap is injected through a virtual camera. | ST-02 → AP-02 → DL-03 |
| p11 | High | A face swap has artifacts suppressed and camera noise added before injection. | ST-02 → AP-02 → AR-04 → AR-05 → DL-03 |
| p12 | High | A generated face is cleaned, given camera noise, recompressed, and injected. | ST-02 → AP-03 → AR-04 → AR-05 → AR-06 → DL-03 |
| p13 | High | A phished real face is partially regenerated, color-matched, and directly submitted. | ST-01 → AP-04 → AR-12 → AR-07 → DL-04 |
| p14 | High | A face swap is delivered from a compromised device. | ST-02 → AP-02 → DL-05 |
| p18 | High | A face swap is transformed and recompressed before virtual-camera injection. | ST-02 → AP-02 → AR-06 → AR-10 → DL-03 |
| p19 | High | A generated identity is transformed and recompressed before virtual-camera injection. | ST-02 → AP-03 → AR-06 → AR-10 → DL-03 |
| p20 | High | A phished face is inpainted, transformed, recompressed, and directly submitted. | ST-01 → AP-04 → AR-12 → AR-06 → AR-10 → DL-04 |
| p21 | High | A face swap receives several evasion refinements before injection. | ST-02 → AP-02 → AR-04 → AR-05 → AR-10 → DL-03 |
| p22 | High | A generated face receives several evasion refinements before injection. | ST-02 → AP-03 → AR-04 → AR-05 → AR-06 → AR-10 → DL-03 |
| s1 | — (signal-only) | An identity mule completes verification with their real face. | ST-01 → AP-06 → DL-01 |
| s2 | — (signal-only) | A real lookalike submits an unchanged face. | ST-01 → AP-01 → DL-01 |
