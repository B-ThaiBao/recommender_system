const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_USER_KEY = 'auth_user';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getAuthUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const getAuthHeaders = () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const storeAuthSession = (payload) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh_token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getUserKey = () => {
  const user = getAuthUser();
  if (!user) {
    return { username: 'guest', user_id: null };
  }

  return {
    username: user.username,
    user_id: user.user_id,
  };
};