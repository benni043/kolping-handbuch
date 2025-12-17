<script setup lang="ts">
import { useRoute } from "#imports";

definePageMeta({
  middleware: ["authenticated"],
});

const toast = useToast();
const route = useRoute();

const { data } = await useFetch<string>("/api/content/", {
  method: "GET",
  query: {
    path: route.params.path,
    subPath: route.params.subPath,
    page: route.params.page,
  },
});

async function updateNote(note: string) {
  try {
    await $fetch("/api/save/content-page", {
      method: "POST",
      body: {
        paths: [route.params.path, route.params.subPath],
        fileName: route.params.page,
        data: note,
      },
    });

    toast.add({
      title: "Erfolg",
      description: "Die Datei wurde erfolgreich geändert!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: unknown) {
    toast.add({
      title: "Fehler",
      description: "Beim Ändern der Datei ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}
</script>

<template>
  <Content :note="data!" @update-note="(note) => updateNote(note)"></Content>
</template>

<style></style>
