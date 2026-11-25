#!/usr/bin/env node
// Releases Uplift. A release is a version in package.json with its own section in
// CHANGELOG.md; when it reaches main, CI tags it and publishes the GitHub release.
//
//   node scripts/release.mjs patch|minor|major   cut a release from "## Unreleased"
//   node scripts/release.mjs check [base-ref]    what CI checks; with a base ref, as on a pull request
//   node scripts/release.mjs notes [version]     print a version's changelog section

import {execFileSync} from 'node:child_process'
import {readFileSync, writeFileSync} from 'node:fs'
import {
  bumpVersion,
  cutRelease,
  pinReadme,
  releaseNotes,
  releaseProblems,
} from './release-lib.mjs'

const root = new URL('..', import.meta.url)
const read = (file) => readFileSync(new URL(file, root), 'utf8')
const write = (file, text) => writeFileSync(new URL(file, root), text)
const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'})

const [command, arg] = process.argv.slice(2)
const pkg = JSON.parse(read('package.json'))

try {
  if (['patch', 'minor', 'major'].includes(command)) {
    const version = bumpVersion(pkg.version, command)
    const date = new Date().toISOString().slice(0, 10)
    write('CHANGELOG.md', cutRelease(read('CHANGELOG.md'), version, date))
    write('package.json', `${JSON.stringify({...pkg, version}, null, 2)}\n`)
    write('README.md', pinReadme(read('README.md'), version))
    console.log(`Released ${version} in CHANGELOG.md, package.json and README.md.`)
    console.log('Next: pnpm build, commit everything with the change, open the pull request.')
  } else if (command === 'check') {
    const changelog = read('CHANGELOG.md')
    let context = {}
    if (arg) {
      const base = JSON.parse(git('show', `${arg}:package.json`))
      const changed = git('diff', '--name-only', `${arg}...HEAD`).split('\n').filter(Boolean)
      const peersChanged =
        JSON.stringify(base.peerDependencies ?? {}) !== JSON.stringify(pkg.peerDependencies ?? {})
      context = {
        baseVersion: base.version,
        shippedChanged: peersChanged || changed.some((file) => file.startsWith('dist/')),
      }
    }
    const problems = releaseProblems({changelog, version: pkg.version, ...context})
    if (problems.length) {
      for (const problem of problems) console.error(`✗ ${problem}`)
      process.exit(1)
    }
    console.log(`✓ ${pkg.version} has its changelog section${arg ? ` and the release matches the change since ${arg}` : ''}.`)
  } else if (command === 'notes') {
    console.log(releaseNotes(read('CHANGELOG.md'), arg ?? pkg.version))
  } else {
    console.error('Usage: node scripts/release.mjs patch|minor|major | check [base-ref] | notes [version]')
    process.exit(1)
  }
} catch (error) {
  console.error(`✗ ${error.message}`)
  process.exit(1)
}
