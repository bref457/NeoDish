import { NextRequest, NextResponse } from 'next/server'

const NEOFLOW_URL = 'https://rnefrykihngtoromgppv.supabase.co/rest/v1/notes'
const NEOFLOW_KEY = process.env.NEOFLOW_SERVICE_KEY!
const NEOFLOW_USER_ID = process.env.NEOFLOW_USER_ID!

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!message) {
    return NextResponse.json({ error: 'Keine Nachricht' }, { status: 400 })
  }
  const content = `Feedback von ${name || 'Anonym'} · ${email || '–'} zu NeoDish: ${message}`
  const res = await fetch(NEOFLOW_URL, {
    method: 'POST',
    headers: {
      apikey: NEOFLOW_KEY,
      Authorization: `Bearer ${NEOFLOW_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: NEOFLOW_USER_ID,
      category: 'note',
      priority: 'mittel',
      app_name: 'NeoDish',
      content,
    }),
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Feedback konnte nicht gespeichert werden' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
