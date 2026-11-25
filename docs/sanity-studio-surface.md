# What Uplift can change in a Sanity Studio

A map of every channel through which a shared package can change how a Studio looks and behaves, and of what Uplift uses today. Terms follow [GLOSSARY.md](../GLOSSARY.md).

**Checked against:** `sanity` 6.24.0, `@sanity/ui` 4.4.12, and `@sanity/ui` 5.0.0-alpha.24, which Sanity bundles under the alias `ui5`. The facts come from reading the installed source, not from a running Studio. Sanity's bundle file names are hashed and change between releases, so to re-check a fact, grep `node_modules/sanity/lib` for the component or attribute named here.

## In short

There are three channels, and each one reaches a different part of the Studio.

| Channel | Who can use it | What it reaches |
| --- | --- | --- |
| **Theme** (`theme` in the workspace config) | Only the project's workspace config. A plugin cannot set it. | Components built on `@sanity/ui` 4: inputs, buttons, cards, menus, dialogs, tabs, badges, previews. |
| **Plugin API** (`definePlugin`) | Any plugin | Wrapping Studio and form components, document actions and badges, Studio copy, tools and a few feature switches. |
| **CSS** | Any plugin that injects a stylesheet | Anything in the DOM. This is the only way to reach the parts the theme does not. |

**The fact that shapes everything else:** in Sanity 6.24 the *form chrome* (field headers, fieldsets, nested content, the gaps between fields) is built on `ui5`. `ui5` is styled by fixed CSS custom properties on `:root` and **ignores the theme**. Field titles and descriptions stay at 13 px and the nested-content indent stays at 12 px whatever the theme says. Only CSS can change them.

## 1. Theme

### What the Studio keeps

The Studio rebuilds the theme it receives (`getThemeValues` in `StudioThemeProvider`):

- **Kept:** `v2`, `fonts` and `color`. `fonts` is reset to stock when the theme comes from `@sanity/themer` (`__themer: true`).
- **Discarded:** every other root key: `space`, `radius`, `shadows`, `container`, `media`, `layer`, `avatar`, `button`, `input`, `focusRing`, `styles`. They are replaced by stock values.
- **Reported:** setting them also raises `DeprecatedConfigUsageObserved` telemetry flags. Sanity's own code says these options go away in v7.

`@sanity/ui` 4 components read **only `v2`**. The root is converted into a `v2` only when `v2` is missing, which is the case for `buildLegacyTheme` themes: such a theme can change nothing but fonts and colours.

Some of Sanity's own styled components still read the stock root directly (`theme.sanity.space` about 30 times, `radius` 14 times). Those spots ignore any spacing change; one example is the group tabs wrapper.

### The `v2` keys

| Key | Holds | Stock value |
| --- | --- | --- |
| `font` | `text`, `label`, `heading`, `code`: each with a family, weights and sizes (`fontSize`, `lineHeight`, `ascenderHeight`, `descenderHeight`, `iconSize`, `letterSpacing`) | `text` 10/15, 13/19, 15/23, 18/27, 21/31; `label` 6 steps; `heading` 6 steps; Inter and ui-monospace |
| `space` | spacing scale, 10 steps | `[0, 4, 8, 12, 20, 32, 52, 84, 136, 220]` |
| `radius` | 7 steps | `[0, 1, 3, 6, 9, 12, 21]` |
| `shadow` | 6 elevation steps (umbra, penumbra, ambient) | |
| `container` | max widths | `[320, 640, 960, 1280, 1600, 1920]` |
| `media` | breakpoints | `[360, 600, 900, 1200, 1800, 2400]` |
| `layer` | z offsets of dialog, popover, tooltip | 600, 400, 200 |
| `avatar` | sizes and focus ring | 19, 25, 33, 49 |
| `button` | text weight, border width, focus ring | `medium`, 1 |
| `card` | border width, focus ring, outline shadow | 1 |
| `input` | checkbox, radio, switch sizes; border width; focus rings | checkbox 17, switch 25 × 17 |
| `color` | light and dark schemes × 8 card tones, each with `bg`, `fg`, `border`, `focusRing`, `muted`, `accent`, `link`, `code`, `shadow`, plus nested `button`, `selectable`, `input`, `badge`, `avatar` and `syntax` colours | built from a palette and tokens |

