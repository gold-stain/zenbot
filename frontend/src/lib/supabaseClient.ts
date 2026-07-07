import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY as string;
const previewUrl = "https://example.supabase.co";
const hasSupabaseConfig =
  Boolean(supabaseUrl && supabaseKey) && supabaseUrl !== previewUrl;
const notConfiguredError = {
  message:
    "Supabase is not configured for this local preview. Add frontend/.env values to use auth and saved data.",
};

if (!hasSupabaseConfig) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing local Supabase config; running public preview mode."
  );
}

function createPreviewQuery() {
  const response = Promise.resolve({ data: null, error: notConfiguredError });
  const query: any = {
    select: () => query,
    insert: () => query,
    update: () => query,
    upsert: () => query,
    delete: () => query,
    eq: () => query,
    order: () => query,
    limit: () => query,
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    single: () => response,
    then: response.then.bind(response),
    catch: response.catch.bind(response),
    finally: response.finally.bind(response),
  };
  return query;
}

function createPreviewClient() {
  const auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => undefined } },
    }),
    signInWithPassword: async () => ({ data: null, error: notConfiguredError }),
    signUp: async () => ({ data: { session: null }, error: notConfiguredError }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: notConfiguredError }),
    updateUser: async () => ({ data: null, error: notConfiguredError }),
  };

  return {
    auth,
    from: () => createPreviewQuery(),
    storage: {
      from: () => ({
        createSignedUrl: async () => ({ data: null, error: notConfiguredError }),
        upload: async () => ({ data: null, error: notConfiguredError }),
      }),
    },
  } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = hasSupabaseConfig ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}) : createPreviewClient();

export const isSupabaseConfigured = hasSupabaseConfig;

export const SITE_URL =
  (process.env.REACT_APP_SITE_URL as string) ||
  (typeof window !== "undefined" ? window.location.origin : "");
