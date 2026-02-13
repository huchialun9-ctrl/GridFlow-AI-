
'use client'

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import UsageMetrics from '@/components/UsageMetrics';
import SystemStatus from '@/components/SystemStatus';
import Image from 'next/image';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || 'User');
            }
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        ) },
        { name: 'My Datasets', href: '/dashboard/datasets', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        ) },
        { name: 'Analytics', href: '/dashboard/insights', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        ) },
        { name: 'Integrations', href: '/dashboard/integrations', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        ) },
        { name: 'Automation', href: '/dashboard/automation', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        ) },
        { name: 'Settings', href: '/dashboard/settings', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        ) },
        { name: 'Developers', href: '/dashboard/api', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        ) },
        { name: 'Help & Docs', href: '/dashboard/help', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        ) },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 fixed h-full hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                    <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2.5">
                        <Image src="/logo.png" alt="GridFlow" width={28} height={28} className="w-7 h-7" />
                        <span><span className="text-blue-600">GridFlow</span> AI</span>
                    </Link>
                </div>

                <div className="p-4 flex-1">
                    <nav className="flex-1 px-4 space-y-2 py-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none translate-x-1'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                <span className={isActive ? 'text-white dark:text-slate-900' : 'text-slate-400'}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 shrink-0 flex items-center justify-center text-sm font-black italic shadow-inner">
                                    {userEmail?.[0] || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
                                    {userEmail?.split('@')[0] || 'User'}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                    <p className="text-[10px] font-medium text-slate-500 italic">Free Plan</p>
                                </div>
                            </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                                title="Sign out"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            </button>
                        </div>
                        <div className="flex items-center justify-between px-1 mb-2">
                            <span className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest">Access_Tier</span>
                            <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black font-mono rounded-sm tracking-tighter uppercase">General</span>
                        </div>
                        <a href="mailto:huchialun97@gmail.com?subject=Enterprise Pro Plan Application" className="block w-full text-center py-1.5 bg-slate-900 dark:bg-slate-50 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white text-white dark:text-slate-900 text-[10px] font-bold rounded transition-colors uppercase tracking-wide">
                            Upgrade to Pro
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                {/* Analytics Header */}
                <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-8 flex items-center justify-end gap-4">
                     <div className="relative group">
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-slate-900"></span>
                        </button>
                        
                        {/* Dropdown */}
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">System Update: v1.0.2 Live</p>
                                    <p className="text-[10px] text-slate-400 mt-1">New extraction engine deployed successfully.</p>
                                </div>
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">Welcome to GridFlow Pro!</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Explore our new documentation to get started.</p>
                                </div>
                            </div>
                            <div className="p-2 text-center border-t border-slate-100 dark:border-slate-800">
                                <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase">Mark_All_Read</button>
                            </div>
                        </div>
                     </div>
                     <UsageMetrics />
                </header>

                <div className="flex-1 p-8">
                    {children}
                </div>
                
                <SystemStatus />
            </main>
        </div>
    );
}
