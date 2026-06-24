/**
 * Wraps a supabase query: returns the data when ok, null + logs if the
 * relation doesn't exist yet (migration not applied) or when RLS denies.
 * Components should always have a graceful empty-state fallback.
 */
export async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.warn("[supabase]", e?.message || e);
    return null;
  }
}
