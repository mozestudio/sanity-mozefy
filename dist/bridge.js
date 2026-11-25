/**
 * The token bridge: carries the theme's spacing and type scale to the parts of
 * the Studio that ignore the theme.
 *
 * Since Sanity 6.24 the form chrome (field headers, fieldsets, nested content)
 * is built with Sanity UI 5, which reads fixed custom properties on `:root`
 * (`--space-N`, `--body-N`) instead of the theme. The bridge rewrites those
 * properties from the theme, so the whole Studio follows one scale and a
 * project that retunes a token group sees the change everywhere.
 *
 * On a Sanity version without Sanity UI 5 the properties are unused and the
 * bridge has no effect.
 */
/** Steps Sanity UI 5 declares: `--space-0` to `--space-9`, `--body-0` to `--body-4`. */
const SPACE_STEPS = 10;
const BODY_STEPS = 5;
/**
 * The CSS that points Sanity UI 5's spacing and body text properties at the
 * theme's scales.
 *
 * `html:root` outranks Sanity UI's own `:root` declaration whatever the order
 * the stylesheets load in.
 */
export function buildTokenBridge(theme) {
    const { space, font } = theme;
    const weight = font.text.weights?.regular ?? 400;
    const declarations = [
        ...space.slice(0, SPACE_STEPS).map((value, step) => `  --space-${step}: ${value}px;`),
        ...font.text.sizes
            .slice(0, BODY_STEPS)
            .map((size, step) => `  --body-${step}: ${weight} ${size.fontSize}px/${size.lineHeight}px ${font.text.family};`),
    ];
    return `html:root {\n${declarations.join('\n')}\n}`;
}
//# sourceMappingURL=bridge.js.map