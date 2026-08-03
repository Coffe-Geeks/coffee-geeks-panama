/**
 * SMTP2GO API integration using fetch.
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.SMTP2GO_API_KEY;
  const from = process.env.EMAIL_FROM || "Coffee Geeks <noreply@coffeegeekspanama.com>";

  if (!apiKey) {
    console.error("SMTP2GO API key not configured in environment variables.");
    return { error: "Email configuration missing." };
  }

  // SMTP2GO Send Email Endpoint
  const endpoint = "https://api.smtp2go.com/v3/email/send";
  
  const body = {
    api_key: apiKey,
    to: [to],
    sender: from,
    subject: subject,
    html_body: html,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    let result;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = { message: await response.text() };
    }

    if (!response.ok) {
      console.error("SMTP2GO API error:", result);
      return { error: result.data?.error || "Failed to send email." };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error sending email via SMTP2GO:", error);
    return { error: "Internal server error while sending email." };
  }
}
