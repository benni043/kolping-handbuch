<script setup lang="ts">
import NavMenu from "~/components/nav/nav-menu.vue";
import type { Structure } from "~/types/structure";
import { useRoute } from "#imports";
import { useBlurStore } from "~/stores/useBlur";

const structureStore = useStructureStore();
const blurStore = useBlurStore();

const { loggedIn, user } = useUserSession();

const contentPage = ref(true);

const route = useRoute();

const path = ref("");
const subPath = ref("");
const category = ref("");

const pathId = ref("");
const subPathId = ref("");

watch(
  () => route.params,
  () => {
    handleRouting();
  },
);

async function fetchStructure() {
  const structure = await $fetch<Structure[]>(`/api/structure`, {
    method: "GET",
  });

  structureStore.setStructure(structure);
}

onMounted(() => {
  fetchStructure();
  handleRouting();
});

const isEditing = ref(true);

watch(
  isEditing,
  () => {
    document.body.style.overflow = isEditing.value ? "hidden" : "";
  },
  { deep: true },
);

function handleRouting() {
  const segment0 = getSegment(1);

  switch (segment0) {
    case introductionLower: {
      clearPaths();
      path.value = introductionUpper;
      pathId.value = introductionLower;
      contentPage.value = false;
      return;
    }
    case contactLower: {
      clearPaths();
      path.value = contactUpper;
      pathId.value = contactLower;
      contentPage.value = false;
      return;
    }
    case impressumLower: {
      clearPaths();
      path.value = impressumUpper;
      pathId.value = impressumLower;
      contentPage.value = false;
      return;
    }
    case loginLower: {
      clearPaths();
      path.value = loginUpper;
      pathId.value = loginLower;
      contentPage.value = false;
      return;
    }
    case startPageLower: {
      clearPaths();
      path.value = startPageUpper;
      pathId.value = startPageLower;
      contentPage.value = false;
      return;
    }
  }

  contentPage.value = true;

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
  clearPaths();

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
  clearPaths();

  navigateTo(`/${pathId.value}/${subPathId.value}`);
}

function navigateTwoStepsBack() {
  clearPaths();

  navigateTo(`/${pathId.value}`);
}
</script>

<template>
  <div>
    <div
      class="mt-5 ml-5 mb-10 flex justify-between"
      :class="{ 'blur-sm': blurStore.blur }"
    >
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
          Admin
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

        <button
          class="text-xl cursor-pointer"
          @click="navigatoToIntroduction()"
        >
          Einleitung
        </button>
      </div>
    </div>

    <div class="mb-15 flex justify-center items-start gap-1">
      <nav-menu
        :data="structureStore.structure"
        @emit-route="
          (pathIdNew, subPathNewId, categoryNew) =>
            navigateToCategory(pathIdNew, subPathNewId, categoryNew)
        "
        @refetch="fetchStructure()"
      ></nav-menu>

      <div class="relative" :class="{ 'blur-sm': blurStore.blur }">
        <div class="flex flex-col absolute h-full justify-center ml-20">
          <h1 class="text-6xl">
            <b>Kolping</b>
          </h1>
          <h1 class="text-6xl"><b>Handbuch</b></h1>
        </div>

        <img
          :style="{
            height: `calc(var(--spacing) * ${(structureStore.getOuterCount() + (user?.role === 'editor' || user?.role === 'admin' ? 1 : 0)) * 11})`,
          }"
          class="w-150 test"
          src="/img/header.png"
          alt="header"
        />
      </div>
    </div>

    <div
      :class="{ 'blur-sm': blurStore.blur }"
      class="h-10 bg-gray-200 mb-10"
    ></div>

    <div :class="{ 'blur-sm': blurStore.blur }" class="flex gap-3 ml-20 mb-10">
      <a class="cursor-pointer" @click="returnToHome()">Handbuch</a>

      <span v-if="path !== ''">></span>
      <a
        v-if="path !== '' && subPath !== ''"
        class="cursor-pointer"
        @click="navigateTwoStepsBack()"
      >
        <span v-if="contentPage"
          >{{ structureStore.getIdByUuid(pathId) }}&ensp;</span
        >
        <span>{{ path }}</span>
      </a>
      <span v-if="path !== '' && subPath === ''">
        <span v-if="contentPage"
          >{{ structureStore.getIdByUuid(pathId) }}&ensp;</span
        >
        <span>{{ path }}</span>
      </span>

      <span v-if="subPath !== ''">></span>
      <a
        v-if="subPath !== '' && category !== ''"
        class="cursor-pointer"
        @click="navigateOneStepBack()"
      >
        <span v-if="contentPage"
          >{{ structureStore.getChildIdByUuid(pathId, subPathId) }}&ensp;</span
        >
        <span>{{ subPath }}</span>
      </a>
      <span v-if="subPath !== '' && category === ''">
        <span v-if="contentPage"
          >{{ structureStore.getChildIdByUuid(pathId, subPathId) }}&ensp;</span
        >
        <span>{{ subPath }}</span>
      </span>

      <span v-if="category !== ''">></span>
      <span v-if="category !== ''">{{ category }}</span>
    </div>
  </div>
</template>

<style scoped></style>
