# 🧠 AIJob AI工具庫

全站收錄多元且實用的 AI 工具與智能體模型，從新手到專業用戶都能快速找到最適合的解決方案，並全面提升你的工作效率。

這是一個免費提供給大家使用的 AI 工具集合平台，精心收錄了市面上各種實用的 AI 工具與智能體，涵蓋 AI 員工、AI 對話、AI 寫程式工具、部署平台、AI 自動化工作流等多個分類。

---

## ✨ 專案特色

### 🔹 一站式 AI 工具集合平台
- **多元分類**：AI 員工、AI 對話、AI 寫程式工具、部署平台、AI 自動化工作流、AI 分身、AI文書
- **智能搜尋**：快速找到目標工具
- **收藏功能**：跨分類收藏常用工具
- **標籤篩選**：快速篩選相關工具

### 🔹 響應式設計（RWD）- iOS 風格
- **手機版**：
  - iPhone App 圖示風格，4 列網格布局
  - 無卡片容器，只顯示圖示和名稱
  - 點擊圖示打開詳細資訊 Modal
  - 點擊空白處關閉側邊欄抽屜
  - 文字自動換行，標題最多兩行
- **桌面版**：
  - 統一卡片高度，響應式字體與布局
  - 完整資訊顯示（分類、簡介、標籤）
  - 懸停效果和漸層光暈
- **自適應**：根據視窗大小動態調整

### 🔹 智能圖示系統
- **自動 Fallback**：圖片載入失敗時自動顯示相關 icon
- **智能匹配**：根據應用名稱和分類自動選擇合適的 icon
- **多種格式支援**：emoji、圖片路徑、URL、base64
- **離線緩存**：使用 Service Worker 自動緩存圖片，離線時仍可顯示

### 🔹 離線圖片緩存
- **自動緩存**：所有圖片自動緩存到瀏覽器
- **離線支援**：無網路時仍可查看已緩存的圖片
- **智能降級**：緩存失敗時顯示 fallback icon
- **性能優化**：批量預載入，限制並發數

### 🔹 管理功能
- **Admin 面板**：可新增、編輯、刪除工具和分類
- **自動上傳**：支援 API 自動上傳 catalog
- **匯出功能**：可匯出 catalog.json 進行版本控制
- **Logo 自動抓取**：新增工具時自動抓取網站 Logo

### 🔹 動態效果
- **首頁動畫**：漸進式載入動畫（淡入、滑入、縮放）
- **背景裝飾**：流動的彩色 blob 動畫
- **懸停效果**：卡片懸停時的視覺反饋
- **按鈕動畫**：點擊波紋效果和脈衝動畫

### 🔹 SEO 優化（滿分 10/10）
- **完整 Meta 標籤**：Title、Description、Keywords
- **Open Graph**：Facebook 分享優化
- **Twitter Card**：Twitter 分享優化
- **結構化資料**：WebSite 和 EducationalOrganization Schema.org
- **GEO 標籤**：完整的地理位置資訊
- **robots.txt** 和 **sitemap.xml**：搜尋引擎優化

---

## 🛠️ 技術架構

### 前端
- **React 18** + **TypeScript** - UI 框架
- **Vite 5** - 構建工具
- **Tailwind CSS** - 樣式框架（CDN）
- **React Hooks** - 狀態管理
- **Service Worker** - 離線緩存支援

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
│   ├── main.tsx             # React 入口 + Service Worker 註冊
│   ├── index.css            # 樣式表（包含 iOS 風格樣式）
│   ├── components/         # React 組件
│   │   ├── AdminPanel.tsx   # 管理面板
│   │   ├── HomePage.tsx     # 首頁組件
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingAnimation.tsx
│   │   └── SEOHead.tsx      # SEO 動態更新組件
│   └── utils/               # 工具函數
│       ├── security.ts      # 安全驗證
│       ├── advancedSecurity.ts
│       ├── cleanMarkers.ts
│       └── imageCache.ts    # 圖片緩存工具（可選）
├── public/
│   ├── catalog.json         # 工具目錄（可動態更新）
│   ├── sw.js                # Service Worker（離線緩存）
│   ├── robots.txt           # 搜尋引擎爬蟲規則
│   ├── sitemap.xml          # 網站地圖
│   └── images/              # 圖片資源
├── server.js                 # Express 伺服器
├── server-security.js        # 安全防護模組
├── index.html                # HTML 入口（包含完整 SEO 標籤）
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
- ✅ **Logo 自動抓取**：自動從網站抓取 Logo
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
- Service Worker：自動註冊並啟用離線緩存

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
- **手機版**（< 640px）：
  - 4 列網格，iPhone App 風格
  - 無卡片容器，只顯示圖示和名稱
  - 點擊圖示打開詳細資訊 Modal
  - 文字自動換行，標題最多兩行
  - 點擊空白處關閉側邊欄
