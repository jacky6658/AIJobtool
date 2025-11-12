import React from "react";

/** ========= 型別 ========= */
type Category = string;

type App = {
  name: string;
  icon: string; // emoji、/images/xxx.png、http(s) 或 data:image/... base64
  description: string;
  href: string;
  category: Category;
  tags?: string[];
};

type Catalog = {
  categories: Category[];
  apps: App[];
};

/** ========= 簡易雜湊：把你的管理密碼先離線算出 SHA-256，再貼到 ADMIN_HASH ========= */
async function sha256(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
// TODO: 把下面這個哈希換成你的（例：aijob-dev-2025 的 SHA-256）
const ADMIN_HASH = "replace_with_your_sha256_hash";

/** ========= Fallback（catalog.json 載入失敗時使用） ========= */
const fallbackCatalog: Catalog = {
  categories: ["AI智能體", "AI對話", "AI寫程式工具", "部署平台"],
  apps: [
    // --- AI智能體 ---
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

    // --- AI對話 ---
    {
      name: "GPT",
      icon: "/images/ChatGPT.png",
      description: "使用 OpenAI GPT 系列模型進行智能對話。",
      href: "https://chat.openai.com/",
      category: "AI對話",
      tags: ["通用", "英文", "程式"],
    },
    {
      name: "Gemini",
      icon: "/images/gemini.png",
      description: "由 Google 推出的多模態 AI 對話系統。",
      href: "https://gemini.google.com/",
      category: "AI對話",
      tags: ["多模態", "圖片", "影片"],
    },
    {
      name: "Manus",
      icon: "/images/manus.png",
      description: "高效能中文 AI 對話系統，支援多場景應用。",
      href: "https://manus.im/",
      category: "AI對話",
      tags: ["中文", "效率", "本地化"],
    },

    // --- AI寫程式工具 ---
    {
      name: "StackBlitz",
      icon: "🛠️",
      description: "雲端即開即寫的前端開發環境，支援 Vite/Next 等。",
      href: "https://stackblitz.com/",
      category: "AI寫程式工具",
      tags: ["前端", "線上IDE", "快速實驗"],
    },
    {
      name: "Codesandbox",
      icon: "🧰",
      description: "線上沙盒環境，快速建立 React/Vue 專案範本。",
      href: "https://codesandbox.io/",
      category: "AI寫程式工具",
      tags: ["沙盒", "模板", "原型"],
    },
    {
      name: "GitHub Codespaces",
      icon: "💻",
      description: "雲端 VS Code 開發環境，整合 GitHub 專案。",
      href: "https://github.com/features/codespaces",
      category: "AI寫程式工具",
      tags: ["雲端IDE", "GitHub"],
    },

    // --- 部署平台 ---
    {
      name: "Zeabur",
      icon: "🟦",
      description: "一鍵自動化部署，支援 Node/Static/DB 等服務。",
      href: "https://zeabur.com",
      category: "部署平台",
      tags: ["Serverless", "自動部署", "Logs"],
    },
    {
      name: "Vercel",
      icon: "▲",
      description: "前端友善的 Serverless 平台，Next.js 官方好夥伴。",
      href: "https://vercel.com/",
      category: "部署平台",
      tags: ["Serverless", "Edge", "Next.js"],
    },
    {
      name: "Netlify",
      icon: "🌿",
      description: "靜態網站與函式部署，CI/CD 內建。",
      href: "https://www.netlify.com/",
      category: "部署平台",
      tags: ["靜態", "Functions", "CI/CD"],
    },
  ],
};

/** ========= 主元件 ========= */
const AppLauncherDemo: React.FC = () => {
  const [catalog, setCatalog] = React.useState<Catalog>(fallbackCatalog);

  const [activeCategory, setActiveCategory] = React.useState<string>(fallbackCatalog.categories[0]);
  const [selectedApp, setSelectedApp] = React.useState<App | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [keyword, setKeyword] = React.useState<string>("");
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const toastTimeoutRef = React.useRef<number | null>(null);

  // Admin（只有 ?admin=1 + 密碼正確 才為 true）
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  // Admin：新增分類暫存
  const [newCategory, setNewCategory] = React.useState<string>("");

  const isDark = theme === "dark";

  /** ====== 初始化：讀 localStorage（收藏/主題）、載入 catalog.json、admin 模式 ====== */
  React.useEffect(() => {
    // 1) localStorage（收藏 / 主題）
    try {
      const rawFav = localStorage.getItem("aijob-tool-favorites");
      if (rawFav) {
        const parsed = JSON.parse(rawFav);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
      const storedTheme = localStorage.getItem("aijob-theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme as "light" | "dark");
      }
    } catch {}

    // 2) 清掉舊版「本機自訂 App」資料
    try {
      localStorage.removeItem("aijob-custom-apps");
    } catch {}

    // 3) 載入公開 catalog.json（無則沿用 fallback）
    fetch("/catalog.json", { cache: "no-store" })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Catalog) => {
        if (Array.isArray(data.categories) && Array.isArray(data.apps)) {
          setCatalog(data);
          if (!data.categories.includes(activeCategory)) {
            setActiveCategory(data.categories[0] || "AI智能體");
          }
        }
      })
      .catch(() => {});

    // 4) 檢查 admin 入口
    const url = new URL(window.location.href);
    if (url.searchParams.get("admin") === "1") {
      const pwd = window.prompt("請輸入管理密碼");
      if (pwd) {
        sha256(pwd).then(h => {
          if (h === ADMIN_HASH) setIsAdmin(true);
          else alert("密碼錯誤");
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ====== 主題變更時儲存 ====== */
  React.useEffect(() => {
    try {
      localStorage.setItem("aijob-theme", theme);
    } catch {}
  }, [theme]);

  /** ====== 只用公開 catalog（移除本機自訂擴充） ====== */
  const apps: App[] = React.useMemo(() => catalog.apps, [catalog.apps]);

  /** ====== 收藏 ====== */
  const saveFavorites = (next: string[]) => {
    setFavorites(next);
    try {
      localStorage.setItem("aijob-tool-favorites", JSON.stringify(next));
    } catch {}
  };
  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 1600);
  };
  const toggleFavorite = (app: App) => {
    const isFavorite = favorites.includes(app.name);
    const next = isFavorite ? favorites.filter((n) => n !== app.name) : [...favorites, app.name];
    saveFavorites(next);
    showToast(isFavorite ? "已從收藏移除" : "已加入收藏");
  };

  /** ====== 刪除（只有 admin 可以刪公開 catalog） ====== */
  const deleteApp = (app: App) => {
    if (!isAdmin) return;
    if (!window.confirm(`確定刪除（公開）「${app.name}」？匯出後覆蓋 catalog.json 才會全站生效`)) return;
    setCatalog(prev => ({ ...prev, apps: prev.apps.filter(a => !(a.name === app.name && a.href === app.href)) }));
    setFavorites(prev => prev.filter(n => n !== app.name));
    showToast("已刪除（公開草稿）");
  };

  /** ====== 篩選 ====== */
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredApps = apps.filter((app) => {
    if (app.category !== activeCategory) return false;
    if (activeTag && !(app.tags || []).includes(activeTag)) return false;
    if (!normalizedKeyword) return true;
    const text = (app.name + app.description + (app.tags || []).join(" ")).toLowerCase();
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

  /** ====== Admin：新增分類 / 匯出 catalog.json ====== */
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);

  const addCategory = () => {
    const n = newCategory.trim();
    if (!n) return;
    if (catalog.categories.includes(n)) {
      alert("已存在相同分類");
      return;
    }
    setCatalog(prev => ({ ...prev, categories: [...prev.categories, n] }));
    setNewCategory("");
    showToast("已新增分類（公開草稿）");
  };

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "catalog.json";
    a.click();
  };

  /** ====== UI ====== */
  return (
    <div className={isDark ? "min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden"
                           : "min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden"}>
      {/* 背景動態 */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-70 animate-pulse ${
          isDark ? "bg-indigo-900/40" : "bg-indigo-100"}`} />
        <div className={`absolute -bottom-32 -left-20 h-80 w-80 rounded-full blur-3xl opacity-70 animate-pulse ${
          isDark ? "bg-sky-900/40" : "bg-sky-100"}`} />
      </div>

      {/* 行動版頂欄 */}
      <div className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b px-4 py-3 md:hidden ${
        isDark ? "bg-slate-900/90 border-slate-800 text-slate-100"
               : "bg-white/90 border-slate-200 text-slate-800 backdrop-blur-sm"}`}>
        <button onClick={() => setSidebarOpen(true)} className="text-xl">☰</button>
        <span className="font-semibold text-sm">AIJob 工具庫</span>
        <button onClick={() => setTheme(isDark ? "light" : "dark")} className="text-lg" aria-label="切換主題">
          {isDark ? "🌞" : "🌙"}
        </button>
      </div>

      {/* 主要版面 */}
      <div className="relative flex pt-12 md:pt-0">
        {/* 側邊欄 */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 bottom-0 md:h-screen w-64 px-4 py-6 flex flex-col transform transition-all duration-200 ease-in-out border-r ${
            sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"} ${
            isDark ? "bg-slate-900/90 border-slate-800 text-slate-100"
                   : "bg-white/90 border-slate-200/80 text-slate-900 backdrop-blur-sm"}`}>
          {/* Logo 區塊 */}
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src="https://static.wixstatic.com/media/9705bb_dd62dc9b5ff6496a9a9560ca516f9851~mv2.png"
              alt="AIJOB Logo"
              className="w-28 h-auto mb-3 object-contain drop-shadow-md"
            />
            <div className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">AIJob</div>
            <div className="text-xl font-bold mt-1">AI工具庫</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-3">
              集中管理你的 AI 工具與智能體，從這裡出發啟動工作流程。
            </p>
          </div>

          {/* 分類 */}
          <nav className="space-y-1">
            {catalog.categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setActiveCategory(cat); setActiveTag(null); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-indigo-500/10 text-indigo-500 shadow-sm"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
                    : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"}`}>
                <span className="text-base">
                  {cat === "AI智能體" ? "🤖"
                   : cat === "AI對話" ? "💬"
                   : cat === "AI寫程式工具" ? "🛠️"
                   : "☁️"}
                </span>
                <span>{cat}</span>
              </button>
            ))}
          </nav>

          {/* 管理工具（只有 Admin 顯示） */}
          {isAdmin && (
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white text-sm font-medium px-3 py-2 shadow hover:bg-indigo-700 transition-colors">
                ➕ 新增應用（公開草稿）
              </button>

              <div className="rounded-xl border p-2">
                <div className="text-xs mb-1 text-slate-500">新增分類（公開草稿）</div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    placeholder="輸入新分類名稱"
                    value={newCategory}
                    onChange={(e)=>setNewCategory(e.target.value)}
                  />
                  <button
                    onClick={addCategory}
                    className="rounded-lg bg-slate-900 text-white text-xs px-3 py-1.5 hover:bg-black/80"
                  >
                    新增
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={exportCatalog}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border text-slate-700 text-xs font-medium px-3 py-2 hover:bg-slate-50">
                ⬇️ 匯出 catalog.json
              </button>
            </div>
          )}

          <div className="mt-auto pt-6 text-xs text-slate-400 border-t border-slate-100/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span>© {new Date().getFullYear()} AIJob</span>
              <button onClick={() => setTheme(isDark ? "light" : "dark")}
                className="hidden md:inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs hover:border-indigo-400">
                {isDark ? "🌞" : "🌙"}
              </button>
            </div>
          </div>

          {/* 行動版關閉 */}
          <button className="md:hidden absolute top-3 right-3 text-slate-400 hover:text-slate-200"
                  onClick={() => setSidebarOpen(false)}>✕</button>
        </aside>

        {/* 主內容 */}
        <main className="flex-1 px-4 sm:px-6 py-6 md:py-8 md:ml-64">
          <header className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold">{activeCategory}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  點擊下方任一圖示卡片，即可開啟對應工具或頁面。
                </p>
              </div>
              <div className="w-full sm:w-72">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜尋工具名稱或關鍵字"
                    className={`w-full rounded-xl border py-1.5 pl-8 pr-3 text-xs sm:text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
                      isDark ? "border-slate-700 bg-slate-900/80 text-slate-100 placeholder:text-slate-500"
                             : "border-slate-200 bg-white/80 text-slate-700 placeholder:text-slate-400"}`}
                  />
                </div>
              </div>
            </div>

            {favoriteApps.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>⭐ 我的收藏</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">（跨分類顯示你常用的工具）</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteApps.map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                        isDark ? "border-slate-700 bg-slate-900/80 text-slate-100 hover:border-indigo-400 hover:text-indigo-300"
                               : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300 hover:text-indigo-600"}`}>
                      <span className="inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                        {renderIcon(app.icon, app.name)}
                      </span>
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
                    <button type="button" onClick={() => setActiveTag(null)}
                      className="text-[10px] text-indigo-500 hover:underline">
                      清除標籤
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] transition-colors border ${
                        activeTag === tag
                          ? "border-indigo-400 bg-indigo-500/10 text-indigo-500"
                          : isDark
                          ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
                          : "border-sky-200 bg-sky-100 text-black hover:border-sky-300"}`}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* App 卡片 */}
          <section>
            {filteredApps.length === 0 ? (
              <div className="text-sm text-slate-400 dark:text-slate-500">
                找不到符合條件的工具，試試其他關鍵字或切換分類。
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredApps.map((app) => {
                  const isFavoriteApp = favorites.includes(app.name);
                  const isCatalogApp = catalog.apps.some(x => x.name === app.name && x.href === app.href);

                  return (
                    <div
                      key={app.name + app.href}
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
                        {/* 收藏 */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(app); }}
                          className={`absolute right-3 top-3 text-lg transition-transform ${
                            isFavoriteApp ? "text-yellow-400 scale-110" : "text-slate-300 hover:text-slate-400"
                          }`}
                          aria-label={isFavoriteApp ? "移除收藏" : "加入收藏"}
                          title={isFavoriteApp ? "移除收藏" : "加入收藏"}
                        >
                          {isFavoriteApp ? "★" : "☆"}
                        </button>

                        {/* 刪除（只有 Admin 可以刪公開） */}
                        {isAdmin && isCatalogApp && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); deleteApp(app); }}
                            className="absolute left-3 top-3 text-sm text-rose-400 hover:text-rose-500"
                            aria-label="刪除應用"
                            title="刪除應用"
                          >
                            🗑️
                          </button>
                        )}

                        {/* 圖示 */}
                        <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-slate-800" : "bg-indigo-50"} overflow-hidden`}>
                          {renderIcon(app.icon, app.name)}
                        </div>

                        <div className="font-semibold mb-1 text-sm">{app.name}</div>
                        <div className="text-[11px] text-indigo-500 mb-2">{app.category}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{app.description}</div>
                        {app.tags && (
                          <div className="flex flex-wrap justify-center gap-1">
                            {app.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-sky-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] text-black dark:text-slate-400">
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

      {/* 詳情 Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className={`relative max-w-md w-full mx-4 rounded-2xl shadow-2xl p-6 ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
            <button type="button" onClick={() => setSelectedApp(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 text-sm">✕</button>
            <div className="flex flex-col items-center text-center">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-slate-800" : "bg-indigo-50"} overflow-hidden`}>
                {renderIcon(selectedApp.icon, selectedApp.name)}
              </div>
              <h2 className="text-lg font-semibold mb-1">{selectedApp.name}</h2>
              <div className="text-xs text-indigo-500 mb-3">{selectedApp.category}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{selectedApp.description}</p>
              <a
                href={selectedApp.href}
                target={selectedApp.href.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 shadow hover:bg-indigo-700 transition-colors w-full mb-2"
              >
                立即前往工具
              </a>
              <button type="button" onClick={() => setSelectedApp(null)} className="text-xs text-slate-400 hover:text-slate-200 mt-1">
                下次再說，先關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增應用 Modal（只有 Admin；加到 catalog 草稿） */}
      {isAdmin && createOpen && (
        <CreateAppModal
          categories={catalog.categories}
          onClose={() => setCreateOpen(false)}
          onCreate={(app) => {
            setCatalog(prev => ({ ...prev, apps: [...prev.apps, app] }));
            setCreateOpen(false);
            showToast("已新增（公開草稿）");
          }}
        />
      )}

      {/* 收藏提示 */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`rounded-xl px-3 py-2 text-xs shadow-lg flex items中心 gap-2 ${
            isDark ? "bg-slate-900/95 border border-slate-700 text-slate-100" : "bg-white border border-slate-200 text-slate-700"}`}>
            <span>⭐</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/** ========= 圖示渲染：emoji / 路徑 / http(s) / data:image ========= */
function renderIcon(icon: string, alt = "") {
  const isImage =
    typeof icon === "string" &&
    (icon.startsWith("/images/") || icon.startsWith("http") || icon.startsWith("data:image"));
  if (isImage) return <img src={icon} alt={alt} className="h-full w-full object-contain" loading="lazy" />;
  return <span className="text-2xl">{icon}</span>;
}

/** ========= 新增應用 Modal（Admin 專用） ========= */
function CreateAppModal({
  onClose,
  onCreate,
  categories,
}: {
  onClose: () => void;
  onCreate: (app: App) => void;
  categories: Category[];
}) {
  const [name, setName] = React.useState("");
  const [href, setHref] = React.useState("");
  const [icon, setIcon] = React.useState("🧩");
  const [category, setCategory] = React.useState<Category>(categories[0] || "AI智能體");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [preview, setPreview] = React.useState<string | null>(null);

  const canSave = name.trim() && href.trim();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert("請選擇圖片檔");
    if (f.size > 1024 * 1024 * 2) return alert("圖片大小請小於 2MB");
    const dataUrl = await fileToDataUrl(f);
    setIcon(dataUrl);
    setPreview(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">新增應用</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">
            名稱
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="例如：我的工具"
                   value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="text-sm">
            連結（URL）
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="https://example.com"
                   value={href} onChange={(e) => setHref(e.target.value)} />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm">
              圖示（文字路徑或 emoji）
              <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                     placeholder="🧩 或 /images/myicon.png 或 https://..."
                     value={icon}
                     onChange={(e) => { setIcon(e.target.value); setPreview(null); }} />
            </label>

            <label className="text-sm">
              或直接上傳圖片
              <input type="file" accept="image/*"
                     className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                     onChange={onFileChange} />
            </label>
          </div>

        {(preview || icon.startsWith("data:image")) && (
          <div className="mt-1">
            <div className="text-xs text-slate-500 mb-1">預覽：</div>
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <img src={preview || icon} alt="預覽" className="h-full w-full object-contain" />
            </div>
          </div>
        )}

          <label className="text-sm">
            分類
            <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>

          <label className="text-sm">
            簡介
            <textarea className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3}
                      placeholder="這個工具可以幫你做什麼？"
                      value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label className="text-sm">
            標籤（以逗號分隔）
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                   placeholder="例如：中文, 高效率"
                   value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">取消</button>
          <button
            disabled={!canSave}
            onClick={() =>
              onCreate({
                name: name.trim(),
                href: href.trim(),
                icon: icon.trim() || "🧩",
                category,
                description: description.trim(),
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
              })
            }
            className={`rounded-lg px-4 py-2 text-sm text白 ${canSave ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"}`}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}

/** ========= 小工具：File → DataURL(base64) ========= */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("讀取檔案失敗"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export default AppLauncherDemo;
