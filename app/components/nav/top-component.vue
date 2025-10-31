<script setup lang="ts">
import NavMenu from "~/components/nav/nav-menu.vue";
import type { Structure } from "~/types/structure";
import { useRoute } from "#imports";

const structureStore = useStructureStore();

const { loggedIn, user } = useUserSession();

const route = useRoute();

const path = ref("");
const subPath = ref("");
const category = ref("");

const pathId = ref("");
const subPathId = ref("");

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
  },
);

onMounted(() => {
  handleRouting();
});

function handleRouting() {
  const segment0 = getSegment(1);

  switch (segment0) {
    case introductionLower: {
      clearPaths();
      path.value = introductionUpper;
      pathId.value = introductionLower;
      return;
    }
    case contactLower: {
      clearPaths();
      path.value = contactUpper;
      pathId.value = contactLower;
      return;
    }
    case impressumLower: {
      clearPaths();
      path.value = impressumUpper;
      pathId.value = impressumLower;
      return;
    }
    case loginLower: {
      clearPaths();
      path.value = loginUpper;
      pathId.value = loginLower;
      return;
    }
  }

  const segment2 = getSegment(2);

  if (route.params.path || route.params.subPath || segment2) clearPaths();

  if (route.params.path) {
    path.value = structureStore.getTitleById(route.params.path as string)!;
    pathId.value = route.params.path as string;
  }

  if (route.params.subPath) {
    subPath.value = structureStore.getChildTitleById(
      route.params.path as string,
      route.params.subPath as string,
    )!;

    subPathId.value = route.params.subPath as string;
  }

  if (segment2) {
    category.value = mappingLower[segment2 as string]!;
  }
}

function navigateToCategory(
  pathNewId: string,
  subPathNewId: string,
  categoryNew: string,
) {
  pathId.value = pathNewId;

  if (subPathNewId === null) {
    navigateTo(`/${pathNewId}`);

    return;
  }

  if (categoryNew === null) {
    subPathId.value = subPathNewId;

    navigateTo(`/${pathNewId}/${subPathNewId}`);

    return;
  }

  navigateTo(`/${pathNewId}/${subPathNewId}/${mapping[categoryNew]}`);
}

function clearPaths() {
  path.value = "";
  subPath.value = "";
  category.value = "";
}

function navigatoToIntroduction() {
  navigateTo(`/kolping/${introductionLower}`);
}

function navigateToAdmin() {
  navigateTo(`/${adminLower}`);
}

async function navigateToLoginPage() {
  await navigateTo(`/kolping/${loginLower}`);
}

function returnToHome() {
  clearPaths();
  navigateTo("/");
}

function navigateOneStepBack() {
  navigateTo(`/${pathId.value}/${subPathId.value}`);
}

function navigateTwoStepsBack() {
  navigateTo(`/${pathId.value}`);
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
      <button
        v-if="user && user?.role === 'admin'"
        class="text-xl cursor-pointer"
        @click="navigateToAdmin()"
      >
        admin
      </button>
      <button
        v-if="!loggedIn"
        class="text-xl cursor-pointer"
        @click="navigateToLoginPage()"
      >
        Login
      </button>
      <button
        v-if="loggedIn"
        class="text-xl cursor-pointer"
        @click="navigateToLoginPage()"
      >
        Logout
      </button>
      <button class="text-xl cursor-pointer" @click="navigatoToIntroduction()">
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
          navigateToCategory(pathIdNew, subPathNewId, categoryNew)
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
