// The Studio bundler replaces `process.env.SANITY_STUDIO_*` at build time, in the
// browser too. Declared here so the dev Studio typechecks without @types/node.
declare const process: {
  env: {
    SANITY_STUDIO_PROJECT_ID?: string
    SANITY_STUDIO_DATASET?: string
  }
}
