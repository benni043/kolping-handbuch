<script setup lang="ts">
import { USERNAME_ERROR_MSG } from "~~/shared/utils/checks";

definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const props = defineProps<{
  username: string;
  role: string;
  id: number;
}>();

const emit = defineEmits(["changeUser"]);

const usernameRef = ref(props.username || "");
const roleRef = ref(props.role || "");

const userError = ref("");

async function change() {
  userError.value = validateUsername(usernameRef.value)
    ? ""
    : USERNAME_ERROR_MSG;

  if (userError.value) return;

  emit("changeUser", props.id, usernameRef.value, roleRef.value);
}

watch(usernameRef, () => {
  userError.value = validateUsername(usernameRef.value)
    ? ""
    : USERNAME_ERROR_MSG;
});
</script>

<template>
  <div>
    <UForm class="space-y-5">
      <h1 class="mb-4 text-xl font-semibold">Benutzername</h1>
      <UInput
        v-model="usernameRef"
        placeholder="Benutzername"
        type="text"
        size="xl"
        class="w-full"
      />

      <p v-if="userError" class="text-red-500 font-medium">
        {{ userError }}
      </p>

      <h1 class="mb-4 text-xl font-semibold">Rolle</h1>
      <select v-model="roleRef" class="w-full border rounded-lg p-2">
        <option value="user">user</option>
        <option value="editor">editor</option>
        <option value="admin">admin</option>
      </select>

      <UButton
        color="primary"
        size="xl"
        variant="solid"
        type="submit"
        block
        icon="i-heroicons-lock-closed"
        class="cursor-pointer"
        @click="change()"
      >
        Ändern
      </UButton>
    </UForm>
  </div>
</template>

<style scoped></style>
