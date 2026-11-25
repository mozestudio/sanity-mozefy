/**
 * Uplift's CSS rules for what theme tokens cannot reach.
 *
 * Sanity's class names are generated hashes that change between releases, so
 * selectors target attributes Sanity sets on purpose (`data-testid`, named
 * `data-ui` values, `data-level`, the `desc_` description ids). Where a rule
 * still leans on the generic name of a Sanity UI primitive (`Text`, `Card`,
 * `Grid`), its comment says so. See docs/sanity-studio-surface.md.
 *
 * Each value is a rule variable on `:root`, declared inside `:where()` so that
 * a project's own `:root` declaration wins without any extra specificity.
 */

import {comfortable, type TypeStep} from './tokens.js'

/** The scales the rule variables are sized from: the theme's, or {@link comfortable}. */
export interface UpliftStyleScales {
  space?: readonly number[]
  text?: readonly TypeStep[]
}

export interface UpliftStyleOptions {
  /**
   * Field titles stronger than their descriptions, nested content indented and
   * grouped tighter, container titles above their fields, collapsible titles
   * and group tabs on the fields' edge, a visible collapse arrow and roomier
   * group tabs. Default `true`.
   */
  form?: boolean
  /** Extra room between array items, for lists and page builders. Default `true`. */
  arrays?: boolean
}

/**
 * The rule variables. Sizes follow the scales in use, so a project that
 * retunes a token group keeps the same hierarchy: a container title sits on
 * step 2, a field description just under body text (step 1), on purpose
 * between two steps (see ADR 0001), and the fields of nested content on
 * spacing step 4, under half the room between the document's own fields.
 */
function variables({space = comfortable.space, text = comfortable.text}: UpliftStyleScales): string {
  const body = text[1] ?? comfortable.text[1] ?? {fontSize: 14, lineHeight: 21}
  const container = text[2] ?? comfortable.text[2] ?? {fontSize: 16, lineHeight: 24}
  const step = (n: number) => space[n] ?? comfortable.space[n] ?? 0
  return /* css */ `
:where(:root) {
  --uplift-field-title-weight: 600;
  --uplift-field-description-size: ${body.fontSize - 1}px;
  --uplift-field-description-line-height: ${body.lineHeight - 2}px;
  --uplift-nested-content-indent: 16px;
  --uplift-nested-field-gap: ${step(4)}px;
  --uplift-container-title-size: ${container.fontSize}px;
  --uplift-container-title-line-height: ${container.lineHeight}px;
  --uplift-container-title-weight: 700;
  --uplift-collapse-arrow-size: 25px;
  --uplift-group-tab-height: 32px;
  --uplift-group-tabs-gap: 0px;
  --uplift-group-tab-inset: ${step(2)}px;
  --uplift-array-item-gap: 6px;
}
`
}

