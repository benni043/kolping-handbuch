<script setup lang="ts">
import KernprozessCreator from "~/component/admin/kernprozess/kernprozess-creator.vue";

const colorMode = useColorMode();
colorMode.preference = "light";
</script>

<template>
  <div>
    <kernprozess-creator></kernprozess-creator>
  </div>
</template>

<style scoped></style>
