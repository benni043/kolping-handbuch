<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  schrittCount: number | undefined;
}>();

const emit = defineEmits(["cancle", "send"]);

const schrittCountRef: Ref<number> = ref(props.schrittCount || 1);

async function postForm() {
  if (
    !confirm("Sind Sie sicher, dass sie diesen Kernprozess verändern möchten?")
  )
    return;

  emit("send", schrittCountRef.value);
}
</script>

<template>
  <div class="relative max-w-xl mx-auto flex flex-col overflow-hidden">
    <div class="flex flex-1 min-h-0">
      <div class="flex-1 h-full overflow-y-auto px-3">
        <h1 class="mb-8 text-xl font-semibold text-center">
          Aktuelle Nummer: {{ schrittCount }}
        </h1>

        <UInput
          v-model="schrittCountRef"
          placeholder="Schritt"
          type="number"
          icon="i-heroicons-document-plus"
          size="lg"
          class="w-full"
          min="1"
        />
      </div>
    </div>

    <div class="flex justify-around p-4">
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-check"
        class="cursor-pointer"
        @click="postForm"
      >
        Ändern
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
<style scoped></style>
