import { apiClient } from './api-client';

interface UploadedMedia {
  url: string;
  filename: string;
}

const UPLOAD_TIMEOUT_MS = 120_000; // videos can be up to 50 MB

/**
 * Uploads a file through apiClient so it gets the same treatment as every other admin call:
 * bearer token, automatic session refresh on 401 (access tokens are short-lived), and consistent errors.
 * The backend validates the real content type; the server's message is surfaced in the thrown error.
 */
export async function uploadMediaFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient<UploadedMedia>('/admin/media/upload', {
    method: 'POST',
    body: formData,
    requiresAuth: true,
    retryCount: 1,
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });

  const url = res.data?.url;
  if (!url) {
    throw new Error('Upload succeeded but the server returned no file URL');
  }
  return url;
}

export const mediaService = {
  uploadFile: async (file: File) => {
    const fileUrl = await uploadMediaFile(file);
    return { fileUrl };
  },
};
