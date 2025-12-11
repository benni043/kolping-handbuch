<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin", "editor"],
});
</script>

<template>
  <div></div>
</template>
