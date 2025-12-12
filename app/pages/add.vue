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
  const [_, path, subPath, file] = link.split("/");

  const res = await fetch(
    `/api/files?path=${path}&subPath=${subPath}&file=${file}`,
  );

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

load();
</script>

<template>
  <div>
    <span class="font-bold">Pfad: {{ currentPath }}</span>

    <ul>
      <li
        v-if="currentPath !== '/'"
        class="cursor-pointer hover:underline"
        @click="goUp"
      >
        📁 ..
      </li>

      <li
        v-for="i in items"
        :key="i.name"
        class="cursor-pointer hover:underline"
        @click="open(i)"
      >
        {{ i.type === "dir" ? "📁" : "📄" }} {{ i.name }}
      </li>
    </ul>
  </div>
</template>
