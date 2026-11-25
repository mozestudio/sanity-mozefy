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
    form?: boolean;
    /** Extra room between array items, for lists and page builders. Default `true`. */
    arrays?: boolean;
}
/** The rules the `uplift()` plugin injects, for the given options. */
export declare function buildStyles(options?: UpliftStyleOptions): string;
//# sourceMappingURL=styles.d.ts.map