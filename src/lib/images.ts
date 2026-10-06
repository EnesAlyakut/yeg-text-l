/**
 * `sizes` for an image that *covers* a full-height frame of `base`vw width.
 * A landscape photo cropped into a portrait phone screen is rendered far wider than the
 * viewport — plain "100vw" would make the browser fetch a ~480px file and upscale it.
 */
export function coverSizes(width: number, height: number, base = 100) {
  const ratio = width / Math.max(height, 1);
  const at = (screenAspect: number) => Math.min(400, Math.max(base, Math.ceil(((ratio * base) / screenAspect) * 0.9)));
  // Wide photos on 4:3 / 16:10 desktops are also cropped by height, so they are drawn wider than the screen.
  const wide = (screenAspect: number) => Math.min(400, Math.max(base, Math.ceil((ratio * base) / screenAspect)));
  return `(max-aspect-ratio: 3/4) ${at(0.5)}vw, (max-aspect-ratio: 1/1) ${at(0.85)}vw, (max-aspect-ratio: 4/3) ${wide(4 / 3)}vw, (max-aspect-ratio: 16/10) ${wide(1.6)}vw, ${wide(1.78)}vw`;
}

/**
 * How much wider than its frame a photo is drawn: `object-cover` crops a wider photo by
 * scaling it to the frame's height, and hover / parallax zooms enlarge it further.
 */
export function coverFactor(img: { width: number; height: number } | null | undefined, frameAspect: number, zoom = 1) {
  if (!img || !img.width || !img.height) return zoom;
  return Math.max(1, img.width / img.height / frameAspect) * zoom;
}

/** Multiplies every `NNvw` in a `sizes` string, so the browser fetches a file big enough for the drawn size. */
export function scaleSizes(sizes: string, factor: number) {
  if (factor <= 1.01) return sizes;
  return sizes.replace(/(\d+(?:\.\d+)?)vw/g, (_, n: string) => `${Math.min(400, Math.ceil(Number(n) * factor))}vw`);
}

/**
 * `sizes` for a frame measured in viewport units (e.g. 32vw wide × 68vh tall) on wide screens.
 * The photo's drawn width depends on the screen's aspect ratio, so a few common ratios are listed.
 */
export function viewportFrameSizes(img: { width: number; height: number } | null | undefined, frame: { vw: number; vh: number }, zoom = 1) {
  const ratio = img && img.height ? img.width / img.height : 1;
  const at = (screenAspect: number) => Math.min(400, Math.ceil(Math.max(frame.vw, (frame.vh * ratio) / screenAspect) * zoom));
  return [`(max-aspect-ratio: 4/3) ${at(4 / 3)}vw`, `(max-aspect-ratio: 16/10) ${at(1.6)}vw`, `${at(1.78)}vw`];
}
