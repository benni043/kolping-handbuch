<script setup lang="ts">
import NewUser from "~/components/admin/db/new-user.vue";

definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const response = await $fetch("/api/user", {
  method: "GET",
});

console.log(response);
</script>

<template>
  <new-user></new-user>
</template>

<style scoped></style>
