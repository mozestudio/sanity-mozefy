import {useMemo} from 'react'
import {definePlugin, type LayoutProps} from 'sanity'
import {useTheme} from 'styled-components'
import {buildTokenBridge, type BridgeTheme} from './bridge.js'
import {buildStyles, type UpliftStyleOptions} from './styles.js'

export interface UpliftOptions extends UpliftStyleOptions {
  /**
   * Carry the theme's spacing and type scale to the parts of the Studio that
   * ignore the theme, such as field titles and descriptions on Sanity 6.24.
   * Default `true`.
   */
  bridge?: boolean
}

/** The styled-components theme Sanity UI provides: the root theme under `sanity`. */
interface StudioStyledTheme {
  sanity?: {v2?: BridgeTheme}
}

/**
 * Adds Uplift's rules to the Studio: the token bridge, and the parts of the UX
 * that theme tokens cannot reach, such as the hierarchy between a field's title
 * and its description, or the room between array items.
 *
 * Pair it with `upliftTheme()` on the config's `theme` option.
 */
export const uplift = definePlugin<UpliftOptions | void>((options) => {
  const {bridge = true, ...styleOptions} = options ?? {}
  const rules = buildStyles(styleOptions)

  function UpliftLayout(props: LayoutProps) {
    const theme = (useTheme() as StudioStyledTheme | undefined)?.sanity?.v2
    const css = useMemo(
      () => [bridge && theme ? buildTokenBridge(theme) : '', rules].filter(Boolean).join('\n\n'),
      [theme],
    )

    return (
      <>
        {css ? <style data-uplift="">{css}</style> : null}
        {props.renderDefault(props)}
      </>
    )
  }

  return {
    name: '@mozestudio/sanity-uplift',
    studio: {components: {layout: UpliftLayout}},
  }
})
