import { createClient } from "@supabase/supabase-js"
import { Storage } from "@plasmohq/storage"

// Initialize Supabase Client
// Note: In a real extension, these should be in a secure storage or build env
const SUPABASE_URL = "https://iwowisdzxgljrartodjj.supabase.co"
const SUPABASE_KEY = "sb_publishable_FNNENJsMJbfri7Z-bxjSZw_C7u9rTMk"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: false, // We will manage session persistence manually with Plasmo Storage
    }
})

const storage = new Storage()

export class CloudSync {

    static async login(email: string, pass: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass
        })
        if (error) throw error
        if (data.session) {
            await storage.set("supabase_session", data.session)
        }
        return data.user
    }

    static async logout() {
        await supabase.auth.signOut()
        await storage.remove("supabase_session")
    }

    static async getSession() {
        const session = await storage.get("supabase_session")
        return session
    }

    static async getOrganizations() {
        const session: any = await this.getSession()
        if (!session) return []

        const authenticatedClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            }
        })

        const { data, error } = await authenticatedClient
            .from('organizations')
            .select('id, name')

        if (error) throw error
        return data || []
    }

    static async uploadDataset(name: string, headers: string[], rows: string[][], sourceUrl: string, organizationId?: string) {
        const session: any = await this.getSession()
        if (!session || !session.access_token) {
            throw new Error("Not authenticated. Please log in.")
        }

        // Set the auth token for this request
        const authenticatedClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            }
        })

        const { data, error } = await authenticatedClient
            .from('datasets')
            .insert([
                {
                    name: name,
                    headers: headers,
                    rows: rows,
                    source_url: sourceUrl,
                    row_count: rows.length,
                    organization_id: organizationId || null,
                    metadata: {
                        source: "chrome_extension",
                        version: "1.0.0"
                    }
                },
            ])
            .select()

        if (error) throw error
        return data
    }
}
