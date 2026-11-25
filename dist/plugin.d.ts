import { type MozefyStyleOptions } from './styles.js';
export type MozefyOptions = MozefyStyleOptions;
/**
 * Adds Mozefy's form rules to the Studio: the parts of the UX that theme
 * tokens cannot reach, such as the hierarchy between a field's title and its
 * description, or the gap between array items.
 *
 * Pair it with `mozefyTheme()` on the config's `theme` option.
 */
export declare const mozefy: import("sanity").Plugin<void | MozefyStyleOptions>;
//# sourceMappingURL=plugin.d.ts.map