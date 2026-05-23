import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, source, atgard, kommun } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Obligatoriska fält saknas" }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("Lead API error: WEB3FORMS_ACCESS_KEY not set");
      return NextResponse.json({ error: "Internt serverfel" }, { status: 500 });
    }

    const formattedMessage = [
      `Namn:      ${name}`,
      `E-post:    ${email}`,
      `Telefon:   ${phone}`,
      atgard ? `Åtgärd:    ${atgard}` : null,
      kommun ? `Kommun:    ${kommun}` : null,
      `Källa:     ${source || "okänd"}`,
      "",
      message ? `Meddelande:\n${message}` : "Inget meddelande",
      "",
      `Tidpunkt:  ${new Date().toLocaleString("sv-SE")}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "Ny lead – bygglov24.se",
        from_name: name,
        email,
        message: formattedMessage,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Web3Forms error:", res.status, detail);
      return NextResponse.json({ error: "Internt serverfel" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Internt serverfel" }, { status: 500 });
  }
}
