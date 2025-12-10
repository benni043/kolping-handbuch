<script setup lang="ts">
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

async function change() {
  emit("changeUser", props.id, usernameRef.value, roleRef.value);
}
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
