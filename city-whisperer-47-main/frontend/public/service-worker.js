const CACHE_NAME = 'scf-cache-v1';
const APP_SHELL = [
	'/',
	'/index.html',
	'/manifest.json'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (url.pathname.startsWith('/api/')) {
		// Network-first for API
		event.respondWith(
			fetch(request).then((res) => {
				const resClone = res.clone();
				caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
				return res;
			}).catch(() => caches.match(request))
		);
		return;
	}
	// Cache-first for navigation/static
	event.respondWith(
		caches.match(request).then((cached) => cached || fetch(request))
	);
});
