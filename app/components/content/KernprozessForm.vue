<script setup lang="ts">
import { ref } from "vue";
import type { KernprozessElementLink } from "~/utils/kernprozess/kernprozess";

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
  create: boolean;
}>();

const placeholderLink =
  "[path]/[subPath]/{kernprozesse/arbeitshilfen}/[file].[endung]";
const placeholderRedirect = "/[uuid]/{uuid}/{file.md}";

const emit = defineEmits(["cancle", "send"]);

const STEPS = 6;
const currentStep = ref(0);

function deepCopy<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function nextStep() {
  if (currentStep.value < STEPS - 1) currentStep.value++;
  else currentStep.value = 0;
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--;
  else currentStep.value = STEPS - 1;
}

// const schrittCountRef: Ref<number> = ref(props.schrittCount || 1);
// const vorgabenBlueRef = ref<KernprozessElementLink[]>(
//   props.vorgabenBlue || [
//     { text: "", hasLink: false, link: "", redirect: false },
//   ],
// );
// const vorlagenBlueRef = ref<KernprozessElementLink[]>(
//   props.vorlagenBlue || [
//     { text: "", hasLink: false, link: "", redirect: false },
//   ],
// );

// const middleHeadRef: Ref<string> = ref(props.middleHead || "");
// const middleListRef = ref<{ text: string }[]>(
//   props.middleList || [{ text: "" }],
// );

// const aufzeichnungOrangeRef = ref<KernprozessElementLink[]>(
//   props.aufzeichnungOrange || [
//     { text: "", hasLink: false, link: "", redirect: false },
//   ],
// );
// const verantwortlicherOrangeRef: Ref<string> = ref(
//   props.verantwortlicherOrange || "",
// );
// const informationOrangeRef: Ref<string> = ref(props.informationOrange || "");

// const orangeRef: Ref<boolean> = ref(props.orange || false);
//
const form = ref({
  schrittCount: 1,
  vorgabenBlue: [{ text: "", hasLink: false, link: "", redirect: false }],
  vorlagenBlue: [{ text: "", hasLink: false, link: "", redirect: false }],
  middleHead: "",
  middleList: [{ text: "" }],
  aufzeichnungOrange: [{ text: "", hasLink: false, link: "", redirect: false }],
  verantwortlicherOrange: "",
  informationOrange: "",
  orange: false,
});

watch(
  () => props,
  () => {
    form.value = deepCopy({
      schrittCount: props.schrittCount ?? 1,
      vorgabenBlue: props.vorgabenBlue ?? [
        { text: "", hasLink: false, link: "", redirect: false },
      ],
      vorlagenBlue: props.vorlagenBlue ?? [
        { text: "", hasLink: false, link: "", redirect: false },
      ],
      middleHead: props.middleHead ?? "",
      middleList: props.middleList ?? [{ text: "" }],
      aufzeichnungOrange: props.aufzeichnungOrange ?? [
        { text: "", hasLink: false, link: "", redirect: false },
      ],
      verantwortlicherOrange: props.verantwortlicherOrange ?? "",
      informationOrange: props.informationOrange ?? "",
      orange: props.orange ?? false,
    });
  },
  { immediate: true, deep: true },
);

function addVorgabeBlue() {
  form.value.vorgabenBlue.push({
    text: "",
    hasLink: false,
    link: "",
    redirect: false,
  });
}

function removeVorgabeBlue(index: number) {
  form.value.vorgabenBlue.splice(index, 1);
}

function addVorlagenBlue() {
  form.value.vorlagenBlue.push({
    text: "",
    hasLink: false,
    link: "",
    redirect: false,
  });
}

function removeVorlagenBlue(index: number) {
  form.value.vorlagenBlue.splice(index, 1);
}

function addMiddleList() {
  form.value.middleList.push({ text: "" });
}

function removeMiddleList(index: number) {
  form.value.middleList.splice(index, 1);
}

function addAufzeichnungOrange() {
  form.value.aufzeichnungOrange.push({
    text: "",
    hasLink: false,
    link: "",
    redirect: false,
  });
}

function removeAufzeichnungOrange(index: number) {
  form.value.aufzeichnungOrange.splice(index, 1);
}

function postForm() {
  emit("send", deepCopy(form.value));
}

function clearForm() {
  if (
    !confirm(
      "Sind Sie sicher, dass Sie alle Eigenschaften dieses Kernprozesses löschen wollen?",
    )
  )
    return;

  form.value = deepCopy({
    schrittCount: 1,
    vorgabenBlue: [{ text: "", hasLink: false, link: "", redirect: false }],
    vorlagenBlue: [{ text: "", hasLink: false, link: "", redirect: false }],
    middleHead: "",
    middleList: [{ text: "" }],
    aufzeichnungOrange: [
      { text: "", hasLink: false, link: "", redirect: false },
    ],
    verantwortlicherOrange: "",
    informationOrange: "",
    orange: false,
  });
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
            v-model="form.schrittCount"
            placeholder="Schritt"
            type="number"
            icon="i-heroicons-document-plus"
            size="lg"
            class="w-full"
            min="1"
          />

          <h1 class="my-8 text-xl font-semibold text-center">
            Überschrift Kernprozess
          </h1>

          <UInput
            v-model="form.middleHead"
            placeholder="Überschrift Kernprozess"
            icon="i-heroicons-document-text"
            size="lg"
            class="w-full"
          />

          <h1 class="my-8 text-xl font-semibold text-center">
            Bezug zur Kolping-Idee?
          </h1>

          <select v-model="form.orange" class="w-full border rounded-lg p-2">
            <option :value="true">Ja</option>
            <option :value="false">Nein</option>
          </select>
        </div>

        <div v-if="currentStep === 1">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Vorgaben / Arbeitshilfen
          </h1>
          <div
            v-for="(item, index) in form.vorgabenBlue"
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
            v-for="(item, index) in form.vorlagenBlue"
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
            Kernprozess Inhalt
          </h1>

          <div
            v-for="(item, index) in form.middleList"
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

        <div v-if="currentStep === 4">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Aufzeichnungen / Dokumentation
          </h1>

          <div
            v-for="(item, index) in form.aufzeichnungOrange"
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

        <div v-if="currentStep === 5">
          <h1 class="mb-8 text-xl font-semibold text-center">
            Verantwortliche/r
          </h1>

          <UTextarea
            v-model="form.verantwortlicherOrange"
            placeholder="Verantwortliche/r"
            autoresize
            class="w-full"
          />

          <h1 class="my-8 text-xl font-semibold text-center">Information an</h1>

          <UTextarea
            v-model="form.informationOrange"
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

    <div class="flex justify-around p-4 border-t border-t-gray-300">
      <UButton
        color="error"
        variant="solid"
        icon="i-heroicons-trash"
        class="cursor-pointer"
        @click="clearForm"
      >
        Leeren
      </UButton>

      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-check"
        class="cursor-pointer"
        @click="postForm"
      >
        <span v-if="create">Erstellen</span>
        <span v-else>Verändern</span>
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
<style scoped></style>
