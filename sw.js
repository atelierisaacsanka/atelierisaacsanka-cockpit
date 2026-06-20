// Service Worker — Atelier Isaacsanka Cockpit
// Gère la réception des notifications push en arrière-plan

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Réception d'une notification push
self.addEventListener('push', function(e) {
  var data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch(err) {
    data = { title: 'Isaacsanka', body: e.data ? e.data.text() : '' };
  }

  var options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-72.png',
    tag: data.tag || 'isaacsanka',
    renotify: true,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Ouvrir le cockpit' },
      { action: 'close', title: 'Fermer' }
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title || 'Atelier Isaacsanka', options)
  );
});

// Clic sur la notification
self.addEventListener('notificationclick', function(e) {
  e.notification.close();

  if (e.action === 'close') return;

  var url = e.notification.data && e.notification.data.url ? e.notification.data.url : '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Si le cockpit est déjà ouvert, le mettre au premier plan
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Sync en arrière-plan (optionnel)
self.addEventListener('sync', function(e) {
  if (e.tag === 'sync-cockpit') {
    // La sync Supabase se fait déjà côté app
  }
});
