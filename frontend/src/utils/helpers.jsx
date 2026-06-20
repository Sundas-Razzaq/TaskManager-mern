const AUTH_TOKEN_KEY = "taskmanager_auth_token";
const AUTH_USER_KEY = "taskmanager_auth_user";

export const getStoredToken = () => {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getStoredUser = () => {
    const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
};

export const setAuthSession = ({ token, user }) => {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = () => {
    return Boolean(getStoredToken());
};

export const resolveErrorMessage = (error) => {
    return error?.response?.data?.message || error?.message || "Something went wrong";
};
