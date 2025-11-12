# Catalog API Server

用於自動更新 `catalog.json` 的後端 API 服務。

## 功能

- ✅ 接收前端傳送的 catalog 資料
- ✅ 驗證 Admin 權限
- ✅ 自動更新 `public/catalog.json`
- ✅ CORS 支援
- ✅ 健康檢查端點

## 環境變數

在 Zeabur 部署時需要設定：

| 變數名稱 | 說明 | 必填 | 預設值 |
|---------|------|------|--------|
| `ADMIN_SECRET` | Admin 密碼（與前端的原始密碼相同，不是雜湊值） | ✅ 是 | - |
| `CATALOG_FILE_PATH` | catalog.json 的完整路徑 | ❌ 否 | `./public/catalog.json` |
| `PORT` | 伺服器端口 | ❌ 否 | `3001` |

## 部署到 Zeabur

### 方法一：作為獨立服務部署

1. 在 Zeabur 建立新專案
2. 選擇「Node.js」服務
3. 設定：
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. 設定環境變數：
   - `ADMIN_SECRET`: 你的 Admin 密碼（例如：`auijq165!@3fgh`）
5. 部署

### 方法二：與前端一起部署（使用 Zeabur 的 Monorepo）

如果前端和後端在同一個 Git 儲存庫：

1. 在 Zeabur 專案中新增第二個服務
2. 選擇 `api` 目錄
3. 設定同上

## API 端點

### `GET /health`
健康檢查

**回應：**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "catalogPath": "/path/to/catalog.json"
}
```

### `GET /api/catalog`
獲取當前 catalog

**回應：**
```json
{
  "categories": [...],
  "apps": [...]
}
```

### `POST /api/catalog`
更新 catalog（需要 Admin 權限）

**Headers:**
```
Authorization: Bearer <你的原始密碼>
Content-Type: application/json
```

**Body:**
```json
{
  "categories": ["分類1", "分類2"],
  "apps": [...]
}
```

**回應：**
```json
{
  "success": true,
  "message": "Catalog 已成功更新",
  "timestamp": "2025-01-XX..."
}
```

## 前端設定

在前端專案的 Zeabur 環境變數中設定：

```
VITE_CATALOG_API_ENDPOINT=https://your-api-service.zeabur.app/api/catalog
```

## 安全注意事項

1. ⚠️ **ADMIN_SECRET** 必須與前端登入時使用的原始密碼相同
2. ⚠️ 生產環境建議限制 CORS 來源
3. ⚠️ 建議使用 HTTPS

## 本地開發

```bash
cd api
npm install
npm run dev
```

API 將運行在 `http://localhost:3001`

