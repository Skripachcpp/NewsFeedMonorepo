import {
  NewsService,
  TagsService,
  OpenAPI,
  type NewsArticleDto,
  type PageDtoOfNewsArticleDto,
  type ArticleCreateRequest,
  type ArticleUpdateRequest,
  type TagDto,
} from "~/api/generated";
import { useAuth } from "./useAuth";

export const useApi = () => {
  const config = useRuntimeConfig();
  if (config.public.apiBaseUrl) {
    OpenAPI.BASE = config.public.apiBaseUrl;
  }

  const auth = useAuth();
  OpenAPI.TOKEN = async () => auth.token.value ?? "";

  const getArticles = async (
    params?: { offset?: number; count?: number },
  ): Promise<PageDtoOfNewsArticleDto> => {
    return await NewsService.newsGetArticles(params?.offset, params?.count);
  };

  const getArticle = async (id: number): Promise<NewsArticleDto> => {
    return await NewsService.newsGetArticle(id);
  };

  const createArticle = async (
    requestBody: ArticleCreateRequest,
  ): Promise<NewsArticleDto> => {
    return await NewsService.newsCreateArticle(requestBody);
  };

  const updateArticle = async (
    requestBody: ArticleUpdateRequest,
  ): Promise<NewsArticleDto> => {
    return await NewsService.newsUpdateArticle(requestBody);
  };

  const deleteArticle = async (id: number): Promise<void> => {
    await NewsService.newsDeleteArticle(id);
  };

  const getTags = async (): Promise<TagDto[]> => {
    return await TagsService.tagsGetTags();
  };

  const deleteTag = async (id: number): Promise<void> => {
    await TagsService.tagsDeleteTag(id);
  };

  return {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    getTags,
    deleteTag,
  };
};
