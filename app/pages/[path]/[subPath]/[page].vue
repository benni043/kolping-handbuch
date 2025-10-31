<script setup lang="ts">
import { useRoute } from "#imports";
import ContentPage from "~/components/content-page.vue";

definePageMeta({
  middleware: ["authenticated"],
});

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
  const response = await $fetch("/api/save/content-page", {
    method: "POST",
    body: {
      paths: [route.params.path, route.params.subPath],
      fileName: route.params.page,
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

<style></style>
