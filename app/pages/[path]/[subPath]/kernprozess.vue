<script setup lang="ts">
import KernprozessCreator from "~/components/admin/kernprozess/kernprozess-creator.vue";
import { useRoute } from "#imports";
import type { Kernprozess } from "~/utils/type/kernprozess";

definePageMeta({
  middleware: ["authenticated"],
});

const { isMobile } = useDevice();

const toast = useToast();
const route = useRoute();
const { user } = useUserSession();

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

function toggleEditing(key: number) {
  editingStates.value[key] = !editingStates.value[key];
}

async function deleteKernprozess(kernprozessNumber: number) {
  if (
    confirm(
      "Sind Sie sicher, dass Sie diesen Kernprozess löschen möchten? Dieser Vorgang kann nicht Rückgängig gemacht werden!",
    )
  ) {
    const response = await $fetch("/api/save/kernprozess/", {
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

    if (response.success) {
      toast.add({
        title: "Erfolg",
        description: `Der Kernprozess mit der Nummer ${kernprozessNumber} wurde erfolgreich gelöscht!`,
        color: "success",
        icon: "i-heroicons-check",
      });
    } else {
      toast.add({
        title: "Fehler",
        description:
          "Beim Löschen des Kernprozesses ist ein Fehler aufgetreten!",
        color: "error",
        icon: "i-heroicons-x-mark",
      });
    }
  }
}

async function send(kernprozess: Kernprozess, count: number) {
  const response = await $fetch("/api/save/kernprozess/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      path: getSegment(0),
      subPath: getSegment(1),
      kernprozessNumber: kernprozess.schrittCount,
      data: JSON.stringify(kernprozess),
    },
  });

  if (response.success) {
    if (kernprozess.schrittCount > kernprozesseRef.value.length) {
      toast.add({
        title: "Erfolg",
        description: `Der Kernprozess mit der Nummer ${kernprozess.schrittCount} wurde erfolgreich erstellt!`,
        color: "success",
        icon: "i-heroicons-check",
      });
    } else {
      toast.add({
        title: "Erfolg",
        description: `Der Kernprozess mit der Nummer ${kernprozess.schrittCount} wurde erfolgreich geändert!`,
        color: "success",
        icon: "i-heroicons-check",
      });
    }
  } else {
    toast.add({
      title: "Fehler",
      description:
        "Beim Erstellen des Kernprozesses ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }

  await fetchKernprozesse();

  toggleEditing(count);
}

onMounted(() => {
  fetchKernprozesse();
});
</script>

<template>
  <div>
    <div class="flex justify-center items-center">
      <div class="w-[90vw] lg:w-[60vw] flex justify-end">
        <button
          v-if="user && (user.role === 'admin' || user.role === 'editor')"
          class="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          @click.prevent="toggleEditing(0)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>

    <UModal
      v-model:open="editingStates[0]"
      fullscreen
      title="Kernprozess hinzufügen"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
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
      </template>
    </UModal>

    <div v-for="kernprozess in kernprozesseRef" :key="kernprozess.middleHead">
      <div
        v-if="user && (user.role === 'admin' || user.role === 'editor')"
        class="ml-20 flex gap-5"
      >
        <button
          class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          @click.prevent="toggleEditing(kernprozess.schrittCount)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>

        <button
          class="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          @click.prevent="deleteKernprozess(kernprozess.schrittCount)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>

      <UModal
        v-model:open="editingStates[kernprozess.schrittCount]"
        fullscreen
        title="Kernprozess hinzufügen"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
      >
        <template #body>
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
        </template>
      </UModal>

      <div
        class="flex justify-center gap-10 mt-10 mb-20 w-full"
        :class="{ 'flex-col': isMobile, 'ml-5': isMobile, 'mr-5': isMobile }"
      >
        <div class="lg:w-50 xl:w-80">
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

        <div class="relative lg:w-100 xl:w-130">
          <h3
            class="absolute top-2.5 left-3 text-white font-bold text-md xl:text-xl z-10"
          >
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
            alt="orange"
            class="xl:w-130"
          />

          <div :class="{ 'bg-[#F18700]': kernprozess.orange }" class="relative">
            <img
              v-if="!kernprozess.orange"
              src="/img/kernprozess/kernprozess_content_blue.png"
              alt="content-blue"
              class="absolute inset-0 h-full w-full z-10"
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

        <div class="lg:w-50 xl:w-80">
          <div>
            <h2
              v-if="kernprozess.aufzeichnungOrange.length >= 1"
              class="text-[#F18700] font-bold mb-2"
            >
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

          <hr
            v-if="
              kernprozess.aufzeichnungOrange.length >= 1 ||
              kernprozess.verantwortlicherOrange.length >= 1 ||
              kernprozess.informationOrange.length >= 1
            "
            class="text-gray-400 mb-2 mt-3 border-t-4 border-dotted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
