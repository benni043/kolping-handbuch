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

const kernprozesseRef: Ref<Kernprozess[]> = ref([]);

async function fetchKernprozesse() {
  const kernprozesse = await $fetch<Kernprozess[]>("/api/kernprozess/all", {
    method: "GET",
    query: {
      path: route.params.path,
      subPath: route.params.subPath,
    },
  });

  kernprozesseRef.value = kernprozesse;
  kernprozesseRef.value = kernprozesse.sort(
    (k, k2) => k.schrittCount - k2.schrittCount,
  );
}

const editingStates = ref<Record<number, boolean>>({});

function isEditing(key: number) {
  return editingStates.value[key] === true;
}

function toggleEditing(key: number) {
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

    kernprozesseRef.value = kernprozesseRef.value.filter(
      (k) => k.schrittCount !== kernprozessNumber,
    );
  }
}

async function send(kernprozess: Kernprozess, count: number) {
  await $fetch("/api/save/kernprozess/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      path: getSegment(0),
      subPath: getSegment(1),
      kernprozessNumber: kernprozess.schrittCount,
      data: JSON.stringify(kernprozess),
    },
  });

  await fetchKernprozesse();

  toggleEditing(count);
}

watch(
  editingStates,
  (val) => {
    const anyEditing = Object.values(val).some((v) => v);
    document.body.style.overflow = anyEditing ? "hidden" : "";
  },
  { deep: true },
);

onMounted(() => {
  fetchKernprozesse();
});
</script>

<template>
  <div>
    <div
      class="flex my-5 justify-end mr-10"
      :class="{ 'blur-sm': blurStore.blur }"
    >
      <button
        v-if="user && (user.role === 'admin' || user.role === 'editor')"
        class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        @click.prevent="toggleEditing(0)"
      >
        NEU
      </button>
    </div>

    <div
      v-if="isEditing(0)"
      class="fixed inset-0 z-50 overflow-y-auto p-6 blur-none"
    >
      <KernprozessCreator
        :schritt-count="kernprozesseRef.length + 1"
        :vorgaben-blue="undefined"
        :vorlagen-blue="undefined"
        :middle-head="undefined"
        :middle-list="undefined"
        :aufzeichnung-orange="undefined"
        :verantwortlicher-orange="undefined"
        :information-orange="undefined"
        :orange="false"
        :editing="false"
        @cancle="toggleEditing(0)"
        @send="(kernprozess) => send(kernprozess, 0)"
      />
    </div>

    <div v-for="kernprozess in kernprozesseRef" :key="kernprozess.middleHead">
      <div
        v-if="user && (user.role === 'admin' || user.role === 'editor')"
        class="ml-20 flex gap-5"
        :class="{ 'blur-sm': blurStore.blur }"
      >
        <button
          class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          @click.prevent="toggleEditing(kernprozess.schrittCount)"
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
        v-if="isEditing(kernprozess.schrittCount)"
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
          :orange="kernprozess.orange"
          :editing="true"
          @cancle="toggleEditing(kernprozess.schrittCount)"
          @send="(kernprozess) => send(kernprozess, kernprozess.schrittCount)"
        />
      </div>

      <div
        class="flex justify-center gap-10 mt-10 mb-20"
        :class="{ 'blur-sm': blurStore.blur }"
      >
        <div class="w-50 xl:w-80">
          <h2 class="text-[#50A9CE] font-bold text-2xl">
            Schritt {{ kernprozess.schrittCount }}
          </h2>

          <hr class="text-[#50A9CE] mb-2 mt-3 border-t-4 border-dotted" />

          <div>
            <h2 class="text-[#50A9CE] font-bold mb-2">
              VORGABEN / ARBEITSHILFEN
            </h2>

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
            <h2 class="text-[#50A9CE] font-bold mb-2">
              VORLAGEN SCHLUSSBERICHTE
            </h2>

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
            v-if="!kernprozess.orange"
            src="/img/kernprozess/kernprozess_header_orange.png"
            alt="blue"
            class="xl:w-130"
          />
          <img
            v-else
            src="/img/kernprozess/kernprozess_header_blue.png"
            alt="blue"
            class="xl:w-130"
          />

          <div :class="{ 'bg-[#F18700]': kernprozess.orange }" class="relative">
            <img
              v-if="!kernprozess.orange"
              src="/img/kernprozess/kernprozess_content_blue.png"
              alt="content-blue"
              class="absolute inset-0 h-full w-full object-cover z-10"
            />

            <div class="relative z-20">
              <p class="text-white font-bold ml-3 pt-3 mb-3">
                TÄTIGKEIT / ENTSCHEIDUNG / PRÜFSCHRITT
              </p>

              <ul class="list-disc pl-6">
                <li
                  v-for="elem in kernprozess.middleList"
                  :key="elem.text"
                  class="text-white ml-3 mr-3"
                >
                  <span>{{ elem.text }}</span>
                </li>
              </ul>
            </div>
          </div>

          <img
            v-if="kernprozess.orange"
            src="/img/kernprozess/kernprozess_bottom_orange.png"
            alt="orange"
            class="xl:w-130"
          />
          <img
            v-else
            src="/img/kernprozess/kernprozess_bottom_blue.png"
            alt="orange"
            class="xl:w-130"
          />
        </div>

        <div class="w-50 xl:w-80">
          <div>
            <h2 class="text-[#F18700] font-bold mb-2">
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
            <h2 class="text-[#F18700] mt-3 font-bold mb-2">
              VERANTWORTLICHE/R
            </h2>
            <p class="pl-2">{{ kernprozess.verantwortlicherOrange }}</p>
          </div>

          <div v-if="kernprozess.informationOrange.length >= 1">
            <h2 class="text-[#F18700] mt-3 font-bold mb-2">INFORMATION AN</h2>
            <p class="pl-2">{{ kernprozess.informationOrange }}</p>
          </div>

          <hr class="text-gray-400 mb-2 mt-3 border-t-4 border-dotted" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
