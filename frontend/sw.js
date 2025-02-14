self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open('static-cache').then(cache => {
      return cache.addAll(['/', '/index.html', '/index.js', './icon.png'])
    })
  )
})

self.addEventListener('activate', event => {
  console.log('Service Worker activated.')
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// Handle push notifications (server-triggered)
self.addEventListener('push', event => {
  console.log('Push event received:', event)

  let notificationData = {
    title: 'New Notification',
    message: 'Placeholder notification.',
  }

  if (event.data) notificationData = event.data.json() // Parse the received data
  const options = {
    body: notificationData.message,
    icon: '/icon.png',
  }
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})
