# Sanity Uplift

[![CI](https://github.com/mozestudio/sanity-uplift/actions/workflows/ci.yml/badge.svg)](https://github.com/mozestudio/sanity-uplift/actions/workflows/ci.yml)
![Sanity](https://img.shields.io/badge/sanity-v5%20%7C%20v6-f03e2f)
![Node](https://img.shields.io/badge/node-%3E%3D22-339933)

**A calmer, more readable Sanity Studio for the people who write in it.**

Sanity Uplift is the shared Studio layer we use at [Moze](https://github.com/mozestudio) on every Sanity project. It changes how the Studio reads, not what it does: a larger type scale, roomier spacing and a clearer hierarchy inside forms, so editors who are not developers can find their way through long documents.

It carries nothing project-specific. Your schemas, structure, colours and copy stay where they are.

- **Readable type.** Body text goes from 13 to 14 px, small text from 10 to 11 px.
- **Room to breathe.** The middle steps of the spacing scale open up, so fields and controls stop crowding each other.
- **Clear form hierarchy.** Field titles read stronger than their descriptions, descriptions keep a readable line length, nested content is indented, and an object's title reads above the fields inside it.
- **Lists that read as cards.** Array items get space between them, in plain lists and page builders alike.
- **Composes with your theme.** Uplift touches only spacing and type, so it sits on top of any colour theme.
- **Tunable, not forkable.** Every value is a theme token or a CSS custom property you can override.

> [!NOTE]
> **Sanity 6.24 and later.** These versions build the form chrome (field headers, fieldsets, nested content) with Sanity UI 5, which ignores the theme. The `uplift()` plugin carries the theme's scales across with a [token bridge](#how-it-works). The selectors were rewritten for the markup of 6.24 and checked in a running 6.24 Studio. See [What Uplift can change in a Sanity Studio](docs/sanity-studio-surface.md).

## Contents

- [Requirements](#requirements)
- [Install](#install)
- [Quick start](#quick-start)
- [What it changes](#what-it-changes)
- [Customise](#customise)
- [API](#api)
- [How it works](#how-it-works)
- [Contributing](#contributing)

## Requirements

| | Version |
| --- | --- |
| Sanity Studio | v5 or v6 |
| React | 19 |
| styled-components | 6, already required by Sanity |
| Node.js | 22 or later |

## Install

The package is installed straight from this repository, pinned to a release tag. There is no npm registry and no token: each tag carries the compiled `dist/`.

```sh
# pnpm
pnpm add github:mozestudio/sanity-uplift#v0.4.0

# npm
npm install github:mozestudio/sanity-uplift#v0.4.0
```

This adds `"@mozestudio/sanity-uplift": "github:mozestudio/sanity-uplift#v0.4.0"` to your `package.json`. To update, change the tag and reinstall. Releases are listed in the [changelog](CHANGELOG.md).

## Quick start

Uplift has two parts, because a Sanity plugin cannot set the theme: the theme belongs to the workspace config.

```ts
// sanity.config.ts
import {uplift, upliftTheme} from '@mozestudio/sanity-uplift'
import {defineConfig} from 'sanity'

export default defineConfig({
  // ...projectId, dataset, schema
  theme: upliftTheme(),
  plugins: [uplift() /* , ...your other plugins */],
})
```

- `upliftTheme()` sets the spacing and type scale through Sanity UI's theme tokens.
- `uplift()` carries those scales to the parts of the Studio that ignore the theme, and adds the form and array rules that tokens cannot reach.

Use both for the full effect. Either one works on its own; `uplift()` alone bridges the stock scales.

## What it changes

### Type scale

The `Text` scale, as `size={n}` in Sanity UI. Size 1 is the Studio's body text: field titles, inputs, lists. On Sanity 6.24 and later, field titles and descriptions follow it only through the token bridge of `uplift()`.

| Step | Sanity default | Uplift |
| --- | --- | --- |
| 0 | 10 / 15 px | **11 / 16 px** |
| 1 | 13 / 19 px | **14 / 21 px** |
| 2 | 15 / 23 px | **16 / 24 px** |
| 3 | 18 / 27 px | 18 / 27 px |
| 4 | 21 / 31 px | 21 / 31 px |

### Spacing scale

The `space={n}` scale, in px.

| Step | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sanity default | 0 | 4 | 8 | 12 | 20 | 32 | 52 | 84 | 136 | 220 |
| Uplift | 0 | 4 | 8 | **14** | **22** | **36** | **56** | **88** | 136 | 220 |

### Form and array rules

| Rule set | Option | What it does |
| --- | --- | --- |
| Form | `form` | Field titles at weight 600; descriptions at 13 px with a 68-character measure; nested content indented by 16 px, its fields 22 px apart instead of 56 px, so a container reads as one group; container titles at 16 px, one step above the fields inside them; a larger collapse arrow that hangs before the edge, so collapsible titles line up with the fields; group tabs 32 px tall, on the fields' edge and as close to the fields as fields are to each other |
| Arrays | `arrays` | 6 px of extra room between array items, on top of Sanity's own gap |

### Token bridge

On Sanity 6.24 and later, `uplift()` reads the theme in use and points Sanity UI 5's spacing and body text at its scales. Field headers and nested content then follow the same scale as the rest of the Studio. Turn it off with `uplift({bridge: false})`.

## Customise

Start from the defaults: the point of Uplift is that every Studio reads the same way. When a project really needs something different, override a value instead of copying the rules.

### Keep your colours

Build your colour theme first and pass it as `base`. Uplift keeps everything of the base theme except spacing and type.

```ts
import {buildTheme} from '@sanity/themer'

theme: upliftTheme({
  base: buildTheme({light: {accent: '#0a7cff'}, dark: {accent: '#5aa8ff'}}),
}),
```

### Turn a rule set off

```ts
plugins: [uplift({arrays: false})]
```

### Replace a token group

`tokens.space` needs ten steps starting at `0`; `tokens.text` needs five. Uplift throws a clear error otherwise.

```ts
theme: upliftTheme({
  tokens: {space: [0, 4, 8, 12, 20, 32, 52, 84, 136, 220]},
}),
```

### Override a CSS custom property

From your project's own stylesheet. Uplift declares its defaults without specificity, so a plain `:root` rule wins:

```css
:root {
  --uplift-array-item-gap: 10px;
}
```

| Property | Default | Controls |
| --- | --- | --- |
| `--uplift-field-title-weight` | `600` | Weight of a field's title |
| `--uplift-field-description-size` | `13px`: body text minus 1 px | Size of a field's description |
| `--uplift-field-description-line-height` | `19px`: body text minus 2 px | Line height of a field's description |
| `--uplift-nested-content-indent` | `16px` | Indent of nested content |
| `--uplift-nested-field-gap` | `22px`: spacing step 4 | Room between the fields of nested content |
| `--uplift-container-title-size` | `16px`: step 2 | Size of the title of an object or fieldset with nested content |
| `--uplift-container-title-line-height` | `24px`: step 2 | Line height of that title |
| `--uplift-container-title-weight` | `700` | Weight of that title, one notch above field titles |
| `--uplift-collapse-arrow-size` | `25px` | Size of the collapse arrow's icon; the triangle is about a fifth of it |
| `--uplift-group-tab-height` | `32px` | Minimum height of a group tab |
| `--uplift-group-tabs-gap` | `0px` | Extra room below the group tabs, on top of the gap between fields |
| `--uplift-group-tab-inset` | `8px`: spacing step 2 | How far the group tabs move back, so their labels start on the fields' edge; match it to the tabs' padding |
| `--uplift-array-item-gap` | `6px` | Extra room between array items |

## API

### `upliftTheme(options?)`

Returns a `StudioTheme` for the config's `theme` option.

| Option | Type | Default |
| --- | --- | --- |
| `base` | `StudioTheme` | The stock theme of your Sanity version |
| `tokens` | `Partial<UpliftTokens>` | `comfortable` |

### `uplift(options?)`

A Studio plugin that injects Uplift's CSS once, at the layout level: the token bridge first, then the rules.

| Option | Type | Default |
| --- | --- | --- |
| `bridge` | `boolean` | `true` |
| `form` | `boolean` | `true` |
| `arrays` | `boolean` | `true` |

### Other exports

| Export | What it is |
| --- | --- |
| `comfortable` | The default `UpliftTokens`, to read or extend |
| `buildStyles(options?, scales?)` | The rules `uplift()` injects, sized from `scales.space` and `scales.text` (each defaults to `comfortable`), if you need to place them yourself |
| `buildTokenBridge(theme)` | The token bridge CSS for a `v2` theme |
| `toFontSize(step)` | Turns a `{fontSize, lineHeight}` step into a Sanity UI font size, with cap-height trim and icon size |
| `UpliftOptions`, `UpliftThemeOptions`, `UpliftStyleScales`, `UpliftTokens`, `TypeStep`, `BridgeTheme` | TypeScript types |

## How it works

- **Tokens first.** Whatever a theme token can express, Uplift expresses as a token, so every Studio component that follows the theme picks it up. The Studio reads the `v2` theme and the root `fonts`; Uplift writes both.
- **A bridge where the theme does not reach.** Since Sanity 6.24 the form chrome ignores the theme and reads Sanity UI 5's own custom properties. The plugin rewrites them from the theme in use, so a retuned token group reaches the whole Studio. Why it is done this way: [ADR 0001](docs/adr/0001-token-bridge-and-targeted-rules.md).
- **CSS only for the rest.** Form hierarchy and array spacing are not reachable through tokens, so the plugin adds a small stylesheet.
- **Stable selectors.** Sanity's class names are generated hashes that change between releases, and a test guards against them. Selectors rest on hooks Sanity sets on purpose (`data-testid`, named `data-ui` values such as `fieldHeaderContentBox`, `data-level`, the `desc_` description ids). Where a rule still leans on the generic name of a Sanity UI primitive (`Text`, `Card`, `Grid`), its comment says so. See the [map of Studio hooks](docs/sanity-studio-surface.md#4-dom-hooks-for-css).
- **No side effects on your theme.** `upliftTheme()` returns a new object and never mutates `base`.

## Contributing

Before changing a rule or a token, read [What Uplift can change in a Sanity Studio](docs/sanity-studio-surface.md), a map of the theme, plugin API and DOM hooks Sanity exposes. The words used across the code and docs are defined in [GLOSSARY.md](GLOSSARY.md).

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules the package follows, how to develop against a real Studio and how releases work.
