import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const CONTACT_EMAIL = 'contact@rafaelteixeira.fr';
const MAX_LENGTH = { name: 100, email: 254, subject: 150, message: 5000 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { name, email, subject, message, company } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: bots fill hidden fields, humans don't.
  if (typeof company === 'string' && company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return NextResponse.json({ error: 'Merci de remplir tous les champs obligatoires.' }, { status: 400 });
  }

  if (
    trimmedName.length > MAX_LENGTH.name ||
    trimmedEmail.length > MAX_LENGTH.email ||
    trimmedSubject.length > MAX_LENGTH.subject ||
    trimmedMessage.length > MAX_LENGTH.message
  ) {
    return NextResponse.json({ error: 'Un des champs dépasse la longueur autorisée.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured.');
    return NextResponse.json({ error: "Le service d'envoi n'est pas configuré." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: trimmedEmail,
      subject: `[Portfolio] ${trimmedSubject || 'Nouveau message'} — ${trimmedName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p><strong>Nom :</strong> ${escapeHtml(trimmedName)}</p>
          <p><strong>Email :</strong> ${escapeHtml(trimmedEmail)}</p>
          ${trimmedSubject ? `<p><strong>Sujet :</strong> ${escapeHtml(trimmedSubject)}</p>` : ''}
          <p><strong>Message :</strong></p>
          <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br />')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: "Échec de l'envoi du message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: "Échec de l'envoi du message." }, { status: 500 });
  }
}
