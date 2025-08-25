'use client';

import React, { ReactNode, useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MonitoringProvider } from '../contexts/GlobalMonitoringContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Logger } from '../../shared/logger';
import './globals.css';

interface ClientLayoutProps {
    readonly children: ReactNode;
    readonly initialAuth?: any;
}

export default function ClientLayout({ children, initialAuth }: ClientLayoutProps): React.ReactElement {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [isClientMounted, setIsClientMounted] = useState<boolean>(false);
    const pathname = usePathname();

    // restore sidebar state before paint
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedState = localStorage.getItem('sidebar-collapsed');
                if (savedState === 'true') {
                    setSidebarCollapsed(true);
                }
                Logger.debug('LAYOUT', 'Sidebar state restored immediately', { collapsed: savedState === 'true' });
            } catch (error) {
                Logger.error('LAYOUT', 'Failed to restore sidebar state', error);
            }
        }
        setIsClientMounted(true);
    }, []);

    const handleNavigate = (href: string): void => {
        window.location.href = href;
    };

    const handleToggleSidebar = (): void => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('sidebar-collapsed', newState.toString());
                Logger.debug('LAYOUT', 'Sidebar state saved', { collapsed: newState });
            } catch (error) {
                Logger.error('LAYOUT', 'Failed to save sidebar state', error);
            }
        }
    };

    return (
        <ThemeProvider defaultTheme="system">
            <AuthProvider initialAuth={initialAuth}>
                <MonitoringProvider>
                    <div className="h-screen flex">
                        <aside className="flex-shrink-0">
                            <AppSidebar
                                activeRoute={pathname}
                                onNavigate={handleNavigate}
                                collapsed={sidebarCollapsed}
                                onToggleCollapse={handleToggleSidebar}
                            />
                        </aside>

                        <main className="flex-1 flex flex-col overflow-hidden">
                            <header className="flex-shrink-0">
                                <AppHeader />
                            </header>

                            <div className="flex-1 overflow-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                </MonitoringProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
