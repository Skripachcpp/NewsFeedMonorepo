import type { Ref } from "vue";
import { ref } from "vue";
import type { TagDto } from "@news-feed/shared";
import { errorToString } from "@news-feed/shared";
import { api } from "../api";

export function useDeleteTags(tags: Ref<TagDto[] | null>) {
  const tagToDelete = ref<{ id: number; name: string }>();
  const deletingId = ref<number>();
  const deleteError = ref<string>();

  async function confirmDelete() {
    if (!tagToDelete.value) return;
    const { id } = tagToDelete.value;
    deleteError.value = undefined;
    try {
      deletingId.value = id;
      await api.deleteTag(id);
      if (tags.value) {
        tags.value = tags.value.filter((tag: TagDto) => tag.id !== id);
      }
      tagToDelete.value = undefined;
    } catch (err) {
      deleteError.value = errorToString(err);
    } finally {
      deletingId.value = undefined;
    }
  }

  return { deletingId, deleteError, tagToDelete, confirmDelete };
}
