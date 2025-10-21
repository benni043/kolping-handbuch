<script setup lang="ts">
import type { Kernprozess } from "~/types/kernprozess";
import { ref, watch } from "vue";
import { useRoute } from "#imports";

const route = useRoute();

const path = ref("");
const subPath = ref("");

path.value = route.params.path as string;
subPath.value = route.params.subpath as string;

// const res = await $fetch("/api/kernprozess", {
//   method: "GET",
//   params: {
//     path: path.value,
//     subPath: subPath.value,
//     kernprozessNum: 1,
//   },
// });

const res = await $fetch("/api/kernprozess/all", {
  method: "GET",
  params: {
    path: path.value,
    subPath: subPath.value,
  },
});

const kernprozesses = ref<Kernprozess[]>([]);
if (res) kernprozesses.value = res;
</script>

<template>
  <div v-for="kernprozess in kernprozesses">
    <div class="flex justify-around mt-10 ml-[10vw] mr-[10vw] gap-5">
      <div class="max-w-100">
        <h2 class="text-[#50A9CE] font-bold text-2xl">
          Schritt {{ kernprozess.schrittCount }}
        </h2>

        <hr class="text-[#50A9CE] mb-2 mt-3 border-t-4 border-dotted" />

        <div>
          <h2 class="text-[#50A9CE] font-bold">VORGABEN / ARBEITSHILFEN</h2>

          <ul class="list-disc pl-6">
            <li
              v-for="elem in kernprozess.vorgabenBlue"
              :key="elem.text"
              class="marker:text-[#50A9CE]"
            >
              <a v-if="elem.hasLink" class="cursor-pointer">{{ elem.text }}</a>
              <span v-if="!elem.hasLink">{{ elem.text }}</span>
            </li>
          </ul>
        </div>

        <br />

        <div v-if="kernprozess.vorlagenBlue.length >= 1">
          <h2 class="text-[#50A9CE] font-bold">VORLAGEN SCHLUSSBERICHTE</h2>

          <ul class="list-disc pl-6">
            <li
              v-for="elem in kernprozess.vorlagenBlue"
              :key="elem.text"
              class="marker:text-[#50A9CE]"
            >
              <a v-if="elem.hasLink" class="cursor-pointer">{{ elem.text }}</a>
              <span v-if="!elem.hasLink">{{ elem.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="relative w-[450px] flex flex-col min-w-120 max-w-120">
        <h3 class="absolute top-2 left-3 text-white font-bold text-2xl z-10">
          {{ kernprozess.middleHead }}
        </h3>

        <img
          src="https://handbuch.kolping.at/tl_files/kolping_handbuch/kernprozess_header_blue.png"
          alt="blue"
        />

        <div class="bg-[#F18700]">
          <p class="text-white font-bold ml-3">
            TÄTIGKEIT / ENTSCHEIDUNG / PRÜFSCHRITT
          </p>

          <ul class="list-disc pl-6">
            <li
              v-for="elem in kernprozess.middleList"
              :key="elem.text"
              class="text-white ml-3"
            >
              <a v-if="elem.hasLink" class="cursor-pointer">{{ elem.text }}</a>
              <span v-if="!elem.hasLink">{{ elem.text }}</span>
            </li>
          </ul>
        </div>

        <img
          src="https://handbuch.kolping.at/tl_files/kolping_handbuch/kernprozess_bottom_orange.png"
          alt="orange"
          class=""
        />
      </div>

      <div class="max-w-100">
        <div>
          <h2 class="text-[#F18700] font-bold">
            AUFZEICHNUNGEN / DOKUMENTATION
          </h2>

          <ul class="list-disc pl-6">
            <li
              v-for="elem in kernprozess.aufzeichnungOrange"
              :key="elem.text"
              class="marker:text-[#F18700]"
            >
              <a v-if="elem.hasLink" class="cursor-pointer">{{ elem.text }}</a>
              <span v-if="!elem.hasLink">{{ elem.text }}</span>
            </li>
          </ul>
        </div>

        <div v-if="kernprozess.verantwortlicherOrange.length >= 1">
          <h2 class="text-[#F18700] mt-3 font-bold">VERANTWORTLICHE/R</h2>
          <p class="pl-2">{{ kernprozess.verantwortlicherOrange }}</p>
        </div>

        <div v-if="kernprozess.informationOrange.length >= 1">
          <h2 class="text-[#F18700] mt-3 font-bold">INFORMATION AN</h2>
          <p class="pl-2">{{ kernprozess.informationOrange }}</p>
        </div>

        <hr class="text-gray-400 mb-2 mt-3 border-t-4 border-dotted" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
