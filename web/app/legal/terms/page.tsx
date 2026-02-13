
export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 font-sans text-slate-900 dark:text-slate-50">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="mb-4">Last Updated: February 2026</p>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-400">
        <p>By accessing GridFlow AI, you agree to these Terms of Service. If you do not agree, do not use our services.</p>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">1. Usage Rights</h2>
        <p>GridFlow AI grants you a limited, non-exclusive license to use our platform for lawful data extraction purposes. You are responsible for ensuring your scraping activities comply with the target website's Terms of Service.</p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">2. Prohibited Content</h2>
        <p>You may not use GridFlow AI to extract PII (Personal Identifiable Information) without consent, copyright-protected content, or illegal material.</p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">3. Liability</h2>
        <p>GridFlow AI is provided "as is". We are not liable for any data loss or legal consequences resulting from your use of the extracted data.</p>
      </div>
    </div>
  );
}
