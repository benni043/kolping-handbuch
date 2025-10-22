<script setup lang="ts">
import { useRoute } from "#imports";
import ContentPage from "~/component/content-page.vue";

const route = useRoute();

const { data } = await useFetch<string>("/api/content/", {
  method: "GET",
  query: {
    path: route.params.path,
    subPath: route.params.subPath,
    page: route.params.page,
  },
});
</script>

<template>
  <content-page :note="data!"></content-page>
</template>

<style></style>
