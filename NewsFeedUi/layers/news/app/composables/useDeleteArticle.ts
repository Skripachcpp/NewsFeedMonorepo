import type { NewsArticleDto } from "~/api/generated";
import { useApi } from "~/api/useApi";

export function useDeleteArticle(articles: Ref<NewsArticleDto[]>) {
  const api = useApi();

  let deleteArticleId = ref<number>();

  let confirmDeleteArticle = async () => {
    if (deleteArticleId.value == null) return;

    await api.deleteArticle(deleteArticleId.value);
    if (articles.value) {
      articles.value = articles.value.filter((it) => it.id != deleteArticleId.value);
    }
    deleteArticleId.value = undefined;
  };

  return {
    deleteArticleId,
    confirmDeleteArticle,
  };
}