Input height depends on `space` and on each type step's ascender and descender trim. A change to the type scale therefore also changes the height of inputs.

### Colours

A project sets colours with `buildTheme` (from `@sanity/ui/theme`, or `@sanity/themer`), as a palette plus colour tokens written as `[light, dark]` pairs. The theme turns them into `--card-*` CSS custom properties on each `@sanity/ui` 4 element: `--card-bg-color`, `--card-fg-color`, `--card-border-color`, `--card-focus-ring-color` and so on. These are scoped per element, not set on `:root`, so change them in the theme rather than in CSS. `ui5` has its own colour tokens, which the theme does not reach.

## 2. The `ui5` tokens

`ui5` declares its whole design system once, as custom properties on `:root`. Nothing in Sanity maps the theme onto them.

| Tokens | Stock value | Used for |
| --- | --- | --- |
| `--space-0` … `--space-9` | the stock spacing scale (`--space-3: 12px`) | gaps and padding in field headers, fields, fieldsets, nested content, array lists |
| `--body-0` … `--body-4` | the stock text scale (`--body-1: 400 13px/1.5 Inter…`), with the font family baked in | field titles and descriptions |
| `--code-*`, `--heading-*`, `--eyebrow-*` | | code, headings, small caps |
| `--radius-*`, `--shadow-*`, `--container-*` | | |
| `--sans`, `--mono`, `--regular` … `--bold` | | changing `--sans` does not reach `--body-*`, which spell the family out |
| `--foreground-*`, `--background-*`, `--separator-*`, the colour ramps | | `ui5` colours |

The breakpoints of `ui5` are fixed in its media queries.

Overriding `--space-N` or `--body-N` on `:root` retunes the whole form chrome in one place, and Uplift's token bridge does exactly that. It is also the most fragile hook on this page: `ui5` is an alpha, and its token names may change in any Sanity release. These tokens are not inside an `@layer`, so an override has to win on specificity or order; the bridge uses `html:root`. The per-size text trim (`.sui-text-body1{--trim:-5px}`) is set on classes and stays stock.

## 3. Plugin API

### What a plugin may set

A plugin can set everything a workspace can, except:

- `theme`
- `title`, `subtitle`, `icon`, `basePath`, `hidden`
- `projectId`, `dataset`, `auth`
- `scheduledPublishing`, `tasks`, `apps`
- `releases.enabled`

Plugins are applied in order with the workspace last, so the workspace has the final say. For wrapped components, the first plugin in `plugins[]` is the outermost wrapper.

### Studio chrome: `studio.components`

Each slot wraps Sanity's default through `renderDefault`.

| Slot | Wraps |
| --- | --- |
| `layout` | The whole Studio UI. Uplift injects its stylesheet here, and reads the theme from the context to build the token bridge. |
| `provider` | The context above the layout. Marked beta, and must stay synchronous. |
| `navbar` | The top bar |
| `toolMenu` | The tool switcher, in the sidebar and the top bar |
| `activeToolLayout` | The area of the active tool. Can branch per tool. |
| `logo` | Deprecated; no effect in 6.24 |

### The form: `form.components`

These wrap **every** field, including fields whose schema sets its own component.

| Slot | Wraps | Props worth deciding on |
| --- | --- | --- |
| `field` | A field: header plus input | `schemaType`, `level`, `path`, `title`, `description`, `collapsible`, `collapsed` |
| `input` | The input alone | `schemaType`, `level`, `members`, `groups`, `readOnly`, `validation` |
| `item` | An array item | `schemaType`, `parentSchemaType`, `index`, `level` |
| `preview` | Previews in lists, references, array items | `layout`, `title`, `subtitle`, `media` |
| `block`, `inlineBlock`, `annotation` | Portable Text objects and annotations | `selected`, `focused`, `schemaType` |

Other form options:

- **`form.arrays.collapseItems`** sets how many array items show before the "show all" toggle. Stock: list 4, grid 8.
- **`form.image` and `form.file`** add asset sources.
- **`form.components.portableText.plugins`** turns Portable Text editor plugins on or off.

### Documents, copy, tools

