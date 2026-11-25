import {defaultTheme, type StudioTheme} from 'sanity'
import {comfortable, type UpliftTokens, type TypeStep} from './tokens.js'

type RootTheme = typeof defaultTheme
type ThemeFontSize = RootTheme['fonts']['text']['sizes'][number]

/** Inter's cap height as a share of the font size. */
const CAP_HEIGHT = 0.727

export interface UpliftThemeOptions {
  /**
   * The theme to start from. Pass the project's own theme here, for example the
   * result of `buildTheme` from `@sanity/themer` with the project's colours, and
   * Uplift keeps its colours and changes only spacing and type.
   * Defaults to the stock Studio theme of the project's Sanity version.
   */
  base?: StudioTheme
  /** Replaces whole token groups. Defaults to {@link comfortable}. */
  tokens?: Partial<UpliftTokens>
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
export function upliftTheme(options: UpliftThemeOptions = {}): StudioTheme {
  const base: StudioTheme = options.base ?? defaultTheme
  const tokens: UpliftTokens = {...comfortable, ...options.tokens}
  const baseFonts = base.fonts ?? defaultTheme.fonts
  const baseSpace = base.space ?? defaultTheme.space

  assertScale('space', tokens.space, baseSpace.length)
  if (tokens.space[0] !== 0) throw new Error('sanity-uplift: tokens.space[0] must be 0')
  assertScale('text', tokens.text, baseFonts.text.sizes.length)

  const fonts = {
    ...baseFonts,
    text: {
      ...baseFonts.text,
      sizes: tokens.text.map((step, index) => toFontSize(step, baseFonts.text.sizes[index])),
    },
  }
  const space = [...tokens.space]

  return {
    ...base,
    fonts,
    space,
    ...(base.v2 ? {v2: {...base.v2, font: fonts, space}} : {}),
  }
}

/**
 * Turns a type step into Sanity UI's font size: the cap-height trim is what
 * keeps text optically centred in buttons and inputs, and the icon size
 * follows the line height as in the stock scale.
 */
export function toFontSize(step: TypeStep, previous?: ThemeFontSize): ThemeFontSize {
  const trim = Math.round(((step.lineHeight - step.fontSize * CAP_HEIGHT) / 2) * 2) / 2
  return {
    ascenderHeight: trim,
    descenderHeight: trim,
    fontSize: step.fontSize,
    iconSize: step.lineHeight + 2,
    letterSpacing: previous?.letterSpacing ?? 0,
    lineHeight: step.lineHeight,
  }
}

function assertScale(name: string, scale: readonly unknown[], expected: number) {
  if (scale.length !== expected) {
    throw new Error(
      `sanity-uplift: tokens.${name} needs ${expected} steps to match the base theme, got ${scale.length}`,
    )
  }
}
