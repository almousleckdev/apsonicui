import type { PageDocument } from './types';

/** postMessage contract between the builder (parent window) and the preview frame. Both sides check the origin. */
export const BUILDER_TO_PREVIEW = 'apsonic-builder' as const;
export const PREVIEW_TO_BUILDER = 'apsonic-preview' as const;

export interface BuilderStateMessage {
  source: typeof BUILDER_TO_PREVIEW;
  type: 'state';
  document: PageDocument;
  selectedId: string | null;
  /** Section type -> display name, so the frame can label sections. */
  labels: Record<string, string>;
}
export type BuilderMessage = BuilderStateMessage;

export type PreviewMessage =
  | { source: typeof PREVIEW_TO_BUILDER; type: 'ready' }
  | { source: typeof PREVIEW_TO_BUILDER; type: 'select'; id: string | null }
  | { source: typeof PREVIEW_TO_BUILDER; type: 'insert'; index: number }
  | { source: typeof PREVIEW_TO_BUILDER; type: 'action'; id: string; action: 'up' | 'down' | 'duplicate' | 'delete' | 'toggle-hidden' };
