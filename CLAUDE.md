# Sanity Uplift

Moze's shared layer for Sanity Studio: a theme (`upliftTheme()`) and a plugin (`uplift()`) that change how every Moze Studio reads. [README.md](README.md) covers what it does; [CONTRIBUTING.md](CONTRIBUTING.md) covers the rules and the release. Read both before changing anything.

## Words

Use the terms in [GLOSSARY.md](GLOSSARY.md), in code, docs, commits and PRs. Examples: token group, rule set, rule variable, token bridge, nested content (not "nested fieldset"), field title (not "label"). When a new concept appears, add it there first.

## Layout

```text
src/
├── tokens.ts   # UpliftTokens and the `comfortable` defaults
├── theme.ts    # upliftTheme(): writes the tokens into a StudioTheme (v2 + root fonts)
├── bridge.ts   # buildTokenBridge(): theme scales → Sanity UI 5 :root properties
├── styles.ts   # buildStyles(): the rule sets (form, arrays) and their rule variables
├── plugin.tsx  # uplift(): layout wrapper that injects bridge + rules in one <style>
└── index.ts    # public exports
docs/
├── sanity-studio-surface.md  # what a theme, a plugin and CSS can change in a Studio
└── adr/                      # decisions worth a record
dev/            # dev Studio running src/, never published
scripts/        # release.mjs: cuts a release, and the checks CI runs on it
dist/           # compiled output, committed: projects install from git tags
```

## Commands

```sh
pnpm test        # vitest
pnpm typecheck   # src/ and the dev Studio
pnpm build       # rewrites dist/; commit it with the change, CI fails otherwise
pnpm dev         # dev Studio on :3333, needs dev/.env.local (see CONTRIBUTING.md)
pnpm dev:seed    # imports the Fixture document into the dev Studio's dataset
pnpm release patch|minor|major   # cuts a release from CHANGELOG.md's "## Unreleased"
pnpm release:check origin/main   # what CI checks about the version and the changelog
```

Run test, typecheck and build before you finish. If you touch `src/`, `dist/` changes too.

Every pull request adds a line under `## Unreleased` in `CHANGELOG.md`. One that changes `dist/` also cuts a release, so projects can install it: see [CONTRIBUTING.md](CONTRIBUTING.md#release). CI tags the new version when it reaches `main`; never push a tag yourself. The one exception is when GitHub Actions is off: then follow [If CI is off](CONTRIBUTING.md#if-ci-is-off), and only when the user asks.

## Facts about Sanity come from the installed source

The Studio's internals change between releases, and memory or old docs are often wrong. Check claims about the theme, the DOM or the plugin API in `node_modules/sanity/lib` and `node_modules/@sanity/ui`. Bundle file names are hashed, so grep for the component or attribute. [docs/sanity-studio-surface.md](docs/sanity-studio-surface.md) is the current map. Update it when you learn something new, and note the Sanity version you checked against.

Traps already found, on Sanity 6.24:

- **The theme belongs to the workspace config.** A plugin cannot set it.
- **The Studio keeps only `v2`, `fonts` and `color` of a theme.** Every other root key is discarded.
- **The form chrome ignores the theme.** It is built with Sanity UI 5 (bundled as `ui5`, an alpha), which reads its own `:root` properties. That is why the token bridge exists ([ADR 0001](docs/adr/0001-token-bridge-and-targeted-rules.md)).
- **Generic `data-ui` names are not stable hooks.** Names like `Box`, `Stack`, `VStack`, `Text` and `Grid` change when Sanity swaps a primitive. Prefer `data-testid`, named `data-ui` values, `data-level` and the `desc_` ids.

## Verifying a rule

Unit tests only check the CSS string. A selector that stops matching fails silently, so a change to a rule or to the bridge is not done until someone has checked it in a running Studio, in light and dark mode.

Use the dev Studio for this. `/uplift` and `/stock` show the same `Fixture` document with and without Uplift. When a rule targets a part of the form that `Fixture` lacks, add a generic field to `dev/schema.ts`, and give it content in `dev/seed/fixture.ndjson`. If you could not check a change, say so in the PR and in the map. Never call it verified.

## Decisions

Record a decision in `docs/adr/` (`NNNN-slug.md`, a short paragraph) only when it is hard to reverse, surprising without context and the result of a real trade-off.

## Agent skills in this repo

`.claude/skills/` vendors Sanity's own skills: `sanity-plugin-authoring`, `sanity-best-practices` and `sanity-plugin-best-practices`.

`sanity-plugin-best-practices` is written for the `sanity-io/plugins` monorepo: vanilla-extract, and no raw `<style>` tags. Uplift is different. Its product *is* global CSS aimed at the Studio's own markup, and the token bridge is built from the theme at runtime. Where that skill conflicts with CONTRIBUTING.md or an ADR, this repo's documents win. Raise the conflict instead of rewriting the styling approach on your own.
