/**
 * 圖片緩存工具
 * 使用 Cache API 和 Service Worker 實現離線圖片緩存
 */

const IMAGE_CACHE_NAME = 'aijob-images-v4';

/**
 * 預載入圖片到緩存
 */
export async function preloadImage(url: string): Promise<void> {
  if (!('caches' in window)) {
    return; // 瀏覽器不支持 Cache API
  }

  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cached = await cache.match(url);
    
    if (!cached) {
      // 如果緩存中沒有，嘗試從網路獲取並緩存
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (response.ok) {
          await cache.put(url, response.clone());
          console.log('[Image Cache] Preloaded:', url);
        }
      } catch (error) {
        console.warn('[Image Cache] Failed to preload:', url, error);
      }
    }
  } catch (error) {
    console.warn('[Image Cache] Cache error:', error);
  }
}

/**
 * 從緩存獲取圖片（如果可用）
 */
export async function getCachedImage(url: string): Promise<string | null> {
  if (!('caches' in window)) {
    return null;
  }

  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cached = await cache.match(url);
    
    if (cached) {
      const blob = await cached.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.warn('[Image Cache] Failed to get cached image:', error);
  }
  
  return null;
}

/**
 * 批量預載入圖片
 */
export async function preloadImages(urls: string[]): Promise<void> {
  // 並行預載入，但限制並發數
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.all(batch.map(url => preloadImage(url)));
  }
}

/**
 * 檢查是否在線
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 監聽網路狀態變化
 */
export function onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // 返回清理函數
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

