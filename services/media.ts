import { tokenStorage } from './token-storage';

export async function uploadMediaFile(file: File): Promise<string> {
  const token = tokenStorage.getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Use relative '/api/v1/admin/media/upload' so Next.js rewrites to backend proxy seamlessly
  const uploadUrl = typeof window !== 'undefined'
    ? '/api/v1/admin/media/upload'
    : `${process.env.INTERNAL_API_URL || 'http://localhost:8080'}/api/v1/admin/media/upload`;

  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      const relativeUrl = json.data?.url;
      if (relativeUrl) return relativeUrl;
    }
    const errorJson = await res.json().catch(() => null);
    const errMsg = errorJson?.message || `Server returned ${res.status}: ${res.statusText}`;
    throw new Error(errMsg);
  } catch (error) {
    console.error('Backend media upload error:', error);
    throw error;
  }
}

export const mediaService = {
  uploadFile: async (file: File) => {
    const fileUrl = await uploadMediaFile(file);
    return { fileUrl };
  },
};
