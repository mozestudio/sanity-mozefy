import { defaultTheme, type StudioTheme } from 'sanity';
import { type UpliftTokens, type TypeStep } from './tokens.js';
type RootTheme = typeof defaultTheme;
type ThemeFontSize = RootTheme['fonts']['text']['sizes'][number];
export interface UpliftThemeOptions {
    /**
     * The theme to start from. Pass the project's own theme here, for example the
     * result of `buildTheme` from `@sanity/themer` with the project's colours, and
     * Uplift keeps its colours and changes only spacing and type.
     * Defaults to the stock Studio theme of the project's Sanity version.
     */
    base?: StudioTheme;
    /** Replaces whole token groups. Defaults to {@link comfortable}. */
    tokens?: Partial<UpliftTokens>;
}
/**
 * Builds the value of a Studio's `theme` option: the base theme with Uplift's
 * spacing and type scale applied.
 *
 * A plugin cannot set the theme, so this lives beside the `uplift()` plugin:
 *
 * ```ts
 * defineConfig({
 *   theme: upliftTheme(),
 *   plugins: [uplift()],
 * })
 * ```
 */
export declare function upliftTheme(options?: UpliftThemeOptions): StudioTheme;
/**
 * Turns a type step into Sanity UI's font size: the cap-height trim is what
 * keeps text optically centred in buttons and inputs, and the icon size
 * follows the line height as in the stock scale.
 */
export declare function toFontSize(step: TypeStep, previous?: ThemeFontSize): ThemeFontSize;
export {};
//# sourceMappingURL=theme.d.ts.map