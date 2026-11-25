// Pure helpers behind scripts/release.mjs. They read and rewrite CHANGELOG.md and
// README.md as text, so the tests can run them without touching the repo.

const UNRELEASED = 'Unreleased'

/** Every `## ` section of the changelog, with its title and where it sits in the text. */
export function parseSections(changelog) {
  const heads = [...changelog.matchAll(/^## (.+)$/gm)]
  return heads.map((head, i) => ({
    title: head[1].trim(),
    start: head.index,
    bodyStart: head.index + head[0].length,
    end: i + 1 < heads.length ? heads[i + 1].index : changelog.length,
  }))
}

/** The version a section title names: `0.3.0 - 2026-11-25` → `0.3.0`. */
function versionOf(title) {
  return title.split(/\s/)[0]
}

function sectionBody(changelog, section) {
  return changelog.slice(section.bodyStart, section.end).trim()
}

export function bumpVersion(version, level) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) throw new Error(`Not a plain x.y.z version: ${version}`)
  const [major, minor, patch] = match.slice(1).map(Number)
  if (level === 'major') return `${major + 1}.0.0`
  if (level === 'minor') return `${major}.${minor + 1}.0`
  if (level === 'patch') return `${major}.${minor}.${patch + 1}`
  throw new Error(`Unknown bump "${level}": use patch, minor or major`)
}

/** True when `a` is a higher x.y.z version than `b`. */
export function isNewer(a, b) {
  const [pa, pb] = [a, b].map((v) => v.split('.').map(Number))
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] > pb[i]
  }
  return false
}

/**
 * Moves what is under `## Unreleased` into a new `## <version> - <date>` section,
 * and leaves an empty `## Unreleased` above it for the next change.
 */
export function cutRelease(changelog, version, date) {
  const sections = parseSections(changelog)
  const unreleased = sections.find((s) => s.title === UNRELEASED)
  if (!unreleased) throw new Error(`CHANGELOG.md has no "## ${UNRELEASED}" section`)
  if (sections.some((s) => versionOf(s.title) === version)) {
    throw new Error(`CHANGELOG.md already has a section for ${version}`)
  }
  const body = sectionBody(changelog, unreleased)
  if (!body) {
    throw new Error(`Nothing under "## ${UNRELEASED}" in CHANGELOG.md: describe the change there first`)
  }
  const released = `## ${UNRELEASED}\n\n## ${version} - ${date}\n\n${body}\n\n`
  const rest = changelog.slice(unreleased.end)
  return (changelog.slice(0, unreleased.start) + released + rest).replace(/\n+$/, '\n')
}

/** The body of the version's section, used as the notes of its GitHub release. */
export function releaseNotes(changelog, version) {
  const section = parseSections(changelog).find((s) => versionOf(s.title) === version)
  if (!section) throw new Error(`CHANGELOG.md has no section for ${version}`)
  return sectionBody(changelog, section)
}

/** Points the install commands of the README at the new tag. */
export function pinReadme(readme, version) {
  return readme.replace(/(sanity-uplift#v)\d+\.\d+\.\d+/g, `$1${version}`)
}

/**
 * What is wrong with the release state of a branch, as messages; empty when nothing is.
 * `baseVersion` and `shippedChanged` are known only on a pull request.
 */
export function releaseProblems({changelog, version, baseVersion, shippedChanged}) {
  const problems = []
  const sections = parseSections(changelog)
  if (!sections.some((s) => versionOf(s.title) === version)) {
    problems.push(`CHANGELOG.md has no section for ${version}, the version in package.json`)
  }
  if (baseVersion === undefined) return problems

  const bumped = version !== baseVersion
  if (shippedChanged && !bumped) {
    problems.push(
      'dist/ or the peer dependencies changed, so projects get a new build, but the version did not: ' +
        'run `pnpm release patch|minor|major` and commit the result',
    )
  }
  if (bumped && !isNewer(version, baseVersion)) {
    problems.push(`The version goes from ${baseVersion} to ${version}: it must go up`)
  }
  const unreleased = sections.find((s) => s.title === UNRELEASED)
  if (bumped && unreleased && sectionBody(changelog, unreleased)) {
    problems.push(
      `This branch releases ${version} but "## ${UNRELEASED}" still has entries: move them into ${version}`,
    )
  }
  return problems
}
