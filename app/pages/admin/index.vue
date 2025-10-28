<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});
</script>

<template>
  <h1>hallo admin</h1>
</template>

<style scoped></style>
