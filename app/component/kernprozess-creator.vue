<script setup lang="ts">
import {ref} from "vue";

let schrittCount: Ref<number | undefined> = ref(undefined);
let vorlagenBlue: Ref<{ text: string, isLink: boolean }[]> = ref([]);

let middleHead: Ref<string> = ref("");
let middleList: Ref<string[]> = ref([]);

let aufzeichnungOrange: Ref<{ text: string, isLink: boolean }[]> = ref([]);
let verantwortlicherOrange: Ref<string> = ref("");
let informationOrange: Ref<string> = ref("");


const vorgaben = ref<{ text: string; link?: string; hasLink: boolean }[]>([
  {text: "", hasLink: false, link: ""}
]);

function addItem() {
  vorgaben.value.push({text: "", hasLink: false, link: ""});
}

function removeItem(index: number) {
  vorgaben.value.splice(index, 1);
}

function send() {
  console.log(vorgaben.value);
}
</script>

<template>
  <UCard class="max-w-xl mx-auto mt-10">
    <UForm class="space-y-5">
      <h1>Vorgaben / Arbeitshilfen</h1>

      <div v-for="(item, index) in vorgaben" :key="index" class="border p-4 rounded-xl space-y-3 relative">
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
            @click="removeItem(index)"
        />
      </div>

      <div class="flex justify-between mt-6">
        <UButton
            @click="addItem"
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
        >
          Hinzufügen
        </UButton>
      </div>

      <UButton
          @click="send"
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