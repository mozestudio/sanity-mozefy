# Contributing

Thanks for helping. Mozefy is small on purpose, so a few rules keep it that way.

## Rules

- **Nothing project-specific.** No schema names, document types, brand colours or copy. If a rule only makes sense for one project, it belongs in that project.
- **Tokens before CSS.** If a theme token can express the change, change the token. CSS is for what tokens cannot reach.
- **Stable selectors only.** Sanity's class names are generated hashes. Target attributes Sanity sets on purpose (`data-testid`, `data-ui`, `data-level`), never a class.
- **Every value is a custom property.** A project retunes a value by overriding the property, not by copying the rule.
- **Check it in a real Studio**, in light and dark mode, before releasing: a selector that stops matching fails silently.

## Develop

```sh
pnpm install
pnpm test        # unit tests
pnpm typecheck
pnpm build       # dist/, committed: projects run it straight from a tag
```

To try a change in a Studio before releasing, install the local folder there with `pnpm add file:../path/to/sanity-mozefy`. A `file:` dependency resolves `sanity` and React from the project, so the Studio keeps a single copy of each. Switch back to the released version afterwards.

## Release

1. Bump `version` in `package.json`, note the change in `CHANGELOG.md`, run `pnpm build` and commit `dist/` with the change. CI fails when `dist/` does not match the source.
2. Merge to `main`, then push a matching tag: `git tag v0.2.0 && git push origin v0.2.0`. CI checks the tag against `package.json`.
3. In each project, point the dependency at the new tag (`github:mozestudio/sanity-mozefy#v0.2.0`) and reinstall.
