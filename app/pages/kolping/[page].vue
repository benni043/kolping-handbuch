<script setup lang="ts">
const toast = useToast();

const segment = getSegment(1);
const current = segment === undefined ? "startpage" : segment;

const { data } = await useFetch<string>("/api/content/startpage", {
  method: "GET",
  query: {
    file: current,
  },
});

async function updateNote(note: string) {
  const response = await $fetch("/api/save/content-page", {
    method: "POST",
    body: {
      paths: [],
      fileName: current,
      data: note,
    },
  });

  if (response.success) {
    toast.add({
      title: "Erfolg",
      description: "Die Datei wurde erfolgreich geändert!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } else {
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
  <content-page
    :note="data!"
    @update-note="(note) => updateNote(note)"
  ></content-page>
</template>

<style scoped></style>
