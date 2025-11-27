<script setup lang="ts">
import { useRoute } from "#imports";

definePageMeta({
  middleware: ["authenticated"],
});

const route = useRoute();

const structureStore = useStructureStore();

function navigateToSubPath(subPath: string) {
  navigateTo(`/${route.params.path}/${subPath}`);
}
</script>

<template>
  <div class="flex justify-center items-center">
    <div class="w-[90vw] lg:w-[60vw]">
      <div v-for="structure in structureStore.structure" :key="structure.id">
        <div v-if="structure.uuid === route.params.path">
          <h1 class="mt-6 mb-4 text-2xl leading-tight font-bold">
            {{ structure.id }} {{ structure.name }}
          </h1>

          <hr class="my-6 border-t-4 border-dotted text-gray-400" />

          <ul
            v-for="structureChild in structure.children"
            :key="structureChild.id"
          >
            <li>
              <h2
                class="mt-6 mb-3 text-xl leading-snug font-semibold hover:underline cursor-pointer"
                @click="navigateToSubPath(structureChild.uuid)"
              >
                {{ structureChild.id }} {{ structureChild.name }}
              </h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
