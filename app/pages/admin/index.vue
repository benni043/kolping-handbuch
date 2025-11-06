<script setup lang="ts">
import type { User } from "#auth-utils";
import { ref, onMounted } from "vue";
import NewUser from "~/components/admin/db/new-user.vue";

const blurStore = useBlurStore();

const users = ref<{ statusCode: number; data: User[] }>({
  statusCode: 0,
  data: [],
});
const editingUser = ref<User | null>(null);

const fetchUsers = async () => {
  const response = await $fetch<{ statusCode: number; data: User[] }>(
    "/api/user",
  );
  users.value = response;
};

const startEdit = (user: User) => {
  editingUser.value = { ...user };
  blurStore.blur = !blurStore.blur;
};

function cancle() {
  editingUser.value = null;
  blurStore.blur = !blurStore.blur;
}

function change() {}

onMounted(fetchUsers);
</script>

<template>
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
        <tr v-for="user in users.data" :key="user.id" class="hover:bg-gray-100">
          <td class="border border-gray-300 p-2 text-left">{{ user.id }}</td>
          <td class="border border-gray-300 p-2 text-left">
            {{ user.username }}
          </td>
          <td class="border border-gray-300 p-2 text-left">{{ user.role }}</td>
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
      <new-user
        :username="editingUser.username"
        :role="editingUser.role"
        @cancle="cancle()"
      ></new-user>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
