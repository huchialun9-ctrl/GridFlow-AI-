'use client';

import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export default function DeveloperSection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div className="container mx-auto px-6 max-w-6xl relative">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Left: Bio & Identity */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                                Lead Developer & Architect
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mt-4 tracking-tight">
                                胡家綸 <span className="text-slate-400 font-light">/ Hu Chia-lun</span>
                            </h2>
                        </div>
                        
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            A passionate Full-Stack Engineer specializing in AI-driven automation and enterprise data architecture. 
                            GridFlow AI was built to solve the gap between modern extraction needs and corporate compliance standards.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="https://github.com/huchialun9-ctrl" 
                                target="_blank" 
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
                            >
                                <Github className="w-5 h-5" />
                                GitHub Profile
                            </a>
                            <a 
                                href="/docs" 
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Project Docs
                            </a>
                        </div>

                        {/* Tech Stack Mini Bar */}
                        <div className="pt-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Expertise</p>
                            <div className="flex flex-wrap gap-2">
                                {['Typescript', 'Next.js', 'Supabase', 'Gemini AI', 'TailwindCSS'].map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-500">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Project Stats / Card Styling */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative group hover:-translate-y-2 transition-transform duration-500">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent rounded-3xl pointer-events-none"></div>
                            
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
                                <Github className="w-5 h-5 text-emerald-500" />
                                Repository Insights
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-slate-500">PROJECT_STATUS</span>
                                        <span className="text-emerald-500 font-bold">STABLE V1.0</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="w-full h-full bg-emerald-500"></div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="text-2xl font-black text-slate-900 dark:text-slate-50">100%</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Open Source</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="text-2xl font-black text-slate-900 dark:text-slate-50">AGPL</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">License</div>
                                    </div>
                                </div>

                                <a 
                                    href="https://github.com/huchialun9-ctrl/GridFlow-AI-" 
                                    target="_blank"
                                    className="block w-full text-center py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-sm"
                                >
                                    Explore the Codebase
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
