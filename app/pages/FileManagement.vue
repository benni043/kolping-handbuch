<script setup lang="ts">
import { ref } from "vue";
import CreateFolderForm from "~/components/filemanagement/CreateFolderForm.vue";
import { fetchData, type Item } from "~/utils/file/file";

const toast = useToast();

const items: Ref<Item[]> = ref([]);
const currentPath = ref("/");

const fileInput = ref<HTMLInputElement | null>(null);

const createFolderModalOpen = ref(false);

async function load(path = "/") {
  currentPath.value = normalize(path);

  const res = await $fetch<Item[]>("/api/files/structure", {
    query: { path: currentPath.value },
  });

  items.value = res;
}

function normalize(p: string) {
  if (!p || p === "/") return "/";

  return "/" + p.split("/").filter(Boolean).join("/");
}

async function open(item: Item) {
  if (item.type === "dir") {
    const next =
      currentPath.value === "/"
        ? `/${item.name}`
        : `${currentPath.value}/${item.name}`;

    load(next);
  } else {
    const res = await fetchData(currentPath.value + "/" + item.name);

    if (!res)
      toast.add({
        title: "Fehler",
        description:
          "Beim Herunterladen des Dokuments ist ein Fehler aufgetreten! Wenden Sie sich an Ihren Administrator!",
        color: "error",
        icon: "i-heroicons-x-mark",
      });
  }
}

function goUp() {
  if (currentPath.value === "/") return;

  const parts = currentPath.value.split("/").filter(Boolean);
  parts.pop();

  load(parts.length ? "/" + parts.join("/") : "/");
}

function upload() {
  fileInput.value?.click();
}

async function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("path", currentPath.value);

  try {
    await $fetch("/api/files", {
      method: "POST",
      body: fd,
    });

    load(currentPath.value);
  } catch {
    toast.add({
      title: "Fehler",
      description: "Upload fehlgeschlagen",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

function openCreateFolderModal() {
  createFolderModalOpen.value = true;
}

async function createFolder(folder: string) {
  try {
    await $fetch("/api/files/folder", {
      method: "POST",
      body: {
        path: currentPath.value,
        folder: folder,
      },
    });

    load(currentPath.value);
  } catch (e: unknown) {
    toast.add({
      title: "Fehler",
      description:
        "Beim Erstellen des Ordners ist ein Fehler aufgetreten! Wenden Sie sich an Ihren Administrator!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

load();
</script>

<template>
  <div class="p-4 text-sm select-none">
    <span class="font-bold block mb-3 text-xl">Pfad: {{ currentPath }}</span>

    <ul class="space-y-1">
      <li
        v-if="currentPath !== '/'"
        class="cursor-pointer hover:bg-gray-200 rounded px-2 py-1 transition text-xl"
        @click="goUp"
      >
        <div class="flex gap-2">
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
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>

          <b>..</b>
        </div>
      </li>

      <li
        v-for="i in items"
        :key="i.name"
        class="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition flex items-center gap-1 text-xl"
        @click="open(i)"
      >
        <div v-if="i.type === 'dir'" class="flex gap-2">
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
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>
          {{ i.name }}
        </div>
        <div v-else class="flex gap-2">
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          {{ i.name }}
        </div>
      </li>

      <br />

      <li
        class="mt-3 font-semibold text-blue-600 cursor-pointer hover:underline text-xl"
        @click="openCreateFolderModal()"
      >
        <div class="flex gap-2">
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
              d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>

          Ordner erstellen
        </div>
      </li>

      <UModal
        v-model:open="createFolderModalOpen!"
        title="Ordner hinzufügen"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
      >
        <template #body>
          <CreateFolderForm
            @add="(folder: string) => createFolder(folder)"
          ></CreateFolderForm>
        </template>
      </UModal>

      <li
        class="mt-3 font-semibold text-blue-600 cursor-pointer hover:underline text-xl"
        @click="upload"
      >
        <div class="flex gap-2">
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>

          PDF Hochladen
        </div>

        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="onFileSelected"
        />
      </li>
    </ul>
  </div>
</template>
