<script setup lang="ts">
import { useRoute } from "#imports";
import type { BreadcrumbItem } from "@nuxt/ui";
import { getDisplayName, getRedirect } from "~/utils/nav/nav-menu";
import { useWindowSize, useMounted } from "@vueuse/core";

const items: Ref<BreadcrumbItem[]> = ref([
  {
    label: "Handbuch",
    to: "/",
  },
]);

const structureStore = useStructureStore();
const { loggedIn, user } = useUserSession();

const { width } = useWindowSize();

const route = useRoute();

const isActive = ref(false);

const isMounted = useMounted();

watch(
  () => route.params,
  () => {
    handlePaths();
  },
);

async function fetchStructure() {
  const structure = await $fetch<Structure[]>(`/api/content/structure`, {
    method: "GET",
  });

  structureStore.setStructure(structure);
}

await fetchStructure();
handlePaths();

function handlePaths() {
  items.value = [
    {
      label: "Handbuch",
      to: "/",
    },
  ];

  const segments = useRoute().path.split("/").filter(Boolean);
  const len = segments.length;

  if (segments[0] === "kolping" && len === 2) {
    items.value.push({
      label: getDisplayName(segments[1]!)!,
    });

    return;
  }

  if (segments[0] === "usermanagement" && len === 1) {
    items.value.push({
      label: getDisplayName(segments[0]!)!,
    });

    return;
  }

  if (segments[0] === "filemanagement" && len === 1) {
    items.value.push({
      label: getDisplayName(segments[0]!)!,
    });

    return;
  }

  if (len === 1) {
    items.value.push({
      label: `${structureStore.getIdByUuid(segments[0]!)!} ${structureStore.getDisplayNameByUuid(segments[0]!)!}`,
    });

    return;
  }

  if (len === 2) {
    items.value.push({
      label: `${structureStore.getIdByUuid(segments[0]!)!} ${structureStore.getDisplayNameByUuid(segments[0]!)!}`,
      to: `/${segments[0]}`,
    });

    items.value.push({
      label: `${structureStore.getChildIdByUuid(
        segments[0]!,
        segments[1]!,
      )!} ${structureStore.getChildDisplayNameByUuid(
        segments[0]!,
        segments[1]!,
      )!}`,
      to: `/${segments[0]}/${segments[1]}`,
    });

    return;
  }

  if (len === 3) {
    items.value.push({
      label: `${structureStore.getIdByUuid(segments[0]!)!} ${structureStore.getDisplayNameByUuid(segments[0]!)!}`,
      to: `/${segments[0]}`,
    });
    items.value.push({
      label: `${structureStore.getChildIdByUuid(
        segments[0]!,
        segments[1]!,
      )!} ${structureStore.getChildDisplayNameByUuid(
        segments[0]!,
        segments[1]!,
      )!}`,
      to: `/${segments[0]}/${segments[1]}`,
    });
    items.value.push({
      label: getDisplayName(segments[2]!)!,
    });
    return;
  }
}

function navigateToCategory(
  pathId: string,
  subPathId: string,
  category: string,
) {
  if (subPathId === null) {
    navigateTo(`/${pathId}`);
    isActive.value = !isActive.value;
    return;
  }

  if (category === null) {
    navigateTo(`/${pathId}/${subPathId}`);
    isActive.value = !isActive.value;
    return;
  }

  navigateTo(`/${pathId}/${subPathId}/${getRedirect(category)}`);
  isActive.value = false;
}

function navigatoToIntroduction() {
  navigateTo(`/kolping/introduction`);
  isActive.value = false;
}

function navigateToAdmin() {
  navigateTo(`/usermanagement`);
  isActive.value = false;
}

function navigateToAddFile() {
  navigateTo(`/filemanagement`);
  isActive.value = false;
}

function navigateToLoginPage() {
  navigateTo(`/kolping/login`);
  isActive.value = false;
}

function navigateToHome() {
  navigateTo("/");
  isActive.value = false;
}
</script>

<template>
  <div>
    <div
      class="flex items-center justify-between lg:mx-5 mt-5 mb-5 lg:mb-7 mx-3"
    >
      <img
        class="not-lg:w-40 lg:w-60 cursor-pointer lg:mb-0"
        src="/img/logo.png"
        alt="logo"
        @click="navigateToHome()"
      />

      <div class="flex lg:gap-5 gap-3">
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
          v-if="user && (user?.role === 'admin' || user?.role === 'editor')"
          class="text-xl cursor-pointer"
          @click="navigateToAddFile()"
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
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
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

        <button v-if="width <= 1024" @click="isActive = !isActive">
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
      class="flex justify-center items-start gap-1"
      :class="{
        'mb-0': isMounted && !isActive && width <= 1024,
        'mb-5': isMounted && isActive && width <= 1024,
        'mb-10': !isMounted || width > 1024,
      }"
    >
      <NavMenuElement
        :data="structureStore.structure"
        :active="isActive"
        @emit-route="
          (pathIdNew, subPathNewId, categoryNew) =>
            navigateToCategory(pathIdNew, subPathNewId, categoryNew)
        "
        @refetch="fetchStructure()"
        @active="isActive = false"
      ></NavMenuElement>

      <div
        v-if="(isActive && !(width <= 1024)) || !(width <= 1024)"
        class="relative block"
      >
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

    <div class="flex justify-center items-center mb-5">
      <div class="w-[90vw] lg:w-[60vw]">
        <UBreadcrumb :items="items">
          <template #item-label="{ item }">
            <div class="lg:text-lg">{{ item.label }}</div>
          </template>
        </UBreadcrumb>
      </div>
    </div>
  </div>
</template>

<style></style>
