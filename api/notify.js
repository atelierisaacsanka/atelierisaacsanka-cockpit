// Vercel Function — envoie une notification push à tous les abonnés
import crypto from 'crypto';

// Encoder en base64url
function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Créer le JWT VAPID
async function createVapidJWT(audience, subject, privateKeyB64) {
  const header = b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(JSON.stringify({
    aud: audience, exp: now + 43200, sub: subject
  }));

  const unsigned = `${header}.${payload}`;

  // Importer la clé privée
  const privRaw = Buffer.from(privateKeyB64 + '==', 'base64url');
  const privateKey = crypto.createPrivateKey({
    key: Buffer.concat([
      Buffer.from('308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420', 'hex'),
      privRaw,
      Buffer.from('a144034200', 'hex'),
      // On a besoin du point public — générer depuis la privée
    ]),
    format: 'der',
    type: 'pkcs8'
  });

  const sig = crypto.sign('SHA256', Buffer.from(unsigned), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363'
  });

  return `${unsigned}.${b64url(sig)}`;
}

// Envoyer une notification à un endpoint
async function sendPush(subscription, payload, vapidPublic, vapidPrivate) {
  const sub = JSON.parse(subscription);
  const url = new URL(sub.endpoint);
  const audience = `${url.protocol}//${url.host}`;

  try {
    const jwt = await createVapidJWT(
      audience,
      'mailto:contact@isaacsanka.com',
      vapidPrivate
    );

    const r = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `vapid t=${jwt},k=${vapidPublic}`,
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400'
      },
      body: Buffer.from(JSON.stringify(payload))
    });

    return r.status;
  } catch(e) {
    return 0;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Vérifier la clé secrète interne
  const secret = req.headers['x-notify-secret'];
  if (secret !== process.env.NOTIFY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, body, icon, tag } = req.body;
    const SB_URL = process.env.SUPABASE_URL;
    const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
    const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
    const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;

    // Récupérer tous les abonnements depuis Supabase
    const r = await fetch(`${SB_URL}/rest/v1/push_subscriptions?select=subscription`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const subs = await r.json();

    const payload = { title: title || 'Isaacsanka', body: body || '', icon: icon || '/icon.png', tag: tag || 'notif' };

    // Envoyer à tous
    const results = await Promise.all(
      subs.map(s => sendPush(s.subscription, payload, VAPID_PUBLIC, VAPID_PRIVATE))
    );

    res.json({ sent: results.length, results });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
