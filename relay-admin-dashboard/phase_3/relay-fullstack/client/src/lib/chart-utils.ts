// ─────────────────────────────────────────────────────────────────────────
// Small, dependency-free chart-drawing helpers.
//
// Pulled out of PulseStrip.tsx so the component only handles state/render,
// while the pure math (turning a series of numbers into an SVG path
// string) lives here and can be unit-tested or reused independently.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Converts an array of values (expected range 0-100) into an SVG `<path>`
 * `d` attribute, drawing a smooth left-to-right line across the given
 * pixel dimensions.
 *
 * @param series - data points, each roughly 0-100 (percentage of height)
 * @param width - target SVG viewBox width in pixels
 * @param height - target SVG viewBox height in pixels
 */
export function buildLinePath(series: number[], width: number, height: number): string {
  const stepX = width / (series.length - 1);
  return series
    .map((value, index) => {
      const x = index * stepX;
      // Invert Y because SVG's origin is top-left, but a higher value
      // should draw closer to the top of the chart.
      const y = height - (value / 100) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * Extends a line path into a closed area path (adds bottom-right and
 * bottom-left corners), used to fill the region under the pulse line with
 * a gradient.
 */
export function buildAreaPath(linePath: string, width: number, height: number): string {
  return `${linePath} L${width},${height} L0,${height} Z`;
}
