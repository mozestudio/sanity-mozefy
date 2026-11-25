import { type UpliftStyleOptions } from './styles.js';
export type UpliftOptions = UpliftStyleOptions;
/**
 * Adds Uplift's form rules to the Studio: the parts of the UX that theme
 * tokens cannot reach, such as the hierarchy between a field's title and its
 * description, or the gap between array items.
 *
 * Pair it with `upliftTheme()` on the config's `theme` option.
 */
export declare const uplift: import("sanity").Plugin<void | UpliftStyleOptions>;
//# sourceMappingURL=plugin.d.ts.map