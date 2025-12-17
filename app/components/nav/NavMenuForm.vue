<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const emit = defineEmits(["add"]);

const menuName = ref("");
const subMenuName = ref("");

const menuError = ref("");
const subMenuError = ref("");

watch(menuName, () => {
  menuError.value = validateUsername(menuName.value) ? "" : USERNAME_ERROR_MSG;
});

watch(subMenuName, () => {
  subMenuError.value = validateUsername(subMenuName.value)
    ? ""
    : USERNAME_ERROR_MSG;
});

async function add() {
  if (!confirm("Sind Sie sicher, dass sie diesen Menupunkt hinzufügen wollen?"))
    return;

  emit("add", menuName.value, subMenuName.value);
}
</script>

<template>
  <div>
    <UForm class="space-y-5 flex flex-col">
      <h1 class="mb-4 text-xl font-semibold">Menuname</h1>
      <UInput v-model="menuName" placeholder="Menuname" type="text" size="xl" />
      <div v-if="menuError" class="text-red-500 font-medium">
        {{ menuError }}
      </div>

      <h1 class="mb-4 text-xl font-semibold">Untermenu</h1>
      <UInput
        v-model="subMenuName"
        placeholder="Untermenu"
        type="text"
        size="xl"
      />
      <div v-if="subMenuError" class="text-red-500 mt-2 font-medium">
        {{ subMenuError }}
      </div>

      <UButton
        color="primary"
        block
        size="xl"
        variant="solid"
        type="submit"
        icon="i-heroicons-lock-closed"
        class="cursor-pointer"
        :disabled="
          menuError !== '' ||
          subMenuError !== '' ||
          menuName === '' ||
          subMenuName === ''
        "
        @click.prevent="add"
      >
        Hinzufügen
      </UButton>
    </UForm>
  </div>
</template>
