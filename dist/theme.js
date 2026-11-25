import { defaultTheme } from 'sanity';
import { comfortable } from './tokens.js';
/** Inter's cap height as a share of the font size. */
const CAP_HEIGHT = 0.727;
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
export function mozefyTheme(options = {}) {
    const base = options.base ?? defaultTheme;
    const tokens = { ...comfortable, ...options.tokens };
    const baseFonts = base.fonts ?? defaultTheme.fonts;
    const baseSpace = base.space ?? defaultTheme.space;
    assertScale('space', tokens.space, baseSpace.length);
    if (tokens.space[0] !== 0)
        throw new Error('sanity-mozefy: tokens.space[0] must be 0');
    assertScale('text', tokens.text, baseFonts.text.sizes.length);
    const fonts = {
        ...baseFonts,
        text: {
            ...baseFonts.text,
            sizes: tokens.text.map((step, index) => toFontSize(step, baseFonts.text.sizes[index])),
        },
    };
    const space = [...tokens.space];
    return {
        ...base,
        fonts,
        space,
        ...(base.v2 ? { v2: { ...base.v2, font: fonts, space } } : {}),
    };
}
/**
 * Turns a type step into Sanity UI's font size: the cap-height trim is what
 * keeps text optically centred in buttons and inputs, and the icon size
 * follows the line height as in the stock scale.
 */
export function toFontSize(step, previous) {
    const trim = Math.round(((step.lineHeight - step.fontSize * CAP_HEIGHT) / 2) * 2) / 2;
    return {
        ascenderHeight: trim,
        descenderHeight: trim,
        fontSize: step.fontSize,
        iconSize: step.lineHeight + 2,
        letterSpacing: previous?.letterSpacing ?? 0,
        lineHeight: step.lineHeight,
    };
}
function assertScale(name, scale, expected) {
    if (scale.length !== expected) {
        throw new Error(`sanity-mozefy: tokens.${name} needs ${expected} steps to match the base theme, got ${scale.length}`);
    }
}
//# sourceMappingURL=theme.js.map