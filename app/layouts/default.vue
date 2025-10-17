<script setup lang="ts">
import TopComponent from "~/component/nav/top-component.vue";
import BottomComponent from "~/component/footer/bottom-component.vue";
</script>

<template>
  <div>
    <top-component />
    <main id="main">
      <NuxtPage />
    </main>
    <bottom-component />
  </div>
</template>

<style scoped></style>
