<script setup lang="ts">
import NavMenu from "~/component/nav/nav-menu.vue";
import { mapping, mappingLower } from "~/utils/utils";
import type { Structure } from "~/types/structure";
import { useRoute } from "#imports";

const uiStore = useUiStore();
const structureStore = useStructureStore();

const route = useRoute();

const path = ref("");
const subPath = ref("");
const category = ref("");

const pathId = ref("");
const subPathId = ref("");

uiStore.triggerTopAction = (value: string) => {
  // clearPaths();
  // path.value = value;
};

const { data } = await useFetch<Structure[]>(`/api/structure`, {
  method: "GET",
});

watch(
  data,
  (newVal) => {
    if (newVal) structureStore.setStructure(newVal);
  },
  { immediate: true },
);

watch(
  () => route.params,
  () => {
    handleRouting();

    // switch (route.params.path) {
    //   case "/": {
    //     path.value = "Startseite";
    //     break;
    //   }
    //   case "/contact": {
    //     path.value = "Kontakt";
    //     break;
    //   }
    //   case "/impressum": {
    //     path.value = "Impressum";
    //     break;
    //   }
    //   case "introduction": {
    //     path.value = "Einleitung";
    //     break;
    //   }
    // }
  },
);

onMounted(() => {
  handleRouting();
});

function handleRouting() {
  clearPaths();

  if (route.params.path) {
    path.value = structureStore.getTitleById(route.params.path as string)!;
  }

  if (route.params.subPath) {
    subPath.value = structureStore.getChildTitleById(
      route.params.path as string,
      route.params.subPath as string,
    )!;
  }

  if (route.params.page) {
    category.value = mappingLower[route.params.page as string]!;
  }
}

function post(pathNewId: string, subPathNewId: string, categoryNew: string) {
  pathId.value = pathNewId;
  subPathId.value = subPathNewId;

  navigateTo(`/${pathNewId}/${subPathNewId}/${mapping[categoryNew]}`);
}

function login() {
  alert("clicked login");
}

function introduction() {
  // clearPaths();
  // path.value = "Einleitung";

  navigateTo("/introduction");
}

function returnToHome() {
  navigateTo("/");
}

function navigateOneStepBack() {
  //hat er ned wenn die leer sind -_- :D :P ;C :O
  navigateTo(`/${pathId.value}/${subPathId.value}`);
}

function navigateTwoStepsBack() {
  navigateTo(`/${pathId.value}`);
}

function clearPaths() {
  path.value = "";
  subPath.value = "";
  category.value = "";
}
</script>

<template>
  <div class="mt-5 ml-5 mb-10 flex justify-between">
    <img
      class="w-60 cursor-pointer"
      src="/img/logo.png"
      alt="logo"
      @click="returnToHome()"
    />

    <div class="mr-5 flex gap-5">
      <button class="text-xl cursor-pointer" @click="login()">Login</button>
      <button class="text-xl cursor-pointer" @click="introduction()">
        Einleitung
      </button>
    </div>
  </div>

  <div class="mb-15 flex justify-center items-start gap-1">
    <nav-menu
      v-if="data"
      :data="structureStore.structure"
      @emit-route="
        (pathIdNew, subPathNewId, categoryNew) =>
          post(pathIdNew, subPathNewId, categoryNew)
      "
    ></nav-menu>

    <div class="relative">
      <div class="flex flex-col absolute h-full justify-center ml-20">
        <h1 class="text-6xl">
          <b>Kolping</b>
        </h1>
        <h1 class="text-6xl"><b>Handbuch</b></h1>
      </div>

      <img class="h-77 w-150" src="/img/header.png" alt="header" />
    </div>
  </div>

  <div class="h-10 bg-gray-200 mb-10"></div>

  <div class="flex gap-3 ml-20 mb-10">
    <a class="cursor-pointer" @click="returnToHome()">Handbuch</a>
    <span v-if="path !== ''">></span>
    <a
      v-if="path !== ''"
      class="cursor-pointer"
      @click="navigateTwoStepsBack()"
      >{{ path }}</a
    >
    <span v-if="subPath !== ''">></span>
    <a
      v-if="subPath !== ''"
      class="cursor-pointer"
      @click="navigateOneStepBack()"
      >{{ subPath }}</a
    >
    <span v-if="category !== ''">></span>
    <span v-if="category !== ''">{{ category }}</span>
  </div>
</template>

<style scoped></style>
