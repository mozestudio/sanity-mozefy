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

export interface UpliftStyleOptions {
  /** Field titles stronger than their descriptions, and nested content indented. Default `true`. */
  form?: boolean
  /** Extra room between array items, for lists and page builders. Default `true`. */
  arrays?: boolean
}

const VARIABLES = /* css */ `
:where(:root) {
  --uplift-field-title-weight: 600;
  --uplift-field-description-size: 13px;
  --uplift-field-description-line-height: 19px;
  --uplift-nested-content-indent: 16px;
  --uplift-array-item-gap: 6px;
}
`

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
  padding-left: var(--uplift-nested-content-indent);
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

/** The rules the `uplift()` plugin injects, for the given options. */
export function buildStyles(options: UpliftStyleOptions = {}): string {
  const {form = true, arrays = true} = options
  if (!form && !arrays) return ''
  return [VARIABLES, form ? FORM : '', arrays ? ARRAYS : '']
    .map((block) => block.trim())
    .filter(Boolean)
    .join('\n\n')
}
