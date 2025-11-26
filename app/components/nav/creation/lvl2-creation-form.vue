<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const emit = defineEmits(["add"]);

const subMenuName = ref("");
const subMenuError = ref("");

watch(subMenuName, () => {
  subMenuError.value = validateUsername(subMenuName.value);
});

async function add() {
  if (!confirm("Sind Sie sicher, dass sie diesen Menupunkt hinzufügen wollen?"))
    return;

  emit("add", subMenuName.value);
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <UForm class="space-y-5">
      <div>
        <h1 class="mb-4 text-xl font-semibold">Untermenu</h1>

        <UInput
          v-model="subMenuName"
          placeholder="Untermenu"
          type="text"
          size="xl"
          class="w-full"
        />
        <p v-if="subMenuError" class="text-red-500 mt-2 font-medium min-h-1">
          {{ subMenuError }}
        </p>
      </div>

      <div class="flex gap-5">
        <UButton
          color="primary"
          size="xl"
          variant="solid"
          type="submit"
          block
          icon="i-heroicons-lock-closed"
          class="cursor-pointer"
          :disabled="subMenuError !== '' || subMenuName === ''"
          @click.prevent="add"
        >
          Hinzufügen
        </UButton>
      </div>
    </UForm>
  </div>
</template>
