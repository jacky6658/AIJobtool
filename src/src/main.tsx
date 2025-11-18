import React from "react";
import ReactDOM from "react-dom/client";
import AppLauncherDemo from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// 註冊 Service Worker 用於圖片緩存
if ('serviceWorker' in navigator) {
  // 立即註冊，不等待 load 事件
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
    .then((registration) => {
      console.log('[Service Worker] Registered successfully:', registration.scope);
      
      // 立即檢查並強制更新
      registration.update();
      
      // 監聽更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // 有新版本，立即激活
                console.log('[Service Worker] New version available, activating...');
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                // 重新載入頁面以使用新版本
                window.location.reload();
              } else {
                console.log('[Service Worker] Installed for the first time');
              }
            }
          });
        }
      });
      
      // 定期檢查更新（每 60 秒）
      setInterval(() => {
        registration.update();
      }, 60000);
    })
    .catch((error) => {
      console.warn('[Service Worker] Registration failed:', error);
    });
  
  // 監聽 Service Worker 消息，處理 skipWaiting
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[Service Worker] Controller changed, reloading...');
    window.location.reload();
  });
}

// 檢查根元素是否存在
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("找不到 #root 元素，請確認 index.html 中有 <div id='root'></div>");
}

// 添加錯誤處理
try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AppLauncherDemo />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error("React 初始化失敗:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui;">
      <h1 style="color: red;">應用程式載入失敗</h1>
      <p>請檢查瀏覽器控制台的錯誤訊息</p>
      <pre style="background: #f5f5f5; padding: 10px; margin-top: 20px; text-align: left; overflow: auto;">
        ${error instanceof Error ? error.toString() : String(error)}
      </pre>
    </div>
  `;
}
