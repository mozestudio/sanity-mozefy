import {describe, expect, it} from 'vitest'
import {buildStyles} from './styles.js'

describe('buildStyles', () => {
  it('includes the variables and both rule sets by default', () => {
    const css = buildStyles()
    expect(css).toContain('--uplift-field-title-weight')
    expect(css).toContain('fieldHeaderContentBox')
    expect(css).toContain('ArrayInput__content')
  })

  it('leaves out a rule set that is turned off', () => {
    expect(buildStyles({arrays: false})).not.toContain('ArrayInput__content')
    expect(buildStyles({form: false})).not.toContain('fieldHeaderContentBox')
  })

  it('returns nothing when every rule set is off', () => {
    expect(buildStyles({form: false, arrays: false})).toBe('')
  })

  it('targets the hooks Sanity 6.24 renders', () => {
    const css = buildStyles()
    expect(css).toContain('legend [data-ui="Text"]')
    expect(css).toContain('[id^="desc_"]')
    expect(css).toContain('fieldset[data-level]:not([data-level="0"]) > :last-child')
    expect(css).toContain('> [data-index]')
    expect(css).not.toContain('[tabindex]')
    expect(css).not.toContain('[data-ui="Stack"]')
  })

  it('sets container titles, the collapse arrow and group tabs in the form rule set', () => {
    const css = buildStyles()
    expect(css).toContain(
      'fieldset[data-level]:not([data-level="0"]) > :first-child legend [data-ui="Text"]',
    )
    expect(css).toContain('[data-sanity-icon="toggle-arrow-right"]')
    expect(css).toContain('[data-testid="field-group-tabs"] [data-testid^="group-tab-"]')
    expect(css).toContain('[data-testid="field-groups"]')
    const formOff = buildStyles({form: false})
    expect(formOff).not.toContain('toggle-arrow-right')
    expect(formOff).not.toContain('field-group-tabs')
  })

  it('declares its variables without specificity, so a project can override them', () => {
    expect(buildStyles()).toContain(':where(:root) {')
  })

  it('never targets a generated class name', () => {
    expect(buildStyles()).not.toMatch(/\.[a-zA-Z]+-[a-zA-Z0-9]{5,}/)
  })
})
