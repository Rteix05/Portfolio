/**
 * Mails du formulaire de contact, aux couleurs de l'identité (charte Figma « Déclinaisons »).
 * HTML compatible messageries : tableaux, styles inline, images PNG hébergées sur le site
 * (Gmail bloque le SVG). Chaque mail a aussi une version texte.
 */

const SITE = 'https://rafaelteixeira.fr';
const IMG = `${SITE}/signature`;
const LINKEDIN = 'https://www.linkedin.com/in/rafael-teixeira-57b5b1269/';
const GITHUB = 'https://github.com/Rteix05';

const C = { noir: '#050505', fond: '#f2f2f2', bordure: '#e2e2e2', gris: '#6b6b6b', clair: '#f7f7f7' };
const SANS = "'Space Grotesk',Arial,Helvetica,sans-serif";
const MONO = "'JetBrains Mono',Consolas,'Courier New',monospace";

export function echapperHtml(valeur: string) {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const etiquette = (texte: string, couleur = C.gris) =>
  `<span style="font-family:${MONO};font-size:10px;line-height:16px;letter-spacing:1.6px;text-transform:uppercase;color:${couleur};">${texte}</span>`;

const bouton = (href: string, texte: string) => `
  <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
    <td bgcolor="${C.noir}" style="background:${C.noir};">
      <a href="${href}" style="display:inline-block;padding:12px 20px;font-family:${MONO};font-size:12px;line-height:16px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;color:#ffffff;text-decoration:none;">${texte}&nbsp;&nbsp;→</a>
    </td>
  </tr></table>`;

/** Gabarit commun : bandeau noir avec le logo, carte blanche, pied de page. */
function gabarit({ apercu, badge, contenu, pied }: { apercu: string; badge: string; contenu: string; pied: string }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>Rafael Teixeira</title>
</head>
<body style="margin:0;padding:0;background:${C.fond};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.fond};">${apercu}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="${C.fond}" style="background:${C.fond};border-collapse:collapse;">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;max-width:560px;border-collapse:collapse;font-family:${SANS};color:${C.noir};">
      <tr>
        <td bgcolor="${C.noir}" style="background:${C.noir};padding:12px 24px 12px 8px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
            <td valign="middle"><a href="${SITE}" style="text-decoration:none;"><img src="${IMG}/logo-rt.png" width="100" height="40" alt="&lt;RT&gt; Rafael Teixeira" style="display:block;width:100px;height:40px;border:0;"></a></td>
            <td valign="middle" align="right">${etiquette(badge, '#a8a8a8')}</td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="background:#ffffff;border:1px solid ${C.bordure};border-top:0;padding:32px 32px 36px;">${contenu}</td>
      </tr>
      <tr>
        <td style="padding:20px 8px 0;font-size:12px;line-height:18px;color:${C.gris};">${pied}</td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'long', timeStyle: 'short' }).format(date);

type MessageContact = { nom: string; email: string; sujet: string; message: string; date?: Date };

/** Mail que je reçois quand quelqu'un écrit depuis la page contact. */
export function mailNotification({ nom, email, sujet, message, date = new Date() }: MessageContact) {
  const n = echapperHtml(nom);
  const e = echapperHtml(email);
  const s = echapperHtml(sujet || 'Sans sujet');
  const m = echapperHtml(message).replace(/\r?\n/g, '<br>');
  const prenom = echapperHtml(nom.split(/\s+/)[0] || nom);
  const quand = formatDate(date);
  const repondre = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${sujet || 'votre message'}`)}`;
  const ligne = (label: string, valeur: string) => `
    <tr>
      <td valign="top" style="padding:0 16px 8px 0;width:64px;">${etiquette(label)}</td>
      <td valign="top" style="padding:0 0 8px;font-size:14px;line-height:18px;color:${C.noir};">${valeur}</td>
    </tr>`;

  const contenu = `
    ${etiquette('Portfolio · formulaire de contact')}
    <h1 style="margin:10px 0 16px;font-family:${SANS};font-size:26px;line-height:30px;font-weight:600;letter-spacing:-0.6px;color:${C.noir};">Nouveau message de ${n}</h1>
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin:0 0 24px;"><tr>
      <td style="border:1px solid ${C.noir};padding:6px 10px;">${etiquette(s, C.noir)}</td>
    </tr></table>
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin:0 0 24px;">
      ${ligne('Nom', n)}
      ${ligne('Email', `<a href="mailto:${e}" style="color:${C.noir};">${e}</a>`)}
      ${ligne('Reçu', quand)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin:0 0 28px;"><tr>
      <td bgcolor="${C.clair}" style="background:${C.clair};border-left:3px solid ${C.noir};padding:18px 20px;font-size:15px;line-height:24px;color:${C.noir};">${m}</td>
    </tr></table>
    ${bouton(repondre, `Répondre à ${prenom}`)}`;

  return {
    sujet: `[Portfolio] ${sujet || 'Nouveau message'} — ${nom}`,
    html: gabarit({
      apercu: `${nom} vous a écrit depuis le portfolio.`,
      badge: 'Nouveau message',
      contenu,
      pied: `Envoyé depuis <a href="${SITE}/contact" style="color:${C.gris};">rafaelteixeira.fr/contact</a>. Répondre à ce mail répond directement à ${e}.`,
    }),
    texte: [
      'Nouveau message depuis le portfolio',
      '',
      `Nom : ${nom}`,
      `Email : ${email}`,
      `Sujet : ${sujet || 'Sans sujet'}`,
      `Reçu : ${quand}`,
      '',
      message,
    ].join('\n'),
  };
}

