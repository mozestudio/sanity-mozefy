import { defaultTheme, type StudioTheme } from 'sanity';
import { type MozefyTokens, type TypeStep } from './tokens.js';
type RootTheme = typeof defaultTheme;
type ThemeFontSize = RootTheme['fonts']['text']['sizes'][number];
export interface MozefyThemeOptions {
    /**
     * The theme to start from. Pass the project's own theme here, for example the
     * result of `buildTheme` from `@sanity/themer` with the project's colours, and
     * Mozefy keeps its colours and changes only spacing and type.
     * Defaults to the stock Studio theme of the project's Sanity version.
     */
    base?: StudioTheme;
    /** Replaces whole token groups. Defaults to {@link comfortable}. */
    tokens?: Partial<MozefyTokens>;
}
/**
 * Builds the value of a Studio's `theme` option: the base theme with Mozefy's
 * spacing and type scale applied.
 *
 * A plugin cannot set the theme, so this lives beside the `mozefy()` plugin:
 *
 * ```ts
 * defineConfig({
 *   theme: mozefyTheme(),
 *   plugins: [mozefy()],
 * })
 * ```
 */
export declare function mozefyTheme(options?: MozefyThemeOptions): StudioTheme;
/**
 * Turns a type step into Sanity UI's font size: the cap-height trim is what
 * keeps text optically centred in buttons and inputs, and the icon size
 * follows the line height as in the stock scale.
 */
export declare function toFontSize(step: TypeStep, previous?: ThemeFontSize): ThemeFontSize;
export {};
//# sourceMappingURL=theme.d.ts.map