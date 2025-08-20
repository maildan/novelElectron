"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Logger } from '../../shared/logger';

export interface AuthState {
    isAuthenticated: boolean;
    userEmail?: string;
    userName?: string;
    userPicture?: string;
}

export interface AuthContextType {
    auth: AuthState;
    loadAuthStatus: () => Promise<void>;
    setAuth: (next: Partial<AuthState>) => void;
    clearAuth: () => void;
}

const getDefaultAuth = (): AuthState => ({ isAuthenticated: false });

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuthState] = useState<AuthState>(getDefaultAuth());
    const latestLoadId = React.useRef(0);

    const setAuth = useCallback((next: Partial<AuthState>) => {
        setAuthState(prev => ({ ...prev, ...next }));
    }, []);

    const clearAuth = useCallback(() => {
        setAuthState(getDefaultAuth());
    }, []);

    const loadAuthStatus = useCallback(async (): Promise<void> => {
        const requestId = ++latestLoadId.current;
        try {
            if (typeof window === 'undefined' || !window.electronAPI?.oauth?.getAuthStatus) return;
            const res = await window.electronAPI.oauth.getAuthStatus();
            // ignore stale responses
            if (requestId !== latestLoadId.current) return;

            if (res && res.success && res.data && res.data.isAuthenticated) {
                const email = res.data.userEmail;
                setAuthState({
                    isAuthenticated: true,
                    userEmail: email,
                    userName: email ? email.split('@')[0] : res.data.userName || 'Google 사용자',
                    userPicture: email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=4f46e5&color=fff&size=64` : undefined,
                });
                Logger.info('AUTH_CONTEXT', 'Auth status loaded', { userEmail: email });
            } else {
                setAuthState(getDefaultAuth());
            }
        } catch (error) {
            // ignore stale errors
            if (requestId !== latestLoadId.current) return;
            Logger.error('AUTH_CONTEXT', 'Failed to load auth status', error);
            setAuthState(getDefaultAuth());
        }
    }, []);

    useEffect(() => {
        loadAuthStatus();

        if (typeof window !== 'undefined' && window.electronAPI?.on) {
            const handler = (payload?: any) => {
                Logger.info('AUTH_CONTEXT', 'auth-status-changed event received', payload);
                loadAuthStatus();
            };
            window.electronAPI.on('auth-status-changed', handler);
            window.electronAPI.on('oauth-success', handler);
            return () => {
                window.electronAPI?.removeListener('auth-status-changed', handler);
                window.electronAPI?.removeListener('oauth-success', handler);
            };
        }
    }, [loadAuthStatus]);

    const ctx = useMemo(() => ({ auth, loadAuthStatus, setAuth, clearAuth }), [auth, loadAuthStatus, setAuth, clearAuth]);

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthContext;
