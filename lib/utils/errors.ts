/** Message to show for an unknown thrown value: the Error's message when it has one, otherwise the fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
