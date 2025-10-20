<script setup lang="ts">
import { ref } from "vue";

const schrittCount: Ref<number> = ref(0);
const vorgabenBlue = ref<{ text: string; link?: string; hasLink: boolean }[]>([
  { text: "", hasLink: false, link: "" },
]);
const vorlagenBlue = ref<{ text: string; link?: string; hasLink: boolean }[]>([
  { text: "", hasLink: false, link: "" },
]);

const middleHead: Ref<string> = ref("");
const middleList = ref<{ text: string }[]>([{ text: "" }]);

const aufzeichnungOrange = ref<
  { text: string; link?: string; hasLink: boolean }[]
>([{ text: "", hasLink: false, link: "" }]);
const verantwortlicherOrange: Ref<string> = ref("");
const informationOrange: Ref<string> = ref("");

function addVorgabeBlue() {
  vorgabenBlue.value.push({ text: "", hasLink: false, link: "" });
}

function removeVorgabeBlue(index: number) {
  vorgabenBlue.value.splice(index, 1);
}

function addVorlagenBlue() {
  vorlagenBlue.value.push({ text: "", hasLink: false, link: "" });
}

function removeVorlagenBlue(index: number) {
  vorlagenBlue.value.splice(index, 1);
}

function addMiddleList() {
  middleList.value.push({ text: "" });
}

function removeMiddleList(index: number) {
  middleList.value.splice(index, 1);
}

function addAufzeichnungOrange() {
  aufzeichnungOrange.value.push({ text: "", hasLink: false, link: "" });
}

function removeAufzeichnungOrange(index: number) {
  aufzeichnungOrange.value.splice(index, 1);
}

async function postForm() {
  const data = {
    schrittCount: schrittCount.value,
    vorgabenBlue: vorgabenBlue.value,
    vorlagenBlue: vorlagenBlue.value,
    middleHead: middleHead.value,
    middleList: middleList.value,
    aufzeichnungOrange: aufzeichnungOrange.value,
    verantwortlicherOrange: verantwortlicherOrange.value,
    informationOrange: informationOrange.value,
    path: "01-vereinsfuehrung",
    subPath: "01-011-jahresplanung",
  };

  const res = await $fetch("/api/saveForm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(res);
}

function clearForm() {
  schrittCount.value = 0;
  vorgabenBlue.value = [];
  vorlagenBlue.value = [];
  middleHead.value = "";
  middleList.value = [];
  aufzeichnungOrange.value = [];
  verantwortlicherOrange.value = "";
  informationOrange.value = "";
}
</script>

<template>
  <UCard class="max-w-xl mx-auto mt-10">
    <UForm class="space-y-5">
      <UCard>
        <h1 class="mb-4 text-xl">Schritt</h1>

        <UInput
          v-model="schrittCount"
          placeholder="Schritt"
          type="number"
          icon="i-heroicons-document-plus"
        />
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Vorgaben / Arbeitshilfen</h1>

        <div
          v-for="(item, index) in vorgabenBlue"
          :key="index"
          class="mb-8 space-y-3 relative"
        >
          <UInput
            v-model="item.text"
            placeholder="Vorgaben / Arbeitshilfen..."
            icon="i-heroicons-document-text"
          />

          <UCheckbox v-model="item.hasLink" label="Als Link hinzufügen" />

          <UInput
            v-if="item.hasLink"
            v-model="item.link"
            placeholder="https://..."
            icon="i-heroicons-link"
          />

          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            class="absolute top-2 right-2"
            @click="removeVorgabeBlue(index)"
          />
        </div>

        <UButton
          color="neutral"
          variant="soft"
          class="mt-2"
          icon="i-heroicons-plus"
          @click="addVorgabeBlue"
        >
          Hinzufügen
        </UButton>
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Vorlagen Schlussberichte</h1>

        <div
          v-for="(item, index) in vorlagenBlue"
          :key="index"
          class="mb-8 space-y-3 relative"
        >
          <UInput
            v-model="item.text"
            placeholder="Vorlagen Schlussberichte..."
            icon="i-heroicons-document-text"
          />

          <UCheckbox v-model="item.hasLink" label="Als Link hinzufügen" />

          <UInput
            v-if="item.hasLink"
            v-model="item.link"
            placeholder="https://..."
            icon="i-heroicons-link"
          />

          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            class="absolute top-2 right-2"
            @click="removeVorlagenBlue(index)"
          />
        </div>

        <UButton
          color="neutral"
          variant="soft"
          class="mt-2"
          icon="i-heroicons-plus"
          @click="addVorlagenBlue"
        >
          Hinzufügen
        </UButton>
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Überschrift Kernprozess</h1>

        <UInput
          v-model="middleHead"
          placeholder="Überschrift Kernprozess"
          type="text"
          icon="i-heroicons-document-text"
        />
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Kernprozess Inhalt</h1>

        <div
          v-for="(item, index) in middleList"
          :key="index"
          class="mb-8 space-y-3 relative"
        >
          <UInput
            v-model="item.text"
            placeholder="Kernprozess Inhalt..."
            icon="i-heroicons-document-text"
          />

          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            class="absolute top-2 right-2"
            @click="removeMiddleList(index)"
          />
        </div>

        <UButton
          color="neutral"
          variant="soft"
          class="mt-2"
          icon="i-heroicons-plus"
          @click="addMiddleList"
        >
          Hinzufügen
        </UButton>
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Aufzeichnungen / Dokumentation</h1>

        <div
          v-for="(item, index) in aufzeichnungOrange"
          :key="index"
          class="mb-8 space-y-3 relative"
        >
          <UInput
            v-model="item.text"
            placeholder="Aufzeichnungen / Dokumentation..."
            icon="i-heroicons-document-text"
          />

          <UCheckbox v-model="item.hasLink" label="Als Link hinzufügen" />

          <UInput
            v-if="item.hasLink"
            v-model="item.link"
            placeholder="https://..."
            icon="i-heroicons-link"
          />

          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            class="absolute top-2 right-2"
            @click="removeAufzeichnungOrange(index)"
          />
        </div>

        <UButton
          color="neutral"
          variant="soft"
          class="mt-2"
          icon="i-heroicons-plus"
          @click="addAufzeichnungOrange"
        >
          Hinzufügen
        </UButton>
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Verantwortliche/r</h1>

        <UTextarea
          v-model="verantwortlicherOrange"
          placeholder="Verantwortliche/r"
          type="text"
          icon="i-heroicons-document-text"
          autoresize
        />
      </UCard>

      <UCard>
        <h1 class="mb-4 text-xl">Information an</h1>

        <UTextarea
          v-model="informationOrange"
          placeholder="Information an"
          type="text"
          icon="i-heroicons-document-text"
          autoresize
        />
      </UCard>

      <div class="flex justify-around">
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-paper-airplane"
          @click="postForm"
        >
          Senden
        </UButton>

        <UButton
          color="error"
          variant="solid"
          icon="i-heroicons-x-mark"
          @click="clearForm"
        >
          Löschen
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
