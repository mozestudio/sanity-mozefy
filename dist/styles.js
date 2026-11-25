/**
 * Uplift's CSS rules for what theme tokens cannot reach.
 *
 * Sanity's class names are generated hashes that change between releases, so
 * every selector here targets an attribute Sanity sets on purpose
 * (`data-testid`, `data-ui`, `data-level`). Each value is a custom property on
 * `:root`, so a project can retune one without forking the rules.
 */
const VARIABLES = /* css */ `
:root {
  --uplift-field-title-weight: 600;
  --uplift-field-description-size: 13px;
  --uplift-field-description-line-height: 19px;
  --uplift-fieldset-indent: 16px;
  --uplift-array-item-gap: 6px;
}
`;
const FORM = /* css */ `
/* Field title: the strongest text of a field. */
[data-ui="fieldHeaderContentBox"] label,
[data-ui="fieldHeaderContentBox"] legend {
  font-weight: var(--uplift-field-title-weight);
}

/* Field description: quieter and smaller than the title, with room to read. */
[data-ui="fieldHeaderContentBox"] [data-ui="Text"]:not(:first-child) {
  font-size: var(--uplift-field-description-size);
  line-height: var(--uplift-field-description-line-height);
  max-width: 68ch;
}

/* Nested fieldsets: indent their content so the nesting reads at a glance. */
[data-level]:not([data-level="0"]) > [tabindex] {
  padding-left: var(--uplift-fieldset-indent);
}
`;
const ARRAYS = /* css */ `
/* Room between the items of an array, so each one reads as its own card. */
[data-ui="ArrayInput__content"] [data-ui="Stack"] {
  gap: var(--uplift-array-item-gap);
}
`;
/** The CSS the `uplift()` plugin injects, for the given options. */
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