| Key | Changes |
| --- | --- |
| `document.actions` | The buttons in the document footer: Publish, Delete and the rest |
| `document.badges` | The badges in the document footer |
| `document.inspectors` | The side panels and their menu items |
| `document.newDocumentOptions` | The templates in the global Create menu |
| `document.comments.enabled`, `document.askToEdit.enabled` | Show or hide comments and the Ask to edit button |
| `i18n.bundles` | **Any Studio string.** A bundle for an existing locale and namespace (`studio`, `structure`, `validation`, …) replaces individual strings. |
| `tools` | Add, remove or reorder top-level tools |
| `announcements.enabled` | The "what's new" UI |

### What only the schema can do

A plugin cannot set these globally; they belong to each type in the project's schema:

- `components` on a type, including `diff`, which has no global slot
- `renderMembers`, to reorder or regroup fields
- object `options`: `collapsible`, `collapsed`, `columns`, `modal`
- fieldsets
- field groups
- array `options`: `layout`, `sortable`, `insertMenu`, `modal`
- `icon`, `description`, `hidden`, `readOnly`, `preview`

A `form.components` wrapper receives `schemaType`, so it can still read these settings and branch on them.

### Global CSS

There is no official API for a global stylesheet. Wrapping `studio.components.layout` follows the documented middleware pattern; injecting a `<style>` tag from it is Uplift's own choice. The alternatives are `createGlobalStyle` from `styled-components`, a peer dependency of Sanity, or the `provider` slot.

## 4. DOM hooks for CSS

Sanity's class names are hashed and change with every release: `sc-*`, `sanity-*`, `u-*`, `sui-*-<hash>`. Never target them.

Two kinds of attribute exist:

- **Deliberate hooks.** A `data-testid`, a named `data-ui`, `data-level`, or an `id` that Studio code sets on purpose. The most stable ones are also used by Sanity's own CSS or tests.
- **Incidental hooks.** Every `@sanity/ui` primitive writes `data-ui` with its own name (`Box`, `Flex`, `Stack`, `VStack`, `Grid`, `Text`, `Card`). These names change whenever Sanity swaps a primitive; `ui5` already replaced `Stack` with `VStack`. Avoid building selectors on them.

### Form

| Part | Selector | Kind |
| --- | --- | --- |
| Field header | `[data-ui="fieldHeaderContentBox"]` | deliberate; Sanity's own CSS uses it |
| Field title, simple field | `[data-ui="fieldHeaderContentBox"] label` | deliberate |
| Field title, fieldset or object | `[data-ui="fieldHeaderContentBox"] legend [data-ui="Text"]`: the title is a `div` inside the `legend`, with its own weight | partly incidental |
| Field description | `[data-ui="fieldHeaderContentBox"] [id^="desc_"]`: also the `aria-describedby` target | deliberate |
| Deprecation notice | `[data-testid^="deprecated-badge-"]`, `[data-testid^="deprecated-message-"]` | deliberate |
| Validation icon | `svg[data-testid^="input-validation-icon-"]` | deliberate |
| Object, array, image or file field | `fieldset[data-level]`; simple fields are a `div` with `data-level="0"` | deliberate |
| Nested content | `fieldset[data-level]:not([data-level="0"]) > :last-child` | deliberate attribute plus structure |
| Schema fieldset | `fieldset[data-testid="fieldset-<name>"]` | deliberate |
| Group tabs | `[data-testid="field-group-tabs"]`, each tab `[data-testid="group-tab-<name>"]`, narrow-width `select[data-testid="field-group-select"]` | deliberate |
| Array | `[data-ui="ArrayInput__content"]` | deliberate |
| Array items, list layout | `[data-ui="ArrayInput__content"] > [data-ui="Card"] > [data-ui="Grid"] > [data-index]` | mostly incidental |
| Array buttons | `[data-testid="add-single-object-button"]`, `add-multiple-object-button`, `array-item-menu-button` | deliberate |
| Portable Text | `[data-testid="pt-editor"]`, `pt-editor__toolbar-card`, `text-block`, list items `.pt-list-item[data-level]` | deliberate |
| Reference, image, file | `[data-testid="reference-input"]`, `image-input`, `file-button-input` | deliberate |
| Text inputs | `input[data-testid="string-input"]`, `[data-ui="TextInput"]` | deliberate |

Things to know when writing these selectors:

