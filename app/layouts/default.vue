<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";

const toaster: ToasterProps = { position: "top-right" };
</script>

<template>
  <div>
    <Nav />
    <main id="main">
      <UApp :toaster="toaster">
        <NuxtPage />
      </UApp>
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
