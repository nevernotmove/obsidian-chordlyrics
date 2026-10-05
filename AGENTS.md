# Repository guidance

## Commands and build behavior
- Use `npm ci` with the committed `package-lock.json`; run commands from the repository root.
- `npm run build` runs TypeScript checking, bundles `src/main.ts` as CommonJS, then copies `manifest.json` and `styles.css` into `build/`. Obsidian is external to the bundle and supplied by the host app.
- Typecheck only: `npx tsc -noEmit -skipLibCheck`.
- `npm run dev` watches JavaScript only: it does not typecheck or copy the manifest/CSS. Both dev and production bundling clear `build/` on startup; do not hand-edit build artifacts.
- `npm test -- --runInBand` runs the suite. Focus one file with `npm test -- --runInBand --runTestsByPath src/chunk/findChunks.test.ts`; append `-t 'test name'` to filter cases.
- Jest uses `ts-jest`, defaults to Node, and collects coverage even for focused runs. DOM tests need the `@jest-environment jsdom` file docblock used in `src/output/createHtml.test.ts`; no Obsidian installation is needed for the existing unit tests.

## Rendering constraints
- `src/main.ts` registers the `chordlyrics` fenced-block processor: `findLines` → `findChunks` (including `findTwoLineChunks`) → `createHtml`. Wrapping is handled by root `styles.css`, not by inserting line breaks in the parser.
- Whitespace is semantic: chord detection uses a literal-space/content ratio, and paired chord/lyric chunks retain character offsets and pad the shorter line. Do not normalize input or fixture spacing as cosmetic cleanup.
- HTML classes from `createHtml` and CSS must stay aligned; chord/lyric pairs wrap together as `.chordlyrics-stack` elements under a monospace, whitespace-preserving root.

## Manual testing and versioning
- For visual testing, run `npm run build` before `npm run deploy-test`. Deployment does not build; it copies `build/` and opens `obsidian://open?vault=test-vault&file=chord-lyrics`, requiring Obsidian and the test vault to be available.
- **Deployment deletes all of `test-vault/.obsidian`, not just this plugin.** It removes vault settings and other installed plugins; only use it when that reset is intended. The tracked sample is `test-vault/chord-lyrics.md`.
- The npm `version` lifecycle updates `manifest.json` and `versions.json` from `npm_package_version` and stages both files. `.npmrc` sets an empty tag prefix, so `npm version` creates bare version tags rather than `v`-prefixed tags; do not invoke it casually for a metadata edit.
