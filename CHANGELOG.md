# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-18

### Added

- **`validateThaiID()`** — validate Thai National ID using check-digit algorithm
- **`formatThaiID()`** — format a 13-digit ID with dashes (`X-XXXX-XXXXX-XX-X`)
- **`maskThaiID()`** — mask middle 7 digits for PDPA compliance
- **`generateMockThaiID(firstDigit?)`** — generate mock IDs for testing; optional `firstDigit` (1–8) to control person type
- **`extractThaiIDInfo()`** — extract person type, province code, district code, etc. from an ID
- **`parseThaiID()`** — strict parser returning a branded `ThaiID` type or throwing `ThaiIDError`
- **`unformatThaiID()`** — remove dashes from a formatted Thai ID
- **`isFormattedThaiID()`** — check if a string matches the `X-XXXX-XXXXX-XX-X` format
- **`ThaiID` branded type** — compile-time guarantee that a string is a validated Thai ID
- **`ThaiIDError` class** — custom error thrown by `parseThaiID()` and `generateMockThaiID()`
- **`getProvinceName()`** — look up province name in Thai from a 2-digit province code
- **`provinceName` field** on `ThaiIDInfo` returned by `extractThaiIDInfo()`
- ESM/CJS dual-package support via `exports` map
- `sideEffects: false` for tree-shaking
- `files` field to control published files
- `publishConfig.access: "public"`
- `engines` field (`node >= 16`)
- Scripts — `build`, `dev`, `test`, `test:watch`, `test:coverage`, `lint`, `lint:fix`, `format`, `format:check`, `typecheck`
- ESLint flat config with TypeScript support
- Prettier config
- GitHub Actions CI — matrix testing on Node 18/20/22
- JSDoc `@param` and `@returns` tags on all exported functions

[1.0.0]: https://github.com/krizad/thai-id-helper-package/releases/tag/v1.0.0