<script setup lang="ts">
import { useRoute } from "#imports";

const route = useRoute();
</script>

<template>
  <h1>{{ route.params.path }}</h1>
  <h1>{{ route.params.subPath }}</h1>
</template>

<style scoped></style>
