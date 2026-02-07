
const CACHE_NAME = 'misturnos-cache-v1';
const urlsToCache = [
  '.',
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'constants.tsx',
  'utils/dateUtils.ts',
  'hooks/useLocalStorage.ts',
  'contexts/AppContext.tsx',
  'components/BottomNav.tsx',
  'components/CalendarView.tsx',
  'components/ShiftModal.tsx',
  'components/SettingsView.tsx',
  'components/ShiftFormModal.tsx',
  'components/ColorPicker.tsx',
  'components/IconPicker.tsx',
  'components/StatisticsView.tsx',
  'components/CalendarSwitcher.tsx',
  'components/PaintBar.tsx',
  'components/InputDialog.tsx',
  'components/NoteModal.tsx',
  'components/AlarmModal.tsx',
  'components/ExportModal.tsx',
  'components/ExportView.tsx',
  'components/SyncModal.tsx',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/',
  'https://esm.sh/lucide-react@^0.563.0',
  'https://esm.sh/recharts@^3.7.0',
  'https://cdn.glitch.global/e0a86358-18e5-4b07-87a3-e22e5050f443/icon-192x192.png',
  'https://cdn.glitch.global/e0a86358-18e5-4b07-87a3-e22e5050f443/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});