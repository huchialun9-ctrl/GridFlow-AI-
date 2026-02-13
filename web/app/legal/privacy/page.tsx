
export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 font-sans text-slate-900 dark:text-slate-50">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-4">Last Updated: February 2026</p>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-400">
        <p>At GridFlow AI, we take your privacy seriously. This policy outlines how we handle your data.</p>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">1. Data Collection</h2>
        <p>We collect your email and profile image via GitHub OAuth for authentication purposes only. We do not track your browsing history outside of our application.</p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">2. Dataset Privacy</h2>
        <p>Your extracted datasets are private by default. They are stored securely in our cloud database and are accessible only by you, unless you explicitly choose to share them.</p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">3. Third-Party Sharing</h2>
        <p>We do not sell your data to third parties. We use trusted infrastructure providers (Supabase, Vercel) to host your services.</p>
      </div>
    </div>
  );
}
