<script setup lang="ts">
import type { Kernprozess } from "~/types/kernprozess";
import { useRoute } from "#imports";

definePageMeta({
  middleware: ["authenticated"],
});

const route = useRoute();

const { data } = await useFetch<Kernprozess[]>("/api/kernprozess/all", {
  method: "GET",
  query: {
    path: route.params.path,
    subPath: route.params.subPath,
  },
});

const editingStates = ref<Record<string, boolean>>({});

function isEditing(key: string) {
  return editingStates.value[key] === true;
}

function toggleEditing(key: string) {
  editingStates.value[key] = !editingStates.value[key];
}

function send(key: string) {
  if (
    confirm(
      "Sind Sie sicher, dass sie die aktuelle Datei überschreiben möchten?",
    )
  ) {
    editingStates.value[key] = false;
  }
}
</script>

<template>
  <div>
    <div v-for="kernprozess in data!" :key="kernprozess.middleHead">
      <div class="ml-20">
        <button
          v-if="!isEditing(kernprozess.middleHead)"
          class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded"
          @click.prevent="toggleEditing(kernprozess.middleHead)"
        >
          BEARBEITEN
        </button>

        <button
          v-else
          class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded"
          @click="send(kernprozess.middleHead)"
        >
          FERTIG
        </button>
      </div>

      <div class="flex justify-center gap-10 mt-10 mb-10">
        <div class="w-50 xl:w-80">
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
                <a v-if="elem.hasLink" class="cursor-pointer">{{
                  elem.text
                }}</a>
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
                <a v-if="elem.hasLink" class="cursor-pointer">{{
                  elem.text
                }}</a>
                <span v-if="!elem.hasLink">{{ elem.text }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="relative w-100 xl:w-130">
          <h3 class="absolute top-2.5 left-3 text-white font-bold text-xl z-10">
            {{ kernprozess.middleHead }}
          </h3>

          <img
            src="https://handbuch.kolping.at/tl_files/kolping_handbuch/kernprozess_header_blue.png"
            alt="blue"
            class="xl:w-130"
          />

          <div class="bg-[#F18700]">
            <p class="text-white font-bold ml-3 pt-3">
              TÄTIGKEIT / ENTSCHEIDUNG / PRÜFSCHRITT
            </p>

            <ul class="list-disc pl-6">
              <li
                v-for="elem in kernprozess.middleList"
                :key="elem.text"
                class="text-white ml-3"
              >
                <a v-if="elem.hasLink" class="cursor-pointer">{{
                  elem.text
                }}</a>
                <span v-if="!elem.hasLink">{{ elem.text }}</span>
              </li>
            </ul>
          </div>

          <img
            src="https://handbuch.kolping.at/tl_files/kolping_handbuch/kernprozess_bottom_orange.png"
            alt="orange"
            class="xl:w-130"
          />
        </div>

        <div class="w-50 xl:w-80">
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
                <a v-if="elem.hasLink" class="cursor-pointer">{{
                  elem.text
                }}</a>
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
  </div>
</template>

<style scoped></style>
