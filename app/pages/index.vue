<script setup lang="ts">
const colorMode = useColorMode();
colorMode.preference = "light";

const router = useRouter();

router.push(`/menu/menu/startpage`);
</script>

<template>
  <div></div>
</template>

<style scoped></style>
