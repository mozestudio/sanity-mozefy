import { type UpliftStyleOptions } from './styles.js';
export interface UpliftOptions extends UpliftStyleOptions {
    /**
     * Carry the theme's spacing and type scale to the parts of the Studio that
     * ignore the theme, such as field titles and descriptions on Sanity 6.24.
     * Default `true`.
     */
    bridge?: boolean;
}
/**
 * Adds Uplift's rules to the Studio: the token bridge, and the parts of the UX
 * that theme tokens cannot reach, such as the hierarchy between a field's title
 * and its description, or the room between array items.
 *
 * Pair it with `upliftTheme()` on the config's `theme` option.
 */
export declare const uplift: import("sanity").Plugin<void | UpliftOptions>;
//# sourceMappingURL=plugin.d.ts.map