/**
 * Accusé de réception envoyé à la personne qui écrit.
 * Il ne reprend aucun texte saisi (seulement le sujet s'il vient de la liste du formulaire) :
 * sinon le formulaire pourrait servir à envoyer du spam à n'importe quelle adresse.
 */
export function mailConfirmation({ sujetConnu }: { sujetConnu?: string }) {
  const s = sujetConnu ? echapperHtml(sujetConnu) : '';
  const reseau = (href: string, img: string, alt: string) =>
    `<td style="padding:0 12px 0 0;"><a href="${href}" title="${alt}" style="text-decoration:none;"><img src="${IMG}/${img}" width="20" height="20" alt="${alt}" style="display:block;width:20px;height:20px;border:0;"></a></td>`;

  const contenu = `
    ${etiquette('Message bien reçu')}
    <h1 style="margin:10px 0 16px;font-family:${SANS};font-size:26px;line-height:30px;font-weight:600;letter-spacing:-0.6px;color:${C.noir};">Merci pour votre message.</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:24px;color:${C.noir};">Bonjour,</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:24px;color:${C.noir};">Votre message ${s ? `(<strong>${s}</strong>) ` : ''}m’est bien parvenu. Je le lis avec attention et je vous réponds sous 48&nbsp;heures, jours ouvrés.</p>
    <p style="margin:0 0 28px;font-size:15px;line-height:24px;color:${C.noir};">En attendant, mes projets, mon parcours et mes compétences sont sur mon portfolio.</p>
    ${bouton(SITE, 'Voir mon portfolio')}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin:32px 0 0;border-top:1px solid ${C.bordure};"><tr>
      <td style="padding:20px 0 0;">
        <div style="font-size:16px;line-height:20px;font-weight:600;color:${C.noir};">Rafael Teixeira</div>
        <div style="font-size:13px;line-height:20px;color:${C.gris};padding:2px 0 12px;">Développeur Full-stack &amp; IA · <a href="${SITE}" style="color:${C.gris};text-decoration:none;">rafaelteixeira.fr</a></div>
        <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>
          ${reseau(GITHUB, 'github.png', 'GitHub')}${reseau(LINKEDIN, 'linkedin.png', 'LinkedIn')}
        </tr></table>
      </td>
    </tr></table>`;

  return {
    sujet: 'Message bien reçu — Rafael Teixeira',
    html: gabarit({
      apercu: 'Votre message est bien arrivé, je vous réponds sous 48 heures.',
      badge: 'Accusé de réception',
      contenu,
      pied: `Vous recevez ce mail car un message a été envoyé depuis le formulaire de contact de <a href="${SITE}" style="color:${C.gris};">rafaelteixeira.fr</a>. Si ce n’est pas vous, ignorez-le simplement.`,
    }),
    texte: [
      'Merci pour votre message.',
      '',
      'Bonjour,',
      '',
      `Votre message${sujetConnu ? ` (${sujetConnu})` : ''} m’est bien parvenu. Je vous réponds sous 48 heures, jours ouvrés.`,
      `En attendant, mes projets sont sur mon portfolio : ${SITE}`,
      '',
      'Rafael Teixeira',
      'Développeur Full-stack & IA',
      `GitHub : ${GITHUB}`,
      `LinkedIn : ${LINKEDIN}`,
    ].join('\n'),
  };
}
