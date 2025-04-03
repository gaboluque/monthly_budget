/// <reference lib="WebWorker" />

export {};

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('install', event => {
  console.log('Service worker installed');

  console.log("self", self);
  console.log("Env", process.env.BASE_API_URL);

  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');

  event.waitUntil(self.clients.claim());
});
