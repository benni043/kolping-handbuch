<script setup lang="ts">
import { useRoute } from "#imports";

const route = useRoute();

const structureStore = useStructureStore();

function navigateToSubPath(subPath: string) {
  navigateTo(`/${route.params.path}/${subPath}`);
}

function navigateToCategory(category: string) {
  navigateTo(`/${route.params.path}/${route.params.subPath}/${category}`);
}
</script>

<template>
  <div class="ml-20 mr-60 lg:mr-100 xl:mr-150">
    <div v-for="structure in structureStore.structure">
      <div v-if="structure.id === route.params.path">
        <h1 class="mt-6 mb-4 text-2xl leading-tight font-bold">
          {{ structure.id }} {{ structure.title }}
        </h1>

        <hr class="my-6 border-t-4 border-dotted text-gray-400" />

        <ul v-for="structureChild in structure.children">
          <li>
            <h2
              @click="navigateToSubPath(structureChild.id)"
              class="mt-6 mb-3 text-xl leading-snug font-semibold hover:underline cursor-pointer"
            >
              {{ structureChild.id }} {{ structureChild.title }}
            </h2>

            <ul
              class="pl-6"
              v-for="elem in categories"
              v-if="structureChild.id === route.params.subPath"
            >
              <li
                @click="navigateToCategory(mapping[elem]!)"
                class="mb-1 cursor-pointer hover:text-[#F18700]"
              >
                {{ elem }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
