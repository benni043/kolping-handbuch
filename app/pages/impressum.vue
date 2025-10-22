<script setup lang="ts">
import ContentPage from "~/component/content-page.vue";

const colorMode = useColorMode();
colorMode.preference = "light";

const { data } = await useFetch<string>("/api/content/startpage", {
  method: "GET",
  query: {
    file: "impressum",
  },
});
</script>

<template>
  <div>
    <content-page :note="data!"></content-page>
  </div>
</template>

<style scoped></style>
