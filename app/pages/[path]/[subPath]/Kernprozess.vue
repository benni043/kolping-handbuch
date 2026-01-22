<script setup lang="ts">
import { useRoute } from "#imports";
import type { Kernprozess } from "~/utils/kernprozess/kernprozess";
import { fetchData } from "~/utils/file/file";
import CreateKernprozessForm from "~/components/content/CreateKernprozessForm.vue";
import ChangeKernprozessForm from "~/components/content/ChangeKernprozessForm.vue";
import ChangeKernprozessNumberForm from "~/components/content/ChangeKernprozessNumberForm.vue";
import { getSegment } from "~/utils/nav/nav-menu";
import type { NuxtError } from "#app";
import { useWindowSize } from "@vueuse/core";

definePageMeta({
  middleware: ["authenticated"],
});

const { width } = useWindowSize();

const toast = useToast();
const route = useRoute();

const { user } = useUserSession();

const kernprozesseRef: Ref<Kernprozess[]> = ref([]);

type ModalType = "create" | "edit" | "changeNumber" | null;

const modalState = ref<{
  type: ModalType;
  step?: number;
}>({ type: null });

const activeKernprozess = computed(() =>
  modalState.value.step
    ? kernprozesseRef.value.find(
        (k) => k.schrittCount === modalState.value.step,
      )
    : null,
);

const modalOpen = computed({
  get: () => modalState.value.type !== null,
  set: (val: boolean) => {
    if (!val) closeModal();
  },
});

function openCreate() {
  modalState.value = { type: "create" };
}

function openEdit(step: number) {
  modalState.value = { type: "edit", step };
}

function openChangeNumber(step: number) {
  modalState.value = { type: "changeNumber", step };
}

function closeModal() {
  modalState.value = { type: null };
}

async function fetchKernprozesse() {
  try {
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
  } catch (e: unknown) {
    console.error(e);
  }
}

async function send(kernprozess: Kernprozess) {
  try {
    await $fetch("/api/kernprozess/", {
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

    toast.add({
      title: "Erfolg",
      description: `Der Kernprozess mit der Nummer ${kernprozess.schrittCount} wurde erfolgreich erstellt!`,
      color: "success",
      icon: "i-heroicons-check",
      duration: DURATION,
    });

    closeModal();
  } catch (err) {
    const error = err as NuxtError;

    if (error.statusCode === 409) {
      toast.add({
        title: "Warnung",
        description: "Ein Kernprozess mit dieser Nummer existiert bereits!",
        color: "warning",
        icon: "i-heroicons-x-mark",
        duration: DURATION,
      });

      return;
    } else if (error.statusCode === 406) {
      toast.add({
        title: "Warnung",
        description: "Die Kernprozessnummer MUSS eine Zahl sein!",
        color: "warning",
        icon: "i-heroicons-x-mark",
        duration: DURATION,
      });

      return;
    }

    toast.add({
      title: "Fehler",
      description:
        "Beim Erstellen des Kernprozesses ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
      duration: DURATION,
    });
  }
}

async function change(kernprozess: Kernprozess) {
  try {
    await $fetch("/api/kernprozess/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: {
        path: getSegment(0),
        subPath: getSegment(1),
        kernprozessNumber: kernprozess.schrittCount,
        data: JSON.stringify(kernprozess),
      },
    });

    await fetchKernprozesse();

    toast.add({
      title: "Erfolg",
      description: `Der Kernprozess mit der Nummer ${kernprozess.schrittCount} wurde erfolgreich geändert!`,
      color: "success",
      icon: "i-heroicons-check",
      duration: DURATION,
    });

    closeModal();
  } catch (err) {
    const error = err as NuxtError;

    if (error.statusCode === 409) {
      toast.add({
        title: "Warnung",
        description: "Ein Kernprozess mit dieser Nummer existiert bereits!",
        color: "warning",
        icon: "i-heroicons-x-mark",
        duration: DURATION,
      });

      return;
    } else if (error.statusCode === 406) {
      toast.add({
        title: "Warnung",
        description: "Die Kernprozessnummer MUSS eine Zahl sein!",
        color: "warning",
        icon: "i-heroicons-x-mark",
        duration: DURATION,
      });

      return;
    }
    toast.add({
      title: "Fehler",
      description: "Beim Ändern des Kernprozesses ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
      duration: DURATION,
    });
  }
}

