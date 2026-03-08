import type { ArticleUpdateRequest } from "~/api/generated";
import { useApi } from "~/api/useApi";
import { parseTags } from "~/utils/tags";
import { errorToStrings } from "~/utils/error";

export function useUpdateArticle(article: Ref<ArticleUpdateRequest | undefined>) {
  const api = useApi();

  const errors = ref<string[]>();

  const articleTagsInput = ref("");

  let updateProcessed = ref(false);
  const updatedArticleId = ref<number>();

  let create = async () => {
    if (updateProcessed.value) return;

    const current = article.value;
    if (!current) return;

    errors.value = undefined;
    updatedArticleId.value = undefined;

    let parsedTags = parseTags(articleTagsInput.value);

    await api
      .updateArticle({
        id: current.id,
        title: current.title,
        content: current.content,
        summary: current.summary,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      })
      .then((articleNew) => {
        updatedArticleId.value = articleNew.id;
      })
      .catch((err: any) => {
        errors.value = errorToStrings(err);
      })
      .finally(() => {
        updateProcessed.value = false;
      });
  };

  return {
    errors,
    article,
    articleTagsInput,
    updateProcessed,
    updatedArticleId,
    create,
  };
}
