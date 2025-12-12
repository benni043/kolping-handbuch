<script setup lang="ts">
import { ref } from "vue";

interface Item {
  name: string;
  type: "dir" | "file";
  size: number;
}

const items: Ref<Item[]> = ref([]);
const currentPath = ref("/");

async function load(path = "/") {
  currentPath.value = normalize(path);

  const res = await $fetch<Item[]>("/api/files/structure", {
    query: { path: currentPath.value },
  });

  items.value = res.items;
}

function normalize(p: string) {
  if (!p || p === "/") return "/";
  return "/" + p.split("/").filter(Boolean).join("/");
}

function open(item: Item) {
  if (item.type === "dir") {
    const next =
      currentPath.value === "/"
        ? `/${item.name}`
        : `${currentPath.value}/${item.name}`;

    load(next);
  } else {
    fetchData(currentPath.value + "/" + item.name);
  }
}

async function fetchData(link: string) {
  console.log(link);
  const res = await fetch(`/api/files?path=${link}`);

  if (res.status !== 200) return;

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file!;
  a.click();
  URL.revokeObjectURL(url);
}

function goUp() {
  if (currentPath.value === "/") return;

  const parts = currentPath.value.split("/").filter(Boolean);
  parts.pop();

  load(parts.length ? "/" + parts.join("/") : "/");
}

function upload() {}

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
        📁 ..
      </li>

      <li
        v-for="i in items"
        :key="i.name"
        class="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition flex items-center gap-1 text-xl"
        @click="open(i)"
      >
        {{ i.type === "dir" ? "📁" : "📄" }} {{ i.name }}
      </li>

      <li
        class="mt-3 font-semibold text-blue-600 cursor-pointer hover:underline text-xl"
        @click="upload"
      >
        <div>↑ Hochladen</div>
      </li>
    </ul>
  </div>
</template>
