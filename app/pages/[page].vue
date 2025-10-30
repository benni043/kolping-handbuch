<script setup lang="ts">
import ContentPage from "~/components/content-page.vue";

const colorMode = useColorMode();
colorMode.preference = "light";

const segment = getSegment(0);
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
  <div>
    <content-page
      :note="data!"
      @update-note="(note) => updateNote(note)"
    ></content-page>
  </div>
</template>
