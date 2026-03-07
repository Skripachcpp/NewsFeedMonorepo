import type { Ref } from "vue";
import { ref } from "vue";
import type { ArticleUpdateRequest } from "@news-feed/shared";
import { parseTags, errorToStrings } from "@news-feed/shared";
import { api } from "../api";

export function useUpdateArticle(article: Ref<ArticleUpdateRequest | undefined>) {
  const errors = ref<string[]>();
  const articleTagsInput = ref("");
  const updateProcessed = ref(false);
  const updatedArticleId = ref<number>();

  async function save() {
    if (updateProcessed.value) return;
    const current = article.value;
    if (!current) return;
    errors.value = undefined;
    updatedArticleId.value = undefined;
    const parsedTags = parseTags(articleTagsInput.value);
    updateProcessed.value = true;
    try {
      const res = await api.updateArticle({
        id: current.id,
        title: current.title,
        content: current.content,
        summary: current.summary,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      });
      updatedArticleId.value = res.id;
    } catch (err) {
      errors.value = errorToStrings(err);
    } finally {
      updateProcessed.value = false;
    }
  }

  return {
    errors,
    articleTagsInput,
    updateProcessed,
    updatedArticleId,
    create: save,
  };
}
