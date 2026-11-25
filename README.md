# sanity-mozefy

Moze's shared layer for Sanity Studio: a more readable type scale, roomier spacing and a clearer form hierarchy, applied the same way in every project.

It carries no project-specific code. Schemas, structure, colours and copy stay in each project; this package holds only the rules a Moze Studio should share.

## What it changes

| Layer | Where | What |
| --- | --- | --- |
| Theme tokens | `mozefyTheme()` on the config's `theme` | Spacing scale and `Text` scale (body text 13 → 14 px, small text 10 → 11 px) |
| Form rules | `mozefy()` plugin, `form` | Field titles stronger than descriptions, descriptions with a readable measure, indented nested fieldsets |
| Array rules | `mozefy()` plugin, `arrays` | Room between array items, so lists and page builders read as separate cards |

The two layers are separate because a Sanity plugin cannot set the theme: the theme belongs to the workspace config.

## Install

Projects install it straight from this public repository, pinned to a release tag. There is no registry and no token: the tag carries the compiled `dist/`.

```sh
pnpm add github:mozestudio/sanity-mozefy#v0.1.0
```

This writes `"@mozestudio/sanity-mozefy": "github:mozestudio/sanity-mozefy#v0.1.0"` to the project's `package.json`. To update, change the tag and run `pnpm install`.

## Use

```ts
import {mozefy, mozefyTheme} from '@mozestudio/sanity-mozefy'
import {defineConfig} from 'sanity'

export default defineConfig({
  // ...
  theme: mozefyTheme(),
  plugins: [mozefy() /* , ...the project's plugins */],
})
```

### With the project's colours

Mozefy changes only spacing and type, so it composes with any colour theme. Build the colours first and pass them as `base`:

```ts
import {buildTheme} from '@sanity/themer'

theme: mozefyTheme({
  base: buildTheme({light: {accent: '#0a7cff'}, dark: {accent: '#5aa8ff'}}),
}),
```

### Turning rules off

```ts
plugins: [mozefy({arrays: false})]
```

### Retuning a value for one project

Prefer the defaults: the point of the package is that every Studio feels the same. When a project really needs a different value, override the token group or the CSS custom property rather than forking the rules.

```ts
// A whole token group
theme: mozefyTheme({tokens: {space: [0, 4, 8, 12, 20, 32, 52, 84, 136, 220]}}),
```

```css
/* One custom property, from the project's own stylesheet */
:root {
  --mozefy-array-item-gap: 10px;
}
```

| Property | Default | Controls |
| --- | --- | --- |
| `--mozefy-field-title-weight` | `600` | Weight of a field's title |
| `--mozefy-field-description-size` | `13px` | Size of a field's description |
| `--mozefy-field-description-line-height` | `19px` | Line height of a field's description |
| `--mozefy-fieldset-indent` | `16px` | Indent of a nested fieldset's content |
| `--mozefy-array-item-gap` | `6px` | Gap between the items of an array |

## Rules for contributing

- **Nothing project-specific.** No schema names, document types, brand colours or copy. If a rule only makes sense for one project, it belongs in that project.
- **Tokens before CSS.** If a theme token can express the change, change the token. CSS is for what tokens cannot reach.
- **Stable selectors only.** Sanity's class names are generated hashes. Target attributes Sanity sets on purpose (`data-testid`, `data-ui`, `data-level`), never a class.
- **Every value is a custom property.** A project retunes a value by overriding the property, not by copying the rule.
- **Check it in a real Studio**, in light and dark mode, before releasing: a selector that stops matching fails silently.

## Develop

```sh
pnpm install
pnpm test        # unit tests
pnpm typecheck
pnpm build       # dist/, committed: projects run it straight from a tag
```

To try a change in a project's Studio before releasing, install the local folder there with `pnpm add file:../path/to/sanity-mozefy` (a `file:` dependency resolves `sanity` and React from the project, so the Studio keeps a single copy of each), and switch back to the released version afterwards.

## Release

1. Bump `version` in `package.json`, note the change in `CHANGELOG.md`, run `pnpm build` and commit `dist/` with the change. CI fails when `dist/` does not match the source.
2. Merge to `main`, then push a matching tag: `git tag v0.2.0 && git push origin v0.2.0`. CI checks the tag against `package.json`.
3. In each project, point the dependency at the new tag (`github:mozestudio/sanity-mozefy#v0.2.0`) and run `pnpm install`.
