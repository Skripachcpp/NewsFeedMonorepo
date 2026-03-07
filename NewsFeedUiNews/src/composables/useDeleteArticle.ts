import type { Ref } from "vue";
import { ref } from "vue";
import type { NewsArticleDto } from "@news-feed/shared";
import { api } from "../api";

export function useDeleteArticle(articles: Ref<NewsArticleDto[] | null>) {
  const deleteArticleId = ref<number>();

  async function confirmDeleteArticle() {
    if (deleteArticleId.value == null) return;
    await api.deleteArticle(deleteArticleId.value);
    if (articles.value) {
      articles.value = articles.value.filter((it: NewsArticleDto) => it.id !== deleteArticleId.value);
    }
    deleteArticleId.value = undefined;
  }

  return { deleteArticleId, confirmDeleteArticle };
}
