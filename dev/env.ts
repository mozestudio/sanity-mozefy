/**
 * The dev Studio's settings, read from `dev/.env.local` (see `dev/.env.example`).
 * Each contributor points it at their own test project: nothing here is shared.
 */
export const projectId = required('SANITY_STUDIO_PROJECT_ID', process.env.SANITY_STUDIO_PROJECT_ID)
export const dataset = process.env.SANITY_STUDIO_DATASET || 'development'

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Copy dev/.env.example to dev/.env.local and fill in your test project.`,
    )
  }
  return value
}
