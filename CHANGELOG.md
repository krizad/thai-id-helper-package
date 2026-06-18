# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-18

### Added

- **`ThaiID` branded type** — compile-time guarantee that a string is a validated Thai ID
- **`ThaiIDError` class** — custom error thrown by `parseThaiID()` and `generateMockThaiID()`
- **`parseThaiID()`** — strict parser that returns a branded `ThaiID` type or throws `ThaiIDError`
- **`unformatThaiID()`** — removes dashes from a formatted Thai ID
- **`isFormattedThaiID()`** — checks whether a string is in the `X-XXXX-XXXXX-XX-X` format
- **`generateMockThaiID(firstDigit?)`** — now accepts an optional `firstDigit` parameter (1–8) to control the person type; throws `ThaiIDError` for out-of-range values
- **`getProvinceName()`** — looks up province name in Thai from a 2-digit province code
- **`provinceName` field** on `ThaiIDInfo` — returned by `extractThaiIDInfo()`
- **`exports` map** in `package.json` for proper ESM/CJS dual-package support
- **`sideEffects: false`** in `package.json` for tree-shaking
- **`files` field** in `package.json` to control published files
- **`publishConfig.access: "public"`** in `package.json`
- **`engines` field** in `package.json` (`node >= 16`)
- **Scripts** — `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test:coverage`
- **ESLint flat config** with TypeScript support (`eslint.config.js`)
- **Prettier config** (`.prettierrc`, `.prettierignore`)
- **GitHub Actions CI** — matrix testing on Node 18/20/22 with lint, typecheck, coverage
- **JSDoc `@param` and `@returns`** tags on all exported functions

### Fixed

- Province code `19` now correctly maps to "พระนครศรีอยุธยา" (was incorrectly "ลพบุรี")

### Changed

- `package.json` `"type"` set to `"module"` for ESLint config compatibility
- `"main"` and `"module"` fields updated to match CJS (`.cjs`) and ESM (`.js`) build outputs
- Added Thai-language keywords to `package.json` for better npm discoverability

## [1.0.3] - 2024-04-27

### Added

- Initial release with `validateThaiID`, `formatThaiID`, `maskThaiID`, `generateMockThaiID`, `extractThaiIDInfo`

[1.1.0]: https://github.com/krizad/thai-id-kit/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/krizad/thai-id-kit/releases/tag/v1.0.3