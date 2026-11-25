import {defaultTheme} from 'sanity'
import {describe, expect, it} from 'vitest'
import {upliftTheme, toFontSize} from './theme.js'
import {comfortable} from './tokens.js'

describe('toFontSize', () => {
  it('reproduces the stock Sanity text scale from size and line height', () => {
    const stock = defaultTheme.fonts.text.sizes
    for (const size of stock) {
      expect(toFontSize({fontSize: size.fontSize, lineHeight: size.lineHeight}, size)).toEqual(size)
    }
  })
})

describe('upliftTheme', () => {
  it('applies the comfortable spacing and text scale by default', () => {
    const theme = upliftTheme()
    expect(theme.space).toEqual(comfortable.space)
    expect(theme.fonts?.text.sizes.map((s) => [s.fontSize, s.lineHeight])).toEqual(
      comfortable.text.map((s) => [s.fontSize, s.lineHeight]),
    )
  })

  it('keeps the v2 theme in step with the legacy fields', () => {
    const theme = upliftTheme()
    expect(theme.v2?.space).toEqual(theme.space)
    expect(theme.v2?.font).toBe(theme.fonts)
  })

  it('keeps everything else of the base theme, colours included', () => {
    const base = defaultTheme
    const theme = upliftTheme({base})
    expect(theme.color).toBe(base.color)
    expect(theme.v2?.color).toBe(base.v2?.color)
    expect(theme.fonts?.heading).toBe(base.fonts.heading)
    expect(theme.radius).toBe(base.radius)
  })

  it('fills the scales from the stock theme when the base leaves them out', () => {
    const theme = upliftTheme({base: {color: defaultTheme.color}})
    expect(theme.color).toBe(defaultTheme.color)
    expect(theme.space).toEqual(comfortable.space)
    expect(theme.fonts?.heading).toBe(defaultTheme.fonts.heading)
  })

  it('does not mutate the base theme', () => {
    const base = {...defaultTheme, space: [...defaultTheme.space]}
    const space = [...base.space]
    upliftTheme({base})
    expect(base.space).toEqual(space)
  })

  it('lets a project replace a token group', () => {
    const space = [0, 4, 8, 12, 20, 32, 52, 84, 136, 220]
    expect(upliftTheme({tokens: {space}}).space).toEqual(space)
  })

  it('rejects a scale with the wrong number of steps', () => {
    expect(() => upliftTheme({tokens: {space: [0, 4, 8]}})).toThrow(/needs 10 steps/)
    expect(() => upliftTheme({tokens: {text: []}})).toThrow(/needs 5 steps/)
  })

  it('rejects a spacing scale that does not start at 0', () => {
    expect(() => upliftTheme({tokens: {space: [2, 4, 8, 12, 20, 32, 52, 84, 136, 220]}})).toThrow(
      /must be 0/,
    )
  })
})