- **平板**（≥ 640px）：2 列網格
- **桌面**（≥ 768px）：3-5 列網格（根據螢幕大小）
- **統一高度**：桌面版卡片高度一致

### 離線圖片緩存
- **自動緩存**：所有圖片自動緩存到瀏覽器
- **離線支援**：無網路時仍可查看已緩存的圖片
- **預載入**：Catalog 載入後自動預載入所有圖片
- **智能降級**：緩存失敗時顯示 fallback icon

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

## 🔍 SEO 與 GEO 優化

### SEO 功能（評分：10/10）
- ✅ 完整 Meta 標籤（Title、Description、Keywords）
- ✅ Open Graph（Facebook 分享）
- ✅ Twitter Card
- ✅ WebSite 結構化資料（支援站內搜尋）
- ✅ EducationalOrganization 結構化資料
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Canonical URL
- ✅ 語言標籤

### GEO 功能（評分：9/10）
- ✅ 地理位置 Meta 標籤
- ✅ Dublin Core Metadata
- ✅ Schema.org 地理位置資訊
- ✅ 地址資訊（台北市內湖區）

詳細資訊請參考 `SEO_GEO_REPORT.md`

---

## 📱 響應式斷點

- **手機**：< 640px（4 列網格，iOS 風格）
- **平板**：≥ 640px（2 列網格）
- **桌面**：≥ 768px（3 列網格）
- **大螢幕**：≥ 1024px（4 列網格）
- **超大螢幕**：≥ 1280px（5 列網格）

---

## 🔄 離線緩存機制

### Service Worker
- 自動註冊並激活
- 攔截所有圖片請求
- 自動緩存到瀏覽器
- 離線時從緩存讀取

### 緩存策略
1. **線上時**：從網路獲取並緩存
2. **離線時**：從緩存讀取
3. **緩存失敗**：顯示 fallback icon

### 查看緩存
在瀏覽器開發者工具中：
1. 打開 **Application** 標籤
2. 查看 **Cache Storage** → `aijob-images-v1`
3. 可以看到所有緩存的圖片

詳細資訊請參考 `OFFLINE_IMAGE_CACHE.md`

---

## 🐛 故障排除

### 圖片無法顯示
- 檢查圖片路徑是否正確
- 系統會自動使用 fallback icon
- 檢查 Service Worker 是否正常運行

### Service Worker 無法註冊
- 確認網站使用 HTTPS（或 localhost）
- 檢查瀏覽器是否支援 Service Worker
- 查看瀏覽器控制台的錯誤訊息

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
- **LINE 社群**：https://line.me/ti/g2/xaKhtD6TG78lZ8tOLP2T4Lz0zD-edf8GJF8x5w
- **Discord 社群**：https://discord.gg/Dzm2P7rHyg
- **Instagram**：https://www.instagram.com/aijobschool/reels/
- **官方網站**：https://www.aijob.com.tw/

---

## 📚 相關文檔

- `SEO_GEO_REPORT.md` - SEO 與 GEO 規劃詳細報告
- `OFFLINE_IMAGE_CACHE.md` - 離線圖片緩存功能說明
- `PROJECT_ISSUES.md` - 專案問題記錄
