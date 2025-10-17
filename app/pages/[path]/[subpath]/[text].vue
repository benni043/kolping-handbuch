<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "#imports";
import { marked } from "marked";

const route = useRoute();
const content = ref();

const note = ref("");
const isEditing = ref(false);
const render = useTemplateRef("render");

const path = ref("");
const subPath = ref("");
const subSubPath = ref("");

async function loadFile() {
  const { data } = await useFetch(
    `/api/files/${path.value}/${subPath.value}/${subSubPath.value}`,
  );

  content.value = data.value;
}

watch(
  () => route.params,
  async (newFile) => {
    if (newFile) {
      if (route.params.text === "startpage") {
        const { data } = await useFetch("/api/files/startpage.md");

        content.value = data.value;
        return;
      }

      path.value = route.params.path as string;
      subPath.value = route.params.subpath as string;
      subSubPath.value = route.params.text as string;

      await loadFile();
    }
  },
  { immediate: true },
);

watchEffect(async () => {
  if (content.value) {
    note.value = content.value;

    if (render.value && !isEditing.value) {
      render.value.innerHTML = await marked.parse(note.value);
    }
  }
});

watch(isEditing, async () => {
  if (!isEditing.value && render.value) {
    render.value.innerHTML = await marked.parse(note.value);
  }
});
</script>

<template>
  <div class="flex gap-3">
    <span>Handbuch</span>
    <span>></span>
    <span>{{ path }}</span>
    <span>></span>
    <span>{{ subPath }}</span>
    <span>></span>
    <span>{{ subSubPath }}</span>
  </div>

  <div class="flex flex-col mr-[20vw]">
    <button @click.prevent="isEditing = !isEditing">
      <span v-if="isEditing">editing</span>
      <span v-if="!isEditing">md</span>
    </button>

    <div class="ml-[10vw] mr-[20vw]">
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
