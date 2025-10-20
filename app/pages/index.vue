<script setup lang="ts">
import KernprozessCreator from "~/component/admin/kernprozess/kernprozess-creator.vue";

const colorMode = useColorMode();
colorMode.preference = "light";

const router = useRouter();

// router.push(`/menu/menu/startpage`);

const { data } = await useFetch(`/api/structure`);

console.log(data.value);
</script>

<template>
  <div>
    <kernprozess-creator></kernprozess-creator>
  </div>
</template>

<style scoped></style>
