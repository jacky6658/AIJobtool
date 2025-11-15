# 使用 Node.js 18 作為基礎映像
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有檔案
COPY . .

# 建置應用程式
RUN npm run build

# 創建非 root 用戶
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 更改檔案所有者
RUN chown -R nodejs:nodejs /app

# 暴露端口
EXPOSE 8080

# 設定環境變數
ENV PORT=8080
ENV NODE_ENV=production

# 切換到非 root 用戶
USER nodejs

# 啟動應用程式
CMD ["node", "server.js"]


