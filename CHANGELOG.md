# Changelog

## Unreleased

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

## 0.2.0

Renamed from `sanity-mozefy` to `sanity-uplift`. Breaking: only the names change, the behaviour is the same.

| Before | After |
| --- | --- |
| `@mozestudio/sanity-mozefy` | `@mozestudio/sanity-uplift` |
| `mozefyTheme()` | `upliftTheme()` |
| `mozefy()` | `uplift()` |
| `MozefyOptions`, `MozefyStyleOptions`, `MozefyThemeOptions`, `MozefyTokens` | `UpliftOptions`, `UpliftStyleOptions`, `UpliftThemeOptions`, `UpliftTokens` |
| `--mozefy-*` custom properties | `--uplift-*` |

## 0.1.0

- `mozefyTheme()`: the comfortable spacing scale and `Text` scale on top of any base theme.
- `mozefy()`: form rules (field title and description hierarchy, nested fieldsets) and array rules (gap between items), each with custom properties to retune.
