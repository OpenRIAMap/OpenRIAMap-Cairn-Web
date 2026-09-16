/** One owned stack for review overlays; business panels may not invent a z-index. */
export const REVIEW_LAYER = Object.freeze({
  panel: 1760,
  packageDetail: 1761,
  releaseProgress: 1763,
  scrim: 29_900,
  confirmation: 30_000,
  toast: 30_100,
});
