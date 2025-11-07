<script setup lang="ts">
import type { User } from "#auth-utils";
import { ref, onMounted } from "vue";
import ChangeUser from "~/components/admin/db/change-user.vue";

definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: "admin",
});

const blurStore = useBlurStore();

const users: Ref<User[]> = ref([]);

const editingUser = ref<User | null>(null);
const addUser = ref<User | null>(null);

async function fetchUsers() {
  const response = await $fetch<{ statusCode: number; data: User[] }>(
    "/api/admin/user",
  );

  users.value = response.data;

  users.value.sort((user, user2) => user.id - user2.id);
}

const startEdit = (user: User) => {
  editingUser.value = { ...user };
  blurStore.blur = !blurStore.blur;
};

function cancle() {
  editingUser.value = null;
  blurStore.blur = !blurStore.blur;
}

async function change(id: number, username: string, role: string) {
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

async function add() {}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div>
    <button
      class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
    >
      Hinzufügen
    </button>

    <div class="p-6 ml-10">
      <table
        class="w-300 border-collapse border border-gray-300"
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
            <td class="border border-gray-300 p-2 text-left">
              <button
                class="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                @click="startEdit(user)"
              >
                Edit
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
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
