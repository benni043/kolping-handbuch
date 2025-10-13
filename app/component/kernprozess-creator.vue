<script setup lang="ts">

let schrittCount: Ref<number | undefined> = ref(undefined);
let vorgabenBlue: Ref<{ text: string, isLink: boolean }[]> = ref([]);
let vorlagenBlue: Ref<{ text: string, isLink: boolean }[]> = ref([]);

let middleHead: Ref<string> = ref("");
let middleList: Ref<string[]> = ref([]);

let aufzeichnungOrange: Ref<{ text: string, isLink: boolean }[]> = ref([]);
let verantwortlicherOrange: Ref<string> = ref("");
let informationOrange: Ref<string> = ref("");

import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

const vorgaben = ref<{ text: string; link?: string; hasLink: boolean }[]>([]);
const newItem = ref({ text: "", hasLink: false, link: "" });

function addItem() {
  if (!newItem.value.text) return;
  vorgaben.value.push({
    text: newItem.value.text,
    hasLink: newItem.value.hasLink,
    link: newItem.value.hasLink ? newItem.value.link : undefined,
  });
  newItem.value = { text: "", hasLink: false, link: "" };
}

function removeItem(index: number) {
  vorgaben.value.splice(index, 1);
}

function send() {
  console.log(vorgaben.value);
}
</script>

<template>
  <UCard class="max-w-xl mx-auto mt-10 shadow-lg border border-gray-200 rounded-2xl">
    <UCardHeader>
      <h2 class="text-lg font-semibold text-gray-800">Vorgaben hinzufügen</h2>
    </UCardHeader>

    <UCardBody>
      <UForm class="space-y-5">
        <UFormGroup label="Vorgabetext">
          <UInput
              v-model="newItem.text"
              placeholder="Titel oder Beschreibung..."
              icon="i-heroicons-document-text"
          />
        </UFormGroup>

        <div class="flex items-center gap-2">
          <UCheckbox v-model="newItem.hasLink" label="Mit Link hinzufügen" />
        </div>

        <UFormGroup v-if="newItem.hasLink" label="Link">
          <UInput
              v-model="newItem.link"
              placeholder="https://..."
              icon="i-heroicons-link"
          />
        </UFormGroup>

        <div class="flex justify-end">
          <UButton
              @click="addItem"
              color="primary"
              variant="solid"
              icon="i-heroicons-plus-circle"
          >
            Hinzufügen
          </UButton>
        </div>

        <div v-if="vorgaben.length" class="mt-6 space-y-3">
          <div
              v-for="(item, i) in vorgaben"
              :key="i"
              class="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition"
          >
            <div>
              <div class="font-medium text-gray-800">{{ item.text }}</div>
              <div
                  v-if="item.hasLink"
                  class="text-sm text-blue-600 underline truncate max-w-[250px]"
              >
                {{ item.link }}
              </div>
            </div>
            <UButton
                color="red"
                variant="soft"
                size="xs"
                icon="i-heroicons-trash"
                @click="removeItem(i)"
            >
              Entfernen
            </UButton>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <UButton
              @click="send"
              color="green"
              variant="solid"
              icon="i-heroicons-paper-airplane"
          >
            Senden
          </UButton>
        </div>
      </UForm>
    </UCardBody>
  </UCard>

    <!--  <form onsubmit="submit()">-->
    <!--    <div>-->
    <!--      <label for="schritt">Der wievielte Schritt ist dieser Kernprozessabschnitt</label>-->
    <!--      <input v-model="schrittCount" type="number" id="schritt" placeholder="schritt">-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="vorgaben">Vorgaben / Arbeitshilfen</label>-->
    <!--      <div v-for="(item, i) in vorgabenBlue" :key="i">-->
    <!--        <input v-model="vorgabenBlue[i]?.text" type="text" id="vorgaben" placeholder="Vorgaben / Arbeitshilfen">-->

    <!--        <label for="isLinkVorgaben">Soll es ein Link sein?</label>-->
    <!--        <input id="isLinkVorgaben" v-model="vorgabenBlue[i]?.isLink" type="checkbox">-->

    <!--        <label for="">Link</label>-->
    <!--        <input >-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="vorlagen">Vorlagen Schlussberichte</label>-->
    <!--      <div v-for="(item, i) in vorlagenBlue" :key="i">-->
    <!--        <input v-model="vorlagenBlue[i]?.text" type="text" id="vorlagen" placeholder="Vorlagen Schlussberichte">-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="middleHead">Überschrift</label>-->
    <!--      <input v-model="middleHead" type="text" id="middleHead" placeholder="Überschrift">-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="middleList">Mitte Liste</label>-->
    <!--      <div v-for="(item, i) in middleList" :key="i">-->
    <!--        <input v-model="middleList[i]" type="text" id="middleList" placeholder="Mitte Liste">-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="aufzeichnungen">Aufzeichnungen / Dokumentationen</label>-->
    <!--      <div v-for="(item, i) in aufzeichnungOrange" :key="i">-->
    <!--        <input v-model="aufzeichnungOrange[i]?.text" type="text" id="aufzeichnungen"-->
    <!--               placeholder="Aufzeichnungen / Dokumentationen">-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="verantwortlicher">Verantwortliche/r</label>-->
    <!--      <input v-model="verantwortlicherOrange" type="text" id="verantwortlicher"-->
    <!--             placeholder="Verantwortliche/r">-->
    <!--    </div>-->

    <!--    <div>-->
    <!--      <label for="information">Information an</label>-->
    <!--      <input v-model="informationOrange" type="text" id="information"-->
    <!--             placeholder="Information an">-->
    <!--    </div>-->

    <!--    <button type="submit">submit</button>-->
    <!--  </form>-->
</template>

<style scoped>

</style>