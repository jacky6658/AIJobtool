# AI Tool Launcher Demo

這是一個以 **React + Vite + TypeScript** 打造的「AI 工具啟動面板」，讓使用者可以快速瀏覽、收藏並開啟不同的 AI 工具或智能體網站。

---

## 🚀 主要功能

### 🧠 智能分類
- 提供兩大分類：「AI智能體」與「AI對話」。
- 不同分類下可展示多個 AI 工具，如 **ReelMind短影音智能體、HR招募智能體、GPT、Gemini、Manus**。

### ⭐ 收藏系統
- 點擊卡片右上角星星即可將工具加入收藏。
- 收藏結果會自動儲存在 `localStorage`，下次開啟仍會顯示。

### 🔍 搜尋與標籤篩選
- 支援名稱與描述關鍵字搜尋。
- 可依據標籤（Tags）快速篩選工具。

### 🌗 深淺色主題切換
- 內建主題切換按鈕，可自由切換亮色／暗色模式。
- 主題偏好會自動保存。

### 📱 響應式設計
- 行動版有收合式側邊欄，桌機版固定側欄。
- RWD 全面優化，手機與桌機皆可流暢使用。

---

## ⚙️ 專案架構
```
aijob-tool-launcher/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx        → 主介面邏輯與 UI 元件
│   ├── main.tsx       → React 入口檔案
│   └── index.css      → 全域樣式
└── README.md
```

---

## 🧩 技術說明
- **框架**：React 18 + TypeScript
- **建構工具**：Vite 5 + SWC 編譯
- **樣式**：Tailwind CSS（預留 class 結構，易整合）
- **資料儲存**：瀏覽器 localStorage
- **動態功能**：React Hooks + State 管理

---

## 💻 本地執行方式

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 預設網址
http://localhost:5173
```

---

## 🌐 部署建議
若要部署到 GitHub Pages：
1. 在 `vite.config.ts` 新增 `base: '/<repo-name>/'`
2. 執行：
   ```bash
   npm run build
   npm run preview
   ```
3. 將 `dist` 資料夾推送到 GitHub Pages。

---

## 📖 製作理念
此專案旨在打造一個 **可擴充的 AI 工具中心介面**，
讓使用者能像開啟「App Launcher」一樣瀏覽各式 AI 工具，
同時體驗到收藏、搜尋與主題切換的互動設計。
