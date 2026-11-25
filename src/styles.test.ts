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
    expect(css).not.toContain(':last-child > [tabindex]')
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
  it('sizes descriptions and container titles from the type scale', () => {
    const css = buildStyles()
    expect(css).toContain('--uplift-field-description-size: 13px;')
    expect(css).toContain('--uplift-container-title-size: 16px;')
    expect(css).toContain('--uplift-container-title-weight: 700;')
    const retuned = buildStyles(
      {},
      {
        text: [
          {fontSize: 12, lineHeight: 17},
          {fontSize: 15, lineHeight: 23},
          {fontSize: 18, lineHeight: 27},
          {fontSize: 21, lineHeight: 31},
          {fontSize: 24, lineHeight: 34},
        ],
      },
    )
    expect(retuned).toContain('--uplift-field-description-size: 14px;')
    expect(retuned).toContain('--uplift-field-description-line-height: 21px;')
    expect(retuned).toContain('--uplift-container-title-size: 18px;')
    expect(retuned).toContain('--uplift-container-title-line-height: 27px;')
  })

  it('sizes the nested field gap and the group tab inset from the spacing scale', () => {
    const css = buildStyles()
    expect(css).toContain('--uplift-nested-field-gap: 22px;')
    expect(css).toContain('--uplift-group-tab-inset: 8px;')
    const retuned = buildStyles({}, {space: [0, 4, 6, 12, 18, 32, 52, 84, 136, 220]})
    expect(retuned).toContain('--uplift-nested-field-gap: 18px;')
    expect(retuned).toContain('--uplift-group-tab-inset: 6px;')
  })

  it('aligns collapsible titles and group tabs to the edge of the fields', () => {
    const css = buildStyles()
    expect(css).toContain('fieldset[data-level]:not([data-level="0"]) > :last-child > * > [tabindex]')
    expect(css).toContain('legend > button:has([data-sanity-icon="toggle-arrow-right"])')
    expect(css).toContain('inset-inline-start: calc(-1 * var(--uplift-group-tab-inset))')
    expect(css).not.toMatch(/(padding|margin)-(left|right)/)
    expect(buildStyles({form: false})).not.toContain('--uplift-nested-field-gap)')
  })
})
