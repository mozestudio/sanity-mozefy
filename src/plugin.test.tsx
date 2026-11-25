import {renderToStaticMarkup} from 'react-dom/server'
import type {LayoutProps} from 'sanity'
import {ThemeProvider} from 'styled-components'
import {describe, expect, it} from 'vitest'
import {uplift, type UpliftOptions} from './plugin.js'
import {upliftTheme} from './theme.js'

function renderLayout(options?: UpliftOptions, theme: object = {sanity: upliftTheme()}) {
  const Layout = uplift(options).studio?.components?.layout
  if (!Layout) throw new Error('expected a layout component')
  const props = {renderDefault: () => <main />} as unknown as LayoutProps
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <Layout {...props} />
    </ThemeProvider>,
  )
}

describe('uplift() layout', () => {
  it('injects the token bridge from the theme in context, then the rules', () => {
    const html = renderLayout()
    expect(html).toContain('--space-3: 14px;')
    expect(html).toContain('fieldHeaderContentBox')
    expect(html.indexOf('html:root')).toBeLessThan(html.indexOf(':where(:root)'))
    expect(html).toContain('<main></main>')
  })

  it('leaves the bridge out when turned off', () => {
    expect(renderLayout({bridge: false})).not.toContain('html:root')
  })

  it('still injects the rules when the theme has no v2', () => {
    const html = renderLayout(undefined, {sanity: {}})
    expect(html).not.toContain('html:root')
    expect(html).toContain('fieldHeaderContentBox')
  })

  it('injects nothing when everything is off', () => {
    expect(renderLayout({bridge: false, form: false, arrays: false})).toBe('<main></main>')
  })
})
