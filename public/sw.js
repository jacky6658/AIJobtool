// Service Worker for Image Caching
// 版本號，更新時會觸發 Service Worker 更新
const CACHE_VERSION = 'v4';
const IMAGE_CACHE_NAME = `aijob-images-${CACHE_VERSION}`;

// 安裝 Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_VERSION);
  // 立即激活，不需要等待其他 Service Worker 關閉
  self.skipWaiting();
});

// 監聽 skipWaiting 消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
  
  // 忽略所有 API 請求，讓它們直接通過（不進行快取）
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/api/')) {
    return; // 不處理 API 請求，讓瀏覽器直接處理
  }
  
  // 忽略 catalog.json 請求，讓瀏覽器直接處理（避免快取問題）
  if (url.pathname.includes('catalog.json')) {
    return; // 不處理 catalog.json，讓瀏覽器直接處理
  }
  
  // 忽略 Google Play 的日誌請求（避免 401 錯誤）
  if (url.hostname.includes('play.google.com') && url.pathname.includes('/log')) {
    return; // 不處理 Google Play 日誌請求
  }
  
  // 忽略 Google favicon 服務請求（避免 CORS 錯誤）
  if ((url.hostname.includes('google.com') && url.pathname.includes('/s2/favicons')) ||
      url.hostname.includes('gstatic.com')) {
    return; // 不處理 Google favicon 服務請求
  }
  
  // 忽略 Wix 靜態資源請求（避免 CORS 錯誤）
  if (url.hostname.includes('wixstatic.com')) {
    return; // 不處理 Wix 靜態資源請求
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
      // 嘗試多種方式匹配快取（處理 URL 格式差異）
      const matchOptions = [
        event.request, // 原始請求
        new Request(event.request.url), // 使用 URL 創建新請求
        new Request(event.request.url, { mode: 'no-cors' }), // no-cors 模式
        new Request(event.request.url, { mode: 'cors' }) // cors 模式
      ];
      
      // 嘗試匹配快取
      return Promise.all(matchOptions.map(req => cache.match(req)))
        .then((responses) => {
          // 找到第一個有效的快取響應
          const cachedResponse = responses.find(r => r !== undefined);
          
          if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return cachedResponse;
          }

          // 如果沒有緩存，從網路獲取
          // 判斷是否為外部 URL
          const isExternal = url.origin !== self.location.origin;
          
          // 對於同源請求，使用 cors 模式；對於外部請求，嘗試 no-cors
          const fetchOptions = {
            cache: 'no-cache',
            mode: isExternal ? 'no-cors' : 'cors',
            credentials: 'omit'
          };
          
          return fetch(event.request, fetchOptions)
            .then((response) => {
              // 緩存成功的響應
              // no-cors 模式下返回 opaque 響應（status 為 0，但可以緩存）
              // cors 模式下返回 basic 或 cors 響應（status 為 200）
              const canCache = response && (
                response.type === 'opaque' || // no-cors 模式的響應
                (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) // cors 模式的響應
              );
              
              if (canCache) {
                // 克隆響應，因為響應只能使用一次
                const responseToCache = response.clone();
                // 使用原始請求作為 key 來快取
                cache.put(event.request, responseToCache).then(() => {
                  console.log('[Service Worker] Cached new image:', event.request.url, `(${response.type})`);
                }).catch((err) => {
                  console.warn('[Service Worker] Failed to cache image:', event.request.url, err);
                });
              }
              return response;
            })
            .catch((error) => {
              // 網路請求失敗，再次嘗試從快取獲取
              console.log('[Service Worker] Fetch failed, trying cache:', event.request.url);
              return Promise.all(matchOptions.map(req => cache.match(req)))
                .then((responses) => {
                  const cachedResponse = responses.find(r => r !== undefined);
                  if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache after fetch failed:', event.request.url);
                    return cachedResponse;
                  }
                  // 如果快取也沒有，讓請求失敗，讓瀏覽器處理（觸發 onError）
                  console.debug('[Service Worker] No cache available for:', event.request.url);
                  throw error; // 重新拋出錯誤，讓瀏覽器處理
                });
            });
        });
    })
  );
});

