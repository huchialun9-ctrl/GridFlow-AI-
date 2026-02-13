'use client';

import React from 'react';

const Logo = ({ label, color, children }: { label: string, color: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-3 group cursor-default">
        <div className={`w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 relative shadow-sm hover:shadow-xl ${color}`}>
            {children}
        </div>
        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{label}</span>
    </div>
);

export default function LogosSection() {
    return (
        <div className="py-12 border-b border-slate-100 dark:border-slate-900">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-100">
                <Logo label="Excel" color="group-hover:text-emerald-600 group-hover:border-emerald-200 dark:group-hover:border-emerald-900/50">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M2.5 2H9.5L11.5 6L13.5 2H20.5C21.0523 2 21.5 2.44772 21.5 3V21C21.5 21.5523 21.0523 22 20.5 22H2.5C1.94772 22 1.5 21.5523 1.5 21V3C1.5 2.44772 1.94772 2 2.5 2ZM3.5 15V13H8V15H3.5ZM3.5 17V19H8V17H3.5ZM3.5 11V9H8V11H3.5ZM19.5 7V4H4.5V7H19.5ZM10 13H14.5V15H10V13ZM10 17H14.5V19H10V17ZM16.5 13H19.5V15H16.5V13ZM16.5 17H19.5V19H16.5V17Z" /></svg>
                </Logo>
                
                <Logo label="Google Sheets" color="group-hover:text-green-500 group-hover:border-green-200 dark:group-hover:border-green-900/50">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM13 9V3.5L18.5 9H13Z" /></svg>
                </Logo>

                <Logo label="Notion" color="group-hover:text-black dark:group-hover:text-white group-hover:border-slate-300 dark:group-hover:border-slate-600">
                     <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M4.19 19.56L14.7 9.07 15.61 6.84 15 4.3 12.87 3.93 5.48 11.38zM19.81 4.41L18.7 1.69 16.58 2.38 17.5 5.5zM20.25 20.33L16.29 21.75 3.75 22 3.82 20.5 5.22 17.07 5.09 13.9 6.86 11.87 18.06 1.13 20.89 4.29z" /></svg>
                </Logo>

                <Logo label="Airtable" color="group-hover:text-yellow-500 group-hover:border-yellow-200 dark:group-hover:border-yellow-900/50">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.0002 0.899994L0.600195 6.29999L2.73173 9.47154L12.0002 5.07154L21.2687 9.47154L23.4002 6.29999L12.0002 0.899994ZM0.600195 12.3L6.3002 10.5L12.0002 13.2L17.7002 10.5L23.4002 12.3L12.0002 17.7L0.600195 12.3ZM0.600195 18.3L12.0002 23.7L23.4002 18.3L12.0002 22.2L0.600195 18.3Z" /></svg>
                </Logo>

                <Logo label="GitHub" color="group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-300 dark:group-hover:border-slate-600">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </Logo>
            </div>
            
            <div className="text-center mt-8">
                <p className="text-sm text-slate-400 font-mono">
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Verified Native Schema Support
                </p>
            </div>
        </div>
    );
}