async function changeNumber(
  kernprozessNumberOld: number,
  kernprozessNumberNew: number,
) {
  try {
    await $fetch("/api/kernprozess/rename", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: {
        path: getSegment(0),
        subPath: getSegment(1),
        kernprozessNumberOld: kernprozessNumberOld,
        kernprozessNumberNew: kernprozessNumberNew,
      },
    });

    await fetchKernprozesse();

    toast.add({
      title: "Erfolg",
      description: `Der Kernprozess mit der Nummer: ${kernprozessNumberOld} hat nun die Nummer: ${kernprozessNumberNew}!`,
      color: "success",
      icon: "i-heroicons-check",
      duration: DURATION,
    });

    closeModal();
  } catch (err) {
    const error = err as NuxtError;

    if (error.statusCode === 409) {
      toast.add({
        title: "Warnung",
        description: "Ein Kernprozess mit dieser Nummer existiert bereits!",
        color: "warning",
        icon: "i-heroicons-x-mark",
        duration: DURATION,
      });

      return;
    } else if (error.statusCode === 406) {
      toast.add({
        title: "Warnung",
        description: "Die Kernprozessnummer MUSS eine Zahl sein!",
        color: "warning",
        icon: "i-heroicons-x-mark",
        duration: DURATION,
      });

      return;
    }

    toast.add({
      title: "Fehler",
      description:
        "Beim Ändern der Kernprozessnummer ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
      duration: DURATION,
    });
  }

  closeModal();
}

