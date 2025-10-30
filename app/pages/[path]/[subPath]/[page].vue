<script setup lang="ts">
import { useRoute } from "#imports";
import ContentPage from "~/components/content-page.vue";
import { getSegment } from "~~/shared/utils";

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
  await $fetch("/api/save/content-page", {
    method: "POST",
    body: {
      paths: [getSegment(0), getSegment(1)],
      fileName: getSegment(2),
      data: note,
    },
  });
}
</script>

<template>
  <content-page
    :note="data!"
    @update-note="(note) => updateNote(note)"
  ></content-page>
</template>

<style></style>
