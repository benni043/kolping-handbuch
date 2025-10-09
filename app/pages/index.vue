<script setup lang="ts">

import TextPage from "~/component/text-page.vue";
import Kernprozess from "~/component/kernprozess.vue";

const { data } = await useFetch('/api/tree')

console.log(data.value)

</script>

<template>
<!--  <text-page></text-page>-->
<!--  <kernprozess.md></kernprozess.md>-->
</template>

<style scoped>

</style>