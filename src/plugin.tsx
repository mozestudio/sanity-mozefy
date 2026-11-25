import {definePlugin, type LayoutProps} from 'sanity'
import {buildStyles, type UpliftStyleOptions} from './styles.js'

export type UpliftOptions = UpliftStyleOptions

/**
 * Adds Uplift's form rules to the Studio: the parts of the UX that theme
 * tokens cannot reach, such as the hierarchy between a field's title and its
 * description, or the gap between array items.
 *
 * Pair it with `upliftTheme()` on the config's `theme` option.
 */
export const uplift = definePlugin<UpliftOptions | void>((options) => {
  const css = buildStyles(options ?? {})

  function UpliftLayout(props: LayoutProps) {
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
