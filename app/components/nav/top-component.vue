<script setup lang="ts">
import NavMenu from "~/components/nav/nav-menu.vue";
import type { Structure } from "~/utils/type/structure";
import { useRoute, useDevice } from "#imports";

const structureStore = useStructureStore();

const { loggedIn, user } = useUserSession();

const contentPage = ref(true);

const route = useRoute();

const path = ref("");
const subPath = ref("");
const category = ref("");

const pathId = ref("");
const subPathId = ref("");

const isActive = ref(false);

const { isMobile } = useDevice();

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
      class="mt-5 mb-5 lg:mb-10 ml-5 flex items-center h-full justify-between lg:flex-row"
    >
      <img
        class="not-lg:w-40 lg:w-60 cursor-pointer lg:mb-0"
        src="/img/logo.png"
        alt="logo"
        @click="returnToHome()"
      />

      <div class="flex gap-5 mr-5 lg:flex-row">
        <button
          v-if="user && user?.role === 'admin'"
          class="text-xl cursor-pointer"
          @click="navigateToAdmin()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 lg:size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </button>

        <button
          class="text-xl cursor-pointer"
          @click="navigatoToIntroduction()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 lg:size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </button>

        <button
          v-if="!loggedIn"
          class="text-xl cursor-pointer"
          @click="navigateToLoginPage()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 lg:size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
        </button>
        <button
          v-if="loggedIn"
          class="text-xl cursor-pointer"
          @click="navigateToLoginPage()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 lg:size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>

        <button v-if="isMobile" @click="isActive = !isActive">
          <svg
            v-if="!isActive"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 lg:size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 lg:size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="lg:mb-10 flex justify-center items-start gap-1"
      :class="{ 'mb-0': !isActive, 'mb-5': isActive }"
    >
      <nav-menu
        :data="structureStore.structure"
        :active="isActive"
        @emit-route="
          (pathIdNew, subPathNewId, categoryNew) =>
            navigateToCategory(pathIdNew, subPathNewId, categoryNew)
        "
        @refetch="fetchStructure()"
        @active="isActive = !isActive"
      ></nav-menu>

      <div class="relative hidden lg:block">
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
          class="w-150"
          src="/img/header.png"
          alt="header"
        />
      </div>
    </div>

    <div class="h-10 bg-gray-200 mb-5 lg:mb-10"></div>

    <div class="flex justify-center items-center lg:mb-3">
      <div class="w-[90vw] lg:w-[60vw] flex flex-col lg:flex-row">
        <a class="cursor-pointer flex mr-3" @click="returnToHome()">Handbuch</a>

        <div>
          <span v-if="path !== ''" class="mr-3">></span>
          <a
            v-if="path !== '' && subPath !== ''"
            class="cursor-pointer"
            @click="navigateTwoStepsBack()"
          >
            <span v-if="contentPage" class="mr-3"
              >{{ structureStore.getIdByUuid(pathId) }}
            </span>
            <span class="mr-3">{{ path }}</span>
          </a>

          <span v-if="path !== '' && subPath === ''">
            <span v-if="contentPage" class="mr-3"
              >{{ structureStore.getIdByUuid(pathId) }}
            </span>
            <span class="mr-3">{{ path }}</span>
          </span>
        </div>

        <div>
          <span v-if="subPath !== ''" class="mr-3">></span>
          <a
            v-if="subPath !== '' && category !== ''"
            class="cursor-pointer"
            @click="navigateOneStepBack()"
          >
            <span v-if="contentPage" class="mr-3"
              >{{ structureStore.getChildIdByUuid(pathId, subPathId) }}
            </span>
            <span class="mr-3">{{ subPath }}</span>
          </a>

          <span v-if="subPath !== '' && category === ''">
            <span v-if="contentPage" class="mr-3"
              >{{ structureStore.getChildIdByUuid(pathId, subPathId) }}
            </span>
            <span class="mr-3">{{ subPath }}</span>
          </span>
        </div>

        <div>
          <span v-if="category !== ''" class="mr-3">></span>
          <span v-if="category !== ''" class="mr-3">{{ category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
