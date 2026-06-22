// Mock Supabase Client for frontend-only mode
export const supabase = {
    auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ data: null, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
    },
    from: (table) => ({
        select: () => ({
            eq: () => ({
                single: () => Promise.resolve({ data: null, error: null, count: 0 }),
                neq: () => ({
                    limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
                    then: (resolve) => resolve({ data: [], error: null, count: 0 })
                }),
                order: () => Promise.resolve({ data: [], error: null, count: 0 }),
                then: (resolve) => resolve({ data: [], error: null, count: 0 })
            }),
            order: () => ({
                limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
                eq: () => Promise.resolve({ data: [], error: null, count: 0 }),
                then: (resolve) => resolve({ data: [], error: null, count: 0 })
            }),
            limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
            then: (resolve) => resolve({ data: [], error: null, count: 0 })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({
            eq: () => Promise.resolve({ data: null, error: null })
        }),
        delete: () => ({
            eq: () => Promise.resolve({ data: null, error: null })
        })
    })
}
