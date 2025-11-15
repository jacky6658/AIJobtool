# 🧠 AIJob AI工具庫

全站收錄多元且實用的 AI 工具與智能體模型，從新手到專業用戶都能快速找到最適合的解決方案，並全面提升你的工作效率。

這是一個免費提供給大家使用的 AI 工具集合平台，精心收錄了市面上各種實用的 AI 工具與智能體，涵蓋 AI 員工、AI 對話、AI 寫程式工具、部署平台、AI 自動化工作流等多個分類。

---

## ✨ 專案特色

### 🔹 一站式 AI 工具集合平台
- **多元分類**：AI 員工、AI 對話、AI 寫程式工具、部署平台、AI 自動化工作流
- **智能搜尋**：快速找到目標工具
- **收藏功能**：跨分類收藏常用工具
- **標籤篩選**：快速篩選相關工具

### 🔹 響應式設計（RWD）
- **手機版**：iPhone App 圖示風格，4 列網格布局
- **桌面版**：統一卡片高度，響應式字體與布局
- **自適應**：根據視窗大小動態調整

### 🔹 智能圖示系統
- **自動 Fallback**：圖片載入失敗時自動顯示相關 icon
- **智能匹配**：根據應用名稱和分類自動選擇合適的 icon
- **多種格式支援**：emoji、圖片路徑、URL、base64

### 🔹 管理功能
- **Admin 面板**：可新增、編輯、刪除工具和分類
- **自動上傳**：支援 API 自動上傳 catalog
- **匯出功能**：可匯出 catalog.json 進行版本控制

### 🔹 動態效果
- **首頁動畫**：漸進式載入動畫
- **背景裝飾**：流動的彩色 blob 動畫
- **懸停效果**：卡片懸停時的視覺反饋

---

## 🛠️ 技術架構

### 前端
- **React 18** + **TypeScript** - UI 框架
- **Vite 5** - 構建工具
- **Tailwind CSS** - 樣式框架（CDN）
- **React Hooks** - 狀態管理

### 後端
- **Node.js 18+** - 運行環境
- **Express.js 4** - Web 框架
- **server-security.js** - 安全防護模組

### 部署
- **Zeabur** - 雲端部署平台
- **Docker** - 容器化支援
- **NIXPACKS** - 自動構建

---

## 📦 專案結構

```
AIJobtool-main 2/
├── src/
│   ├── App.tsx              # 主應用元件
│   ├── main.tsx             # React 入口
│   ├── index.css            # 樣式表
│   ├── components/         # React 組件
│   │   ├── AdminPanel.tsx   # 管理面板
│   │   ├── HomePage.tsx     # 首頁組件
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingAnimation.tsx
│   │   └── SEOHead.tsx
│   └── utils/               # 工具函數
│       ├── security.ts      # 安全驗證
│       ├── advancedSecurity.ts
│       └── cleanMarkers.ts
├── public/
│   ├── catalog.json         # 工具目錄（可動態更新）
│   └── images/              # 圖片資源
├── server.js                 # Express 伺服器
├── server-security.js        # 安全防護模組
├── index.html                # HTML 入口
├── package.json              # 專案配置
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── Dockerfile                # Docker 配置
├── zeabur.json               # Zeabur 部署配置
└── .npmrc                    # npm 配置
```

---

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 `http://localhost:5173`

### 生產模式

```bash
# 構建
npm run build

# 啟動伺服器
npm start
```

訪問 `http://localhost:8080`

---

## ⚙️ 環境變數設定

### 必需環境變數

在 Zeabur 或 `.env` 文件中設定：

```env
# 管理員密碼（用於 Admin 功能）
ADMIN_SECRET=your_admin_secret_here
```

### 可選環境變數

```env
# 前端管理員雜湊（SHA-256 雜湊值）
VITE_ADMIN_HASH=your_sha256_hash_of_admin_password

# Catalog API 端點（用於自動上傳）
VITE_CATALOG_API_ENDPOINT=/api/catalog

# 是否顯示管理員登入按鈕
VITE_SHOW_ADMIN_LOGIN=true

# 允許的來源（CORS）
ALLOWED_ORIGINS=

# IP 白名單
IP_WHITELIST=
```

### 計算管理員雜湊

```bash
# 使用 Node.js
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your_password').digest('hex'))"
```

---

## 🔐 管理功能

### 登入管理員

1. **URL Hash 方式**：
   ```
   https://your-domain.com#admin=your_password
   ```

2. **登入按鈕**：
   - 點擊側邊欄的「管理員登入」按鈕
   - 輸入管理員密碼

### 管理功能

- ✅ **新增應用程式**：快速新增工具到 catalog
- ✅ **新增分類**：創建新的工具分類
- ✅ **編輯/刪除**：管理現有工具
- ✅ **匯出 catalog.json**：匯出當前配置
- ✅ **自動上傳**：如果設定了 API，會自動上傳到伺服器

