import { ref } from "vue";
import type { ArticleCreateRequest } from "@news-feed/shared";
import { parseTags, errorToStrings } from "@news-feed/shared";
import { api } from "../api";

export function useCreateArticle() {
  const errors = ref<string[] | undefined>();
  const createdArticleSuccess = ref(false);
  const createdArticleId = ref<number>();
  const defaultArticle = (): ArticleCreateRequest => ({
    title: "",
    content: "",
    summary: null,
    tags: [],
  });
  const article = ref<ArticleCreateRequest>(defaultArticle());
  const tagsInput = ref("");
  const createdProcessing = ref(false);

  async function create() {
    if (createdProcessing.value) return;
    createdArticleSuccess.value = false;
    errors.value = undefined;
    createdArticleId.value = undefined;
    const parsedTags = parseTags(tagsInput.value);
    createdProcessing.value = true;
    try {
      const articleNew = await api.createArticle({
        title: article.value.title,
        content: article.value.content,
        summary: article.value.summary,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      });
      article.value = defaultArticle();
      tagsInput.value = "";
      createdArticleSuccess.value = true;
      createdArticleId.value = articleNew.id;
    } catch (err) {
      errors.value = errorToStrings(err);
    } finally {
      createdProcessing.value = false;
    }
  }

  return {
    errors,
    article,
    tagsInput,
    createdArticleSuccess,
    createdArticleId,
    createdProcessing,
    create,
  };
}
