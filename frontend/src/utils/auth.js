export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
        const decoded = JSON.parse(atob(padded));
        return decoded.sub ? Number(decoded.sub) : null;
    } catch (error) {
        return null;
    }
};

export const getAuthToken = () => localStorage.getItem('token');