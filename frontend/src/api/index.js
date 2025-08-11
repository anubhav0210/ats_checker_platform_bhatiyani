// src/api/index.js
import { realBackend } from './realBackend';
import { mockBackend } from './mockBackend';

// Change this to switch between backends
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export const authAPI = USE_MOCK ? mockBackend.authAPI : realBackend.authAPI;
export const resumeAPI = USE_MOCK ? mockBackend.resumeAPI : realBackend.resumeAPI;