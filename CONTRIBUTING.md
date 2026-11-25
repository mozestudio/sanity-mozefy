# Contributing

Thanks for helping. Uplift is small on purpose, so a few rules keep it that way.

## Rules

- **Nothing project-specific.** No schema names, document types, brand colours or copy. If a rule only makes sense for one project, it belongs in that project.
- **Tokens before CSS.** If a theme token can express the change, change the token. CSS is for what tokens cannot reach. Since Sanity 6.24 the form chrome ignores the theme, so check which part of the Studio a token actually reaches: see [the map](docs/sanity-studio-surface.md#1-theme).
- **Stable selectors only.** Sanity's class names are generated hashes. Target hooks Sanity sets on purpose: a `data-testid`, a named `data-ui` such as `fieldHeaderContentBox`, `data-level`, the `desc_` description ids. Avoid the generic `data-ui` names of Sanity UI primitives (`Box`, `Stack`, `VStack`, `Text`, `Grid`), which change when Sanity swaps a primitive. Never target a class. The [map of Studio hooks](docs/sanity-studio-surface.md#4-dom-hooks-for-css) lists the known hooks and how stable each one is.
- **Use the glossary's words.** Code, docs and options use the terms in [GLOSSARY.md](GLOSSARY.md). Add a term there when a new concept appears.
- **Every value is a custom property.** A project retunes a value by overriding the property, not by copying the rule.
- **Check it in a real Studio**, in light and dark mode, before releasing: a selector that stops matching fails silently.

## Develop

```sh
pnpm install
pnpm test        # unit tests
pnpm typecheck
pnpm build       # dist/, committed: projects run it straight from a tag
```

### Dev Studio

`dev/` holds a real Studio that runs the plugin from `src/`, so a change reloads straight away. It is not part of the package: `files` ships only `dist/`, and the build compiles only `src/`.

Point it at your own test project once:

```sh
cp dev/.env.example dev/.env.local   # ignored by git
# fill in SANITY_STUDIO_PROJECT_ID (and SANITY_STUDIO_DATASET if not "development")
pnpm dev:seed                        # once: imports the Fixture document and its images
pnpm dev                             # http://localhost:3333
```

`pnpm dev:seed` writes `fixture-demo` from `dev/seed/fixture.ndjson`, replacing it if it exists, into the `development` dataset. For another dataset, run it as `SANITY_STUDIO_DATASET=name pnpm dev:seed`. Run it again whenever the seed changes.

No test project yet? Create one with `pnpm dlx sanity@latest projects create`, or at sanity.io/manage, and allow `http://localhost:3333` among its CORS origins with credentials.

The Studio has two workspaces on the same content: `/uplift` with the theme and plugin, `/stock` without, to compare against the Studio as Sanity ships it. The `Fixture` document type covers the parts of the form Uplift styles; add a field there when a rule targets something it lacks, and keep it generic. Give the new field some content in `dev/seed/fixture.ndjson` too, so everyone sees it filled in.

### In a project

To try a change in a project's Studio before releasing, install the local folder there with `pnpm add file:../path/to/sanity-uplift`. A `file:` dependency resolves `sanity` and React from the project, so the Studio keeps a single copy of each. Switch back to the released version afterwards.

## Release

Every pull request that changes what projects install ships as a release of its own. Projects install a tag, so a change that never gets one never reaches them.

1. **Note the change.** Every pull request adds a line under `## Unreleased` in `CHANGELOG.md`, written for the people who use Uplift in a project. Docs and dev Studio changes go there too, and ride along with the next release.
2. **Cut the release** when the pull request changes `dist/` or the peer dependencies:

   ```sh
   pnpm release patch   # a fix, nothing to change in projects
   pnpm release minor   # a new rule, token or option; before 1.0, also a breaking change
   pnpm release major   # a breaking change, from 1.0 on
   ```

   It moves `## Unreleased` into a dated `## x.y.z` section, bumps `package.json` and points the README's install commands at the new tag. Then run `pnpm build` and commit everything with the change.
3. **Merge.** When a new version reaches `main`, CI tags it `vx.y.z` and publishes a GitHub release with its changelog section as the notes. Never push a tag by hand.
4. **Update the projects**: point the dependency at the new tag (`github:mozestudio/sanity-uplift#vx.y.z`) and reinstall.

CI fails a pull request whose `dist/` or peer dependencies change while the version stays the same, one whose version has no section in `CHANGELOG.md`, and one that releases a version while `## Unreleased` still has entries. Run the same check locally with `pnpm release:check origin/main`.
