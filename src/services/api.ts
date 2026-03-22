// Barrel re-export — all components continue to import from here.
// Internally everything uses the shared axios instance with auto-refresh.

import { authService } from './authService';
import { userService } from './userService';
import { contentService } from './contentService';
import { forumService } from './forumService';
import { executiveService } from './executiveService';
import { foundingLeaderService } from './foundingLeaderService';

export const authAPI = authService;
export const userAPI = userService;
export const contentAPI = contentService;
export const forumAPI = forumService;
export const executiveAPI = executiveService;
export const foundingLeaderAPI = foundingLeaderService;
