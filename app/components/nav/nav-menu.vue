<script setup lang="ts">
import { ref } from "vue";
import type { Structure } from "~/types/structure";
import { categories } from "~/utils/utils";

defineProps<{
  data: Structure[];
}>();

const emit = defineEmits(["emit-route"]);

const hoveredCategory = ref<number | null>(null);
const hoveredSub = ref<number | null>(null);
const hoveredSubSub = ref<number | null>(null);

let categoryTimeout: ReturnType<typeof setTimeout> | null = null;
let subTimeout: ReturnType<typeof setTimeout> | null = null;
let subSubTimeout: ReturnType<typeof setTimeout> | null = null;

const timeout = 500;

function click(
  pathId: string,
  subPathId: string | null,
  category: string | null,
) {
  emit("emit-route", pathId, subPathId, category);

  hoveredSub.value = null;
  hoveredSubSub.value = null;
  hoveredCategory.value = null;
}

function enterCategory(index: number) {
  if (categoryTimeout) clearTimeout(categoryTimeout);
  hoveredCategory.value = index;
}

function leaveCategory() {
  categoryTimeout = setTimeout(() => {
    hoveredCategory.value = null;
    hoveredSub.value = null;
  }, timeout);
}

function enterSub(subIndex: number) {
  if (subTimeout) clearTimeout(subTimeout);
  hoveredSub.value = subIndex;
}

function leaveSub() {
  subTimeout = setTimeout(() => {
    hoveredSub.value = null;
  }, timeout);
}

function enterSubSub(subIndex: number) {
  if (subSubTimeout) clearTimeout(subSubTimeout);
  hoveredSubSub.value = subIndex;
}

function leaveSubSub() {
  subSubTimeout = setTimeout(() => {
    hoveredSubSub.value = null;
  }, timeout);
}
</script>

<template>
  <div class="z-10">
    <ul
      class="rounded-tl-2xl rounded-bl-2xl min-w-85 bg-[#50A9CE]/[0.33] text-sm divide-y divide-gray-400"
    >
      <li
        v-for="(path, index) in data"
        :key="path.id"
        class="relative h-11"
        @mouseenter="enterCategory(index)"
        @mouseleave="leaveCategory"
        @click.stop="click(path.id, null, null)"
      >
        <div
          class="h-full w-full flex items-center ml-5 cursor-pointer"
          :class="{ 'text-[#F18700]': hoveredCategory === index }"
        >
          <b class="text-[#F18700]">{{ path.id }}&emsp;</b>
          <b>{{ path.title }}</b>
        </div>

        <ul
          v-if="hoveredCategory === index"
          class="absolute ml-1 top-0 left-full min-w-85 max-w-max text-sm divide-y bg-white divide-gray-400"
        >
          <li
            v-for="(subPath, subIndex) in path.children"
            :key="subPath.id"
            class="relative h-11 bg-[#50A9CE]/[0.33]"
            @mouseenter="enterSub(subIndex)"
            @mouseleave="leaveSub"
            @click.stop="click(path.id, subPath.id, null)"
          >
            <div
              class="h-full w-full flex items-center cursor-pointer ml-5"
              :class="{ 'text-[#F18700]': hoveredSub === subIndex }"
            >
              <b class="text-[#F18700]">{{ subPath.id }}&emsp;</b>
              <b>{{ subPath.title }}</b>
            </div>

            <ul
              v-if="hoveredSub === subIndex"
              class="bg-white absolute ml-1 top-0 left-full min-w-40 max-w-max text-sm divide-y divide-gray-400"
            >
              <li
                v-for="(category, subSubIndex) in categories"
                :key="category"
                class="relative h-11 bg-[#50A9CE]/[0.33]"
                @mouseenter="enterSubSub(subSubIndex)"
                @mouseleave="leaveSubSub"
                @click.stop="click(path.id, subPath.id, category)"
              >
                <div
                  class="h-full w-full flex items-center cursor-pointer ml-5"
                  :class="{ 'text-[#F18700]': hoveredSubSub === subSubIndex }"
                >
                  <b>{{ category }}</b>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
