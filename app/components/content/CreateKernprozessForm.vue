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

const placeholderLink =
  "[path]/[subPath]/{kernprozesse/arbeitshilfen}/[file].[endung]";
const placeholderRedirect = "/[uuid]/{uuid}/{file.md}";

const emit = defineEmits(["cancle", "send"]);

const STEPS = 9;
const currentStep = ref(0);

function nextStep() {
  if (currentStep.value < STEPS - 1) currentStep.value++;
  else currentStep.value = 0;
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--;
  else currentStep.value = STEPS - 1;
}

const schrittCountRef: Ref<number> = ref(props.schrittCount || 1);
const vorgabenBlueRef = ref<KernprozessElementLink[]>(
  props.vorgabenBlue || [
    { text: "", hasLink: false, link: "", redirect: false },
  ],
);
const vorlagenBlueRef = ref<KernprozessElementLink[]>(
  props.vorlagenBlue || [
    { text: "", hasLink: false, link: "", redirect: false },
  ],
);

const middleHeadRef: Ref<string> = ref(props.middleHead || "");
const middleListRef = ref<{ text: string }[]>(
  props.middleList || [{ text: "" }],
);

const aufzeichnungOrangeRef = ref<KernprozessElementLink[]>(
  props.aufzeichnungOrange || [
    { text: "", hasLink: false, link: "", redirect: false },
  ],
);
const verantwortlicherOrangeRef: Ref<string> = ref(
  props.verantwortlicherOrange || "",
);
const informationOrangeRef: Ref<string> = ref(props.informationOrange || "");

const orangeRef: Ref<boolean> = ref(props.orange || false);

function addVorgabeBlue() {
  vorgabenBlueRef.value.push({
    text: "",
    hasLink: false,
    link: "",
    redirect: false,
  });
}

function removeVorgabeBlue(index: number) {
  vorgabenBlueRef.value.splice(index, 1);
}

function addVorlagenBlue() {
  vorlagenBlueRef.value.push({
    text: "",
    hasLink: false,
    link: "",
    redirect: false,
  });
}

function removeVorlagenBlue(index: number) {
  vorlagenBlueRef.value.splice(index, 1);
}

function addMiddleList() {
  middleListRef.value.push({ text: "" });
}

function removeMiddleList(index: number) {
  middleListRef.value.splice(index, 1);
}

function addAufzeichnungOrange() {
  aufzeichnungOrangeRef.value.push({
    text: "",
    hasLink: false,
    link: "",
    redirect: false,
  });
}

function removeAufzeichnungOrange(index: number) {
  aufzeichnungOrangeRef.value.splice(index, 1);
}

