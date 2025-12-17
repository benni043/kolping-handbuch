<script setup lang="ts">
const folder = ref("");
const folderError = ref("");

watch(folder, () => {
  folderError.value = validateUsername(folder.value) ? "" : USERNAME_ERROR_MSG;
});

async function add() {
  if (!confirm("Sind Sie sicher, dass sie diesen Ordner hinzufügen wollen?"))
    return;

  emit("add", folder.value);
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
        @click.prevent="add"
      >
        Hinzufügen
      </UButton>
    </UForm>
  </div>
</template>
