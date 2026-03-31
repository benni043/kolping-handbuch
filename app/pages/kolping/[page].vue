<script setup lang="ts">
import {getSegment} from "~/utils/nav/nav-menu";

const toast = useToast();

const segment = getSegment(1);
const current = segment === undefined ? "startpage" : segment;

const data = ref("");

async function fetchNote() {
  try {
    data.value = await $fetch("/api/content/public", {
      method: "GET",
      query: {
        file: current,
      },
    });
  } catch {
    console.error("error");
  }
}

async function updateNote(note: string) {
  try {
    await $fetch("/api/save/content-page", {
      method: "POST",
      body: {
        paths: [],
        fileName: current,
        data: note,
      },
    });

    await fetchNote();

    toast.add({
      title: "Erfolg",
      description: "Die Datei wurde erfolgreich geändert!",
      color: "success",
      icon: "i-heroicons-check",
      duration: DURATION,
    });
  } catch {
    toast.add({
      title: "Fehler",
      description: "Beim Ändern der Datei ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
      duration: DURATION,
    });
  }
}

onMounted(() => {
  fetchNote();
});
</script>

<template>
  <Content :note="data!" @update-note="(note) => updateNote(note)"></Content>
</template>

<style scoped></style>
