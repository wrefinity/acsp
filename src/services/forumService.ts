import api from './axios';

export const forumService = {
  getForums: () => api.get('/forums').then(r => r.data),
  createForum: (data: { name: string; description: string }) =>
    api.post('/forums', data).then(r => r.data),
  deleteForum: (id: string) => api.delete(`/forums/${id}`).then(r => r.data),

  getThreads: (forumId: string) => api.get(`/forums/${forumId}/threads`).then(r => r.data),
  getThread: (threadId: string) => api.get(`/forums/threads/${threadId}`).then(r => r.data),
  createThread: (data: { title: string; content: string; forumId: string }) =>
    api.post(`/forums/${data.forumId}/threads`, { title: data.title, content: data.content }).then(r => r.data),
  createReply: (threadId: string, content: string) =>
    api.post(`/forums/threads/${threadId}/reply`, { content }).then(r => r.data),
};
