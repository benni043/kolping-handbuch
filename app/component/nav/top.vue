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
} from 'reka-ui'

const {data} = await useFetch('/api/files/metadata/metadata.json')

import {ref} from 'vue'

const toggleState = ref(true)

function test() {
  alert("hoii")
}

</script>

<template>
  <div class="flex justify-center items-start mt-5">
    <DropdownMenuRoot :open="true">
      <DropdownMenuTrigger>
        test
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent class="bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px] text-sm">
          <DropdownMenuSub v-for="category in data.categories" :key="category.id">
            <DropdownMenuSubTrigger
                class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors" @click="test"
                value="inner1">
              {{ category.title }}
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent
                  class="bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px] text-sm">
                <DropdownMenuSub v-for="sub in category.sub_categories" :key="sub.id">
                  <DropdownMenuSubTrigger
                      class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      value="inner1" @click="test">
                    {{ sub.title }}
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent
                        class="bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px] text-sm">
                      <DropdownMenuItem @select="test" v-for="topic in sub.topics" :key="topic"
                                        class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                        {{ topic }}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>

    <img src="/img/header.png" alt="header">
  </div>
</template>

<style scoped>

</style>