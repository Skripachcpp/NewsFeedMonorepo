import type { TagDto } from "~/api/generated";
import { useApi } from "~/api/useApi";
import { errorToString } from "~/utils/error";

export function useDeleteTags(tags: Ref<TagDto[]>) {
  const api = useApi();

  const tagToDelete = ref<{ id: number; name: string }>();
  const deletingId = ref<number>();
  const deleteError = ref<string>();

  const confirmDelete = async () => {
    if (!tagToDelete.value) return;

    const { id } = tagToDelete.value;
    deleteError.value = undefined;

    try {
      deletingId.value = id;
      await api.deleteTag(id);
      if (tags.value) {
        tags.value = tags.value.filter((tag) => tag.id !== id);
      }

      tagToDelete.value = undefined;
    } catch (err: any) {
      deleteError.value = errorToString(err);
    } finally {
      deletingId.value = undefined;
    }
  };

  return {
    deletingId,
    deleteError,
    tagToDelete,
    confirmDelete,
  };
}
