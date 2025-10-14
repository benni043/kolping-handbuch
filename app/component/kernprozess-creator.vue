<script setup lang="ts">
import {ref} from "vue";

let schrittCount: Ref<number | undefined> = ref(undefined);

const vorgabenBlue = ref<{ text: string; link?: string; hasLink: boolean }[]>([
  {text: "", hasLink: false, link: ""}
]);

let vorlagenBlue = ref<{ text: string; link?: string; hasLink: boolean }[]>([
  {text: "", hasLink: false, link: ""}
]);

let middleHead: Ref<string> = ref("");
let middleList: Ref<string[]> = ref([]);

let aufzeichnungOrange: Ref<{ text: string, isLink: boolean }[]> = ref([]);
let verantwortlicherOrange: Ref<string> = ref("");
let informationOrange: Ref<string> = ref("");


function addVorgabeBlue() {
  vorgabenBlue.value.push({text: "", hasLink: false, link: ""});
}

function removeVorgabeBlue(index: number) {
  vorgabenBlue.value.splice(index, 1);
}


function addVorlagenBlue() {
  vorlagenBlue.value.push({text: "", hasLink: false, link: ""});
}

function removeVorlagenBlue(index: number) {
  vorlagenBlue.value.splice(index, 1);
}

function postForm() {
  console.log(schrittCount)
  console.log(vorgabenBlue.value);
  console.log(vorlagenBlue.value);
}
</script>

<template>
  <UCard class="max-w-xl mx-auto mt-10">
    <UForm class="space-y-5">
      <UCard>
        <h1 class="mb-2">Schritt</h1>

        <UInput
            v-model="schrittCount"
            placeholder="Schritt"
            type="number"
            icon="i-heroicons-document-plus"
        />
      </UCard>

      <UCard>
        <h1 class="mb-2">Vorgaben / Arbeitshilfen</h1>

        <div v-for="(item, index) in vorgabenBlue" :key="index" class="mb-8 space-y-3 relative">
          <UInput
              v-model="item.text"
              placeholder="Vorgaben / Arbeitshilfen..."
              icon="i-heroicons-document-text"
          />

          <UCheckbox v-model="item.hasLink" label="Als Link hinzufügen"/>

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
            @click="addVorgabeBlue"
            color="neutral"
            variant="soft"
            class="mt-2"
            icon="i-heroicons-plus"
        >
          Hinzufügen
        </UButton>
      </UCard>

      <UCard>
        <h1 class="mb-2">Vorlagen Schlussberichte</h1>

        <div v-for="(item, index) in vorlagenBlue" :key="index" class="mb-8 space-y-3 relative">
          <UInput
              v-model="item.text"
              placeholder="Vorlagen Schlussberichte..."
              icon="i-heroicons-document-text"
          />

          <UCheckbox v-model="item.hasLink" label="Als Link hinzufügen"/>

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
            @click="addVorlagenBlue"
            color="neutral"
            variant="soft"
            class="mt-2"
            icon="i-heroicons-plus"
        >
          Hinzufügen
        </UButton>
      </UCard>

      <UButton
          @click="postForm"
          color="primary"
          variant="solid"
          icon="i-heroicons-paper-airplane"
      >
        Senden
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped>

</style>