<script setup lang="ts">
import { ref } from "vue";
import type {
  Kernprozess,
  KernprozessElementLink,
} from "~/utils/kernprozess/kernprozess";

const props = defineProps<{
  schrittCount: number | undefined;
  vorgabenBlue: KernprozessElementLink[] | undefined;
  vorlagenBlue: KernprozessElementLink[] | undefined;
  middleHead: string | undefined;
  middleList: { text: string }[] | undefined;
  aufzeichnungOrange: KernprozessElementLink[] | undefined;
  verantwortlicherOrange: string | undefined;
  informationOrange: string | undefined;
  orange: boolean | undefined;
  editing: boolean;
}>();

const emit = defineEmits(["cancle", "send"]);

const schrittCountRef = ref(props.schrittCount || 1);
const vorgabenBlueRef = ref<KernprozessElementLink[]>(
  props.vorgabenBlue || [{ text: "", hasLink: false, link: "" }],
);
const vorlagenBlueRef = ref<KernprozessElementLink[]>(
  props.vorlagenBlue || [{ text: "", hasLink: false, link: "" }],
);
const middleHeadRef = ref(props.middleHead || "");
const middleListRef = ref<{ text: string }[]>(
  props.middleList || [{ text: "" }],
);
const aufzeichnungOrangeRef = ref<KernprozessElementLink[]>(
  props.aufzeichnungOrange || [{ text: "", hasLink: false, link: "" }],
);
const verantwortlicherOrangeRef = ref(props.verantwortlicherOrange || "");
const informationOrangeRef = ref(props.informationOrange || "");
const orangeRef = ref(props.orange || false);

const STEPS = 8;
const currentStep = ref(0);

function nextStep() {
  if (currentStep.value < STEPS - 1) currentStep.value++;
  else currentStep.value = 0;
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--;
  else currentStep.value = STEPS - 1;
}

function addVorgabeBlue() {
  vorgabenBlueRef.value.push({ text: "", hasLink: false, link: "" });
}
function removeVorgabeBlue(i: number) {
  vorgabenBlueRef.value.splice(i, 1);
}
function addVorlagenBlue() {
  vorlagenBlueRef.value.push({ text: "", hasLink: false, link: "" });
}
function removeVorlagenBlue(i: number) {
  vorlagenBlueRef.value.splice(i, 1);
}
function addMiddleList() {
  middleListRef.value.push({ text: "" });
}
function removeMiddleList(i: number) {
  middleListRef.value.splice(i, 1);
}
function addAufzeichnungOrange() {
  aufzeichnungOrangeRef.value.push({ text: "", hasLink: false, link: "" });
}
function removeAufzeichnungOrange(i: number) {
  aufzeichnungOrangeRef.value.splice(i, 1);
}

async function postForm() {
  if (
    !confirm(props.editing ? "Kernprozess ändern?" : "Kernprozess erstellen?")
  )
    return;

  const data: Kernprozess = {
    schrittCount: schrittCountRef.value,
    vorgabenBlue: vorgabenBlueRef.value,
    vorlagenBlue: vorlagenBlueRef.value,
    middleHead: middleHeadRef.value,
    middleList: middleListRef.value,
    aufzeichnungOrange: aufzeichnungOrangeRef.value,
    verantwortlicherOrange: verantwortlicherOrangeRef.value,
    informationOrange: informationOrangeRef.value,
    orange: orangeRef.value,
  };

  emit("send", data);
}

function clearForm() {
  if (!confirm("Alle Eigenschaften löschen?")) return;

  vorgabenBlueRef.value = [];
  vorlagenBlueRef.value = [];
  middleHeadRef.value = "";
  middleListRef.value = [];
  aufzeichnungOrangeRef.value = [];
  verantwortlicherOrangeRef.value = "";
  informationOrangeRef.value = "";
  orangeRef.value = false;
}
</script>

