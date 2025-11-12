<script setup lang="ts">
import type { User } from "#auth-utils";
import { ref, onMounted } from "vue";
import ChangeUser from "~/components/admin/db/change-user.vue";
import ChangePassword from "~/components/admin/db/change-password.vue";
import NewUser from "~/components/admin/db/new-user.vue";

definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: "admin",
});

const blurStore = useBlurStore();

const users: Ref<User[]> = ref([]);

const editingUser = ref<User | null>(null);
const passwordChangingId = ref<number | null>(null);
const addingUser = ref(false);

async function fetchUsers() {
  const response = await $fetch<{ statusCode: number; data: User[] }>(
    "/api/admin/user",
  );

  users.value = response.data;
  users.value.sort((user, user2) => user.id - user2.id);
}

function startEditing(user: User) {
  editingUser.value = { ...user };
  blurStore.blur = !blurStore.blur;
}

function startEditingPassword(userId: number) {
  passwordChangingId.value = userId;
  blurStore.blur = !blurStore.blur;
}

function toggleAdd() {
  addingUser.value = !addingUser.value;
  blurStore.blur = !blurStore.blur;
}

function cancle() {
  editingUser.value = null;
  passwordChangingId.value = null;
  blurStore.blur = !blurStore.blur;
}

async function add(username: string, password: string, role: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Benutzer hinzufügen möchten?"))
    return;

  await $fetch("/api/admin/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      username: username,
      password: password,
      role: role,
    },
  });

  await fetchUsers();

  toggleAdd();
}

async function change(id: number, username: string, role: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Benutzer bearbeiten möchten?"))
    return;

  await $fetch("/api/admin/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: {
      id: id,
      username: username,
      role: role,
    },
  });

  await fetchUsers();

  cancle();
}

async function deleteUser(id: number) {
  if (!confirm("Sind Sie sicher, dass sie diesen Benutzer löschen möchten?"))
    return;

  await $fetch("/api/admin/user", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: {
      id: id,
    },
  });

  await fetchUsers();
}

async function changeUserPassword(id: number, password: string) {
  if (
    !confirm(
      `Sind Sie sicher, dass Sie das Passwort des Benutzers ${id} bearbeiten möchten?`,
    )
  )
    return;

  await $fetch("/api/admin/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: {
      id: id,
      password: password,
    },
  });

  await fetchUsers();

  cancle();
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div>
    <div class="flex justify-end mr-10">
      <button
        class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        @click="toggleAdd()"
      >
        Hinzufügen
      </button>
    </div>

    <div
      v-if="addingUser"
      class="fixed inset-0 z-50 overflow-y-auto p-6 blur-none"
    >
      <new-user
        @cancle="toggleAdd()"
        @add="(username, password, role) => add(username, password, role)"
      ></new-user>
    </div>

    <div class="p-6 ml-10">
      <table
        class="w-200 border-collapse border border-gray-300"
        :class="{ 'blur-sm': blurStore.blur }"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 p-2 text-left">ID</th>
            <th class="border border-gray-300 p-2 text-left">Username</th>
            <th class="border border-gray-300 p-2 text-left">Rolle</th>
            <th class="border border-gray-300 p-2 text-left">Aktion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-100">
            <td class="border border-gray-300 p-2 text-left">{{ user.id }}</td>

            <td class="border border-gray-300 p-2 text-left">
              {{ user.username }}
            </td>

            <td class="border border-gray-300 p-2 text-left">
              {{ user.role }}
            </td>

            <td class="border border-gray-300 p-2 text-left flex gap-5">
              <button
                class="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                @click="startEditing(user)"
              >
                Bearbeiten
              </button>

              <button
                class="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                @click="deleteUser(user.id)"
              >
                Löschen
              </button>

              <button
                class="bg-orange-600 text-white px-3 py-1 rounded cursor-pointer"
                @click="startEditingPassword(user.id)"
              >
                Passwort ändern
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="editingUser"
        class="fixed inset-0 z-50 overflow-y-auto p-6 blur-none"
      >
        <change-user
          :id="editingUser.id"
          :username="editingUser.username"
          :role="editingUser.role"
          @cancle="cancle()"
          @change="(id, username, role) => change(id, username, role)"
        ></change-user>
      </div>

      <div
        v-if="passwordChangingId"
        class="fixed inset-0 z-50 overflow-y-auto p-6 blur-none"
      >
        <change-password
          :id="passwordChangingId"
          @cancle="cancle()"
          @change="
            (id: number, password: string) => changeUserPassword(id, password)
          "
        ></change-password>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
