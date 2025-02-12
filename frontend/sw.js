self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open("static-cache").then((cache) => {
      return cache.addAll(["/", "/index.html", "/index.js", "./icon.png"]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Handle push notifications (server-triggered)
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  const options = {
    body: "This is a push notification!",
    icon: "/icon.png",
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
