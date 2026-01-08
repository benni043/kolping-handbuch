<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const emit = defineEmits(["add"]);

const subMenuName = ref("");
const subMenuError = ref("");

watch(subMenuName, () => {
  subMenuError.value = validateUsername(subMenuName.value)
    ? ""
    : USERNAME_ERROR_MSG;
});

async function add() {
  if (!confirm("Sind Sie sicher, dass sie diesen Menupunkt hinzufügen wollen?"))
    return;

  emit("add", subMenuName.value);
}
</script>

<template>
  <div>
    <UForm class="space-y-5 flex flex-col">
      <h1 class="mb-4 text-xl font-semibold">Untermenu</h1>
      <UInput
        v-model="subMenuName"
        placeholder="Untermenu"
        type="text"
        size="xl"
        class="w-full"
      />
      <div v-if="subMenuError" class="text-red-500 font-medium">
        {{ subMenuError }}
      </div>

      <UButton
        color="primary"
        size="xl"
        variant="solid"
        type="submit"
        block
        icon="i-heroicons-check"
        class="cursor-pointer"
        :disabled="subMenuError !== '' || subMenuName === ''"
        @click.prevent="add"
      >
        Hinzufügen
      </UButton>
    </UForm>
  </div>
</template>
