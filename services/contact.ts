import { apiClient } from './api-client';
import type { ContactFormData } from '@/lib/schemas/contact';

export interface ContactMessageItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  department?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
  repliedAt?: string;
}

export interface ContactPageResponse {
  content: ContactMessageItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ContactUnreadCount {
  unreadCount: number;
}

export const submitContactForm = async (data: ContactFormData) => {
  return apiClient<ContactMessageItem>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth: false,
  });
};

export const fetchAdminContactMessages = async (status: string = 'all', page: number = 0, size: number = 20) => {
  return apiClient<ContactPageResponse>(`/admin/contact?status=${status}&page=${page}&size=${size}`, {
    method: 'GET',
    requiresAuth: true,
  });
};

export const fetchAdminContactUnreadCount = async () => {
  return apiClient<ContactUnreadCount>('/admin/contact/unread-count', {
    method: 'GET',
    requiresAuth: true,
    silent: true,
    retryCount: 0,
    timeoutMs: 4000,
  });
};

export const markAdminContactRead = async (id: number, read: boolean = true) => {
  return apiClient<ContactMessageItem>(`/admin/contact/${id}/read?read=${read}`, {
    method: 'PUT',
    requiresAuth: true,
  });
};

export const markAdminContactReplied = async (id: number, replied: boolean = true) => {
  return apiClient<ContactMessageItem>(`/admin/contact/${id}/reply?replied=${replied}`, {
    method: 'PUT',
    requiresAuth: true,
  });
};