### 登出

```
https://your-domain.com#logout=1
```

---

## ☁️ 部署到 Zeabur

### 方法 1：使用 Dockerfile

1. 連結 GitHub 儲存庫到 Zeabur
2. Zeabur 會自動偵測 Dockerfile
3. 設定環境變數：
   - `ADMIN_SECRET`
   - `VITE_ADMIN_HASH`（可選）
   - `VITE_CATALOG_API_ENDPOINT`（可選）

### 方法 2：使用 NIXPACKS

1. 連結 GitHub 儲存庫
2. 使用 `zeabur.json` 配置
3. 設定環境變數

### 部署後

- 前端：自動提供靜態檔案
- API：`/api/catalog` 端點可用
- 健康檢查：`/health` 端點

---

## 📝 如何新增工具

### 方法 1：使用 Admin 面板（推薦）

1. 登入管理員模式
2. 點擊「快速新增應用程式」
3. 填寫工具資訊：
   - 名稱
   - 連結（URL）
   - 圖示（可自動抓取或上傳）
   - 分類
   - 簡介
   - 標籤
4. 儲存後會自動上傳（如果設定了 API）

### 方法 2：手動編輯 catalog.json

1. 編輯 `public/catalog.json`
2. 在 `apps` 陣列中新增：

```json
{
  "name": "工具名稱",
  "icon": "🎯",
  "description": "工具簡介",
  "href": "https://example.com",
  "category": "AI員工",
  "tags": ["標籤1", "標籤2"]
}
```

3. 重新部署

---

## 🎨 功能說明

### 搜尋功能
- 支援工具名稱、簡介、標籤搜尋
- 即時篩選結果

### 收藏功能
- 跨分類收藏常用工具
- 收藏狀態保存在 localStorage

### 標籤篩選
- 快速篩選相關工具
- 支援多標籤組合

### 響應式設計
- **手機版**：4 列網格，iPhone App 風格
- **平板**：2 列網格
- **桌面**：3-5 列網格（根據螢幕大小）
- **統一高度**：桌面版卡片高度一致

---

## 🔧 開發指令

```bash
# 開發模式
npm run dev

# 構建生產版本
npm run build

# 預覽構建結果
npm run preview

# 啟動生產伺服器
npm start

# 安全審計
npm run security:audit

# 修復安全問題
npm run security:fix
```

---

## 📋 API 端點

### GET `/api/catalog`
取得工具目錄

**回應**：
```json
{
  "categories": ["AI員工", "AI對話", ...],
  "apps": [...]
}
```

### POST `/api/catalog`
更新工具目錄（需要 Admin 權限）

**Headers**：
```
Authorization: Bearer your_admin_secret
```

**Body**：
```json
{
  "categories": [...],
  "apps": [...]
}
```

### GET `/health`
健康檢查端點

---

## 🛡️ 安全功能

- ✅ Content Security Policy (CSP)
- ✅ Rate Limiting
- ✅ SSRF 防護
- ✅ XSS 防護
- ✅ 輸入驗證與清理
- ✅ 安全審計日誌

---

## 📱 響應式斷點

- **手機**：< 640px（4 列網格）
- **平板**：≥ 640px（2 列網格）
- **桌面**：≥ 768px（3 列網格）
- **大螢幕**：≥ 1024px（4 列網格）
- **超大螢幕**：≥ 1280px（5 列網格）

---

## 🐛 故障排除

### 圖片無法顯示
- 檢查圖片路徑是否正確
- 系統會自動使用 fallback icon

### Admin 功能無法使用
- 確認已設定 `ADMIN_SECRET` 環境變數
- 確認 `VITE_ADMIN_HASH` 是正確的 SHA-256 雜湊值

### 構建失敗
- 確認 Node.js 版本 ≥ 18
- 執行 `rm -rf node_modules package-lock.json && npm install`

### API 無法上傳
- 確認已設定 `VITE_CATALOG_API_ENDPOINT`
- 檢查後端服務是否正常運行

---

## 📄 授權

© 2025 AIJob 自動化學院

---

## 🔗 相關連結

- [Zeabur 部署平台](https://zeabur.com)
- [AIJob 官方網站](https://www.aijob.com.tw/)
- [YouTube 頻道](https://youtu.be/Wqulhvlj5gk?si=XWPnNGuOqpQiEhZb)

---

## 💡 貢獻

歡迎提交 Issue 或 Pull Request！

---

## 📞 聯絡方式

如有問題或建議，請透過以下方式聯絡：

- **LINE 官方帳號**：https://lin.ee/ZTgJbYG
- **Discord 社群**：https://discord.gg/Dzm2P7rHyg
- **Instagram**：https://www.instagram.com/aijobschool/reels/
