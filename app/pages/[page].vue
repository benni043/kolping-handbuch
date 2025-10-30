<script setup lang="ts">
import ContentPage from "~/components/content-page.vue";

const colorMode = useColorMode();
colorMode.preference = "light";

const { data } = await useFetch<string>("/api/content/startpage", {
  method: "GET",
  query: {
    file: getSegment(0),
  },
});

async function updateNote(note: string) {
  const response = await $fetch("/api/save/content-page", {
    method: "POST",
    body: {
      paths: [],
      fileName: getSegment(0),
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
