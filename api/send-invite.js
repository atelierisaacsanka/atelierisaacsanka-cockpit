export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, role, url, password } = req.body;
  if (!email || !name) return res.status(400).json({ error: 'email et name requis' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY non configuree - email non envoye');
    return res.status(200).json({ ok: true, sent: false, reason: 'RESEND_API_KEY manquante' });
  }

  const roleLabels = {
    admin: 'Administrateur',
    atelier: 'Atelier',
    lecture: 'Lecture seule',
    prestataire: 'Prestataire'
  };

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#F7F6F2;margin:0;padding:24px">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid rgba(0,0,0,0.08)">
    <div style="font-size:20px;font-weight:700;color:#111110;margin-bottom:4px">Atelier Isaacsanka</div>
    <div style="font-size:11px;color:#A8A7A3;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:24px">Cockpit Atelier</div>
    <p style="color:#6B6A66;font-size:14px;line-height:1.6">Bonjour ${name},</p>
    <p style="color:#6B6A66;font-size:14px;line-height:1.6">
      Tu as ete invite(e) a acceder au cockpit de gestion Atelier Isaacsanka avec le role <strong style="color:#111110">${roleLabels[role] || role}</strong>.
    </p>
    <div style="background:#F7F6F2;border-radius:8px;padding:16px;margin:20px 0">
      <div style="font-size:11px;color:#A8A7A3;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px">Tes identifiants</div>
      <div style="font-size:13px;color:#111110;margin-bottom:6px"><strong>URL :</strong> ${url}</div>
      <div style="font-size:13px;color:#111110;margin-bottom:6px"><strong>Email :</strong> ${email}</div>
      <div style="font-size:13px;color:#111110"><strong>Mot de passe :</strong> ${password}</div>
    </div>
    <p style="color:#8C2222;font-size:12px;font-weight:500">Change ton mot de passe lors de ta premiere connexion.</p>
    <a href="${url}" style="display:block;background:#111110;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:14px;margin-top:20px">
      Acceder au cockpit
    </a>
    <p style="color:#A8A7A3;font-size:11px;margin-top:24px;text-align:center">
      Cockpit prive — Atelier Isaacsanka<br>
      Ne partage pas ces identifiants
    </p>
  </div>
</body>
</html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Atelier Isaacsanka <cockpit@atelierisaacsanka.com>',
        to: [email],
        subject: 'Invitation — Cockpit Atelier Isaacsanka',
        html: htmlBody
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data });
    return res.status(200).json({ ok: true, sent: true, id: data.id });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
