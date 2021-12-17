/* eslint-disable no-undef */
const NNS_COMMIT_SHA = "local";
if (self.location.origin === "http://localhost:3000") {
  console.log("Not setting up service worker on localhost - PEACE");
} else {
  if (workbox) {
    console.log(`Workbox is loaded 🎉`);
  } else {
    console.log(`Workbox didn't load `);
  }
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
  self.addEventListener("install", (event) =>
    event.waitUntil(self.skipWaiting())
  );
  self.addEventListener("activate", (event) =>
    event.waitUntil(self.clients.claim())
  );

  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst({
      // Put all cached files in a cache named 'pages'
      cacheName: "pages",
      plugins: [
        // Ensure that only requests that result in a 200 status are cached
        new workbox.cacheableResponse.Plugin({
          statuses: [200],
        }),
      ],
    })
  );

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://fonts.googleapis.com",
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
    })
  );

  workbox.routing.registerRoute(
    // Check to see if the request's destination is style for an image
    ({ request }) => request.destination === "image",
    // Use a Cache First caching strategy
    new workbox.strategies.CacheFirst({
      // Put all cached files in a cache named 'images'
      cacheName: "images",
      plugins: [
        // Ensure that only requests that result in a 200 status are cached
        new workbox.cacheableResponse.Plugin({
          statuses: [200],
        }),
        // Don't cache more than 50 items, and expire them after 30 days
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
        }),
      ],
    })
  );
}

self.addEventListener("onnotificationclick", function (e) {
  console.log("onclick", e);
});
