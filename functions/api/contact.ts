// Cloudflare Pages Function — handles POST /api/contact
// Reads CONTACT_RECIPIENT and (optional) RESEND_API_KEY from env vars set in the
// Cloudflare Pages dashboard. If RESEND_API_KEY is missing, the function still
// returns 200 and logs the submission (visible in `wrangler pages deployment tail`).

interface Env {
  CONTACT_RECIPIENT?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string; // e.g. "Delong Webpages <hello@delongswebpages.com>"
}

interface Submission {
  name?: string;
  email?: string;
  business?: string;
  phone?: string;
  project_type?: string;
  message?: string;
  company?: string; // honeypot
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Submission;
  try {
    data = (await request.json()) as Submission;
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  // Honeypot — silently accept without acting
  if (data.company && data.company.trim() !== "") {
    return json(200, { ok: true });
  }

  // Minimal validation
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();

  if (!name || !email || !message) {
    return json(400, { error: "Missing required fields" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Invalid email" });
  }
  if (message.length > 5000) {
    return json(400, { error: "Message too long" });
  }

  const recipient = env.CONTACT_RECIPIENT || "delong.cullen@gmail.com";

  const subject = `New lead: ${name}${data.business ? ` (${data.business})` : ""}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Business: ${data.business || "—"}`,
    `Phone: ${data.phone || "—"}`,
    `Project type: ${data.project_type || "—"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New lead from delongswebpages.com</h2>
    <p><strong>Name:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escape(email)}">${escape(email)}</a></p>
    <p><strong>Business:</strong> ${escape(data.business || "—")}</p>
    <p><strong>Phone:</strong> ${escape(data.phone || "—")}</p>
    <p><strong>Project type:</strong> ${escape(data.project_type || "—")}</p>
    <h3>Message</h3>
    <p style="white-space: pre-wrap">${escape(message)}</p>
  `;

  // If Resend is configured, send. Otherwise log + succeed (so the form still works during initial setup).
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM || "Delong Webpages <onboarding@resend.dev>",
          to: [recipient],
          reply_to: email,
          subject,
          text,
          html,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Resend error", res.status, body);
        return json(502, { error: "Email provider error" });
      }
    } catch (err) {
      console.error("Resend exception", err);
      return json(502, { error: "Email provider unreachable" });
    }
  } else {
    // Visible in `wrangler pages deployment tail` until RESEND_API_KEY is set
    console.log("[contact] No RESEND_API_KEY configured — submission:", { name, email, business: data.business, phone: data.phone, project_type: data.project_type, message });
  }

  return json(200, { ok: true });
};

export const onRequest: PagesFunction = async () =>
  new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
