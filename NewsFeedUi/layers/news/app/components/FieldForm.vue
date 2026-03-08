<template>
  <div class="field-form">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      v-if="type !== 'textarea'"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      class="input"
      v-bind="$attrs"
      @input="handleInput"
    />
    <textarea
      v-else
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      class="textarea"
      v-bind="$attrs"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    required?: boolean;
    type?: "text" | "number" | "url" | "textarea";
    modelValue?: string | number | null;
    placeholder?: string;
    rows?: number;
  }>(),
  {
    label: "",
    type: "text",
    required: false,
    rows: 3,
    placeholder: "",
    modelValue: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value =
    props.type === "number"
      ? target.value === ""
        ? null
        : Number(target.value)
      : target.value;

  emit("update:modelValue", value);
};
</script>

<style scoped>
.field-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.required {
  color: #e53e3e;
}

.input,
.textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #667eea;
}

.textarea {
  resize: vertical;
  min-height: 120px;
}
</style>
