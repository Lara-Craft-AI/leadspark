import { Agent, Lead } from "@/lib/types";

export async function sendLeadEmail(lead: Lead, agent: Agent, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY missing" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "LeadSpark <noreply@leadspark.app>",
      to: [lead.email],
      subject: `${agent.agency_name}: Quick follow-up on your ${lead.insurance_type} request`,
      text: message
    })
  });

  return { ok: response.ok, reason: response.ok ? undefined : `Resend status ${response.status}` };
}

export async function sendTelegramNotification(agent: Agent, lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = agent.telegram_chat_id;

  if (!token || !chatId) {
    return { ok: false, reason: "Telegram token or chat id missing" };
  }

  const text = [
    `New Lead: ${lead.full_name}`,
    `Type: ${lead.insurance_type}`,
    `Score: ${lead.qualification_score ?? "N/A"}/10`,
    `Timeline: ${lead.timeline}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });

  return { ok: response.ok, reason: response.ok ? undefined : `Telegram status ${response.status}` };
}
