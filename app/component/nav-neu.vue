<script setup lang="ts">
import { ref } from "vue";

const { data } = await useFetch("/api/files/metadata/metadata.json");

const hoveredCategory = ref<number | null>(null);
const hoveredSub = ref<number | null>(null);
const hoveredSubSub = ref<number | null>(null);

let categoryTimeout: ReturnType<typeof setTimeout> | null = null;
let subTimeout: ReturnType<typeof setTimeout> | null = null;
let subSubTimeout: ReturnType<typeof setTimeout> | null = null;

const timeout = 500;

function test() {
  alert("hoii");
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
  <div class="h-65 z-10">
    <ul class="min-w-70 text-sm relative bg-white divide-y divide-gray-200">
      <li
        v-for="(category, index) in data.categories"
        :key="category.id"
        class="relative"
        @mouseenter="enterCategory(index)"
        @mouseleave="leaveCategory"
      >
        <div
          class="px-4 py-2 cursor-pointer transition-colors"
          :class="{ 'text-[#F18700]': hoveredCategory === index }"
          @click="test"
        >
          <b class="text-[#F18700]">{{ category.id }}&emsp;</b>
          <b>{{ category.title }}</b>
        </div>

        <ul
          v-if="hoveredCategory === index"
          class="absolute ml-1 top-0 left-full min-w-60 max-w-max text-sm bg-white divide-y divide-gray-200"
        >
          <li
            v-for="(sub, subIndex) in category.sub_categories"
            :key="sub.id"
            class="relative"
            @mouseenter="enterSub(subIndex)"
            @mouseleave="leaveSub"
          >
            <div
              class="px-4 py-2 cursor-pointer transition-colors"
              :class="{ 'text-[#F18700]': hoveredSub === subIndex }"
              @click="test"
            >
              <b class="text-[#F18700]">{{ sub.id }}&emsp;</b>
              <b>{{ sub.title }}</b>
            </div>

            <ul
              v-if="hoveredSub === subIndex"
              class="absolute ml-1 top-0 left-full min-w-60 max-w-max text-sm bg-white divide-y divide-gray-200"
            >
              <li
                v-for="(topic, subSubIndex) in sub.topics"
                :key="topic"
                class="relative"
                @mouseenter="enterSubSub(subSubIndex)"
                @mouseleave="leaveSubSub"
              >
                <div
                  class="px-4 py-2 cursor-pointer transition-colors"
                  @click="test"
                  :class="{ 'text-[#F18700]': hoveredSubSub === subSubIndex }"
                >
                  <b>{{ topic }}</b>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
