<script setup lang="ts">
import { MENU_ERROR_MSG } from "~~/shared/utils/checks";

definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const props = defineProps<{
  oldName: string;
}>();

const emit = defineEmits(["add"]);

const menuName = ref(props.oldName);
const menuError = ref("");

watch(menuName, () => {
  menuError.value = validateUsername(menuName.value) ? "" : MENU_ERROR_MSG;
});

async function add() {
  if (!confirm("Sind Sie sicher, dass sie diesen Menupunkt umbennenen wollen?"))
    return;

  emit("add", menuName.value);
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

      <UButton
        color="primary"
        block
        size="xl"
        variant="solid"
        type="submit"
        icon="i-heroicons-check"
        class="cursor-pointer"
        :disabled="menuError !== '' || menuName === ''"
        @click.prevent="add"
      >
        Ändern
      </UButton>
    </UForm>
  </div>
</template>
