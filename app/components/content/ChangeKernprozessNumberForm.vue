<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  schrittCount: number | undefined;
}>();

const emit = defineEmits(["cancle", "send"]);

const STEPS = 1;
const currentStep = ref(0);

function nextStep() {
  if (currentStep.value < STEPS - 1) currentStep.value++;
  else currentStep.value = 0;
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--;
  else currentStep.value = STEPS - 1;
}

const schrittCountRef: Ref<number> = ref(props.schrittCount || 1);

async function postForm() {
  if (
    !confirm("Sind Sie sicher, dass sie diesen Kernprozess verändern möchten?")
  )
    return;

  const data = {
    schrittCount: schrittCountRef.value,
  };

  emit("send", data);
}
</script>

<template>
  <div class="relative h-[80vh] max-w-xl mx-auto flex flex-col overflow-hidden">
    <div class="flex flex-1 min-h-0">
      <div>
        <UButton icon="i-heroicons-chevron-left" @click="prevStep" />
      </div>

      <div class="flex-1 h-full overflow-y-auto px-3">
        <div v-if="currentStep === 0">
          <h1 class="mb-8 text-xl font-semibold text-center">Schritt</h1>

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

      <div>
        <UButton icon="i-heroicons-chevron-right" @click="nextStep" />
      </div>
    </div>

    <div class="flex justify-around p-4 border-t">
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-check"
        @click="postForm"
      >
        Ändern
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
<style scoped></style>
