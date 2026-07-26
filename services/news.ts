import type { NewsItem } from "@/lib/types/news";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const newsService = {
  /**
   * Fetches news articles from the CMS API.
   * If the CMS API fails (because the backend news module is not yet integrated),
   * it falls back to loading local static JSON dictionaries from the public folder.
   */
  async getNews(locale: string = "en"): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${BASE_URL}/news?lang=${locale}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error("Failed to fetch news from API");
      }

      const resJson = await response.json();
      return resJson.data || resJson;
    } catch (error) {
      console.warn(`CMS API /news failed. Loading local static news fallback for ${locale}.`);
      
      try {
        const filePath = path.join(process.cwd(), "public", "data", `news_${locale}.json`);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          return JSON.parse(fileContent);
        }
      } catch (fsError) {
        console.error("Failed to read local news JSON file:", fsError);
      }
      
      return [];
    }
  },

  async getNewsById(id: string, locale: string = "en"): Promise<NewsItem | null> {
    try {
      const response = await fetch(`${BASE_URL}/news/${id}?lang=${locale}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch article ${id} from API`);
      }

      const resJson = await response.json();
      return resJson.data || resJson;
    } catch (error) {
      console.warn(`CMS API /news/${id} failed. Loading local static news details for ${locale}.`);
      
      try {
        const filePath = path.join(process.cwd(), "public", "data", `news_${locale}.json`);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const newsList: NewsItem[] = JSON.parse(fileContent);
          return newsList.find((item) => item.id === id) || null;
        }
      } catch (fsError) {
        console.error("Failed to read local news JSON file:", fsError);
      }
      
      return null;
    }
  },
};
