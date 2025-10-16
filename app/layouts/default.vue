<script setup lang="ts">
import Top from "~/component/nav/top.vue";
import Bottom from "~/component/footer/bottom.vue";
</script>

<template>
  <top />
  <main id="main">
    <router-view />
  </main>
  <bottom />
</template>

<style scoped></style>
