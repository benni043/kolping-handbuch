<script setup lang="ts">
import { ref, watch } from "vue";
import { marked } from "marked";

const note = defineModel<string>("note");
const isEditing = ref(note.value === "");
const render = useTemplateRef("render");

watch(isEditing, async () => {
  if (!isEditing.value && render.value) {
    render.value!.innerHTML = await marked.parse(note.value ?? "");
  }
});

onMounted(async () => {
  render.value!.innerHTML = await marked.parse(note.value ?? "");
});
</script>

<template>
  <div>
    <div>
      <button
        class="absolute mr-10 right-0"
        @click.prevent="isEditing = !isEditing"
      >
        <span v-if="isEditing">editing</span>
        <span v-if="!isEditing">md</span>
      </button>
    </div>

    <div class="ml-20 mr-60 lg:mr-100 xl:mr-150">
      <textarea
        v-if="isEditing"
        v-model="note"
        data-testid="note-input"
        class="w-full h-[100vh] rounded border-1 pl-1"
      />

      <div ref="render" class="markdown test" :hidden="isEditing"></div>
    </div>
  </div>
</template>

<style>
@reference "~/assets/css/main.css";

.markdown {
  h1 {
    @apply mt-6 mb-4 text-3xl leading-tight font-bold;
  }

  h2 {
    @apply mt-6 mb-3 text-2xl leading-snug font-semibold text-[#F18700];
  }

  h3 {
    @apply mt-5 mb-2 text-xl leading-snug font-semibold;
  }

  h4 {
    @apply mt-4 mb-2 text-lg font-medium;
  }

  p {
    @apply mb-4 text-base leading-relaxed;
  }

  ul {
    @apply list-disc pl-6;
  }

  ol {
    @apply list-decimal pl-6;
  }

  li {
    @apply mb-1;
  }

  li::marker {
    @apply text-[#F18700];
  }

  hr {
    @apply my-6 border-t-4 border-dotted text-gray-400;
  }
}
</style>