<template>
  <div class="relative h-[80vh] max-w-xl mx-auto flex flex-col overflow-hidden">
    <div class="flex flex-1 min-h-0 items-center">
      <div>
        <UButton icon="i-heroicons-chevron-left" @click="prevStep" />
      </div>

      <div class="flex-1 h-full overflow-y-auto p-4">
        <UCard v-if="currentStep === 0">
          <h1 class="mb-4 text-xl font-semibold">Vorgaben / Arbeitshilfen</h1>
          <div
            v-for="(item, index) in vorgabenBlueRef"
            :key="index"
            class="mb-5 relative"
          >
            <div class="flex gap-5">
              <UInput
                v-model="item.text"
                placeholder="Vorgaben / Arbeitshilfen..."
                icon="i-heroicons-document-text"
                size="lg"
                class="w-full"
              />
              <UButton
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                size="lg"
                @click="removeVorgabeBlue(index)"
              />
            </div>

            <UCheckbox
              v-model="item.hasLink"
              label="Als Link hinzufügen"
              class="my-3 ml-1"
            />

            <UInput
              v-if="item.hasLink"
              v-model="item.link"
              placeholder="[path]/[subPath]/[file].[endung]"
              icon="i-heroicons-link"
              size="lg"
              class="w-full"
            />
            <hr class="mt-5 mb-10" />
          </div>

          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
            @click="addVorgabeBlue"
            >Hinzufügen</UButton
          >
        </UCard>

        <UCard v-if="currentStep === 1">
          <h1 class="mb-4 text-xl font-semibold">Vorlagen Schlussberichte</h1>
          <div
            v-for="(item, index) in vorlagenBlueRef"
            :key="index"
            class="mb-5 relative"
          >
            <div class="flex gap-5">
              <UInput
                v-model="item.text"
                placeholder="Vorlagen Schlussberichte..."
                icon="i-heroicons-document-text"
                size="lg"
                class="w-full"
              />
              <UButton
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                size="lg"
                @click="removeVorlagenBlue(index)"
              />
            </div>
            <UCheckbox
              v-model="item.hasLink"
              label="Als Link hinzufügen"
              class="my-3 ml-1"
            />
            <UInput
              v-if="item.hasLink"
              v-model="item.link"
              placeholder="[path]/[subPath]/[file].[endung]"
              icon="i-heroicons-link"
              size="lg"
              class="w-full"
            />
            <hr class="mt-5 mb-10" />
          </div>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
            @click="addVorlagenBlue"
            >Hinzufügen</UButton
          >
        </UCard>

        <UCard v-if="currentStep === 2">
          <h1 class="mb-4 text-xl font-semibold">Überschrift Kernprozess</h1>
          <UInput
            v-model="middleHeadRef"
            placeholder="Überschrift Kernprozess"
            icon="i-heroicons-document-text"
            size="lg"
            class="w-full"
          />
        </UCard>

        <UCard v-if="currentStep === 3">
          <h1 class="mb-4 text-xl font-semibold">Kernprozess Inhalt</h1>
          <div
            v-for="(item, index) in middleListRef"
            :key="index"
            class="mb-6 flex gap-5"
          >
            <UInput
              v-model="item.text"
              placeholder="Kernprozess Inhalt..."
              icon="i-heroicons-document-text"
              size="lg"
              class="w-full"
            />
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              size="lg"
              @click="removeMiddleList(index)"
            />
          </div>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
            @click="addMiddleList"
            >Hinzufügen</UButton
          >
        </UCard>

        <UCard v-if="currentStep === 4">
          <h1 class="mb-4 text-xl font-semibold">Bezug zur Kolping-Idee?</h1>
          <select v-model="orangeRef" class="w-full border rounded-lg p-2">
            <option :value="true">Ja</option>
            <option :value="false">Nein</option>
          </select>
        </UCard>

        <UCard v-if="currentStep === 5">
          <h1 class="mb-4 text-xl font-semibold">
            Aufzeichnungen / Dokumentation
          </h1>
          <div
            v-for="(item, index) in aufzeichnungOrangeRef"
            :key="index"
            class="mb-6 relative"
          >
            <div class="flex gap-5">
              <UInput
                v-model="item.text"
                placeholder="Aufzeichnungen / Dokumentation..."
                icon="i-heroicons-document-text"
                size="lg"
                class="w-full"
              />
              <UButton
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                size="lg"
                @click="removeAufzeichnungOrange(index)"
              />
            </div>
            <UCheckbox
              v-model="item.hasLink"
              label="Als Link hinzufügen"
              class="my-5"
            />
            <UInput
              v-if="item.hasLink"
              v-model="item.link"
              placeholder="[path]/[subPath]/[file].[endung]"
              icon="i-heroicons-link"
              size="lg"
              class="w-full"
            />
            <hr class="mt-5 mb-10" />
          </div>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
            @click="addAufzeichnungOrange"
            >Hinzufügen</UButton
          >
        </UCard>

        <UCard v-if="currentStep === 6">
          <h1 class="mb-4 text-xl font-semibold">Verantwortliche/r</h1>
          <UTextarea
            v-model="verantwortlicherOrangeRef"
            placeholder="Verantwortliche/r"
            autoresize
            class="w-full"
          />
        </UCard>

        <UCard v-if="currentStep === 7">
          <h1 class="mb-4 text-xl font-semibold">Information an</h1>
          <UTextarea
            v-model="informationOrangeRef"
            placeholder="Information an"
            autoresize
            class="w-full"
          />
        </UCard>
      </div>

      <div>
        <UButton icon="i-heroicons-chevron-right" @click="nextStep" />
      </div>
    </div>

    <div class="flex justify-around p-4 border-t">
      <UButton
        color="error"
        variant="solid"
        icon="i-heroicons-trash"
        @click="clearForm"
      >
        Löschen
      </UButton>
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-check"
        @click="postForm"
      >
        {{ props.editing ? "Ändern" : "Senden" }}
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