- **`data-level` also marks Portable Text list items** (as `div`s). Anchor nesting selectors on `fieldset`.
- **The level counts from the document root.** Every object, array, image and file field has a level above 0, including the ones placed straight on the document.
- **Long array lists are virtualised.** Items are positioned by a script that measures each item, so a CSS `gap` on the list makes the last items overflow the card. Add padding to each item instead. The grid layout is not virtualised.
- **`[data-testid^="field-"]` on its own over-matches.** It also catches `field-actions-menu-*` and `field-group-*`.

### Document pane and Studio chrome

| Part | Selector |
| --- | --- |
| Document pane | `[data-testid="document-pane"]` |
| Pane header, title | `[data-testid="pane-header"]`, `[data-testid="document-panel-document-title"]` |
| Form view | `form[data-testid="form-view"]`, `[data-testid="document-panel-scroller"]` |
| Footer, actions | `[data-testid="pane-footer"]`, `button[data-testid="action-publish"]`, `action-menu-button` |
| Banners | `[data-testid$="-banner"]` |
| Inspector | `aside[data-ui="DocumentInspectorPanel"]` |
| Structure lists | `[data-testid="structure-tool-list-pane"]`, `[data-testid="document-list-pane"]`, `[data-testid="pane-content"]` |
| Navbar, search | `[data-testid="studio-navbar"]`, `[data-testid="studio-search"]` |

## 5. What Uplift touches, and whether it takes effect

On Sanity 6.24, version 0.2.0 reached little of what it aimed at. The selectors below replace the ones it used.

They were checked in the dev Studio on Sanity 6.24.0 (2026-11-25), comparing `/uplift` with `/stock` on the `Fixture` document, in dark and light mode, by reading computed styles:

| | Stock | Uplift |
| --- | --- | --- |
| `--space-3`, `--body-1` | 12px, 13px/1.5 | 14px, 14px/21px |
| Field title, simple field and in a `legend` | 13px, weight 500 | 14px, weight 600 |
| Title of a collapsible fieldset or object | 13px, 500 | 14px, 600 (not styled as a description) |
| Field description | 13px/19.5px, no measure | 13px/19px, 68ch |
| String input | 15px | 16px |
| Nested content, levels 1 to 3 | 12px indent | 16px indent, line kept |
| Portable Text list items (`data-level` 1 and 2) | 0 | 0 (untouched) |
| Array items, list layout | | 3px padding top and bottom; the virtualised list keeps every item inside its card |

Not checked yet: an array in grid layout with items (the fixture's gallery was empty), and Sanity 5.

| Part | Aims at | 0.2.0 | Now |
| --- | --- | --- | --- |
| Theme: type scale (`v2.font.text`, `fonts.text`) | Body text 14 px | Only `@sanity/ui` 4 components: inputs, buttons, menus, previews | Same, plus the form chrome through the token bridge |
| Theme: spacing scale (`v2.space`) | Roomier controls | Only `@sanity/ui` 4 components | Same, plus the form chrome through the token bridge |
| Theme: root `space` | | Discarded by Sanity 6.24 | Unchanged. Kept for Sanity 5, which has not been checked. |
| Token bridge (`html:root` `--space-N`, `--body-N`) | The form chrome follows the theme | Did not exist | New, see [ADR 0001](adr/0001-token-bridge-and-targeted-rules.md) |
| Field title weight | 600 | Simple fields only: `legend` did nothing | `[data-ui="fieldHeaderContentBox"] :is(label, legend [data-ui="Text"])` |
| Field description | 13 px, 68 characters | Also caught the title of collapsible fieldsets | `[data-ui="fieldHeaderContentBox"] [id^="desc_"]` |
| Nested content indent | 16 px | Matched nothing (`> [tabindex]`) | `fieldset[data-level]:not([data-level="0"]) > :last-child` |
| Array items | Extra room between items | Matched nothing (`[data-ui="Stack"]`) | Padding inside each item: `… > [data-ui="Grid"] > [data-index]` in the list layout, the grid's children in the grid layout |
| Rule variables (`--uplift-*`) | A project's `:root` override wins | Lost to Uplift's defaults, which load later | Defaults declared in `:where(:root)` |
| Group tabs | | No rule | No rule; still to decide |

Still open:

- **Grid layout with items, and Sanity 5.** Neither has been checked.
- **Group tabs.** No rule yet.
