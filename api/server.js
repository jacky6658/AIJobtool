/**
 * Catalog API Server
 * 用於接收並更新 catalog.json 的後端 API
 * 
 * 部署到 Zeabur 時：
 * 1. 設定環境變數：ADMIN_SECRET（與前端的 VITE_ADMIN_HASH 對應的原始密碼）
 * 2. 設定環境變數：CATALOG_FILE_PATH（可選，預設為 ./public/catalog.json）
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// 環境變數
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const CATALOG_FILE_PATH = process.env.CATALOG_FILE_PATH || path.join(__dirname, '../public/catalog.json');

// 中間件
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// CORS 設定（允許前端域名）
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // 允許所有來源（生產環境建議限制特定域名）
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// SHA-256 雜湊函數（與前端一致）
function sha256Hex(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// 驗證 Admin 權限
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!ADMIN_SECRET) {
    console.warn('警告：ADMIN_SECRET 未設定，API 將拒絕所有請求');
    return res.status(500).json({ 
      error: '伺服器未設定管理密碼，請設定 ADMIN_SECRET 環境變數' 
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '缺少授權標頭' });
  }

  const token = authHeader.substring(7);
  const tokenHash = sha256Hex(token);

  // 計算 ADMIN_SECRET 的雜湊值
  const secretHash = sha256Hex(ADMIN_SECRET);

  if (tokenHash !== secretHash) {
    return res.status(403).json({ error: '無效的授權令牌' });
  }

  next();
}

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    catalogPath: CATALOG_FILE_PATH 
  });
});

// 獲取當前 catalog
app.get('/api/catalog', async (req, res) => {
  try {
    const data = await fs.readFile(CATALOG_FILE_PATH, 'utf8');
    const catalog = JSON.parse(data);
    res.json(catalog);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'catalog.json 不存在' });
    } else {
      console.error('讀取 catalog 失敗:', error);
      res.status(500).json({ error: '讀取 catalog 失敗' });
    }
  }
});

// 更新 catalog（需要 Admin 權限）
app.post('/api/catalog', verifyAdmin, async (req, res) => {
  try {
    const catalog = req.body;

    // 驗證資料格式
    if (!catalog || !Array.isArray(catalog.categories) || !Array.isArray(catalog.apps)) {
      return res.status(400).json({ 
        error: '無效的 catalog 格式，需要包含 categories 和 apps 陣列' 
      });
    }

    // 確保目錄存在
    const dir = path.dirname(CATALOG_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });

    // 寫入檔案
    await fs.writeFile(
      CATALOG_FILE_PATH, 
      JSON.stringify(catalog, null, 2), 
      'utf8'
    );

    console.log(`Catalog 已更新: ${new Date().toISOString()}`);
    res.json({ 
      success: true, 
      message: 'Catalog 已成功更新',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('更新 catalog 失敗:', error);
    res.status(500).json({ 
      error: '更新 catalog 失敗',
      details: error.message 
    });
  }
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Catalog API Server 運行在 http://localhost:${PORT}`);
  console.log(`📁 Catalog 檔案路徑: ${CATALOG_FILE_PATH}`);
  console.log(`🔐 Admin 驗證: ${ADMIN_SECRET ? '已設定' : '未設定（將拒絕所有請求）'}`);
});

