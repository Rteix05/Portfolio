// Service worker « kill switch ».
// L’ancien site hébergé sur ce domaine (PWA Vite) installait un service worker à cette adresse,
// qui continue de servir l’ancienne version en cache aux visiteurs déjà venus. Tant que /sw.js
// renvoie 404, le navigateur garde ce worker indéfiniment. Ce fichier le remplace : il vide les
// caches, se désinstalle, puis recharge les onglets ouverts sur le site actuel.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
