import api from './axios';

export interface FoundingLeader {
  _id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const foundingLeaderService = {
  getFoundingLeaders: (): Promise<FoundingLeader[]> =>
    api.get('/content/founding-leaders').then(r => r.data),

  getAllFoundingLeaders: (): Promise<FoundingLeader[]> =>
    api.get('/content/founding-leaders/all').then(r => r.data),

  createFoundingLeader: (data: FormData): Promise<FoundingLeader> =>
    api.post('/content/founding-leaders', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  updateFoundingLeader: (id: string, data: FormData): Promise<FoundingLeader> =>
    api.put(`/content/founding-leaders/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  deleteFoundingLeader: (id: string): Promise<void> =>
    api.delete(`/content/founding-leaders/${id}`).then(() => undefined),
};
