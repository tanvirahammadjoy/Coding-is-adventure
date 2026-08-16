// ─────────────────────────────────────────────────────────────────────────
// Express 4 does not automatically forward a rejected promise from an
// async route handler to the error-handling middleware — an unhandled
// rejection would otherwise just hang the request or crash the process.
// Wrapping every async controller in this catches that and calls next(err).
// ─────────────────────────────────────────────────────────────────────────

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
