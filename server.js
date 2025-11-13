/**
 * 整合伺服器：同時提供前端靜態檔案和後端 API
 * 用於 Zeabur 部署（前後端同一個服務）
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// 環境變數
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const CATALOG_FILE_PATH = process.env.CATALOG_FILE_PATH || path.join(__dirname, 'public/catalog.json');

// 中間件
app.use(express.json({ limit: '10mb' }));

// CORS 設定
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// SHA-256 雜湊函數
function sha256Hex(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// 驗證 Admin 權限
function verifyAdmin(req, res, next) {
  console.log(`\n🔐 [${new Date().toISOString()}] 收到 API 請求: ${req.method} ${req.path}`);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers.authorization;
  
  if (!ADMIN_SECRET) {
    console.error('❌ 錯誤：ADMIN_SECRET 未設定，API 將拒絕所有請求');
    return res.status(500).json({ 
      error: '伺服器未設定管理密碼，請設定 ADMIN_SECRET 環境變數' 
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('❌ 錯誤：缺少授權標頭');
    return res.status(401).json({ error: '缺少授權標頭' });
  }

  const token = authHeader.substring(7);
  const tokenHash = sha256Hex(token);
  const secretHash = sha256Hex(ADMIN_SECRET);

  console.log('🔑 Token Hash:', tokenHash.substring(0, 16) + '...');
  console.log('🔑 Secret Hash:', secretHash.substring(0, 16) + '...');

  if (tokenHash !== secretHash) {
    console.error('❌ 錯誤：無效的授權令牌');
    return res.status(403).json({ error: '無效的授權令牌' });
  }

  console.log('✅ 授權驗證通過');
  next();
}

// API 路由（必須在靜態檔案之前）
app.get('/api/catalog', async (req, res) => {
  console.log(`\n📖 [${new Date().toISOString()}] GET /api/catalog`);
  try {
    const data = await fs.readFile(CATALOG_FILE_PATH, 'utf8');
    const catalog = JSON.parse(data);
    console.log(`✅ 成功讀取 catalog: ${catalog.categories?.length || 0} 分類, ${catalog.apps?.length || 0} 應用程式`);
    res.json(catalog);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ catalog.json 不存在:', CATALOG_FILE_PATH);
      res.status(404).json({ error: 'catalog.json 不存在' });
    } else {
      console.error('❌ 讀取 catalog 失敗:', error);
      res.status(500).json({ error: '讀取 catalog 失敗' });
    }
  }
});

app.post('/api/catalog', verifyAdmin, async (req, res) => {
  try {
    console.log('📦 收到 catalog 資料:', {
      categories: req.body?.categories?.length || 0,
      apps: req.body?.apps?.length || 0
    });

    const catalog = req.body;

    if (!catalog || !Array.isArray(catalog.categories) || !Array.isArray(catalog.apps)) {
      console.error('❌ 無效的 catalog 格式');
      return res.status(400).json({ 
        error: '無效的 catalog 格式，需要包含 categories 和 apps 陣列' 
      });
    }

    // 確保目錄存在
    const dir = path.dirname(CATALOG_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    console.log('📁 目錄已確保存在:', dir);

    // 寫入檔案
    const catalogJson = JSON.stringify(catalog, null, 2);
    await fs.writeFile(CATALOG_FILE_PATH, catalogJson, 'utf8');
    console.log(`✅ Catalog 已寫入檔案: ${CATALOG_FILE_PATH}`);
    console.log(`📊 包含 ${catalog.categories.length} 個分類，${catalog.apps.length} 個應用程式`);

    res.json({ 
      success: true, 
      message: 'Catalog 已成功更新',
      timestamp: new Date().toISOString(),
      stats: {
        categories: catalog.categories.length,
        apps: catalog.apps.length
      }
    });
  } catch (error) {
    console.error('❌ 更新 catalog 失敗:', error);
    console.error('錯誤堆疊:', error.stack);
    res.status(500).json({ 
      error: '更新 catalog 失敗',
      details: error.message 
    });
  }
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    catalogPath: CATALOG_FILE_PATH 
  });
});

// 靜態檔案（必須在最後，作為 fallback）
app.use(express.static('dist'));

// SPA fallback：所有其他路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 整合伺服器運行在 http://localhost:${PORT}`);
  console.log(`📁 Catalog 檔案路徑: ${CATALOG_FILE_PATH}`);
  console.log(`🔐 Admin 驗證: ${ADMIN_SECRET ? '已設定 ✓' : '❌ 未設定（將拒絕所有請求）'}`);
  console.log(`📡 API 端點: POST /api/catalog`);
  console.log(`📡 API 端點: GET /api/catalog`);
  console.log(`🏥 健康檢查: GET /health`);
  console.log(`${'='.repeat(60)}\n`);
});

