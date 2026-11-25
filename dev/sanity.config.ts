import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
// The source, not dist/: edits to src/ reload the Studio straight away.
import {uplift, upliftTheme} from '../src/index'
import {dataset, projectId} from './env'
import {schemaTypes} from './schema'

const shared = {
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {types: schemaTypes},
}

/**
 * Two workspaces on the same content: `/uplift` with the theme and plugin,
 * `/stock` without, to compare a change against the Studio as Sanity ships it.
 */
export default defineConfig([
  {
    ...shared,
    name: 'uplift',
    title: 'Uplift',
    basePath: '/uplift',
    theme: upliftTheme(),
    plugins: [...shared.plugins, uplift()],
  },
  {
    ...shared,
    name: 'stock',
    title: 'Stock',
    basePath: '/stock',
  },
])
