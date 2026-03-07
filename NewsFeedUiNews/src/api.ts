import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getTags,
  deleteTag,
} from "@news-feed/shared";
import type { NewsArticleDto, ArticleCreateRequest, ArticleUpdateRequest, TagDto } from "@news-feed/shared";

export const api = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getTags,
  deleteTag,
};

export type { NewsArticleDto, ArticleCreateRequest, ArticleUpdateRequest, TagDto };
