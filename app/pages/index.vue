<script setup lang="ts">

import TextPage from "~/component/text-page.vue";
import Kernprozess from "~/component/kernprozess.vue";
import KernprozessCreator from "~/component/kernprozess-creator.vue";

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

</script>

<template>
<!--  <text-page></text-page>-->
<!--  <kernprozess.md></kernprozess.md>-->

  <ClientOnly v-if="!colorMode?.forced">
    <UButton
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
        @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>

  <kernprozess-creator></kernprozess-creator>
</template>

<style scoped>

</style>