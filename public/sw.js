const CACHE_NAME = 'monastery360-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/map',
  '/calendar',
  '/offline.html',
  // Add monastery assets
  '/src/assets/monastery-360-interior.jpg',
  '/src/assets/monastery-360-exterior.jpg',
  // Add other essential assets
  '/src/assets/rumtek-monastery.jpg',
  '/src/assets/enchey-monastery.jpg',
  '/src/assets/pemayangtse-monastery.jpg'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Skip Waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background Sync');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync any pending data when connection is restored
  console.log('Performing background sync...');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New monastery event available!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Monastery360', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});