async function postForm() {
  if (props.editing) {
    if (
      !confirm(
        "Sind Sie sicher, dass sie diesen Kernprozess verändern möchten?",
      )
    )
      return;
  } else {
    if (
      !confirm(
        "Sind Sie sicher, dass sie diesen Kernprozess erstellen möchten?",
      )
    )
      return;
  }

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
  if (
    !confirm(
      "Sind Sie sicher, dass Sie alle Eigenschaften dieses Kernprozesses löschen wollen?",
    )
  )
    return;

  schrittCountRef.value = 0;
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
    <div class="flex flex-1 min-h-0">
      <div>
        <UButton
          icon="i-heroicons-chevron-left"
          class="cursor-pointer"
          @click="prevStep"
        />
      </div>

      <div class="flex-1 h-full overflow-y-auto px-3">
        <div v-if="currentStep === 0">
          <h1 class="mb-8 text-xl font-semibold text-center">Schritt</h1>

          <UInput
            v-model="schrittCountRef"
            placeholder="Schritt"
            type="number"
            icon="i-heroicons-document-plus"
            size="lg"
            class="w-full"
            min="1"
          />
        </div>

        <div v-if="currentStep === 1">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Vorgaben / Arbeitshilfen
          </h1>
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
                class="cursor-pointer"
                @click="removeVorgabeBlue(index)"
              />
            </div>

            <UCheckbox
              v-model="item.hasLink"
              label="Als Link hinzufügen"
              class="my-3 ml-1"
              @update:model-value="
                (val) => {
                  if (!val) item.redirect = false;
                }
              "
            />

            <UCheckbox
              v-model="item.redirect"
              :disabled="!item.hasLink"
              label="Als Weiterleitung hinzufügen"
              class="my-3 ml-1"
            />

            <UInput
              v-if="item.hasLink"
              v-model="item.link"
              :placeholder="
                item.redirect ? placeholderRedirect : placeholderLink
              "
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
            class="cursor-pointer mb-5"
            @click="addVorgabeBlue"
          >
            Hinzufügen
          </UButton>
        </div>

        <div v-if="currentStep === 2">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Vorlagen Schlussberichte
          </h1>
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
                class="cursor-pointer"
                @click="removeVorlagenBlue(index)"
              />
            </div>

            <UCheckbox
              v-model="item.hasLink"
              label="Als Link hinzufügen"
              class="my-3 ml-1"
              @update:model-value="
                (val) => {
                  if (!val) item.redirect = false;
                }
              "
            />

            <UCheckbox
              v-model="item.redirect"
              :disabled="!item.hasLink"
              label="Als Weiterleitung hinzufügen"
              class="my-3 ml-1"
            />

            <UInput
              v-if="item.hasLink"
              v-model="item.link"
              :placeholder="
                item.redirect ? placeholderRedirect : placeholderLink
              "
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
            class="cursor-pointer mb-5"
            @click="addVorlagenBlue"
          >
            Hinzufügen
          </UButton>
        </div>

        <div v-if="currentStep === 3">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Überschrift Kernprozess
          </h1>

          <UInput
            v-model="middleHeadRef"
            placeholder="Überschrift Kernprozess"
            icon="i-heroicons-document-text"
            size="lg"
            class="w-full"
          />
        </div>

        <div v-if="currentStep === 4">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Kernprozess Inhalt
          </h1>

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
              class="cursor-pointer"
              @click="removeMiddleList(index)"
            />
          </div>

          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
            class="cursor-pointer mb-5"
            @click="addMiddleList"
          >
            Hinzufügen
          </UButton>
        </div>

        <div v-if="currentStep === 5">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Bezug zur Kolping-Idee?
          </h1>

          <select v-model="orangeRef" class="w-full border rounded-lg p-2">
            <option :value="true">Ja</option>
            <option :value="false">Nein</option>
          </select>
        </div>

        <div v-if="currentStep === 6">
          <h1 class="mb-8 text-xl font-semibold text-center">
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
                class="cursor-pointer"
                @click="removeAufzeichnungOrange(index)"
              />
            </div>

            <UCheckbox
              v-model="item.hasLink"
              label="Als Link hinzufügen"
              class="my-3 ml-1"
              @update:model-value="
                (val) => {
                  if (!val) item.redirect = false;
                }
              "
            />

            <UCheckbox
              v-model="item.redirect"
              :disabled="!item.hasLink"
              label="Als Weiterleitung hinzufügen"
              class="my-3 ml-1"
            />

            <UInput
              v-if="item.hasLink"
              v-model="item.link"
              :placeholder="
                item.redirect ? placeholderRedirect : placeholderLink
              "
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
            class="cursor-pointer mb-5"
            @click="addAufzeichnungOrange"
          >
            Hinzufügen
          </UButton>
        </div>

        <div v-if="currentStep === 7">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Verantwortliche/r
          </h1>

          <UTextarea
            v-model="verantwortlicherOrangeRef"
            placeholder="Verantwortliche/r"
            autoresize
            class="w-full"
          />
        </div>

        <div v-if="currentStep === 8">
          <h1 class="mb-8 text-xl font-semibold text-center">Information an</h1>

          <UTextarea
            v-model="informationOrangeRef"
            placeholder="Information an"
            autoresize
            class="w-full"
          />
        </div>
      </div>

      <div>
        <UButton
          icon="i-heroicons-chevron-right"
          class="cursor-pointer"
          @click="nextStep"
        />
      </div>
    </div>

    <div class="flex justify-around p-4 border-t">
      <UButton
        color="error"
        variant="solid"
        icon="i-heroicons-trash"
        class="cursor-pointer"
        @click="clearForm"
      >
        Löschen
      </UButton>

      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-check"
        class="cursor-pointer"
        @click="postForm"
      >
        {{ props.editing ? "Ändern" : "Senden" }}
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
<style scoped></style>
