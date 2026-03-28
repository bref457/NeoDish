import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { sendTelegram } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const { content, name, email } = await req.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Kein Inhalt' }, { status: 400 })
  }

  const from = [name?.trim(), email?.trim()].filter(Boolean).join(' · ')
  const fullContent = from
    ? `Feedback von ${from} zu NeoDish: ${content.trim()}`
    : `Feedback zu NeoDish: ${content.trim()}`

  const res = await fetch(`${process.env.NEOFLOW_SUPABASE_URL}/rest/v1/notes`, {
    method: 'POST',
    headers: {
      'apikey': process.env.NEOFLOW_SERVICE_KEY!,
      'Authorization': `Bearer ${process.env.NEOFLOW_SERVICE_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: process.env.NEOFLOW_USER_ID,
      content: fullContent,
      category: 'feedback',
      app_name: 'NeoDish',
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })

  // Telegram-Benachrichtigung
  const telegramText = [
    `🍽️ <b>Neues NeoDish-Feedback</b>`,
    ``,
    `<b>Name:</b> ${name?.trim() || '–'}`,
    `<b>E-Mail:</b> ${email?.trim() || '–'}`,
    ``,
    `<b>Feedback:</b>`,
    content.trim(),
  ].join('\n')
  await sendTelegram(telegramText)

  // Benachrichtigung an info@neo457.ch
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'NeoDish <info@neo457.ch>',
    to: 'info@neo457.ch',
    subject: `Neues Feedback von ${name || 'Unbekannt'}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;padding:24px;">
        <h2 style="color:#c2622b;margin:0 0 16px;">Neues Feedback eingegangen</h2>
        <p style="margin:0 0 8px;color:#555;"><strong>Von:</strong> ${name || '–'}</p>
        <p style="margin:0 0 16px;color:#555;"><strong>E-Mail:</strong> ${email || '–'}</p>
        <div style="background:#fff7ed;border-left:4px solid #c2622b;padding:12px 16px;border-radius:4px;">
          <p style="margin:0;color:#333;">${content.trim()}</p>
        </div>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
