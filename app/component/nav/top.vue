<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "reka-ui";

import {ref} from "vue";

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const {data} = await useFetch("/api/files/metadata/metadata.json");

const toggleState = ref(true);

function test() {
  alert("hoii");
}
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
        @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="size-8"/>
    </template>
  </ClientOnly>

  <!--  <div class="flex justify-evenly items-start bg-blue-300 h-80">-->
  <!--    <DropdownMenuRoot :open="true">-->
  <!--      <DropdownMenuTrigger class="flex-1 h-6"></DropdownMenuTrigger>-->

  <!--      <DropdownMenuPortal>-->
  <!--        <DropdownMenuContent-->
  <!--            class="bg-white border border-gray-200 shadow-lg py-2 min-w-[200px] text-sm"-->
  <!--        >-->
  <!--          <DropdownMenuSub-->
  <!--              v-for="category in data.categories"-->
  <!--              :key="category.id"-->
  <!--          >-->
  <!--            <DropdownMenuSubTrigger-->
  <!--                class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"-->
  <!--                @click="test"-->
  <!--                value="inner1"-->
  <!--            >-->
  <!--              {{ category.title }}-->
  <!--            </DropdownMenuSubTrigger>-->

  <!--            <DropdownMenuPortal>-->
  <!--              <DropdownMenuSubContent-->
  <!--                  class="bg-white border border-gray-200 shadow-lg min-w-[200px] text-sm"-->
  <!--              >-->
  <!--                <DropdownMenuSub-->
  <!--                    v-for="sub in category.sub_categories"-->
  <!--                    :key="sub.id"-->
  <!--                >-->
  <!--                  <DropdownMenuSubTrigger-->
  <!--                      class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"-->
  <!--                      value="inner1"-->
  <!--                      @click="test"-->
  <!--                  >-->
  <!--                    {{ sub.title }}-->
  <!--                  </DropdownMenuSubTrigger>-->

  <!--                  <DropdownMenuPortal>-->
  <!--                    <DropdownMenuSubContent-->
  <!--                        class="bg-white border border-gray-200 shadow-lg min-w-[200px] text-sm"-->
  <!--                    >-->
  <!--                      <DropdownMenuItem-->
  <!--                          @select="test"-->
  <!--                          v-for="topic in sub.topics"-->
  <!--                          :key="topic"-->
  <!--                          class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"-->
  <!--                      >-->
  <!--                        {{ topic }}-->
  <!--                      </DropdownMenuItem>-->
  <!--                    </DropdownMenuSubContent>-->
  <!--                  </DropdownMenuPortal>-->
  <!--                </DropdownMenuSub>-->
  <!--              </DropdownMenuSubContent>-->
  <!--            </DropdownMenuPortal>-->
  <!--          </DropdownMenuSub>-->
  <!--        </DropdownMenuContent>-->
  <!--      </DropdownMenuPortal>-->
  <!--    </DropdownMenuRoot>-->

  <!--    <div class="flex-1 h-full flex flex-col items-center justify-center">-->
  <!--      <h1 class="text-5xl">Kolping Handbuch</h1>-->
  <!--    </div>-->

  <!--    <img class="pl-77" src="/img/header.png" alt="header">-->
  <!--  </div>-->
</template>

<style scoped></style>