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

  createFolderModalOpen.value = false;
}

async function deleteFolder(item: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Ordner löschen möchten?"))
    return;

  try {
    await $fetch("/api/files", {
      method: "DELETE",
      body: {
        path: currentPath.value,
        item: item,
      },
    });

    load(currentPath.value);
  } catch (e: unknown) {
    toast.add({
      title: "Fehler",
      description:
        "Beim Löschen des Ordners ist ein Fehler aufgetreten! Wenden Sie sich an Ihren Administrator!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function changeFolder(item: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Ordner umbenennen möchten?"))
    return;

  try {
    // await $fetch("/api/files", {
    //   method: "DELETE",
    //   body: {
    //     path: currentPath.value,
    //     item: item,
    //   },
    // });

    console.log(item);

    load(currentPath.value);
  } catch (e: unknown) {
    toast.add({
      title: "Fehler",
      description:
        "Beim Löschen des Ordners ist ein Fehler aufgetreten! Wenden Sie sich an Ihren Administrator!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

onMounted(() => {
  load();
});
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
        class="hover:bg-gray-100 rounded px-2 py-1 transition flex items-center gap-3 text-xl"
      >
        <div class="cursor-pointer" @click="open(i)">
          <div v-if="i.type === 'dir'" class="flex gap-2 items-center">
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
          <div v-else>
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
        </div>

        <button class="hover:text-red-500" @click="deleteFolder(i.name)">
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

        <button class="hover:text-yellow-500" @click="changeFolder(i.name)">
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
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
