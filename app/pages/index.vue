<script setup lang="ts">
const colorMode = useColorMode();
colorMode.preference = "light";

const router = useRouter();

router.push(`/menu/menu/startpage`);
</script>

<template>
  <div class="light"></div>
</template>

<style scoped></style>
