import { supabase } from "@/lib/supabaseClient";

/* -------------------------------------------------------------------------- */
/*  Regions                                                                   */
/* -------------------------------------------------------------------------- */
export async function listRegions() {
  const { data, error } = await supabase
    .from("regions")
    .select("id, code, name, flag")
    .order("name");
  if (error) throw error;
  return data || [];
}

/* -------------------------------------------------------------------------- */
/*  Chat threads & messages                                                   */
/* -------------------------------------------------------------------------- */
export async function listChatThreads(userId: string) {
  const { data, error } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", false)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createChatThread(userId: string, title = "New chat") {
  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ user_id: userId, title })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function renameChatThread(id: string, title: string) {
  const { error } = await supabase
    .from("chat_threads")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function archiveChatThread(id: string) {
  const { error } = await supabase.from("chat_threads").update({ archived: true }).eq("id", id);
  if (error) throw error;
}

export async function deleteChatThread(id: string) {
  const { error } = await supabase.from("chat_threads").delete().eq("id", id);
  if (error) throw error;
}

export async function listMessages(threadId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function appendMessage(
  threadId: string,
  msg: {
    author: "user" | "assistant";
    content: string;
    citations?: any[];
    portals?: any[];
    feedback?: "up" | "down" | null;
    confidence?: number;
  }
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ thread_id: threadId, ...msg })
    .select()
    .single();
  if (error) throw error;
  // bump thread updated_at
  await supabase
    .from("chat_threads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", threadId);
  return data;
}

export async function setMessageFeedback(id: string, feedback: "up" | "down" | null) {
  const { error } = await supabase.from("chat_messages").update({ feedback }).eq("id", id);
  if (error) throw error;
}

/* -------------------------------------------------------------------------- */
/*  Policies                                                                  */
/* -------------------------------------------------------------------------- */
export async function listPolicies() {
  const { data, error } = await supabase
    .from("policies")
    .select(
      "id, title, description, category, tags, current_version, is_active, updated_at, policy_regions ( region_id, regions ( id, code, name, flag ) )"
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deletePolicy(id: string) {
  const { error } = await supabase
    .from("policies")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw error;
}

export async function getPolicyDownloadUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from("policy_pdfs")
    .createSignedUrl(filePath, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function uploadPolicyFile(file: File, path: string) {
  const { error } = await supabase.storage
    .from("policy_pdfs")
    .upload(path, file, { upsert: true });
  if (error) throw error;
}

export async function createPolicy(params: {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  regionIds: string[];
  filePath?: string;
}) {
  const { data: policy, error } = await supabase
    .from("policies")
    .insert({
      title: params.title,
      description: params.description,
      category: params.category,
      tags: params.tags,
    })
    .select()
    .single();
  if (error) throw error;

  if (params.regionIds.length) {
    const rows = params.regionIds.map((r) => ({ policy_id: policy.id, region_id: r }));
    const { error: prErr } = await supabase.from("policy_regions").insert(rows);
    if (prErr) throw prErr;
  }
  if (params.filePath) {
    await supabase
      .from("policy_versions")
      .insert({ policy_id: policy.id, version: 1, file_path: params.filePath });
  }
  return policy;
}

/* -------------------------------------------------------------------------- */
/*  Tickets                                                                   */
/* -------------------------------------------------------------------------- */
export async function listMyTickets(userId: string) {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("created_by", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listRegionTickets(regionId: string | null) {
  const q = supabase.from("tickets").select("*").order("updated_at", { ascending: false });
  const { data, error } = regionId ? await q.eq("region_id", regionId) : await q;
  if (error) throw error;
  return data || [];
}

export async function getTicket(id: string) {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createTicket(params: {
  subject: string;
  description?: string;
  region_id: string | null;
  user_id: string;
  priority?: "low" | "medium" | "high";
  thread_id?: string | null;
}) {
  const { data, error } = await supabase
    .from("tickets")
    .insert({
      subject: params.subject,
      description: params.description,
      region_id: params.region_id,
      created_by: params.user_id,
      priority: params.priority || "medium",
      thread_id: params.thread_id,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTicketStatus(id: string, status: string) {
  const { error } = await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function listTicketMessages(ticketId: string) {
  const { data, error } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function postTicketMessage(ticketId: string, authorId: string, body: string) {
  const { error } = await supabase
    .from("ticket_messages")
    .insert({ ticket_id: ticketId, author_id: authorId, body });
  if (error) throw error;
}

/* -------------------------------------------------------------------------- */
/*  Notifications                                                             */
/* -------------------------------------------------------------------------- */
export async function listNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) throw error;
}

/* -------------------------------------------------------------------------- */
/*  Knowledge gaps                                                            */
/* -------------------------------------------------------------------------- */
export async function listKnowledgeGaps() {
  const { data, error } = await supabase
    .from("knowledge_gaps")
    .select("*")
    .eq("resolved", false)
    .order("occurrences", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function resolveKnowledgeGap(id: string, userId: string) {
  const { error } = await supabase
    .from("knowledge_gaps")
    .update({ resolved: true, resolved_by: userId, resolved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/* -------------------------------------------------------------------------- */
/*  Portal links                                                              */
/* -------------------------------------------------------------------------- */
export async function listPortalLinks(regionId: string | null) {
  let q = supabase.from("portal_links").select("*, regions ( id, code, name, flag )").order("label");
  if (regionId) q = q.eq("region_id", regionId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/* -------------------------------------------------------------------------- */
/*  Users (admin)                                                             */
/* -------------------------------------------------------------------------- */
export async function listUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, regions ( id, code, name, flag )")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateUserRole(profileId: string, role: "employee" | "hr" | "admin") {
  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", profileId);
  if (error) throw error;
}

export async function setUserActive(profileId: string, active: boolean) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: active, updated_at: new Date().toISOString() })
    .eq("id", profileId);
  if (error) throw error;
}

export async function updateMyProfile(userId: string, patch: Partial<{ full_name: string; department: string; employee_id: string; avatar_url: string }>) {
  const { error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
}

/* -------------------------------------------------------------------------- */
/*  Audit logs (admin)                                                        */
/* -------------------------------------------------------------------------- */
export async function listAuditLogs() {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function logAction(actorId: string, action: string, entity_type?: string, entity_id?: string, details?: any) {
  await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type,
    entity_id,
    details: details || null,
  });
}

/* -------------------------------------------------------------------------- */
/*  Settings (system)                                                         */
/* -------------------------------------------------------------------------- */
export async function getSetting(key: string) {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
}

export async function setSetting(key: string, value: any, userId: string) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_by: userId, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}