async function deleteKernprozess(kernprozessNumber: number) {
  if (
    confirm(
      "Sind Sie sicher, dass Sie diesen Kernprozess löschen möchten? Dieser Vorgang kann nicht Rückgängig gemacht werden!",
    )
  ) {
    try {
      await $fetch("/api/kernprozess", {
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

      toast.add({
        title: "Erfolg",
        description: `Der Kernprozess mit der Nummer ${kernprozessNumber} wurde erfolgreich gelöscht!`,
        color: "success",
        icon: "i-heroicons-check",
      });
    } catch (err) {
      const error = err as NuxtError;

      if (error.statusCode === 409) {
        toast.add({
          title: "Fehler",
          description: "Es existiert kein Kernprozess mit dieser Nummer!",
          color: "error",
          icon: "i-heroicons-x-mark",
        });

        return;
      }

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

async function fetchFile(link: string) {
  const res = await fetchData(link);

  if (!res) {
    toast.add({
      title: "Fehler",
      description:
        "Beim Herunterladen des Dokuments ist ein Fehler aufgetreten! Wenden Sie sich an Ihren Administrator!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

function redirect(link: string) {
  navigateTo(link);
}

onMounted(() => {
  fetchKernprozesse();
});
</script>

<template>
  <div>
    <div class="flex justify-center items-center">
      <div class="flex mb-5 w-[90vw] lg:w-[60vw]">
        <UButton
          v-if="user && (user.role === 'admin' || user.role === 'editor')"
          color="neutral"
          variant="outline"
          class="px-4 py-2 rounded cursor-pointer"
          @click="openCreate()"
        >
          Hinzufügen
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
        </UButton>
      </div>
    </div>

    <UModal
      v-model:open="modalOpen"
      :title="
        modalState.type === 'create'
          ? 'Kernprozess erstellen'
          : modalState.type === 'edit'
            ? 'Kernprozess bearbeiten'
            : 'Kernprozess verschieben'
      "
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <CreateKernprozessForm
          v-if="modalState.type === 'create'"
          :schritt-count="kernprozesseRef.length + 1"
          :vorgaben-blue="undefined"
          :vorlagen-blue="undefined"
          :middle-head="undefined"
          :middle-list="undefined"
          :aufzeichnung-orange="undefined"
          :verantwortlicher-orange="undefined"
          :information-orange="undefined"
          :orange="false"
          @send="send"
          @cancle="closeModal"
        />

        <ChangeKernprozessForm
          v-if="modalState.type === 'edit' && activeKernprozess"
          :schritt-count="activeKernprozess.schrittCount"
          :vorgaben-blue="activeKernprozess.vorgabenBlue"
          :vorlagen-blue="activeKernprozess.vorlagenBlue"
          :middle-head="activeKernprozess.middleHead"
          :middle-list="activeKernprozess.middleList"
          :aufzeichnung-orange="activeKernprozess.aufzeichnungOrange"
          :verantwortlicher-orange="activeKernprozess.verantwortlicherOrange"
          :information-orange="activeKernprozess.informationOrange"
          :orange="activeKernprozess.orange"
          @send="change"
          @cancle="closeModal"
        />

        <ChangeKernprozessNumberForm
          v-if="modalState.type === 'changeNumber' && activeKernprozess"
          :schritt-count="activeKernprozess.schrittCount"
          @send="
            (newNumber: number) =>
              changeNumber(activeKernprozess?.schrittCount!, newNumber)
          "
          @cancle="closeModal"
        />
      </template>
    </UModal>

    <div
      v-for="kernprozess in kernprozesseRef"
      :key="kernprozess.middleHead"
      class="flex justify-center items-center flex-col"
    >
      <div
        v-if="user && (user.role === 'admin' || user.role === 'editor')"
        class="flex gap-5 w-[90vw] lg:w-[60vw]"
      >
        <UButton
          color="neutral"
          variant="outline"
          class="px-4 py-2 rounded cursor-pointer"
          @click="openEdit(kernprozess.schrittCount)"
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
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          class="px-4 py-2 rounded cursor-pointer"
          @click="openChangeNumber(kernprozess.schrittCount)"
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
              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
          </svg>
        </UButton>

        <UButton
          color="error"
          variant="outline"
          class="px-4 py-2 rounded cursor-pointer"
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
        </UButton>
      </div>

      <div
        class="flex justify-center"
        :class="{
          'flex-col mx-5 mt-5 mb-20 gap-5': width <= MOBILE_WIDTH,
          'mx-20 mb-20 mt-10 gap-20': width >= MOBILE_WIDTH,
          'w-[80vw]': width >= 1400 && width <= 1600,
          'w-[60vw]': width >= 1600,
        }"
      >
        <div
          class="flex-1"
          :class="{
            'justify-center': width <= MOBILE_WIDTH,
            flex: width <= MOBILE_WIDTH,
          }"
        >
          <div
            :class="{
              'w-full': width <= HANDY_WIDTH,
              'w-[60vw]': width >= HANDY_WIDTH && width <= BIG_HANDY_WIDTH,
              'w-[50vw]': width >= BIG_HANDY_WIDTH && width <= MOBILE_WIDTH,
            }"
          >
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
                  <span
                    v-if="elem.hasLink"
                    class="cursor-pointer hover:underline text-[#50A9CE]"
                    @click="
                      elem.redirect ? redirect(elem.link) : fetchFile(elem.link)
                    "
                  >
                    {{ elem.text }}
                  </span>
                  <span v-if="!elem.hasLink">{{ elem.text }}</span>
                </li>
              </ul>
            </div>

            <div v-if="kernprozess.vorlagenBlue.length >= 1">
              <h2 class="text-[#50A9CE] font-bold my-2">
                VORLAGEN SCHLUSSBERICHTE
              </h2>

              <ul class="list-disc pl-6">
                <li
                  v-for="elem in kernprozess.vorlagenBlue"
                  :key="elem.text"
                  class="marker:text-[#50A9CE]"
                >
                  <span
                    v-if="elem.hasLink"
                    class="cursor-pointer hover:underline text-[#50A9CE]"
                    @click="
                      elem.redirect ? redirect(elem.link) : fetchFile(elem.link)
                    "
                  >
                    {{ elem.text }}
                  </span>
                  <span v-if="!elem.hasLink">{{ elem.text }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="relative flex-2 mx-auto"
          :class="{
            'w-[60vw]': width >= HANDY_WIDTH && width <= BIG_HANDY_WIDTH,
            'w-[50vw]': width >= BIG_HANDY_WIDTH && width <= MOBILE_WIDTH,
          }"
        >
          <h3
            class="absolute left-3 text-white font-bold text-md xl:text-xl z-10"
          >
            {{ kernprozess.middleHead }}
          </h3>

          <img
            v-if="!kernprozess.orange"
            src="/img/kernprozess/kernprozess_header_orange.png"
            alt="blue"
            class="w-full"
          />
          <img
            v-else
            src="/img/kernprozess/kernprozess_header_blue.png"
            alt="orange"
            class="w-full"
          />

          <div :class="{ 'bg-[#F18700]': kernprozess.orange }" class="relative">
            <img
              v-if="!kernprozess.orange"
              src="/img/kernprozess/kernprozess_content_blue.png"
              alt="content-blue"
              class="absolute inset-0 h-full w-full z-10"
            />

            <div class="relative z-20">
              <p class="text-white font-bold mx-3 pt-3">
                TÄTIGKEIT / ENTSCHEIDUNG / PRÜFSCHRITT
              </p>

              <br />

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
            class="w-full"
          />
          <img
            v-else
            src="/img/kernprozess/kernprozess_bottom_blue.png"
            alt="orange"
            class="w-full"
          />
        </div>

        <div
          class="flex-1"
          :class="{
            'justify-center': width <= MOBILE_WIDTH,
            flex: width <= MOBILE_WIDTH,
          }"
        >
          <div
            :class="{
              'w-[60vw]': width >= HANDY_WIDTH && width <= BIG_HANDY_WIDTH,
              'w-[50vw]': width >= BIG_HANDY_WIDTH && width <= MOBILE_WIDTH,
            }"
          >
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
                  <span
                    v-if="elem.hasLink"
                    class="cursor-pointer hover:underline text-[#50A9CE]"
                    @click="
                      elem.redirect ? redirect(elem.link) : fetchFile(elem.link)
                    "
                  >
                    {{ elem.text }}
                  </span>
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
  </div>
</template>

<style scoped></style>
