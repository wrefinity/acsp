import api from './axios';

export const contentService = {
  // Carousel
  getCarouselSlides: () => api.get('/content/carousel').then(r => r.data),
  createCarouselSlide: (data: FormData) =>
    api.post('/content/carousel', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteCarouselSlide: (id: string) => api.delete(`/content/carousel/${id}`).then(r => r.data),

  // Announcements
  getAnnouncements: () => api.get('/content/announcements').then(r => r.data),
  createAnnouncement: (data: any) => api.post('/content/announcements', data).then(r => r.data),
  deleteAnnouncement: (id: string) => api.delete(`/content/announcements/${id}`).then(r => r.data),

  // Events
  getEvents: () => api.get('/content/events').then(r => r.data),
  createEvent: (data: FormData) =>
    api.post('/content/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteEvent: (id: string) => api.delete(`/content/events/${id}`).then(r => r.data),

  // Blogs
  getBlogs: () => api.get('/content/blogs').then(r => r.data),
  createBlog: (data: FormData) =>
    api.post('/content/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteBlog: (id: string) => api.delete(`/content/blogs/${id}`).then(r => r.data),

  // Gallery
  getGallery: () => api.get('/content/gallery').then(r => r.data),
  createGalleryImage: (data: FormData) =>
    api.post('/content/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteGalleryImage: (id: string) => api.delete(`/content/gallery/${id}`).then(r => r.data),

  // Founder messages / Newsletters
  getFounderMessages: () => api.get('/content/founder-messages').then(r => r.data),
  getAllFounderMessages: () => api.get('/content/founder-messages/all').then(r => r.data),
  createFounderMessage: (data: any) => api.post('/content/founder-messages', data).then(r => r.data),
  updateFounderMessage: (id: string, data: any) => api.put(`/content/founder-messages/${id}`, data).then(r => r.data),
  deleteFounderMessage: (id: string) => api.delete(`/content/founder-messages/${id}`).then(r => r.data),

  // Stats
  getStats: () => api.get('/content/stats').then(r => r.data),
};
