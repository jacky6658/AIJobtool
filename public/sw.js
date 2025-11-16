// Service Worker for Image Caching
// 版本號，更新時會觸發 Service Worker 更新
const CACHE_VERSION = 'v1';
const IMAGE_CACHE_NAME = `aijob-images-${CACHE_VERSION}`;

// 安裝 Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_VERSION);
  // 立即激活，不需要等待其他 Service Worker 關閉
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 刪除舊版本的緩存
          if (cacheName.startsWith('aijob-images-') && cacheName !== IMAGE_CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 立即控制所有頁面
  return self.clients.claim();
});

// 攔截網路請求
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 忽略 Google Play 的日誌請求（避免 401 錯誤）
  if (url.hostname.includes('play.google.com') && url.pathname.includes('/log')) {
    return; // 不處理 Google Play 日誌請求
  }
  
  // 忽略 Google favicon 服務請求（避免 CORS 錯誤）
  if ((url.hostname.includes('google.com') && url.pathname.includes('/s2/favicons')) ||
      url.hostname.includes('gstatic.com')) {
    return; // 不處理 Google favicon 服務請求
  }
  
  // 只處理圖片請求
  const isImageRequest = 
    event.request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
  
  if (!isImageRequest) {
    return; // 不處理非圖片請求
  }

  event.respondWith(
    caches.open(IMAGE_CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // 如果有緩存，直接返回
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // 如果沒有緩存，從網路獲取
        return fetch(event.request)
          .then((response) => {
            // 只緩存成功的響應
            if (response && response.status === 200) {
              // 克隆響應，因為響應只能使用一次
              const responseToCache = response.clone();
              cache.put(event.request, responseToCache).then(() => {
                console.log('[Service Worker] Cached new image:', event.request.url);
              });
            }
            return response;
          })
          .catch((error) => {
            console.log('[Service Worker] Fetch failed, trying cache:', event.request.url);
            // 如果網路請求失敗，再次嘗試從緩存獲取
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // 如果緩存也沒有，返回錯誤
              throw error;
            });
          });
      });
    })
  );
});

