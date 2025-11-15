import React from "react";
import { isValidUrl } from "../utils/security";

/**
 * 首頁組件
 * 包含社群連結、YT頻道嵌入等
 */
interface HomePageProps {
  isDark: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  // 安全驗證所有外部連結
  const links = {
    youtube: "https://youtube.com/@aijobschool?si=TXkc9-mS_2DAjRlF",
    lineOfficial: "https://lin.ee/ZTgJbYG",
    lineCommunity: "https://line.me/ti/g2/xaKhtD6TG78lZ8tOLP2T4Lz0zD-edf8GJF8x5w?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
    instagram: "https://www.instagram.com/aijobschool/reels/",
    discord: "https://discord.gg/Dzm2P7rHyg",
    officialWebsite: "https://www.aijob.com.tw/",
    course: "https://onsell.aijob.com.tw",
  };

  // 驗證所有連結
  const validatedLinks = Object.entries(links).reduce((acc, [key, url]) => {
    if (isValidUrl(url)) {
      acc[key] = url;
    }
    return acc;
  }, {} as Record<string, string>);

  // YT頻道ID提取（從URL中提取）
  const getYoutubeChannelId = (url: string): string | null => {
    try {
      const match = url.match(/@([^/?]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const youtubeChannelId = validatedLinks.youtube ? getYoutubeChannelId(validatedLinks.youtube) : null;

  // YT嵌入URL（使用頻道上傳列表）
  const youtubeEmbedUrl = youtubeChannelId 
    ? `https://www.youtube.com/embed?listType=user_uploads&list=${youtubeChannelId}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* 標題區 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          歡迎來到 AIJob 自動化學院
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          專注於 AI 與自動化技術教學，從零打造你的工作流效率
        </p>
      </div>

      {/* YT頻道嵌入 */}
      {youtubeEmbedUrl && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white text-center">
            📺 YouTube 頻道
          </h2>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
              src={youtubeEmbedUrl}
              title="AIJob YouTube Channel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ border: 0 }}
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          </div>
        </div>
      )}

      {/* 社群連結區 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white text-center">
          🔗 加入我們的社群
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LINE官方帳號 */}
          {validatedLinks.lineOfficial && (
            <a
              href={validatedLinks.lineOfficial}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "border-green-500/30 bg-green-500/10 hover:border-green-500/50"
                  : "border-green-500/50 bg-green-50 hover:border-green-500"
              }`}
            >
              <div className="text-4xl mb-3">💬</div>
              <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                LINE 官方帳號
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                獲取最新資訊與即時支援
              </div>
            </a>
          )}

          {/* LINE社群 */}
          {validatedLinks.lineCommunity && (
            <a
              href={validatedLinks.lineCommunity}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50"
                  : "border-blue-500/50 bg-blue-50 hover:border-blue-500"
              }`}
            >
              <div className="text-4xl mb-3">👥</div>
              <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                LINE 社群
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                與學員交流互動
              </div>
            </a>
          )}

          {/* Discord */}
          {validatedLinks.discord && (
            <a
              href={validatedLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "border-indigo-500/30 bg-indigo-500/10 hover:border-indigo-500/50"
                  : "border-indigo-500/50 bg-indigo-50 hover:border-indigo-500"
              }`}
            >
              <div className="text-4xl mb-3">💬</div>
              <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                Discord 社群
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                技術討論與即時支援
              </div>
            </a>
          )}

          {/* Instagram */}
          {validatedLinks.instagram && (
            <a
              href={validatedLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "border-pink-500/30 bg-pink-500/10 hover:border-pink-500/50"
                  : "border-pink-500/50 bg-pink-50 hover:border-pink-500"
              }`}
            >
              <div className="text-4xl mb-3">📷</div>
              <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                Instagram
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                觀看短影音與最新動態
              </div>
            </a>
          )}

          {/* 官方網站 */}
          {validatedLinks.officialWebsite && (
            <a
              href={validatedLinks.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "border-purple-500/30 bg-purple-500/10 hover:border-purple-500/50"
                  : "border-purple-500/50 bg-purple-50 hover:border-purple-500"
              }`}
            >
              <div className="text-4xl mb-3">🌐</div>
              <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                官方網站
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                了解更多課程與服務
              </div>
            </a>
          )}
        </div>
      </div>

      {/* 課程推薦（最下方） */}
      {validatedLinks.course && (
        <div className="mt-16 mb-8">
          <div className={`p-8 rounded-2xl border-2 ${
            isDark
              ? "border-indigo-500/30 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
              : "border-indigo-500/50 bg-gradient-to-r from-indigo-50 to-purple-50"
          }`}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                n8n 行銷 AI 自動化課程
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                告別加班地獄！AI 自動化行銷，讓你每天多出 2 小時
              </p>
              <a
                href={validatedLinks.course}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg ${
                  isDark
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                立即了解課程 →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-slate-900 dark:text-white">8 大即用模板</div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-slate-900 dark:text-white">視覺化拖拉、零程式</div>
              </div>
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-slate-900 dark:text-white">14 天安心保證</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

