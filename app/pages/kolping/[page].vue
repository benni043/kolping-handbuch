<script setup lang="ts">
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

  console.log(response);
}
</script>

<template>
  <content-page
    :note="data!"
    @update-note="(note) => updateNote(note)"
  ></content-page>
</template>

<style scoped></style>
