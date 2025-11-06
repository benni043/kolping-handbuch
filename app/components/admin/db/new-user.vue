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

const emit = defineEmits(["cancle"]);

const usernameRef = ref(props.username || "");
const roleRef = ref(props.role || "");

async function change() {
  await $fetch("/api/admin/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: {
      id: props.id,
      username: usernameRef.value,
      role: roleRef.value,
    },
  });

  emit("cancle");
}

function cancle() {
  emit("cancle");
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <UCard class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">
        Benutzer bearbeiten
      </h1>

      <UForm class="space-y-5">
        <div>
          <h1 class="mb-4 text-xl font-semibold">Benutzername</h1>

          <UInput
            v-model="usernameRef"
            placeholder="Benutzername"
            type="text"
            size="xl"
            class="w-full"
          />
        </div>

        <div>
          <h1 class="mb-4 text-xl font-semibold">Rolle</h1>

          <select v-model="roleRef" class="w-full border rounded-lg p-2">
            <option value="user">user</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
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
            @click="change()"
          >
            Ändern
          </UButton>

          <UButton
            color="error"
            size="xl"
            variant="solid"
            block
            icon="i-heroicons-x-mark"
            class="cursor-pointer"
            @click="cancle()"
          >
            Abbrechen
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
