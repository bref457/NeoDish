import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Keine E-Mail angegeben' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'NeoDish <info@neo457.ch>',
    to: email,
    subject: 'Willkommen bei NeoDish!',
    html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#c2622b;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">NeoDish</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Dein persönlicher Wochenplaner für Mahlzeiten</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px;font-weight:600;">Herzlich willkommen!</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                Sch&ouml;n, dass du dabei bist! NeoDish hilft dir, deine Mahlzeiten f&uuml;r die Woche zu planen &ndash; ganz entspannt und ohne Stress.
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 16px;background:#fdf4f0;border-radius:10px;">
                    <p style="margin:0;font-size:15px;color:#1a1a1a;"><strong>Wochenplanung</strong></p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">Plane alle Mahlzeiten f&uuml;r die ganze Woche auf einen Blick &ndash; morgens, mittags, abends.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:#fdf4f0;border-radius:10px;">
                    <p style="margin:0;font-size:15px;color:#1a1a1a;"><strong>Rezeptsammlung</strong></p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">Speichere deine Lieblingsrezepte und greife jederzeit darauf zur&uuml;ck.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:#fdf4f0;border-radius:10px;">
                    <p style="margin:0;font-size:15px;color:#1a1a1a;"><strong>Einkaufsliste</strong></p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">F&uuml;ge Zutaten direkt aus Rezepten zur Einkaufsliste hinzu &ndash; kein Vergessen mehr.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="https://essen.neo457.ch" style="display:inline-block;background:#c2622b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">App &ouml;ffnen</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;border-top:1px solid #eee;padding-top:20px;">
                Du hast Feedback oder eine Frage? Schreib uns einfach an <a href="mailto:info@neo457.ch" style="color:#c2622b;">info@neo457.ch</a> &ndash; wir freuen uns &uuml;ber jede R&uuml;ckmeldung!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f8f8f8;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#aaa;font-size:12px;">NeoDish &middot; essen.neo457.ch</p>
              <p style="margin:4px 0 0;color:#aaa;font-size:12px;">Du erh&auml;ltst diese E-Mail, weil du dich bei NeoDish registriert hast.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
  }

  // Benachrichtigung an info@neo457.ch
  await resend.emails.send({
    from: 'NeoDish <info@neo457.ch>',
    to: 'info@neo457.ch',
    subject: `Neuer User: ${email}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;padding:24px;">
        <h2 style="color:#c2622b;margin:0 0 12px;">Neuer NeoDish User</h2>
        <p style="color:#555;margin:0;">
          <strong>${email}</strong> hat sich soeben registriert.
        </p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
