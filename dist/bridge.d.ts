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
/** The part of a Sanity UI `v2` theme the bridge reads. */
export interface BridgeTheme {
    space: readonly number[];
    font: {
        text: {
            family: string;
            weights?: {
                regular?: number;
            };
            sizes: readonly {
                fontSize: number;
                lineHeight: number;
            }[];
        };
    };
}
/**
 * The CSS that points Sanity UI 5's spacing and body text properties at the
 * theme's scales.
 *
 * `html:root` outranks Sanity UI's own `:root` declaration whatever the order
 * the stylesheets load in.
 */
export declare function buildTokenBridge(theme: BridgeTheme): string;
//# sourceMappingURL=bridge.d.ts.map