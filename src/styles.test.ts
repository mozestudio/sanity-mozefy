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

  it('never targets a generated class name', () => {
    expect(buildStyles()).not.toMatch(/\.[a-zA-Z]+-[a-zA-Z0-9]{5,}/)
  })
})
