import React from "react";

const AppLauncherDemo: React.FC = () => {
  const categories = ["AI智能體", "AI對話"] as const;
  type Category = (typeof categories)[number];

  type App = {
    name: string;
    icon: string;
    description: string;
    href: string;
    category: Category;
    tags?: string[];
  };

  const [activeCategory, setActiveCategory] = React.useState<Category>("AI智能體");
  const [selectedApp, setSelectedApp] = React.useState<App | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [keyword, setKeyword] = React.useState<string>("");
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const toastTimeoutRef = React.useRef<number | null>(null);

  const isDark = theme === "dark";

  // 初始從 localStorage 載入收藏與主題
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawFav = window.localStorage.getItem("aijob-tool-favorites");
      if (rawFav) {
        const parsed = JSON.parse(rawFav);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }

      const storedTheme = window.localStorage.getItem("aijob-theme");
      if (storedTheme === "light" || "dark") {
        setTheme(storedTheme as "light" | "dark");
      }
    } catch (e) {
      console.warn("Failed to load from localStorage", e);
    }
  }, []);

  // 主題變更時存入 localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("aijob-theme", theme);
    } catch (e) {
      console.warn("Failed to save theme", e);
    }
  }, [theme]);

  const saveFavorites = (next: string[]) => {
    setFavorites(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("aijob-tool-favorites", JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save favorites to localStorage", e);
      }
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    if (typeof window === "undefined") return;
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 1600);
  };

  const toggleFavorite = (app: App) => {
    const isFavorite = favorites.includes(app.name);
    const next = isFavorite
      ? favorites.filter((n) => n !== app.name)
      : [...favorites, app.name];
    saveFavorites(next);
    showToast(isFavorite ? "已從收藏移除" : "已加入收藏");
  };

  const apps: App[] = [
    {
      name: "ReelMind短影音智能體",
      icon: "🎬",
      description: "輸入需求即可自動生成帳號定位、腳本選題與短影音腳本。",
      href: "https://reelmind.aijob.com.tw",
      category: "AI智能體",
      tags: ["短影音", "內容策略", "影片腳本"],
    },
    {
      name: "HR招募智能體",
      icon: "💼",
      description: "快速生成職缺描述、面試問題與人才畫像分析。",
      href: "https://step1nerecruit.zeabur.app/",
      category: "AI智能體",
      tags: ["HR", "招募", "面試題目"],
    },
    {
      name: "GPT",
      icon: "🤖",
      description: "使用 OpenAI GPT 系列模型進行智能對話。",
      href: "https://chat.openai.com/",
      category: "AI對話",
      tags: ["通用", "英文", "程式"],
    },
    {
      name: "Gemini",
      icon: "🌟",
      description: "由 Google 推出的多模態 AI 對話系統。",
      href: "https://gemini.google.com/",
      category: "AI對話",
      tags: ["多模態", "圖片", "影片"],
    },
    {
      name: "Manus",
      icon: "🧠",
      description: "高效能中文 AI 對話系統，支援多場景應用。",
      href: "https://manus.im/",
      category: "AI對話",
      tags: ["中文", "效率", "本地化"],
    },
  ];

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredApps = apps.filter((app) => {
    if (app.category !== activeCategory) return false;
    if (activeTag && !(app.tags || []).includes(activeTag)) return false;
    if (!normalizedKeyword) return true;
    const text = (
      app.name + app.description + (app.tags || []).join(" ")
    ).toLowerCase();
    return text.includes(normalizedKeyword);
  });

  const favoriteApps = apps.filter((app) => favorites.includes(app.name));

  const availableTags = Array.from(
    new Set(
      apps
        .filter((app) => app.category === activeCategory && app.tags)
        .flatMap((app) => app.tags as string[])
    )
  );

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden"
          : "min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden"
      }
    >
      {/* 動態背景 */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-70 animate-pulse ${
            isDark ? "bg-indigo-900/40" : "bg-indigo-100"
          }`}
        />
        <div
          className={`absolute -bottom-32 -left-20 h-80 w-80 rounded-full blur-3xl opacity-70 animate-pulse ${
            isDark ? "bg-sky-900/40" : "bg-sky-100"
          }`}
        />
      </div>

      {/* 行動版頂部列 */}
      <div
        className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b px-4 py-3 md:hidden ${
          isDark
            ? "bg-slate-900/90 border-slate-800 text-slate-100"
            : "bg-white/90 border-slate-200 text-slate-800 backdrop-blur-sm"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-xl"
        >
          ☰
        </button>
        <span className="font-semibold text-sm">AIJob 工具庫</span>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="text-lg"
          aria-label="切換主題"
        >
          {isDark ? "🌞" : "🌙"}
        </button>
      </div>

      {/* 主要版面：包含側邊欄與主內容。pt-12 只在手機用來騰出頂欄空間 */}
      <div className="relative flex pt-12 md:pt-0">
        {/* 側邊導覽欄 */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 bottom-0 md:bottom-auto md:h-screen w-64 px-4 py-6 flex flex-col transform transition-all duration-200 ease-in-out border-r ${
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
          } ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-slate-100"
              : "bg-white/90 border-slate-200/80 text-slate-900 backdrop-blur-sm"
          }`}
        >
          <div className="mb-8">
            <div className="text-xs uppercase tracking-wide text-indigo-500 font-semibold mb-1">
              AIJob
            </div>
            <div className="text-xl font-bold">AI工具庫</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              集中管理你的 AI 工具與智能體，從這裡出發啟動工作流程。
            </p>
          </div>

          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveTag(null);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-indigo-500/10 text-indigo-500 shadow-sm"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                }`}
              >
                <span className="text-base">
                  {cat === "AI智能體" ? "🤖" : "💬"}
                </span>
                <span>{cat}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 text-xs text-slate-400 border-t border-slate-100/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span>© {new Date().getFullYear()} AIJob</span>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="hidden md:inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs hover:border-indigo-400"
              >
                {isDark ? "🌞" : "🌙"}
              </button>
            </div>
          </div>

          {/* 行動版關閉按鈕 */}
          <button
            className="md:hidden absolute top-3 right-3 text-slate-400 hover:text-slate-200"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </aside>

        {/* 主內容區 */}
        <main className="flex-1 px-4 sm:px-6 py-6 md:py-8 md:ml-64">
          <header className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold">
                  {activeCategory}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  點擊下方任一圖示卡片，即可開啟對應工具或頁面。
                </p>
              </div>

              <div className="w-full sm:w-72">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜尋工具名稱或關鍵字"
                    className={`w-full rounded-xl border py-1.5 pl-8 pr-3 text-xs sm:text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
                      isDark
                        ? "border-slate-700 bg-slate-900/80 text-slate-100 placeholder:text-slate-500"
                        : "border-slate-200 bg-white/80 text-slate-700 placeholder:text-slate-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {favoriteApps.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>⭐ 我的收藏</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    （跨分類顯示你常用的工具）
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteApps.map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                        isDark
                          ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:border-indigo-400 hover:text-indigo-300"
                          : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableTags.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>🏷️ 快速篩選標籤</span>
                  {activeTag && (
                    <button
                      type="button"
                      onClick={() => setActiveTag(null)}
                      className="text-[10px] text-indigo-500 hover:underline"
                    >
                      清除標籤
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setActiveTag((prev) => (prev === tag ? null : tag))
                      }
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] transition-colors border ${
                        activeTag === tag
                          ? "border-indigo-400 bg-indigo-500/10 text-indigo-500"
                          : isDark
                          ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
                          : "border-sky-200 bg-sky-100 text-black hover:border-sky-300"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </header>

          <section>
            {filteredApps.length === 0 ? (
              <div className="text-sm text-slate-400 dark:text-slate-500">
                找不到符合條件的工具，試試其他關鍵字或切換分類。
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredApps.map((app) => {
                  const isFavoriteApp = favorites.includes(app.name);
                  return (
                    <div
                      key={app.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedApp(app)}
                      className="group relative rounded-2xl p-px transition-transform duration-150 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                    >
                      {/* hover 漸層光暈 */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-gradient-to-br from-indigo-200/80 via-sky-200/60 to-transparent dark:from-indigo-500/40 dark:via-sky-500/30" />

                      <div
                        className={`relative rounded-[14px] p-4 flex flex-col items-center text-center shadow-sm backdrop-blur-sm ${
                          isDark
                            ? "bg-slate-900/90 border border-slate-800"
                            : "bg-white/95 border border-slate-100"
                        }`}
                      >
                        {/* 收藏按鈕 */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(app);
                          }}
                          className={`absolute right-3 top-3 text-lg transition-transform ${
                            isFavoriteApp
                              ? "text-yellow-400 scale-110"
                              : "text-slate-300 hover:text-slate-400"
                          }`}
                          aria-label={
                            isFavoriteApp ? "移除收藏" : "加入收藏"
                          }
                        >
                          {isFavoriteApp ? "★" : "☆"}
                        </button>

                        <div
                          className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                            isDark ? "bg-slate-800" : "bg-indigo-50"
                          }`}
                        >
                          {app.icon}
                        </div>
                        <div className="font-semibold mb-1 text-sm">
                          {app.name}
                        </div>
                        <div className="text-[11px] text-indigo-500 mb-2">
                          {app.category}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                          {app.description}
                        </div>
                        {app.tags && (
                          <div className="flex flex-wrap justify-center gap-1">
                            {app.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-sky-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] text-black dark:text-slate-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* 浮動說明視窗（Modal） */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div
            className={`relative max-w-md w-full mx-4 rounded-2xl shadow-2xl p-6 animate-[fadeIn_0.18s_ease-out] ${
              isDark ? "bg-slate-900 border border-slate-700" : "bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 text-sm"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                  isDark ? "bg-slate-800" : "bg-indigo-50"
                }`}
              >
                {selectedApp.icon}
              </div>
              <h2 className="text-lg font-semibold mb-1">
                {selectedApp.name}
              </h2>
              <div className="text-xs text-indigo-500 mb-3">
                {selectedApp.category}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                {selectedApp.description}
              </p>
              <a
                href={selectedApp.href}
                target={selectedApp.href.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 shadow hover:bg-indigo-700 transition-colors w-full mb-2"
              >
                立即前往工具
              </a>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-xs text-slate-400 hover:text-slate-200 mt-1"
              >
                下次再說，先關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 收藏提示 Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-[fadeIn_0.15s_ease-out]">
          <div
            className={`rounded-xl px-3 py-2 text-xs shadow-lg flex items-center gap-2 ${
              isDark
                ? "bg-slate-900/95 border border-slate-700 text-slate-100"
                : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            <span>⭐</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLauncherDemo;
