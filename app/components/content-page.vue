<script setup lang="ts">
import { marked } from "marked";
import { onMounted, ref, watch } from "vue";

const { user } = useUserSession();

const emit = defineEmits<{
  (e: "update-note", note: string): void;
}>();

const props = defineProps<{ note: string }>();
const note = ref(props.note);

const isEditing = ref(note.value === "");
const render = useTemplateRef("render");

watch(isEditing, async () => {
  if (!isEditing.value && render.value) {
    render.value!.innerHTML = await marked.parse(note.value ?? "");
  }
});

watch(
  () => props.note,
  async (newVal) => {
    note.value = newVal;
    if (render.value) {
      render.value.innerHTML = await marked.parse(newVal ?? "");
    }
  },
);

onMounted(async () => {
  render.value!.innerHTML = await marked.parse(note.value ?? "");
});

function send() {
  if (
    confirm(
      "Sind Sie sicher, dass sie die aktuelle Datei überschreiben möchten?",
    )
  ) {
    emit("update-note", note.value!);
    isEditing.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="user && user.role === 'admin'" class="relative">
      <button
        v-if="!isEditing"
        class="absolute mr-10 right-0 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded"
        @click.prevent="isEditing = true"
      >
        BEARBEITEN
      </button>

      <button
        v-if="isEditing"
        class="absolute mr-10 right-0 bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded"
        @click="send()"
      >
        FERTIG
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
