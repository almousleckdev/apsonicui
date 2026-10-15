import { apiClient } from './api-client';

export interface TrashItem {
  id: string;
  title: string;
  deletedAt: string;
  deletedBy: string;
}

export type TrashResourceType = 'products' | 'categories' | 'news' | 'users' | 'notifications' | 'pages';

export const fetchTrashItems = async (type: TrashResourceType) => {
  return apiClient<TrashItem[]>(`/admin/trash/${type}`, {
    method: 'GET',
    requiresAuth: true,
  });
};

export const restoreTrashItem = async (type: TrashResourceType, id: string) => {
  return apiClient<void>(`/admin/trash/${type}/${id}/restore`, {
    method: 'POST',
    requiresAuth: true,
  });
};

export const deleteTrashItemPermanently = async (type: TrashResourceType, id: string) => {
  return apiClient<void>(`/admin/trash/${type}/${id}`, {
    method: 'DELETE',
    requiresAuth: true,
  });
};

export const clearTrash = async (type: TrashResourceType) => {
  return apiClient<void>(`/admin/trash/${type}/clear`, {
    method: 'DELETE',
    requiresAuth: true,
  });
};
