<script setup lang="ts">
import type { User } from "#auth-utils";
import { ref } from "vue";
import ChangeUser from "~/components/admin/db/change-user.vue";
import ChangePassword from "~/components/admin/db/change-password.vue";
import NewUser from "~/components/admin/db/new-user.vue";

definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: "admin",
});

const toast = useToast();

const users: Ref<User[]> = ref([]);

const editingUser = ref<User | null>(null);
const passwordChangingId = ref<number | null>(null);

const isAddingUser = ref(false);
const isEditingUser = ref(false);
const isEditingPassword = ref(false);

async function fetchUsers() {
  const response = await $fetch<{ statusCode: number; data: User[] }>(
    "/api/user/",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  users.value = response.data;
  users.value.sort((user, user2) => user.id - user2.id);
}

function openEditingUserModal(user: User) {
  isEditingUser.value = true;
  editingUser.value = { ...user };
}

function openEditingPasswordModal(userId: number) {
  isEditingPassword.value = true;
  passwordChangingId.value = userId;
}

function openAddModal() {
  isAddingUser.value = !isAddingUser.value;
}

function cancle() {
  editingUser.value = null;
  passwordChangingId.value = null;
}

async function addUser(username: string, password: string, role: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Benutzer hinzufügen möchten?"))
    return;

  try {
    await $fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        username: username,
        password: password,
        role: role,
      },
    });

    isAddingUser.value = false;

    await fetchUsers();

    toast.add({
      title: "Erfolg",
      description: "Der Benutzer wurde erfolreich hinzugefügt!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function changeUserName(id: number, username: string, role: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Benutzer bearbeiten möchten?"))
    return;

  try {
    await $fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: {
        id: id,
        username: username,
        role: role,
      },
    });

    isEditingUser.value = false;

    await fetchUsers();

    cancle();

    toast.add({
      title: "Erfolg",
      description: "Der Benutzer wurde erfolgreich geändert!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Ändern des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function deleteUser(id: number) {
  if (!confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?"))
    return;

  try {
    await $fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: {
        id: id,
      },
    });

    await fetchUsers();

    toast.add({
      title: "Erfolg",
      description: "Der Benutzer wurde erfolreich gelöscht!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Löschen des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function changeUserPassword(id: number, password: string) {
  if (
    !confirm(
      `Sind Sie sicher, dass Sie das Passwort des Benutzers ${id} bearbeiten möchten?`,
    )
  )
    return;

  try {
    await $fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: {
        id: id,
        password: password,
      },
    });

    isEditingPassword.value = false;

    await fetchUsers();

    cancle();

    toast.add({
      title: "Erfolg",
      description: "Das Passwort wurde erfolgreich geändert!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Ändern des Passworts ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

fetchUsers();
</script>

<template>
  <div class="flex justify-center items-center flex-col">
    <div class="relative flex justify-end w-[90vw] lg:w-[60vw]">
      <button
        class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        @click="openAddModal()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>

    <div class="space-y-4 m-5 md:ml-20 md:mr-30 w-max">
      <div v-for="user in users" :key="user.id" class="border-b-1 p-4">
        <div class="text-lg font-bold">{{ user.username }}</div>
        <div class="text-lg">ID: {{ user.id }}</div>
        <div class="text-lg">Rolle: {{ user.role }}</div>

        <div class="flex gap-3 mt-3">
          <button
            class="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer flex gap-2"
            @click="openEditingUserModal(user)"
          >
            Benutzer
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>

          <button
            class="bg-orange-600 text-white px-3 py-1 rounded cursor-pointer flex gap-2"
            @click="openEditingPasswordModal(user.id)"
          >
            Passwort
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>

          <button
            class="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
            @click="deleteUser(user.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <UModal
      v-model:open="isAddingUser!"
      title="Benutzer hinzufügen"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <new-user
          @add="(username, password, role) => addUser(username, password, role)"
        ></new-user>
      </template>
    </UModal>

    <UModal
      v-model:open="isEditingUser"
      title="Benutzer bearbeiten"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <change-user
          v-if="editingUser"
          :id="editingUser!.id"
          :username="editingUser!.username"
          :role="editingUser!.role"
          @change-user="
            (id, username, role) => changeUserName(id, username, role)
          "
        ></change-user>
      </template>
    </UModal>

    <UModal
      v-model:open="isEditingPassword"
      title="Passwort ändern"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <change-password
          v-if="passwordChangingId"
          :id="passwordChangingId!"
          @change-password="
            (id: number, password: string) => changeUserPassword(id, password)
          "
        ></change-password>
      </template>
    </UModal>
  </div>
</template>

<style scoped></style>
