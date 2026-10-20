/** Bare technical answers from the server that tell an administrator nothing. */
const UNHELPFUL = /^(not found|internal server error|bad request|forbidden|unauthorized|failed to fetch|network ?error)\.?$/i;

/** Message to show for an unknown thrown value: the Error's message when it is readable, otherwise the fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message && !UNHELPFUL.test(error.message.trim()) ? error.message : fallback;
}
