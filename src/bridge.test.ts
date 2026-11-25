import {defaultTheme} from 'sanity'
import {describe, expect, it} from 'vitest'
import {buildTokenBridge, type BridgeTheme} from './bridge.js'
import {upliftTheme} from './theme.js'

function v2Of(theme: {v2?: unknown}): BridgeTheme {
  if (!theme.v2) throw new Error('expected a v2 theme')
  return theme.v2 as BridgeTheme
}

describe('buildTokenBridge', () => {
  it('reproduces Sanity UI 5 stock values from the stock theme', () => {
    const css = buildTokenBridge(v2Of(defaultTheme))
    expect(css).toContain('--space-3: 12px;')
    expect(css).toMatch(/--body-1: 400 13px\/19px Inter/)
  })

  it('carries the comfortable scale from upliftTheme()', () => {
    const css = buildTokenBridge(v2Of(upliftTheme()))
    expect(css).toContain('--space-3: 14px;')
    expect(css).toContain('--space-9: 220px;')
    expect(css).toMatch(/--body-0: 400 11px\/16px /)
    expect(css).toMatch(/--body-1: 400 14px\/21px /)
  })

  it('follows a retuned token group', () => {
    const css = buildTokenBridge(
      v2Of(upliftTheme({tokens: {space: [0, 4, 8, 16, 24, 40, 64, 96, 136, 220]}})),
    )
    expect(css).toContain('--space-3: 16px;')
  })

  it('writes only the steps Sanity UI 5 declares, on html:root', () => {
    const css = buildTokenBridge(v2Of(upliftTheme()))
    expect(css.startsWith('html:root {')).toBe(true)
    expect(css).not.toContain('--space-10')
    expect(css).not.toContain('--body-5')
  })
})
