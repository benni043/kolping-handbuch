<script setup lang="ts">
import { ref, watch } from "vue";
import { marked } from "marked";
import { useRoute } from "#imports";

const route = useRoute();

const url = computed(() => {
  return `/api/files/${route.params.path}/${route.params.subPath}/${route.params.page}.md`;
});

const { data } = await useFetch(url);

const content = computed(() => data.value);

const note = defineModel<string>("note");

const isEditing = ref(note.value === "");
const render = useTemplateRef("render");

watch(isEditing, async () => {
  if (!isEditing.value) {
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

<style scoped></style>
