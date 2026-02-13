'use client';

import { useState } from 'react';
import { ArrowRight, Building, Mail, MessageSquare, User, ShieldCheck, Zap } from 'lucide-react';

export default function UpgradePage() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        useCase: '',
        estimatedVolume: '10k-50k rows/month'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const subject = encodeURIComponent(`Enterprise Pro Application: ${formData.company}`);
        const body = encodeURIComponent(
`APPLICATION DETAILS
------------------
Name: ${formData.name}
Company: ${formData.company}
Estimated Volume: ${formData.estimatedVolume}

USE CASE & REQUIREMENTS
----------------------
${formData.useCase}

----------------------
Submitted via GridFlow Console
`
        );

        window.location.href = `mailto:huchialun97@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                
                {/* Left: Value Prop */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Upgrade to Pro</h1>
                        <p className="text-sm text-slate-500 font-mono mt-2">
                            Unlock the full potential of GridFlow Intelligence.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">Unlimited Extraction</h3>
                                <p className="text-sm text-slate-500 mt-1">Remove the 10,000 row monthly limit. Extract millions of data points without interruption.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                                <Building className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">API & Webhooks</h3>
                                <p className="text-sm text-slate-500 mt-1">Full access to the REST API and real-time webhook events for seamless integration.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">Priority Support & SLA</h3>
                                <p className="text-sm text-slate-500 mt-1">Dedicated support channel and 99.9% uptime SLA guarantee for mission-critical workflows.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Review Process</p>
                        <p className="text-sm text-slate-900 dark:text-slate-50 leading-relaxed">
                            We manually review every Enterprise application to ensure we can meet your specific data requirements. Most applications are approved within 24 hours.
                        </p>
                    </div>
                </div>

                {/* Right: Application Form */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">Application Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                Full Name
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wide flex items-center gap-2">
                                <Building className="w-4 h-4 text-slate-400" />
                                Company Name
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Acme Corp"
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wide flex items-center gap-2">
                                <Zap className="w-4 h-4 text-slate-400" />
                                Estimated Volume
                            </label>
                            <select 
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600 dark:text-slate-300"
                                value={formData.estimatedVolume}
                                onChange={e => setFormData({...formData, estimatedVolume: e.target.value})}
                            >
                                <option>10k-50k rows/month</option>
                                <option>50k-500k rows/month</option>
                                <option>500k-1M+ rows/month</option>
                                <option>Unsure / Custom</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-slate-50 uppercase tracking-wide flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-slate-400" />
                                Use Case & Requirements
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                placeholder="Please describe your extraction needs..."
                                value={formData.useCase}
                                onChange={e => setFormData({...formData, useCase: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-4 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <span>Send Application</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="text-center text-xs text-slate-400">
                            Updates usually provided within 24 hours.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
