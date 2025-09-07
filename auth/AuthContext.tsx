

import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import * as backendService from '../services/backendService';
import { User } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for an active session on initial load
        const activeUser = backendService.getActiveUser();
        if (activeUser) {
            setUser(activeUser);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (username: string) => {
        setIsLoading(true);
        try {
            const { user: loggedInUser } = await backendService.login(username);
            setUser(loggedInUser);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            // Clear any saved application data for the user on logout
            if (user) {
                backendService.clearApplicationData(user.username);
            }
            await backendService.logout();
            setUser(null);
        } finally {
            // A short delay to prevent UI flashing and ensure a smooth transition
            setTimeout(() => setIsLoading(false), 300);
        }
    }, [user]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    }), [user, isLoading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthState => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};