# Standards and questions

> Source: Persona Research, Identity Fraud Control Matrix — snapshot of https://labs.withpersona.com/fraud-controls as of October 2026. Generated from `data/matrix.json`.

## Standards

- **[ISO/IEC 30107-3:2023](https://www.iso.org/standard/79520.html)** — Testing and reporting for biometric presentation attack detection. Use for evaluation scope and metrics at stage AT02. Do not imply it covers media injection or system-level attacks.
- **[ISO/IEC 30107-1:2023](https://www.iso.org/standard/83828.html)** — The presentation attack detection framework, including the vocabulary of instruments and species used throughout this matrix.
- **[CEN/TS 18099:2024](https://standards.cencenelec.eu/)** — Framework for detecting and evaluating biometric data injection attacks, meaning samples replaced or modified before feature extraction. The correct counterpart to 30107-3 for stage AT03, not a substitute for it.
- **[ISO/IEC 19795-1:2021](https://www.iso.org/search.html?q=ISO%2FIEC+19795-1)** — Principles and framework for biometric performance testing and reporting. Use for face comparison methodology and for the form in which error rates should be quoted.
- **[ISO/IEC 19795-10:2024](https://www.iso.org/search.html?q=ISO%2FIEC+19795-10)** — Quantifying performance variation across demographic groups. The relevant reporting form is per-group error at a fixed operating point, not a single aggregate.
- **[ISO/IEC 29794-5](https://www.iso.org/search.html?q=ISO%2FIEC+29794-5)** — Face image quality assessment, including component measures reported alongside a unified score. Quality conditions everything downstream of it.
- **[ISO/IEC 2382-37](https://www.iso.org/search.html?q=ISO%2FIEC+2382-37)** — Harmonized biometric vocabulary. Use to fix terminology before comparing vendor claims, because much apparent disagreement is vocabulary.
- **[NIST SP 800-63A r4](https://csrc.nist.gov/pubs/sp/800/63/a/r4/final)** — Identity proofing and enrollment: resolution, validation, verification, fraud checks, privacy, redress, and accessibility. Tie any assurance-level claim to a defined service, configuration, and assessment scope.
- **[ETSI TS 119 461](https://www.etsi.org/deliver/etsi_ts/119400_119499/119461/02.01.01_60/ts_119461v020101p.pdf)** — Policy and security requirements for identity proofing service components, including the five-task operational model and the proofing record.
- **[ICAO Doc 9303](https://www.icao.int/publications/pages/publication.aspx?docnum=9303)** — Machine-readable travel documents, chip data, and the public key infrastructure behind electronic passport validation.
- **[ENISA remote identity proofing](https://www.enisa.europa.eu/publications/remote-identity-proofing-attacks-countermeasures)** — Threat analysis and good practice, including presentation attacks, deepfakes, and injection. Guidance rather than a conformance standard.

## Questions to ask of any quoted PAD figure

- **Which instrument species were tested, and which were not?** A result covers only the species in the test set. Untested classes are not covered by the number, however strong it looks.
- **Presentation attacks only, or injection as well?** Separate attack classes with separate controls, in columns AT02 and AT03 of this matrix. A result about one is not evidence about the other.
- **Which devices, operating systems, and capture modes?** Camera quality, available sensors, and platform integrity features vary enormously. Results do not transfer across device classes.
- **Video sequence or single still?** A single still removes the motion and temporal families entirely, which materially changes what is detectable.
- **At what operating point, and what was the paired error rate?** Either error rate can be made to look excellent by sacrificing the other. Both are needed.
- **Which population, and was error reported by group?** Aggregates can conceal materially worse performance for a subgroup. ISO/IEC 19795-10 addresses this.
- **Which product version, tested when?** Both models and attacks change. A result ages, and results against generative attacks age fastest.
- **Laboratory evaluation or production monitoring?** Laboratory testing gives comparability under controlled conditions; production monitoring gives evidence about the real distribution. Neither substitutes for the other.
