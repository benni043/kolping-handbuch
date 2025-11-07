<script setup lang="ts">
import { ref } from "vue";
import type { Kernprozess, TestLink } from "~/types/kernprozess";

const props = defineProps<{
  schrittCount: number | undefined;
  vorgabenBlue: TestLink[] | undefined;
  vorlagenBlue: TestLink[] | undefined;
  middleHead: string | undefined;
  middleList: { text: string }[] | undefined;
  aufzeichnungOrange: TestLink[] | undefined;
  verantwortlicherOrange: string | undefined;
  informationOrange: string | undefined;
  orange: boolean | undefined;
  editing: boolean;
}>();

const emit = defineEmits(["cancle", "send"]);

const schrittCountRef: Ref<number> = ref(props.schrittCount || 1);
const vorgabenBlueRef = ref<TestLink[]>(
  props.vorgabenBlue || [{ text: "", hasLink: false, link: "" }],
);
const vorlagenBlueRef = ref<TestLink[]>(
  props.vorlagenBlue || [{ text: "", hasLink: false, link: "" }],
);

const middleHeadRef: Ref<string> = ref(props.middleHead || "");
const middleListRef = ref<{ text: string }[]>(
  props.middleList || [{ text: "" }],
);

const aufzeichnungOrangeRef = ref<TestLink[]>(
  props.aufzeichnungOrange || [{ text: "", hasLink: false, link: "" }],
);
const verantwortlicherOrangeRef: Ref<string> = ref(
  props.verantwortlicherOrange || "",
);
const informationOrangeRef: Ref<string> = ref(props.informationOrange || "");

const orangeRef: Ref<boolean> = ref(props.orange || false);

function addVorgabeBlue() {
  vorgabenBlueRef.value.push({ text: "", hasLink: false, link: "" });
}

function removeVorgabeBlue(index: number) {
  vorgabenBlueRef.value.splice(index, 1);
}

function addVorlagenBlue() {
  vorlagenBlueRef.value.push({ text: "", hasLink: false, link: "" });
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
  aufzeichnungOrangeRef.value.push({ text: "", hasLink: false, link: "" });
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
  <UForm
    class="rounded-md bg-white grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(7,1fr)] gap-5 h-[85vh] my-[5vh] mx-5 p-5"
  >
    <UCard class="col-span-1 row-span-2">
      <h1 class="mb-4 text-xl font-semibold">Schritt</h1>

      <UInput
        v-model="schrittCountRef"
        placeholder="Schritt"
        type="number"
        icon="i-heroicons-document-plus"
        size="lg"
        class="w-full"
        min="1"
      />
    </UCard>

    <UCard class="col-span-1 row-span-3 col-start-1 overflow-y-auto">
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
            class="cursor-pointer"
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
          placeholder="https://..."
          icon="i-heroicons-link"
          size="lg"
          class="w-full"
        />

        <hr class="mt-5" />
      </div>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus"
        class="cursor-pointer"
        @click="addVorgabeBlue"
      >
        Hinzufügen
      </UButton>
    </UCard>

    <UCard class="col-span-1 row-span-2 col-start-1 overflow-y-auto">
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
            class="cursor-pointer"
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
          placeholder="https://..."
          icon="i-heroicons-link"
          size="lg"
          class="w-full"
        />

        <hr class="mt-5" />
      </div>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus"
        class="cursor-pointer"
        @click="addVorlagenBlue"
      >
        Hinzufügen
      </UButton>
    </UCard>

    <UCard class="col-span-1 row-span-2 col-start-2 row-start-1">
      <h1 class="mb-4 text-xl font-semibold">Überschrift Kernprozess</h1>

      <UInput
        v-model="middleHeadRef"
        placeholder="Überschrift Kernprozess"
        icon="i-heroicons-document-text"
        size="lg"
        class="w-full"
      />
    </UCard>

    <UCard
      class="col-span-1 row-span-3 col-start-2 row-start-3 overflow-y-auto"
    >
      <h1 class="mb-4 text-xl font-semibold">Kernprozess Inhalt</h1>
      <div
        v-for="(item, index) in middleListRef"
        :key="index"
        class="mb-6 relative flex gap-5"
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
          class="cursor-pointer"
          size="lg"
          @click="removeMiddleList(index)"
        />
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus"
        class="cursor-pointer"
        @click="addMiddleList"
      >
        Hinzufügen
      </UButton>
    </UCard>

    <UCard class="col-span-1 row-span-2">
      <h1 class="mb-4 text-xl font-semibold">Bezug zur Kolping-Idee?</h1>

      <select v-model="orangeRef" class="w-full border rounded-lg p-2">
        <option :value="true">True</option>
        <option :value="false">False</option>
      </select>
    </UCard>

    <UCard
      class="col-span-1 row-span-3 col-start-3 row-start-1 overflow-y-auto"
    >
      <h1 class="mb-4 text-xl font-semibold">Aufzeichnungen / Dokumentation</h1>

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
            class="cursor-pointer"
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
          placeholder="https://..."
          icon="i-heroicons-link"
          size="lg"
          class="w-full"
        />

        <hr class="mt-5" />
      </div>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus"
        class="cursor-pointer"
        @click="addAufzeichnungOrange"
      >
        Hinzufügen
      </UButton>
    </UCard>

    <UCard
      class="col-span-1 row-span-2 col-start-3 row-start-4 overflow-y-auto"
    >
      <h1 class="mb-4 text-xl font-semibold">Verantwortliche/r</h1>

      <UTextarea
        v-model="verantwortlicherOrangeRef"
        placeholder="Verantwortliche/r"
        autoresize
        class="w-full"
      />
    </UCard>

    <UCard
      class="col-span-1 row-span-2 col-start-3 row-start-6 overflow-y-auto"
    >
      <h1 class="mb-4 text-xl font-semibold">Information an</h1>
      <UTextarea
        v-model="informationOrangeRef"
        placeholder="Information an"
        auoresize
        class="w-full"
      />
    </UCard>

    <div class="col-start-2 flex justify-center gap-6">
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-paper-airplane"
        size="lg"
        class="cursor-pointer"
        @click="postForm"
      >
        <span v-if="props.editing">Ändern</span>
        <span v-else>Erstellen</span>
      </UButton>

      <UButton
        color="error"
        variant="solid"
        icon="i-heroicons-x-mark"
        size="lg"
        class="cursor-pointer"
        @click="clearForm"
      >
        Löschen
      </UButton>

      <UButton
        color="neutral"
        variant="solid"
        icon="i-heroicons-x-mark"
        size="lg"
        class="cursor-pointer"
        @click="$emit('cancle')"
      >
        Abbrechen
      </UButton>
    </div>
  </UForm>
</template>

<style scoped></style>
<style scoped></style>
