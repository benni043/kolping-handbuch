<script setup lang="ts">
import type { Kernprozess } from "~/types/kernprozess";
import KernprozessCreator from "~/components/admin/kernprozess/kernprozess-creator.vue";
import { useRoute } from "#imports";
import { useBlurStore } from "~/stores/useBlur";

definePageMeta({
  middleware: ["authenticated"],
});

const { user } = useUserSession();

const route = useRoute();
const blurStore = useBlurStore();

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
  blurStore.blur = !blurStore.blur;
  editingStates.value[key] = !editingStates.value[key];
}

async function deleteKernprozess(kernprozessNumber: number) {
  if (
    confirm(
      "Sind Sie sicher, dass Sie diesen Kernprozess löschen möchten? Dieser Vorgang kann nicht Rückgängig gemacht werden!",
    )
  ) {
    await $fetch("/api/save/kernprozess/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: {
        path: getSegment(0),
        subPath: getSegment(1),
        kernprozessNumber: kernprozessNumber,
      },
    });

    if (data.value) {
      data.value = data.value.filter(
        (k) => k.schrittCount !== kernprozessNumber,
      );
    }
  }
}

watch(
  editingStates,
  (val) => {
    const anyEditing = Object.values(val).some((v) => v);
    document.body.style.overflow = anyEditing ? "hidden" : "";
  },
  { deep: true },
);
</script>

<template>
  <div>
    <div
      class="flex my-5 justify-end mr-10"
      :class="{ 'blur-sm': blurStore.blur }"
    >
      <button
        class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        @click.prevent="toggleEditing('new')"
      >
        NEU
      </button>
    </div>

    <div
      v-if="isEditing('new')"
      class="fixed inset-0 z-50 overflow-y-auto p-6 blur-none"
    >
      <KernprozessCreator
        :schritt-count="undefined"
        :vorgaben-blue="undefined"
        :vorlagen-blue="undefined"
        :middle-head="undefined"
        :middle-list="undefined"
        :aufzeichnung-orange="undefined"
        :verantwortlicher-orange="undefined"
        :information-orange="undefined"
        :editing="false"
        @cancle="toggleEditing('new')"
      />
    </div>

    <div v-for="kernprozess in data!" :key="kernprozess.middleHead">
      <div
        v-if="user && user.role === 'admin'"
        class="ml-20 flex gap-5"
        :class="{ 'blur-sm': blurStore.blur }"
      >
        <button
          class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          @click.prevent="toggleEditing(kernprozess.middleHead)"
        >
          BEARBEITEN
        </button>

        <button
          class="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          @click.prevent="deleteKernprozess(kernprozess.schrittCount)"
        >
          X
        </button>
      </div>

      <div
        v-if="isEditing(kernprozess.middleHead)"
        class="fixed inset-0 z-50 overflow-y-auto p-6 blur-none"
      >
        <KernprozessCreator
          :schritt-count="kernprozess.schrittCount"
          :vorgaben-blue="kernprozess.vorgabenBlue"
          :vorlagen-blue="kernprozess.vorlagenBlue"
          :middle-head="kernprozess.middleHead"
          :middle-list="kernprozess.middleList"
          :aufzeichnung-orange="kernprozess.aufzeichnungOrange"
          :verantwortlicher-orange="kernprozess.verantwortlicherOrange"
          :information-orange="kernprozess.informationOrange"
          :editing="true"
          @cancle="toggleEditing(kernprozess.middleHead)"
        />
      </div>

      <div
        class="flex justify-center gap-10 mt-10 mb-10"
        :class="{ 'blur-sm': blurStore.blur }"
      >
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
                <a v-if="elem.hasLink" class="cursor-pointer hover:underline">{{
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
                <a v-if="elem.hasLink" class="cursor-pointer hover:underline">{{
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
                <span>{{ elem.text }}</span>
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
                <a v-if="elem.hasLink" class="cursor-pointer hover:underline">{{
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
