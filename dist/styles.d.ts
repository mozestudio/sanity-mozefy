/**
 * Uplift's CSS rules for what theme tokens cannot reach.
 *
 * Sanity's class names are generated hashes that change between releases, so
 * every selector here targets an attribute Sanity sets on purpose
 * (`data-testid`, `data-ui`, `data-level`). Each value is a custom property on
 * `:root`, so a project can retune one without forking the rules.
 */
export interface UpliftStyleOptions {
    /** Field titles stronger than their descriptions, clearer fieldsets and group tabs. Default `true`. */
    form?: boolean;
    /** Readable array items with room between them, for lists and page builders. Default `true`. */
    arrays?: boolean;
}
/** The CSS the `uplift()` plugin injects, for the given options. */
export declare function buildStyles(options?: UpliftStyleOptions): string;
//# sourceMappingURL=styles.d.ts.map