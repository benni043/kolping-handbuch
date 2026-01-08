<script setup lang="ts">
import {
  FILE_ERROR_MSG,
  FOLDER_ERROR_MSG,
  validateFolder,
} from "~~/shared/utils/checks";

const emit = defineEmits(["rename"]);

const props = defineProps<{
  isFolder: boolean;
  oldName: string;
}>();

const folder = ref(props.oldName);
const folderError = ref("");

watch(folder, () => {
  folderError.value = validateFolder(folder.value)
    ? ""
    : props.isFolder
      ? FOLDER_ERROR_MSG
      : FILE_ERROR_MSG;
});

async function rename() {
  const folderMsg =
    "Sind Sie sicher, dass sie diesen Ordner umbenennen wollen?";

  const fileMsg = "Sind Sie sicher, dass sie diese Datei umbenennen wollen?";

  if (!confirm(props.isFolder ? folderMsg : fileMsg)) return;

  emit("rename", folder.value);
}
</script>

<template>
  <div>
    <UForm class="space-y-5 flex flex-col">
      <h1 class="mb-4 text-xl font-semibold">
        {{ isFolder ? "Ordnername" : "Dateiname" }}
      </h1>

      <UInput
        v-model="folder"
        :placeholder="isFolder ? 'Ordnername' : 'Dateiname'"
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
        icon="i-heroicons-check"
        class="cursor-pointer"
        :disabled="folderError !== '' || folder === ''"
        @click.prevent="rename"
      >
        Umbenennen
      </UButton>
    </UForm>
  </div>
</template>
