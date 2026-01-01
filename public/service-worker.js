importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
    console.log(`Workbox is loaded`);

    // Cache page navigations (html) with a Network First strategy
    workbox.routing.registerRoute(
        ({ request }) => request.mode === 'navigate',
        new workbox.strategies.NetworkFirst({
            cacheName: 'pages',
        })
    );

    // Cache CSS, JS, and Worker files with a Stale While Revalidate strategy
    workbox.routing.registerRoute(
        ({ request }) =>
            request.destination === 'style' ||
            request.destination === 'script' ||
            request.destination === 'worker',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'assets',
        })
    );

    // Cache Images
    workbox.routing.registerRoute(
        ({ request }) => request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
            ],
        })
    );

    // Offline fallback for specific routes (optional, but good for "My Keys")
    // For now, standard caching covers visited pages.

} else {
    console.log(`Workbox didn't load`);
}
