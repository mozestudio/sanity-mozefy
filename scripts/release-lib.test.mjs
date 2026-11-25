import {describe, expect, it} from 'vitest'
import {
  bumpVersion,
  cutRelease,
  isNewer,
  pinReadme,
  releaseNotes,
  releaseProblems,
} from './release-lib.mjs'

const changelog = `# Changelog

## Unreleased

- New rule.

## 0.2.0 - 2026-11-25

Renamed.

## 0.1.0

- First.
`

describe('bumpVersion', () => {
  it('bumps each level and resets the lower ones', () => {
    expect(bumpVersion('0.2.3', 'patch')).toBe('0.2.4')
    expect(bumpVersion('0.2.3', 'minor')).toBe('0.3.0')
    expect(bumpVersion('0.2.3', 'major')).toBe('1.0.0')
  })

  it('refuses an unknown level or version', () => {
    expect(() => bumpVersion('0.2.3', 'huge')).toThrow(/patch, minor or major/)
    expect(() => bumpVersion('0.2.3-beta', 'patch')).toThrow(/x\.y\.z/)
  })
})

describe('isNewer', () => {
  it('compares numerically, not as text', () => {
    expect(isNewer('0.10.0', '0.9.0')).toBe(true)
    expect(isNewer('0.2.0', '0.2.0')).toBe(false)
    expect(isNewer('0.1.9', '0.2.0')).toBe(false)
  })
})

describe('cutRelease', () => {
  it('moves Unreleased into a dated section and leaves Unreleased empty', () => {
    expect(cutRelease(changelog, '0.3.0', '2026-12-01')).toBe(`# Changelog

## Unreleased

## 0.3.0 - 2026-12-01

- New rule.

## 0.2.0 - 2026-11-25

Renamed.

## 0.1.0

- First.
`)
  })

  it('refuses an empty Unreleased', () => {
    const released = cutRelease(changelog, '0.3.0', '2026-12-01')
    expect(() => cutRelease(released, '0.3.1', '2026-12-02')).toThrow(/Nothing under/)
  })

  it('refuses a version that already has a section', () => {
    expect(() => cutRelease(changelog, '0.2.0', '2026-12-01')).toThrow(/already has/)
  })
})

describe('releaseNotes', () => {
  it('returns the body of the version section, with or without a date', () => {
    expect(releaseNotes(changelog, '0.2.0')).toBe('Renamed.')
    expect(releaseNotes(changelog, '0.1.0')).toBe('- First.')
  })

  it('fails for a version without a section', () => {
    expect(() => releaseNotes(changelog, '9.9.9')).toThrow(/no section/)
  })
})

describe('pinReadme', () => {
  it('points every install command at the new tag', () => {
    const readme = 'pnpm add github:mozestudio/sanity-uplift#v0.2.0\n"github:mozestudio/sanity-uplift#v0.2.0"'
    expect(pinReadme(readme, '0.3.0')).toBe(
      'pnpm add github:mozestudio/sanity-uplift#v0.3.0\n"github:mozestudio/sanity-uplift#v0.3.0"',
    )
  })
})

describe('releaseProblems', () => {
  const released = cutRelease(changelog, '0.3.0', '2026-12-01')

  it('passes a release with its section and nothing left in Unreleased', () => {
    expect(releaseProblems({changelog: released, version: '0.3.0', baseVersion: '0.2.0', shippedChanged: true})).toEqual([])
  })

  it('passes a change that ships nothing without a release', () => {
    expect(releaseProblems({changelog, version: '0.2.0', baseVersion: '0.2.0', shippedChanged: false})).toEqual([])
  })

  it('flags a new build without a new version', () => {
    expect(releaseProblems({changelog, version: '0.2.0', baseVersion: '0.2.0', shippedChanged: true})).toEqual([
      expect.stringMatching(/pnpm release/),
    ])
  })

  it('flags a version without a section, a version going down and entries left behind', () => {
    expect(releaseProblems({changelog, version: '0.0.9', baseVersion: '0.2.0', shippedChanged: true})).toEqual([
      expect.stringMatching(/no section for 0\.0\.9/),
      expect.stringMatching(/must go up/),
      expect.stringMatching(/still has entries/),
    ])
  })

  it('checks only the section when there is no base to compare with', () => {
    expect(releaseProblems({changelog, version: '0.2.0'})).toEqual([])
    expect(releaseProblems({changelog, version: '0.4.0'})).toHaveLength(1)
  })
})
