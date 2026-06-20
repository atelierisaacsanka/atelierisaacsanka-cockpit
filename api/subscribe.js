// Vercel Function — sauvegarde l'abonnement push du navigateur
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { subscription, userId, userName } = req.body;
    if (!subscription) return res.status(400).json({ error: 'No subscription' });

    const SB_URL = process.env.SUPABASE_URL;
    const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

    // Sauvegarder l'abonnement dans Supabase
    const r = await fetch(`${SB_URL}/rest/v1/push_subscriptions`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        subscription: JSON.stringify(subscription),
        user_id: userId || 'admin',
        user_name: userName || 'Admin',
        updated_at: new Date().toISOString()
      })
    });

    if (!r.ok) throw new Error('Supabase error');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