const FORM = /* css */ `
/* Field title: the strongest text of a field. A simple field's title is its
   label; a fieldset's or an object's title is a Text inside the legend, with a
   weight of its own. */
[data-ui="fieldHeaderContentBox"] :is(label, legend [data-ui="Text"]) {
  font-weight: var(--uplift-field-title-weight);
}

/* Field description: quieter and smaller than the title, with room to read.
   Sanity gives it a desc_ id for screen readers. */
[data-ui="fieldHeaderContentBox"] [id^="desc_"] {
  font-size: var(--uplift-field-description-size);
  line-height: var(--uplift-field-description-line-height);
  max-width: 68ch;
}

/* Nested content: indent it so the nesting reads at a glance. The content is
   the last child of the fieldset; anchoring on fieldset keeps Portable Text
   list items, which also carry data-level, out. */
fieldset[data-level]:not([data-level="0"]) > :last-child {
  padding-inline-start: var(--uplift-nested-content-indent);
}

/* Fields of nested content sit closer to each other than the document's own
   fields do, so a container reads as one group. Sanity spaces an object's
   fields like the document's (step 6) and a fieldset's on step 5. A
   fieldset's fields sit straight in the content's grid; an object's sit in
   its focusable stack, the grid's child with a tabindex. */
fieldset[data-level]:not([data-level="0"]) > :last-child > *,
fieldset[data-level]:not([data-level="0"]) > :last-child > * > [tabindex] {
  row-gap: var(--uplift-nested-field-gap);
}

/* Container title: an object or fieldset with nested content reads one step
   above the field titles inside it, and heavier, since one step alone is only
   2px. Sanity draws nested content's line exactly
   when data-level is above 0; > :first-child keeps the rule on the fieldset's
   own header, out of the fields nested below it. */
fieldset[data-level]:not([data-level="0"]) > :first-child legend [data-ui="Text"] {
  font-size: var(--uplift-container-title-size);
  line-height: var(--uplift-container-title-line-height);
  font-weight: var(--uplift-container-title-weight);
}

/* Collapse arrow: Sanity's icon is 14px, and the triangle fills a fifth of
   it. A larger icon, centred on Sanity's 9px icon box, keeps it clear of the
   title. The inline transform that turns it open stays Sanity's. */
fieldset[data-level] legend > button {
  align-items: center;
}
fieldset[data-level] legend [data-sanity-icon="toggle-arrow-right"] {
  display: block;
  width: var(--uplift-collapse-arrow-size);
  height: var(--uplift-collapse-arrow-size);
  margin: calc((9px - var(--uplift-collapse-arrow-size)) / 2);
}

/* The arrow hangs before the edge, so a collapsible title starts on the same
   edge as the fields around it. 12px is Sanity's 9px icon box plus the 3px
   before the title. Nested, it hangs in the indent, clear of the line. */
fieldset[data-level] legend > button:has([data-sanity-icon="toggle-arrow-right"]) {
  margin-inline-start: -12px;
}

/* Group tabs: a taller target, and no extra room below them. Sanity pads
   them from the stock theme, so the tabs sat 20px further from the fields
   they switch between than the fields sit from each other. */
[data-testid="field-group-tabs"] [data-testid^="group-tab-"] {
  min-height: var(--uplift-group-tab-height);
  align-items: center;
}
[data-testid="field-groups"] {
  padding-bottom: var(--uplift-group-tabs-gap);
}

/* Group tabs line up with the field titles: a tab pads its label by step 2,
   so the row moves back by as much and the selected tab's background hangs
   before the edge. Relative offset, so the layout around it is unchanged.
   At narrow widths Sanity swaps the tabs for a select, which stays on the
   edge like any other input. */
[data-testid="field-group-tabs"] {
  position: relative;
  inset-inline-start: calc(-1 * var(--uplift-group-tab-inset));
}
`

const ARRAYS = /* css */ `
/* Array items, list layout: the list is virtualised and measures each item, so
   the extra room goes inside each item. A gap on the list would push the last
   items past its edge. Leans on the generic Card and Grid names. */
[data-ui="ArrayInput__content"] > [data-ui="Card"] > [data-ui="Grid"] > [data-index] {
  padding-block: calc(var(--uplift-array-item-gap) / 2);
}

/* Array items, grid layout: not virtualised, same extra room on every side. */
[data-ui="ArrayInput__content"] > [data-ui="Card"] > [data-ui="Grid"]:not(:has(> [data-index])) > * {
  padding: calc(var(--uplift-array-item-gap) / 2);
}
`

/**
 * The rules the `uplift()` plugin injects, for the given options. `scales`
 * holds the spacing and type scale in use; the plugin passes the theme's, and
 * each defaults to {@link comfortable}.
 */
export function buildStyles(options: UpliftStyleOptions = {}, scales: UpliftStyleScales = {}): string {
  const {form = true, arrays = true} = options
  if (!form && !arrays) return ''
  return [variables(scales), form ? FORM : '', arrays ? ARRAYS : '']
    .map((block) => block.trim())
    .filter(Boolean)
    .join('\n\n')
}
