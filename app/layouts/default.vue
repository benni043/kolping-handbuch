<script setup lang="ts">
import TopComponent from "~/components/nav/top-component.vue";
import BottomComponent from "~/components/footer/bottom-component.vue";

const colorMode = useColorMode();
colorMode.preference = "light";
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
