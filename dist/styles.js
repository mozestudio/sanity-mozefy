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
const VARIABLES = /* css */ `
:where(:root) {
  --uplift-field-title-weight: 600;
  --uplift-field-description-size: 13px;
  --uplift-field-description-line-height: 19px;
  --uplift-nested-content-indent: 16px;
  --uplift-container-title-size: 16px;
  --uplift-container-title-line-height: 24px;
  --uplift-collapse-arrow-size: 25px;
  --uplift-group-tab-height: 32px;
  --uplift-group-tabs-gap: 0px;
  --uplift-array-item-gap: 6px;
}
`;
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

/* Container title: an object or fieldset with nested content reads one step
   above the field titles inside it. Sanity draws nested content's line exactly
   when data-level is above 0; > :first-child keeps the rule on the fieldset's
   own header, out of the fields nested below it. */
fieldset[data-level]:not([data-level="0"]) > :first-child legend [data-ui="Text"] {
  font-size: var(--uplift-container-title-size);
  line-height: var(--uplift-container-title-line-height);
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
`;
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
`;
/** The rules the `uplift()` plugin injects, for the given options. */
export function buildStyles(options = {}) {
    const { form = true, arrays = true } = options;
    if (!form && !arrays)
        return '';
    return [VARIABLES, form ? FORM : '', arrays ? ARRAYS : '']
        .map((block) => block.trim())
        .filter(Boolean)
        .join('\n\n');
}
//# sourceMappingURL=styles.js.map