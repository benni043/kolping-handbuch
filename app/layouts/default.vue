<script setup lang="ts">
import TopComponent from "~/components/nav/top-component.vue";
import BottomComponent from "~/components/footer/bottom-component.vue";

const colorMode = useColorMode();
colorMode.preference = "light";

const toaster = { position: "top-right" };
</script>

<template>
  <div>
    <top-component />
    <main id="main">
      <UApp :toaster="toaster">
        <NuxtPage />
      </UApp>
    </main>
    <bottom-component />
  </div>
</template>

<style scoped></style>
