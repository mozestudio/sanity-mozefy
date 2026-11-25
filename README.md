# Sanity Uplift

[![CI](https://github.com/mozestudio/sanity-uplift/actions/workflows/ci.yml/badge.svg)](https://github.com/mozestudio/sanity-uplift/actions/workflows/ci.yml)
![Sanity](https://img.shields.io/badge/sanity-v5%20%7C%20v6-f03e2f)
![Node](https://img.shields.io/badge/node-%3E%3D22-339933)

**A calmer, more readable Sanity Studio for the people who write in it.**

Sanity Uplift is the shared Studio layer we use at [Moze](https://github.com/mozestudio) on every Sanity project. It changes how the Studio reads, not what it does: a larger type scale, roomier spacing and a clearer hierarchy inside forms, so editors who are not developers can find their way through long documents.

It carries nothing project-specific. Your schemas, structure, colours and copy stay where they are.

- **Readable type.** Body text goes from 13 to 14 px, small text from 10 to 11 px.
- **Room to breathe.** The middle steps of the spacing scale open up, so fields and controls stop crowding each other.
- **Clear form hierarchy.** Field titles read stronger than their descriptions, descriptions keep a readable line length, nested fieldsets are indented.
- **Lists that read as cards.** Array items and page-builder blocks get space between them.
- **Composes with your theme.** Uplift touches only spacing and type, so it sits on top of any colour theme.
- **Tunable, not forkable.** Every value is a theme token or a CSS custom property you can override.

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
| Node.js | 22 or later |

## Install

The package is installed straight from this repository, pinned to a release tag. There is no npm registry and no token: each tag carries the compiled `dist/`.

```sh
# pnpm
pnpm add github:mozestudio/sanity-uplift#v0.2.0

# npm
npm install github:mozestudio/sanity-uplift#v0.2.0
```

This adds `"@mozestudio/sanity-uplift": "github:mozestudio/sanity-uplift#v0.2.0"` to your `package.json`. To update, change the tag and reinstall. Releases are listed in the [changelog](CHANGELOG.md).

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
- `uplift()` adds the form and array rules that tokens cannot reach.

Use both for the full effect. Either one works on its own.

## What it changes

### Type scale

The `Text` scale, as `size={n}` in Sanity UI. Size 1 is the Studio's body text: field titles, inputs, lists.

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
| Form | `form` | Field titles at weight 600; descriptions at 13 px with a 68-character measure; nested fieldsets indented by 16 px |
| Arrays | `arrays` | A 6 px gap between the items of an array |

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

From your project's own stylesheet:

```css
:root {
  --uplift-array-item-gap: 10px;
}
```

| Property | Default | Controls |
| --- | --- | --- |
| `--uplift-field-title-weight` | `600` | Weight of a field's title |
| `--uplift-field-description-size` | `13px` | Size of a field's description |
| `--uplift-field-description-line-height` | `19px` | Line height of a field's description |
| `--uplift-fieldset-indent` | `16px` | Indent of a nested fieldset's content |
| `--uplift-array-item-gap` | `6px` | Gap between the items of an array |

## API

### `upliftTheme(options?)`

Returns a `StudioTheme` for the config's `theme` option.

| Option | Type | Default |
| --- | --- | --- |
| `base` | `StudioTheme` | The stock theme of your Sanity version |
| `tokens` | `Partial<UpliftTokens>` | `comfortable` |

### `uplift(options?)`

A Studio plugin that injects Uplift's CSS once, at the layout level.

| Option | Type | Default |
| --- | --- | --- |
| `form` | `boolean` | `true` |
| `arrays` | `boolean` | `true` |

### Other exports

| Export | What it is |
| --- | --- |
| `comfortable` | The default `UpliftTokens`, to read or extend |
| `buildStyles(options?)` | The CSS string `uplift()` injects, if you need to place it yourself |
| `toFontSize(step)` | Turns a `{fontSize, lineHeight}` step into a Sanity UI font size, with cap-height trim and icon size |
| `UpliftOptions`, `UpliftThemeOptions`, `UpliftTokens`, `TypeStep` | TypeScript types |

## How it works

- **Tokens first.** Whatever a theme token can express, Uplift expresses as a token, so every Studio component picks it up consistently. Both the legacy and the `v2` theme fields are kept in step.
- **CSS only for the rest.** Form hierarchy and array spacing are not reachable through tokens, so the plugin adds a small stylesheet.
- **Stable selectors.** Sanity's class names are generated hashes that change between releases. Uplift targets only the attributes Sanity sets on purpose (`data-ui`, `data-testid`, `data-level`), and a test guards against generated class names.
- **No side effects on your theme.** `upliftTheme()` returns a new object and never mutates `base`.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules the package follows, how to develop against a real Studio and how releases work.
