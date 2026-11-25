# Changelog

## 0.2.0

Renamed from `sanity-mozefy` to `sanity-uplift`. Breaking: only the names change, the behaviour is the same.

| Before | After |
| --- | --- |
| `@mozestudio/sanity-mozefy` | `@mozestudio/sanity-uplift` |
| `mozefyTheme()` | `upliftTheme()` |
| `mozefy()` | `uplift()` |
| `MozefyOptions`, `MozefyStyleOptions`, `MozefyThemeOptions`, `MozefyTokens` | `UpliftOptions`, `UpliftStyleOptions`, `UpliftThemeOptions`, `UpliftTokens` |
| `--mozefy-*` custom properties | `--uplift-*` |

## 0.1.0

- `mozefyTheme()`: the comfortable spacing scale and `Text` scale on top of any base theme.
- `mozefy()`: form rules (field title and description hierarchy, nested fieldsets) and array rules (gap between items), each with custom properties to retune.
