// Vercel Function — retourne la clé VAPID publique
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY || ''
  });
}
