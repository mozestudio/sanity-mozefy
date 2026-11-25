import {definePlugin, type LayoutProps} from 'sanity'
import {buildStyles, type MozefyStyleOptions} from './styles.js'

export type MozefyOptions = MozefyStyleOptions

/**
 * Adds Mozefy's form rules to the Studio: the parts of the UX that theme
 * tokens cannot reach, such as the hierarchy between a field's title and its
 * description, or the gap between array items.
 *
 * Pair it with `mozefyTheme()` on the config's `theme` option.
 */
export const mozefy = definePlugin<MozefyOptions | void>((options) => {
  const css = buildStyles(options ?? {})

  function MozefyLayout(props: LayoutProps) {
    return (
      <>
        {css ? <style data-mozefy="">{css}</style> : null}
        {props.renderDefault(props)}
      </>
    )
  }

  return {
    name: '@mozestudio/sanity-mozefy',
    studio: {components: {layout: MozefyLayout}},
  }
})
