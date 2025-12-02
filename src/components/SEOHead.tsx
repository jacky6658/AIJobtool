import React from "react";
import { SchemaGenerator, DEFAULT_FAQ_QUESTIONS } from "../utils/schemaGenerator";

/**
 * SEO Head 組件
 * 用於動態更新頁面的 meta 標籤和結構化資料
 * 支援平台論壇導向的 Schema 優化
 */
interface SEOHeadProps {
  title?: string;
  description?: string;
  currentPage?: "home" | "tools";
  category?: string; // 當前分類，用於設置分享連結的錨點
  tools?: Array<{ // 工具列表（用於分類頁面）
    name: string;
    description: string;
    category: string;
    tags?: string[];
    url?: string;
    logo?: string;
  }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title = "AIJob 自動化學院 - AI 工具庫與自動化教學",
  description = "AIJob 自動化學院專注於 AI 與自動化技術教學，提供 AI 工具庫、n8n 自動化課程、LINE 社群、Discord 社群等資源，從零打造你的工作流效率。",
  currentPage = "home",
  category,
  tools = []
}) => {
  const siteUrl = "https://aitools.aijob.com.tw";
  const imageUrl = "https://static.wixstatic.com/media/9705bb_dd62dc9b5ff6496a9a9560ca516f9851~mv2.png";

  React.useEffect(() => {
    // 初始化 Schema 生成器
    const schemaGenerator = new SchemaGenerator({
      siteUrl,
      organizationName: "AIJob 自動化學院",
      organizationLogo: imageUrl,
      organizationUrl: siteUrl
    });
    // 動態更新 document.title
    document.title = title;
    
    // 動態更新 meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 更新 Open Graph
    const updateOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOGMeta('og:title', title);
    updateOGMeta('og:description', description);
    // 根據當前分類設置分享連結的錨點
    // 如果有分類且是工具頁面，則指向該分類；否則指向首頁
    const shareUrl = category && currentPage === "tools" 
      ? `${siteUrl}/#category=${encodeURIComponent(category)}`
      : siteUrl;
    updateOGMeta('og:url', shareUrl);

    // 更新 Twitter Card
    const updateTwitterMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateTwitterMeta('twitter:title', title);
    updateTwitterMeta('twitter:description', description);

    // 使用 Schema 生成器生成結構化資料
    
    // 1. WebSite 結構化資料（增強版 - 平台論壇特性）
    const websiteStructuredData = schemaGenerator.generateWebSiteSchema(description);
    SchemaGenerator.injectSchema(websiteStructuredData, "website");

    // 2. EducationalOrganization 結構化資料（增強版 - 社群特性）
    const organizationStructuredData = schemaGenerator.generateOrganizationSchema(description);
    SchemaGenerator.injectSchema(organizationStructuredData, "organization");

    // 3. FAQPage Schema（首頁 - GEO 強化）
    if (currentPage === "home") {
      const faqSchema = schemaGenerator.generateFAQSchema(DEFAULT_FAQ_QUESTIONS);
      SchemaGenerator.injectSchema(faqSchema, "faq");
    } else {
      SchemaGenerator.removeSchema("faq");
    }

    // 4. BreadcrumbList Schema（分類頁面和工具頁面）
    if (currentPage === "tools" && category) {
      const breadcrumbSchema = schemaGenerator.generateBreadcrumbSchema([category]);
      SchemaGenerator.injectSchema(breadcrumbSchema, "breadcrumb");
    } else if (currentPage === "tools") {
      const breadcrumbSchema = schemaGenerator.generateBreadcrumbSchema(["tools"]);
      SchemaGenerator.injectSchema(breadcrumbSchema, "breadcrumb");
    } else {
      SchemaGenerator.removeSchema("breadcrumb");
    }

    // 5. ItemList Schema（分類頁面）
    if (currentPage === "tools" && category && tools.length > 0) {
      const categoryTools = tools.filter(tool => tool.category === category);
      if (categoryTools.length > 0) {
        const itemListSchema = schemaGenerator.generateCategoryItemListSchema(category, categoryTools);
        SchemaGenerator.injectSchema(itemListSchema, "category-itemlist");
      }
    } else {
      SchemaGenerator.removeSchema("category-itemlist");
    }
  }, [title, description, currentPage, category, tools]);

  return null; // 此組件不渲染任何內容
};

