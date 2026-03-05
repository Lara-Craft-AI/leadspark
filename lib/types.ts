export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export type Agent = {
  id: string;
  email: string;
  name: string;
  agency_name: string;
  phone: string | null;
  timezone: string;
  insurance_types: string[];
  calendar_link: string | null;
  brand_voice: string | null;
  slug: string;
  telegram_chat_id: string | null;
  created_at: string;
};

export type Lead = {
  id: string;
  agent_id: string;
  full_name: string;
  email: string;
  phone: string;
  insurance_type: string;
  current_coverage: string;
  timeline: string;
  zip_code: string;
  qualification_score: number | null;
  qualification_reason: string | null;
  status: LeadStatus;
  ai_response: string | null;
  notes: string | null;
  created_at: string;
};
