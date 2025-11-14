<script setup lang="ts">
import { ref } from "vue";
import type { Structure } from "~/types/structure";
import { categories } from "~/utils/utils";
import Lvl1Component from "~/components/nav/lvl1-component.vue";
import Lvl2Component from "~/components/nav/lvl2-component.vue";

defineProps<{
  data: Structure[];
}>();

const emit = defineEmits(["emit-route", "refetch"]);

const toast = useToast();
const blurStore = useBlurStore();

const { user } = useUserSession();

const hoveredCategory = ref<number | null>(null);
const hoveredSub = ref<number | null>(null);
const hoveredSubSub = ref<number | null>(null);

let categoryTimeout: ReturnType<typeof setTimeout> | null = null;
let subTimeout: ReturnType<typeof setTimeout> | null = null;
let subSubTimeout: ReturnType<typeof setTimeout> | null = null;

const timeout = 500;

const addingLvl1 = ref(false);
const addingLvl2 = ref(false);

const currentPathId = ref("");

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

function addLvl1() {
  blurStore.blur = true;
  addingLvl1.value = true;
}

function addLvl2(pathId: string) {
  currentPathId.value = pathId;

  blurStore.blur = true;
  addingLvl2.value = true;
}

async function addLvl2Menu(subMenuName: string) {
  const response = await $fetch("/api/content/subMenu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      menuId: currentPathId.value,
      subMenuName: subMenuName,
    },
  });

  if (response.success) {
    toast.add({
      title: "Erfolg",
      description: "Der Untermenupunkt wurde erfolgreich hinzugefügt!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } else {
    toast.add({
      title: "Fehler",
      description: "Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }

  cancleAdding();

  emit("refetch");
}

async function addLvl1Menu(menuName: string, subMenuName: string) {
  const response = await $fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      menuName: menuName,
      subMenuName: subMenuName,
    },
  });

  if (response.success) {
    toast.add({
      title: "Erfolg",
      description: "Der Menupunkt wurde erfolgreich hinzugefügt!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } else {
    toast.add({
      title: "Fehler",
      description: "Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }

  cancleAdding();

  emit("refetch");
}

function cancleAdding() {
  blurStore.blur = false;

  addingLvl1.value = false;
  addingLvl2.value = false;

  currentPathId.value = "";
}
</script>

<template>
  <div class="z-10 relative">
    <ul
      class="min-w-88 text-sm divide-y divide-gray-400"
      :class="{ 'blur-sm': blurStore.blur }"
    >
      <!-- normal lvl 1 -->
      <li
        v-for="(path, index) in data"
        :key="path.id"
        class="relative h-11 bg-[#50A9CE]/[0.33]"
        :class="{
          'rounded-tl-2xl': index === 0,
          'rounded-bl-2xl':
            index === data.length - 1 &&
            user?.role !== 'admin' &&
            user?.role !== 'editor',
        }"
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
          class="absolute ml-1 top-0 left-full min-w-88 max-w-max text-sm divide-y bg-white divide-gray-400"
        >
          <!-- normal lvl 2 -->
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

          <!-- extra lvl 2 -->
          <li
            v-if="user?.role === 'admin' || user?.role === 'editor'"
            class="relative h-11 bg-[#00a28c]/[0.33]"
            @mouseenter="enterSub(-1)"
            @mouseleave="leaveSub"
            @click.stop="addLvl2(path.id)"
          >
            <div
              class="h-full w-full flex items-center cursor-pointer ml-5"
              :class="{ 'text-[#F18700]': hoveredSub === -1 }"
            >
              <b class="text-[#F18700]">+</b>&emsp;
              <b>Extra Unterpunkt</b>
            </div>
          </li>
        </ul>
      </li>

      <!-- extra lvl 1 -->
      <li
        v-if="user?.role === 'admin' || user?.role === 'editor'"
        class="relative h-11 bg-[#00a28c]/[0.33] rounded-bl-2xl"
        @mouseenter="enterCategory(-1)"
        @mouseleave="leaveCategory"
        @click.stop="addLvl1()"
      >
        <div
          class="h-full w-full flex items-center ml-5 cursor-pointer"
          :class="{ 'text-[#F18700]': hoveredCategory === -1 }"
        >
          <b class="text-[#F18700]">+</b>&emsp;
          <b>Extra Menüpunkt</b>
        </div>
      </li>
    </ul>

    <div class="absolute top-0 left-50">
      <lvl1-component
        v-if="addingLvl1"
        @cancle="cancleAdding()"
        @add="
          (menuName: string, subMenuName: string) =>
            addLvl1Menu(menuName, subMenuName)
        "
      ></lvl1-component>

      <lvl2-component
        v-if="addingLvl2"
        @cancle="cancleAdding()"
        @add="(subMenuName: string) => addLvl2Menu(subMenuName)"
      ></lvl2-component>
    </div>
  </div>
</template>
