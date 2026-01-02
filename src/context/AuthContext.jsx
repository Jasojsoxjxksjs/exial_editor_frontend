import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'https://railway.com/project/5cf1d53e-69cd-482b-bd54-91cd30b1f2c4?environmentId=ca36a9f3-3a01-4f53-8902-ce2de965e2b9/api/auth';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('currentUser');

            if (token && savedUser) {
                // Optionally verify token with backend here
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (!response.ok) return { success: false, message: data.message };

            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            setUser(data.user);

            return { success: true, message: 'تم التسجيل بنجاح' };
        } catch (error) {
            return { success: false, message: 'خطأ في الاتصال بالخادم' };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) return { success: false, message: data.message };

            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            setUser(data.user);

            return { success: true, message: 'تم تسجيل الدخول بنجاح' };
        } catch (error) {
            return { success: false, message: 'خطأ في الاتصال بالخادم' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    };

    const updateProfile = async (newData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });

            const data = await response.json();
            if (!response.ok) return { success: false, message: data.message };

            localStorage.setItem('currentUser', JSON.stringify(data));
            setUser(data);

            return { success: true, message: 'تم تحديث البيانات بنجاح' };
        } catch (error) {
            return { success: false, message: 'خطأ في الاتصال بالخادم' };
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
