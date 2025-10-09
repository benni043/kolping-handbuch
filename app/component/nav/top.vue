<script setup lang="ts">
import {
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'reka-ui'

const {data} = await useFetch('/api/files/metadata/metadata.json')

import {ref} from 'vue'

const toggleState = ref(false)
const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const person = ref('pedro')

function handleSelect() {
  // eslint-disable-next-line no-alert
  alert('hello!')
}

</script>

<template>
  <DropdownMenuRoot v-model:open="toggleState">
    <DropdownMenuTrigger
        class="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-grass11 bg-white border shadow-sm outline-none hover:bg-stone-50 dark:focus:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-black"
        aria-label="Customise options"
    >
      <Icon icon="radix-icons:hamburger-menu"/>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
          class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          :side-offset="5"
      >
        <DropdownMenuItem
            value="New Tab"
            class="group text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            @select="handleSelect"
        >
          New Tab
          <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
          >
            ⌘+T
          </div>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
              value="more toolsz"
              class="group w-full text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
          >
            More Tools
            <div
                class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              <Icon icon="radix-icons:chevron-right"/>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
                class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                :side-offset="2"
                :align-offset="-5"
            >
              <DropdownMenuItem
                  class="group text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Save Page As…
                <div
                    class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                >
                  ⌘+S
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                  class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Create Shortcut…
              </DropdownMenuItem>
              <DropdownMenuItem
                  class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Name Window…
              </DropdownMenuItem>
              <DropdownMenuSeparator class="h-[1px] bg-green6 m-[5px]"/>
              <DropdownMenuItem
                  class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Developer Tools
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>

  <!--  <ul>-->
  <!--    <li v-for="category in data.categories" :key="category.id" class="relative group/inner2">-->
  <!--      <div class="px-4 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300">-->
  <!--        {{ category.title }}-->
  <!--      </div>-->

  <!--      <ul class="hidden group-hover/inner2:block">-->
  <!--        <li v-for="sub in category.sub_categories" :key="sub.id" class="relative group">-->
  <!--          <div class="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200">-->
  <!--            {{ sub.title }}-->
  <!--          </div>-->

  <!--          <ul class="hidden group-hover:block  ml-4">-->
  <!--            <li v-for="topic in sub.topics" :key="topic" class="px-4 py-2 bg-gray-50 hover:bg-gray-200 cursor-pointer">-->
  <!--              {{ topic }}-->
  <!--            </li>-->
  <!--          </ul>-->
  <!--        </li>-->
  <!--      </ul>-->
  <!--    </li>-->
  <!--  </ul>-->


</template>

<style scoped>

</style>