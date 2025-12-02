import React, { useState, useEffect } from "react";
import { isValidUrl } from "../utils/security";
import { DEFAULT_FAQ_QUESTIONS } from "../utils/schemaGenerator";

/**
 * 首頁組件
 * 包含社群連結、YT頻道嵌入等
 */
interface HomePageProps {
  isDark?: boolean; // 保留參數以兼容，但不再使用
  onNavigateToCategory?: (category: string) => void; // 導航到指定分類（桌面版）
  onOpenSidebar?: () => void; // 打開側邊欄（手機版）
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToCategory, onOpenSidebar }) => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 檢測是否為手機版
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 頁面載入動畫 - 漸進式顯示
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 100);
    setTimeout(() => setContentVisible(true), 300);
    setTimeout(() => setVideoVisible(true), 500);
    setTimeout(() => setFaqVisible(true), 700);
  }, []);

  // 切換 FAQ 展開/收起
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  // 安全驗證所有外部連結
  const links = {
    youtube: "https://youtu.be/Wqulhvlj5gk?si=XWPnNGuOqpQiEhZb",
    lineOfficial: "https://lin.ee/ZTgJbYG",
    lineCommunity: "https://line.me/ti/g2/xaKhtD6TG78lZ8tOLP2T4Lz0zD-edf8GJF8x5w?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
    instagram: "https://www.instagram.com/aijobschool/reels/",
    discord: "https://discord.gg/Dzm2P7rHyg",
    officialWebsite: "https://www.aijob.com.tw/",
  };

  // 驗證所有連結
  const validatedLinks = Object.entries(links).reduce((acc, [key, url]) => {
    if (isValidUrl(url)) {
      acc[key] = url;
    }
    return acc;
  }, {} as Record<string, string>);

  // YT影片ID提取（從URL中提取）
  const getYoutubeVideoId = (url: string): string | null => {
    try {
      // 處理 https://youtu.be/Wqulhvlj5gk?si=... 格式
      const match1 = url.match(/youtu\.be\/([^?&]+)/);
      if (match1) return match1[1];
      // 處理 https://www.youtube.com/watch?v=... 格式
      const match2 = url.match(/[?&]v=([^&]+)/);
      if (match2) return match2[1];
      return null;
    } catch {
      return null;
    }
  };

  const youtubeVideoId = validatedLinks.youtube ? getYoutubeVideoId(validatedLinks.youtube) : null;

  // YT嵌入URL（使用影片ID）
  const youtubeEmbedUrl = youtubeVideoId 
    ? `https://www.youtube.com/embed/${youtubeVideoId}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* 標題區 - 淡入+滑入動畫 */}
      <div className={`text-center mb-12 transition-all duration-1000 ${
        titleVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-8'
      }`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
          AIJob AI工具庫
        </h1>
        <div className={`max-w-3xl mx-auto space-y-3 transition-all duration-700 delay-200 ${
          contentVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-xl text-slate-700 font-medium">
            歡迎使用 AIJob AI工具庫
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            這是一個免費提供給大家使用的 AI 工具集合平台。我們精心收錄了市面上各種實用的 AI 工具與智能體，涵蓋 AI 員工、AI 對話、AI 寫程式工具、部署平台、AI 自動化工作流等多個分類，幫助你快速找到適合的工具，提升工作效率。
          </p>
          <p className="text-sm text-slate-500 mt-4">
            無論你是開發者、設計師、行銷人員，或是想要探索 AI 應用的任何人，都能在這裡找到適合的工具。
          </p>
        </div>
      </div>

      {/* YT影片嵌入 - 淡入+縮放動畫 */}
      {youtubeEmbedUrl && (
        <div className={`mb-12 transition-all duration-1000 delay-300 ${
          videoVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}>
          <h2 className="text-2xl font-semibold mb-6 text-slate-900 text-center">
            YouTube 頻道
          </h2>
          <div className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              src={youtubeEmbedUrl}
              title="AIJob YouTube Channel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ border: 0 }}
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          </div>
          
          {/* 探索 AI 員工按鈕 */}
          <div className="mt-12 text-center">
            <button
              onClick={async () => {
                // 桌面版：導航到 AI員工 分類
                if (!isMobile && onNavigateToCategory) {
                  await onNavigateToCategory("AI員工");
                } 
                // 手機版：打開側邊欄
                else if (isMobile && onOpenSidebar) {
                  onOpenSidebar();
                }
              }}
              className="explore-button inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 active:scale-95 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white opacity-0 button-ripple"></span>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="relative z-10">探索AI工具</span>
            </button>
          </div>
        </div>
      )}

      {/* FAQ 常見問題區塊 */}
      <div className={`mb-12 transition-all duration-1000 delay-400 ${
        faqVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-slate-900">
          常見問題
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {DEFAULT_FAQ_QUESTIONS.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset hover:bg-slate-50 transition-colors"
                aria-expanded={openFaqIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 pt-2">
                  {faq.question === "如何加入 AIJob 自動化學院？" ? (
                    <>
                      <p className="text-slate-600 leading-relaxed mb-3">
                        您可以透過以下方式加入 AIJob 自動化學院：
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {validatedLinks.lineOfficial && (
                          <a
                            href={validatedLinks.lineOfficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.345 0 .627.285.627.63 0 .349-.282.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                            </svg>
                            LINE 官方帳號
                          </a>
                        )}
                        {validatedLinks.lineCommunity && (
                          <a
                            href={validatedLinks.lineCommunity}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.345 0 .627.285.627.63 0 .349-.282.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                            </svg>
                            LINE 社群
                          </a>
                        )}
                        {validatedLinks.discord && (
                          <a
                            href={validatedLinks.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                            Discord 社群
                          </a>
                        )}
                        {validatedLinks.instagram && (
                          <a
                            href={validatedLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            Instagram
                          </a>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm mt-3">
                        我們會定期分享 AI 工具使用技巧和自動化教學內容。
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 動態背景裝飾 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .explore-button:active .button-ripple {
          animation: ripple 0.6s ease-out;
        }
        .explore-button:active {
          transform: scale(0.95);
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
          }
        }
        .explore-button:hover {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

