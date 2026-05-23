import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, phone, message, source, atgard, kommun } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Obligatoriska fält saknas" }, { status: 400 });
    }

    // Send notification to admin
    await resend.emails.send({
      from: "Bygglov24 <noreply@bygglov24.se>",
      to: process.env.LEAD_EMAIL || "leads@bygglov24.se",
      subject: `Ny lead: ${name} – ${atgard || "Bygglov"} ${kommun ? `i ${kommun}` : ""}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0058a0;">Ny bygglovsförfrågan</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Namn</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">E-post</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Telefon</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
            ${atgard ? `<tr><td style="padding: 8px 0; color: #666;">Åtgärd</td><td style="padding: 8px 0;">${atgard}</td></tr>` : ""}
            ${kommun ? `<tr><td style="padding: 8px 0; color: #666;">Kommun</td><td style="padding: 8px 0;">${kommun}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #666;">Källa</td><td style="padding: 8px 0;">${source}</td></tr>
            ${message ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Meddelande</td><td style="padding: 8px 0;">${message}</td></tr>` : ""}
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Bygglov24.se – ${new Date().toLocaleString("sv-SE")}</p>
        </div>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: "Bygglov24 <noreply@bygglov24.se>",
      to: email,
      subject: "Vi har tagit emot din förfrågan – Bygglov24.se",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0058a0; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Tack, ${name}!</h1>
          </div>
          <div style="padding: 24px; background: white; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #333;">Vi har tagit emot din förfrågan och en bygglovskonsult kommer att kontakta dig inom <strong>1 arbetsdag</strong>.</p>
            ${message ? `<div style="background: #f5f8ff; padding: 16px; border-radius: 6px; margin: 16px 0;"><p style="margin: 0; color: #555; font-style: italic;">"${message}"</p></div>` : ""}
            <p style="color: #666; font-size: 14px;">Har du brådskande frågor? Besök <a href="https://bygglov24.se" style="color: #0058a0;">bygglov24.se</a> för mer information.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Internt serverfel" }, { status: 500 });
  }
}
