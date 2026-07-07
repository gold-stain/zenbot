export type Role = "employee" | "hr" | "admin";

export type RegionCode =
  | "IN"
  | "US"
  | "UK"
  | "ZA"
  | "AT"
  | "SG"
  | "CA"
  | "IE"
  | "GLOBAL";

export interface Region {
  id: string;
  code: RegionCode;
  name: string;
  flag?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  employee_id: string | null;
  department: string | null;
  role: Role;
  region_id: string | null;
  avatar_url?: string | null;
  preferred_name?: string | null;
  pronouns?: string | null;
  job_title?: string | null;
  manager_name?: string | null;
  manager_email?: string | null;
  phone?: string | null;
  work_location?: string | null;
  timezone?: string | null;
  language?: string | null;
  start_date?: string | null;
  employment_type?: string | null;
  cost_center?: string | null;
  skills?: string[] | null;
  working_hours?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  bio?: string | null;
  created_at?: string;
}

export interface ChatThread {
  id: string;
  user_id: string;
  title: string;
  archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  author: "user" | "assistant";
  content: string;
  citations?: Citation[];
  portals?: PortalChip[];
  feedback?: "up" | "down" | null;
  created_at: string;
}

export interface Citation {
  policy_id?: string;
  title: string;
  section?: string;
  page?: number;
  url?: string;
}

export interface PortalChip {
  label: string;
  url: string;
  icon?: string;
}

export interface Ticket {
  id: string;
  code: string;
  subject: string;
  description?: string;
  status: "open" | "in_progress" | "awaiting_employee" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  region_id: string;
  created_by: string;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
}
