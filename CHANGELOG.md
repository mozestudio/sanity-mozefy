# Changelog

## Unreleased

## 0.4.0 - 2026-11-25

Tightens the form's structure: containers read as groups, and every title starts on the same edge. Checked in the dev Studio on Sanity 6.24.0, in dark and light mode, and 380 px wide.

- **Container titles read heavier.** They were one step (2 px) above field titles at the same weight, which barely showed. They now also take `--uplift-container-title-weight`, `700` by default.
- **Nested content reads as one group.** Its fields sit 22 px apart, spacing step 4, under half the 56 px between the document's own fields. Sanity spaced an object's fields like the document's, and a fieldset's on step 5. Retune with `--uplift-nested-field-gap`.
- **Collapsible titles and group tabs line up with the fields.** The collapse arrow hangs before the edge, so a collapsible title starts where the fields around it start, 12 px further left than before. The group tabs move back by their own padding, `--uplift-group-tab-inset` (step 2, 8 px), so their labels start on that edge too. At narrow widths the group select stays where it was.
- **Nested content is indented with `padding-inline-start`**, not `padding-left`.
- **`buildStyles()` takes the spacing and type scale** as its second argument, `{space, text}`, both defaulting to `comfortable`. New export: `UpliftStyleScales`.
- **Description and container title sizes follow the type scale.** A project that retunes `tokens.text` keeps the same hierarchy: descriptions sit 1 px under body text, container titles on step 2. The defaults are unchanged with `comfortable`.
- **For contributors:** [CONTRIBUTING.md](CONTRIBUTING.md#if-ci-is-off) says how to check a pull request and tag a release by hand when GitHub Actions is off.

## 0.3.0 - 2026-11-25

Makes Uplift work on Sanity 6.24, whose form chrome ignores the theme. Checked in the dev Studio on Sanity 6.24.0, in dark and light mode. Sanity 5 has not been checked yet.

- **Token bridge.** `uplift()` reads the theme in use and rewrites Sanity UI 5's `--space-N` and `--body-N`, so field headers and nested content follow the spacing and type scale. Turn it off with `uplift({bridge: false})`.
- **Rules rewritten for the markup of 6.24:**
  - Fieldset and object titles now get the title weight.
  - Descriptions are targeted by their `desc_` id, so collapsible fieldset titles are left alone.
  - The nested content indent matches again.
  - The array rule adds room inside each item instead of setting a gap on a list that is virtualised.
- **New form rules:**
  - Container titles, the titles of objects and fieldsets with nested content, read one step above the field titles inside them: 16 px against 14 px.
  - The collapse arrow of a collapsible object or fieldset is drawn larger and centred on its title. Sanity's triangle was about 3 px wide.
  - Group tabs are 32 px tall, and sit as far from the first field as fields sit from each other. Before, they were 20 px further away.
- **Rule variables can be overridden.** Their defaults are declared in `:where(:root)`, so a project's `:root` rule wins. Before, Uplift's defaults loaded later and won.
- **Breaking:** `--uplift-fieldset-indent` is now `--uplift-nested-content-indent`. The old one never took effect on 6.24.
- **New peer dependency:** `styled-components` ^6.1.15, which Sanity already requires.
- **New exports:** `buildTokenBridge()` and `BridgeTheme`.
- **Docs:**
  - [GLOSSARY.md](GLOSSARY.md) defines the terms used across code and docs.
  - [docs/sanity-studio-surface.md](docs/sanity-studio-surface.md) maps what a theme, a plugin and CSS can change in a Sanity Studio.
  - [ADR 0001](docs/adr/0001-token-bridge-and-targeted-rules.md) records why Uplift has both a bridge and targeted rules.
- **For contributors** (nothing here ships in the package):
  - A dev Studio in `dev/` runs the plugin from `src/`. Its `/uplift` and `/stock` workspaces show the same `Fixture` document with and without Uplift. `pnpm dev:seed` imports the document.
  - [CLAUDE.md](CLAUDE.md) briefs agents working in this repo, and `.claude/skills/` vendors Sanity's agent skills.
  - Releases are cut with `pnpm release patch|minor|major`. CI checks that a change to `dist/` comes with a new version, and tags each new version that reaches `main`. See [CONTRIBUTING.md](CONTRIBUTING.md#release).

## 0.2.0 - 2026-11-25

Renamed from `sanity-mozefy` to `sanity-uplift`. Breaking: only the names change, the behaviour is the same.

| Before | After |
| --- | --- |
| `@mozestudio/sanity-mozefy` | `@mozestudio/sanity-uplift` |
| `mozefyTheme()` | `upliftTheme()` |
| `mozefy()` | `uplift()` |
| `MozefyOptions`, `MozefyStyleOptions`, `MozefyThemeOptions`, `MozefyTokens` | `UpliftOptions`, `UpliftStyleOptions`, `UpliftThemeOptions`, `UpliftTokens` |
| `--mozefy-*` custom properties | `--uplift-*` |

- **Docs:** the README is written for a public repo, and the contributor guide moved to [CONTRIBUTING.md](CONTRIBUTING.md).

## 0.1.0 - 2026-11-25

- `mozefyTheme()`: the comfortable spacing scale and `Text` scale on top of any base theme.
- `mozefy()`: form rules (field title and description hierarchy, nested fieldsets) and array rules (gap between items), each with custom properties to retune.
- Installed straight from a GitHub tag, with the compiled `dist/` committed. There is no registry.
