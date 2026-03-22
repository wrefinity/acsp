import api from './axios';

export interface ExecutiveMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const executiveService = {
  getExecutives: (): Promise<ExecutiveMember[]> =>
    api.get('/content/executives').then(r => r.data),

  createExecutive: (data: FormData): Promise<ExecutiveMember> =>
    api.post('/content/executives', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  updateExecutive: (id: string, data: FormData): Promise<ExecutiveMember> =>
    api.put(`/content/executives/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  deleteExecutive: (id: string): Promise<void> =>
    api.delete(`/content/executives/${id}`).then(() => undefined),
};
