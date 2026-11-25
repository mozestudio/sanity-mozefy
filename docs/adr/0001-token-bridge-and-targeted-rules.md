# Reach the form chrome with a token bridge and with targeted rules

Since Sanity 6.24, the form chrome is built with Sanity UI 5. That covers field headers, fieldsets, nested content and the gaps between fields. Sanity UI 5 reads fixed custom properties on `:root` (`--space-N`, `--body-N`) and ignores the theme, so `upliftTheme()` no longer reaches field titles and descriptions.

We chose to do two things at once:

1. **A token bridge.** The plugin reads the theme in use and rewrites Sanity UI 5's spacing and body text properties from it. The whole Studio then follows one scale, and a retuned token group reaches everywhere.
2. **Targeted rules.** These keep the hierarchy inside a field: the title weight, the description size and the nested content indent. They target hooks Sanity sets on purpose.

The two parts do different jobs. The bridge sets the scale; the rules set the differences within it. That is why the description stays at 13 px while body text is 14 px.

## Considered options

- **Only the bridge.** One place to change, but it cannot express hierarchy, such as a title heavier than its description.
- **Only targeted rules.** Less exposed to Sanity UI 5's names, but each new piece of chrome needs its own rule, and the scale would drift from the theme's.

## Consequences

- **The bridge depends on an alpha.** It writes custom property names from Sanity UI 5 (`5.0.0-alpha.24` in Sanity 6.24). A Sanity release that renames them makes the bridge a silent no-op. On a Sanity version without Sanity UI 5, the properties are unused and the bridge does nothing.
- **The plugin needs the theme at runtime.** The theme is passed to `upliftTheme()` and the bridge is injected by `uplift()`, so the plugin reads the theme from the styled-components context. `styled-components` is now a peer dependency; Sanity already requires it.
- **Text trimming is fixed in Sanity UI 5.** Sanity UI 5 keeps its own per-size trim (`--trim`). With a larger type scale, text can sit up to half a pixel off optical centre.
