'use strict';

const PREFIX = 'robertgabriel.ninja';
const HASH = '2ae6b795';
const OFFLINE_CACHE = `${PREFIX}-${HASH}`;

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(OFFLINE_CACHE).then(function(cache) {
			return cache.addAll([
				'/',
				'/index.html',
				'/562c1341.js',
				'/scripts/app.js',
				'/scripts/background.js',
				'/scripts/chromereload.js',
				'/scripts/vendor/fontawesome.js',
				'/scripts/vendor/go.js',
				'/scripts/vendor/highlight.js',
				'/scripts/vendor/jquery.js',
				'/scripts/vendor/loadish.js',
				'/scripts/vendor/marked.js',
				'/scripts/vendor/vue-resouce.js',
				'/scripts/vendor/vue.js'
			]); // Computed at build time.
		})
	);
});

self.addEventListener('activate', function(event) {
	// Delete old asset caches.
	event.waitUntil(
		caches.keys().then(function(keys) {
			return Promise.all(
				keys.map(function(key) {
					if (
						key != OFFLINE_CACHE &&
						key.startsWith(`${PREFIX}-`)
					) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (event.request.mode == 'navigate') {
		//console.log('Handling fetch event for', event.request.url);
		//console.log(event.request);
		event.respondWith(
			fetch(event.request).catch(function(exception) {
				// The `catch` is only triggered if `fetch()` throws an exception,
				// which most likely happens due to the server being unreachable.
				console.error(
					'Fetch failed; returning offline page instead.',
					exception
				);
				return caches.open(OFFLINE_CACHE).then(function(cache) {
					return cache.match('/');
				});
			})
		);
	} else {
		// It’s not a request for an HTML document, but rather for a CSS or SVG
		// file or whatever…
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}

});
