/**
 * Schema 生成工具
 * 用於生成各種類型的 Schema.org 結構化資料
 * 針對平台論壇導向的 AI 工具庫優化
 */

export interface Tool {
  name: string;
  description: string;
  category: string;
  tags?: string[];
  url?: string;
  logo?: string;
  rating?: number;
  reviewCount?: number;
}

export interface SchemaGeneratorConfig {
  siteUrl: string;
  organizationName: string;
  organizationLogo: string;
  organizationUrl?: string;
}

/**
 * Schema 生成器類別
 */
export class SchemaGenerator {
  private config: SchemaGeneratorConfig;

  constructor(config: SchemaGeneratorConfig) {
    this.config = config;
  }

  /**
   * 生成增強版的 WebSite Schema（平台論壇特性）
   */
  generateWebSiteSchema(description: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AIJob AI工具庫",
      "alternateName": ["AIJob 自動化學院", "AIJob Tools Forum"],
      "url": this.config.siteUrl,
      "description": description || "免費 AI 工具集合平台與社群論壇，提供 AI 工具推薦、使用教學、社群討論、專家解答等服務。",
      "inLanguage": "zh-Hant",
      "isAccessibleForFree": true,
      "keywords": "AI工具,自動化,AI教學,n8n,LINE自動化,AI員工,AI對話,AIJob,自動化學院,GPT,ChatGPT,Gemini,Manus,Cursor,StackBlitz,Codesandbox,OpenAI,Google AI,AI程式編輯器,AI工具推薦,免費AI工具,AI工具庫",
      "audience": {
        "@type": "Audience",
        "audienceType": "AI工具使用者、開發者、設計師、行銷人員"
      },
      "about": {
        "@type": "Thing",
        "name": "AI工具推薦與討論平台",
        "description": "專注於 AI 工具收集、評測、教學和社群討論的平台"
      },
      "sameAs": [
        "https://www.aijob.com.tw/",
        "https://www.instagram.com/aijobschool/",
        "https://youtube.com/@aijobschool",
        "https://discord.gg/Dzm2P7rHyg",
        "https://lin.ee/ZTgJbYG"
      ],
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName,
        "logo": {
          "@type": "ImageObject",
          "url": this.config.organizationLogo,
          "width": 512,
          "height": 512
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${this.config.siteUrl}/#search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  /**
   * 生成增強版的 EducationalOrganization Schema（社群特性）
   */
  generateOrganizationSchema(description: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": this.config.organizationName,
      "alternateName": this.config.organizationName,
      "url": this.config.siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": this.config.organizationLogo,
        "width": 512,
        "height": 512
      },
      "description": description || "AI 工具推薦平台與自動化教學社群，提供 AI 工具庫、n8n 自動化課程、社群討論、專家解答等服務。",
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "學生、開發者、設計師、行銷人員、AI工具使用者"
      },
      "knowsAbout": [
        "AI工具",
        "自動化技術",
        "n8n",
        "LINE自動化",
        "AI教學"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Taiwan"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "TW",
        "addressRegion": "台北市",
        "addressLocality": "內湖區",
        "streetAddress": "康寧路三段之7號3樓",
        "postalCode": "114" // 內湖區郵遞區號（可選，但建議填寫以消除警告）
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+886-02-6605-7111",
        "contactType": "customer service",
        "email": "aiagentg888@gmail.com",
        "areaServed": "TW",
        "availableLanguage": ["zh-Hant", "zh-TW"]
      },
      "sameAs": [
        "https://www.aijob.com.tw/",
        "https://www.instagram.com/aijobschool/",
        "https://youtube.com/@aijobschool",
        "https://discord.gg/Dzm2P7rHyg",
        "https://lin.ee/ZTgJbYG"
      ],
      "offers": [
        {
          "@type": "Offer",
          "name": "n8n 行銷 AI 自動化課程",
          "url": "https://onsell.aijob.com.tw",
          "priceCurrency": "TWD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "免費 AI 工具庫",
          "url": this.config.siteUrl,
          "price": "0",
          "priceCurrency": "TWD",
          "availability": "https://schema.org/InStock"
        }
      ]
    };
  }

  /**
   * 生成 FAQPage Schema（GEO 強化）
   */
  generateFAQSchema(questions: Array<{ question: string; answer: string }>): object {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }

  /**
   * 生成 QAPage Schema（論壇問答）
   */
  generateQAPageSchema(qa: {
    question: string;
    questionAuthor?: string;
    acceptedAnswer: string;
    answerAuthor?: string;
    answerCount?: number;
    upvoteCount?: number;
    dateCreated?: string;
    suggestedAnswers?: Array<{
      text: string;
      author?: string;
      dateCreated?: string;
      upvoteCount?: number;
    }>;
  }): object {
    return {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": qa.question,
        "text": qa.question,
        ...(qa.answerCount !== undefined && { "answerCount": qa.answerCount }),
        ...(qa.upvoteCount !== undefined && { "upvoteCount": qa.upvoteCount }),
        ...(qa.dateCreated && { "dateCreated": qa.dateCreated }),
        ...(qa.questionAuthor && {
          "author": {
            "@type": "Person",
            "name": qa.questionAuthor
          }
        }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.acceptedAnswer,
          ...(qa.answerAuthor && {
            "author": {
              "@type": "Person",
              "name": qa.answerAuthor
            }
          }),
          ...(qa.dateCreated && { "dateCreated": qa.dateCreated })
        },
        ...(qa.suggestedAnswers && qa.suggestedAnswers.length > 0 && {
          "suggestedAnswer": qa.suggestedAnswers.map((suggested) => ({
            "@type": "Answer",
            "text": suggested.text,
            ...(suggested.author && {
              "author": {
                "@type": "Person",
                "name": suggested.author
              }
            }),
            ...(suggested.dateCreated && { "dateCreated": suggested.dateCreated }),
            ...(suggested.upvoteCount !== undefined && { "upvoteCount": suggested.upvoteCount })
          }))
        })
      }
    };
  }

  /**
   * 生成工具的 SoftwareApplication Schema
   */
  generateToolSchema(tool: Tool): object {
    const toolUrl = tool.url || `${this.config.siteUrl}/#tool=${encodeURIComponent(tool.name)}`;
    
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.name,
      "applicationCategory": "AI工具",
      "operatingSystem": "Web, iOS, Android",
      "description": tool.description,
      "url": toolUrl,
      ...(tool.logo && { "logo": tool.logo }),
      "softwareVersion": "最新版本",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "TWD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      },
      "category": tool.category,
      ...(tool.tags && tool.tags.length > 0 && { "keywords": tool.tags.join(", ") }),
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName,
        "url": this.config.siteUrl
      },
      "about": {
        "@type": "Thing",
        "name": tool.category,
        "description": `屬於 ${tool.category} 分類的 AI 工具`
      }
    };

    // 如果有評分資料，加入 AggregateRating
    if (tool.rating !== undefined && tool.reviewCount !== undefined) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": tool.rating.toString(),
        "ratingCount": tool.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    return schema;
  }

  /**
   * 生成分類頁面的 ItemList Schema
   */
  generateCategoryItemListSchema(category: string, tools: Tool[]): object {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${category} - AI工具列表`,
      "description": `AIJob AI工具庫中的 ${category} 分類，包含 ${tools.length} 個精選 AI 工具`,
      "url": `${this.config.siteUrl}/#category=${encodeURIComponent(category)}`,
      "numberOfItems": tools.length,
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "url": tool.url || `${this.config.siteUrl}/#tool=${encodeURIComponent(tool.name)}`,
          "applicationCategory": "AI工具",
          "category": category,
          ...(tool.rating !== undefined && tool.reviewCount !== undefined && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": tool.rating.toString(),
              "ratingCount": tool.reviewCount.toString()
            }
          })
        }
      })),
      "about": {
        "@type": "Thing",
        "name": category,
        "description": `${category} 類別的 AI 工具集合`
      },
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName
      }
    };
  }

  /**
   * 生成 BreadcrumbList Schema
   */
  generateBreadcrumbSchema(path: string[]): object {
    const baseUrl = this.config.siteUrl;
    
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首頁",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI工具庫",
        "item": `${baseUrl}/#tools`
      }
    ];

    path.forEach((segment, index) => {
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": segment,
        "item": `${baseUrl}/#${encodeURIComponent(segment)}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };
  }

  /**
   * 生成 Forum Schema（論壇主頁）
   */
  generateForumSchema(forumName: string, description: string, url: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "Forum",
      "name": forumName,
      "description": description,
      "url": url,
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName
      },
      "about": [
        {
          "@type": "Thing",
          "name": "AI工具推薦"
        },
        {
          "@type": "Thing",
          "name": "AI工具使用教學"
        },
        {
          "@type": "Thing",
          "name": "AI自動化討論"
        }
      ]
    };
  }

  /**
   * 生成 DiscussionForumPosting Schema（論壇貼文）
   */
  generateForumPostSchema(post: {
    title: string;
    content: string;
    author: string;
    category: string;
    replyCount?: number;
    viewCount?: number;
    datePublished: string;
    url: string;
  }): object {
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      "headline": post.title,
      "articleBody": post.content,
      "datePublished": post.datePublished,
      "dateModified": post.datePublished,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "about": {
        "@type": "Thing",
        "name": post.category
      },
      "url": post.url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": post.url
      }
    };

    // 添加互動統計
    const interactionStats: any[] = [];
    if (post.replyCount !== undefined) {
      interactionStats.push({
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": post.replyCount
      });
    }
    if (post.viewCount !== undefined) {
      interactionStats.push({
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": post.viewCount
      });
    }
    if (interactionStats.length > 0) {
      schema.interactionStatistic = interactionStats;
    }

    return schema;
  }

  /**
   * 注入 Schema 到頁面
   */
  static injectSchema(schema: object, schemaId: string): void {
    let script = document.querySelector(`script[data-schema="${schemaId}"]`);
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', schemaId);
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema, null, 2);
  }

  /**
   * 移除 Schema
   */
  static removeSchema(schemaId: string): void {
    const script = document.querySelector(`script[data-schema="${schemaId}"]`);
    if (script) {
      script.remove();
    }
  }
}

/**
 * 預設的 FAQ 問題列表
 */
export const DEFAULT_FAQ_QUESTIONS = [
  {
    question: "什麼是 AIJob AI工具庫？",
    answer: "AIJob AI工具庫是一個免費提供給大家使用的 AI 工具集合平台。我們精心收錄了市面上各種實用的 AI 工具與智能體，涵蓋 AI 員工、AI 對話、AI 寫程式工具、部署平台、AI 自動化工作流等多個分類，幫助你快速找到適合的工具，提升工作效率。"
  },
  {
    question: "AIJob AI工具庫有哪些分類？",
    answer: "AIJob AI工具庫包含以下分類：AI員工（如 ReelMind AI短影音智能體、AI人資招募智能體）、AI對話（如 GPT、ChatGPT、Gemini、Manus）、AI寫程式工具（如 Cursor、StackBlitz、Codesandbox）、部署平台、AI自動化、AI分身、AI文書等。每個分類都有精心挑選的實用工具，包括熱門的 GPT、ChatGPT、Gemini、Manus、Cursor 等。"
  },
  {
    question: "使用 AIJob AI工具庫需要付費嗎？",
    answer: "不需要。AIJob AI工具庫是完全免費提供給大家使用的平台。我們致力於推廣 AI 與自動化技術，幫助更多人提升工作效率。"
  },
  {
    question: "如何加入 AIJob 自動化學院？",
    answer: "您可以透過以下方式加入 AIJob 自動化學院：1) 加入 LINE 官方帳號：https://lin.ee/ZTgJbYG、2) 加入 LINE 社群、3) 加入 Discord 社群、4) 關注 Instagram。我們會定期分享 AI 工具使用技巧和自動化教學內容。"
  },
  {
    question: "AIJob 自動化學院提供哪些課程？",
    answer: "AIJob 自動化學院提供 n8n 行銷 AI 自動化課程，教授從零開始建立自動化工作流程。課程涵蓋 LINE 自動化、AI 整合、行銷自動化等實用內容。更多資訊請至：https://onsell.aijob.com.tw"
  },
  {
    question: "如何推薦新的 AI 工具到平台？",
    answer: "如果您發現好用的 AI 工具，可以透過 AIJob 社群（LINE、Discord）向我們推薦。我們會評估後將合適的工具加入工具庫，與大家分享。"
  }
];

