<script setup lang="ts">
import { FOLDER_ERROR_MSG, validateFolder } from "~~/shared/utils/checks";

const folder = ref("");
const folderError = ref("");

const emit = defineEmits(["rename"]);

watch(folder, () => {
  folderError.value = validateFolder(folder.value) ? "" : FOLDER_ERROR_MSG;
});

async function rename() {
  if (!confirm("Sind Sie sicher, dass sie diesen Ordner umbenennen wollen?"))
    return;

  emit("rename", folder.value);
}
</script>

<template>
  <div>
    <UForm class="space-y-5 flex flex-col">
      <h1 class="mb-4 text-xl font-semibold">Ordnername</h1>

      <UInput
        v-model="folder"
        placeholder="Ordnername"
        type="text"
        size="xl"
        class="w-full"
      />
      <div v-if="folderError" class="text-red-500 font-medium">
        {{ folderError }}
      </div>

      <UButton
        color="primary"
        size="xl"
        variant="solid"
        type="submit"
        block
        icon="i-heroicons-lock-closed"
        class="cursor-pointer"
        :disabled="folderError !== '' || folder === ''"
        @click.prevent="rename"
      >
        Umbenennen
      </UButton>
    </UForm>
  </div>
</template>
