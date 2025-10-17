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

const router = useRouter();

function getFile(categoryId: string, subId: string, index: number) {
  const fileNames = [
    "inhalt-und-zweck.md",
    "hinfuehrung.md",
    "kernprozess.md",
    "checkliste.md",
    "best-practise.md",
    "arbeitshilfen.md",
  ];

  subId = subId.replace(".", "-");

  const file = fileNames[index];

  if (!file) return;

  router.push(`/${categoryId}/${subId}/${file}`);

  hoveredCategory.value = null;
  hoveredSub.value = null;
  hoveredSubSub.value = null;
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
        v-for="(category, index) in data.categories"
        :key="category.id"
        class="relative h-11"
        @mouseenter="enterCategory(index)"
        @mouseleave="leaveCategory"
      >
        <div
          class="h-full w-full flex items-center ml-5 cursor-pointer"
          :class="{ 'text-[#F18700]': hoveredCategory === index }"
        >
          <b class="text-[#F18700]">{{ category.id }}&emsp;</b>
          <b>{{ category.title }}</b>
        </div>

        <ul
          v-if="hoveredCategory === index"
          class="absolute ml-1 top-0 left-full min-w-85 max-w-max text-sm divide-y bg-white divide-gray-400"
        >
          <li
            v-for="(sub, subIndex) in category.sub_categories"
            :key="sub.id"
            class="relative h-11 bg-[#50A9CE]/[0.33]"
            @mouseenter="enterSub(subIndex)"
            @mouseleave="leaveSub"
          >
            <div
              class="h-full w-full flex items-center cursor-pointer ml-5"
              :class="{ 'text-[#F18700]': hoveredSub === subIndex }"
            >
              <b class="text-[#F18700]">{{ sub.id }}&emsp;</b>
              <b>{{ sub.title }}</b>
            </div>

            <ul
              v-if="hoveredSub === subIndex"
              class="bg-white absolute ml-1 top-0 left-full min-w-40 max-w-max text-sm divide-y divide-gray-400"
            >
              <li
                v-for="(topic, subSubIndex) in sub.topics"
                :key="topic"
                class="relative h-11 bg-[#50A9CE]/[0.33]"
                @mouseenter="enterSubSub(subSubIndex)"
                @mouseleave="leaveSubSub"
                @click.stop="getFile(category.id, sub.id, subSubIndex)"
              >
                <div
                  class="h-full w-full flex items-center cursor-pointer ml-5"
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
