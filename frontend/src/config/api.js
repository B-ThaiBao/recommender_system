const DEFAULT_AUTH_BASE_URL = "http://localhost:9001";
const DEFAULT_CORE_BASE_URL = "http://localhost:9002";
const DEFAULT_GRADE_BASE_URL = "http://localhost:9003";
const DEFAULT_CHATBOT_BASE_URL = "http://localhost:9014";

export const API_BASE_URLS = {
  auth: import.meta.env.VITE_AUTH_API_BASE_URL || DEFAULT_AUTH_BASE_URL,
  core: import.meta.env.VITE_CORE_API_BASE_URL || DEFAULT_CORE_BASE_URL,
  grade: import.meta.env.VITE_GRADE_API_BASE_URL || DEFAULT_GRADE_BASE_URL,
  chatbot: import.meta.env.VITE_CHATBOT_API_BASE_URL || DEFAULT_CHATBOT_BASE_URL,
};

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URLS.auth}/v1/auth/login`,
    register: `${API_BASE_URLS.auth}/v1/auth/register`,
    refresh: `${API_BASE_URLS.auth}/v1/auth/refresh`,
    me: `${API_BASE_URLS.auth}/v1/auth/me`,
  },
  core: {
    templates: `${API_BASE_URLS.core}/v1/quiz/templates`,
    submitAttempt: `${API_BASE_URLS.core}/v1/quiz/attempts`,
    latestRecommendations: `${API_BASE_URLS.core}/v1/recommendations/latest`,
  },
  grade: {
    uploadTranscript: `${API_BASE_URLS.grade}/v1/grades/upload-transcript`,
    manual: `${API_BASE_URLS.grade}/v1/grades/manual`,
    latest: `${API_BASE_URLS.grade}/v1/grades/latest`,
  },
  chatbot: {
    chat: `${API_BASE_URLS.chatbot}/v1/chat`,
    sessions: `${API_BASE_URLS.chatbot}/v1/chat/sessions`,
  },
};
