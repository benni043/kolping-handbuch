<script setup lang="ts">

let schrittCount: Ref<number | undefined> = ref(undefined);
let vorgabenBlue: Ref<{ text: string, isLink: boolean }[]> = ref([]);
let vorlagenBlue: Ref<{ text: string, isLink: boolean }[]> = ref([]);

let middleHead: Ref<string> = ref("");
let middleList: Ref<string[]> = ref([]);

let aufzeichnungOrange: Ref<{ text: string, isLink: boolean }[]> = ref([]);
let verantwortlicherOrange: Ref<string> = ref("");
let informationOrange: Ref<string> = ref("");

function submit() {

}

import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

const schema = z.object({
  vorgaben: z.string()
})

type Schema = z.output<typeof schema>

const itemSchema = z.object({
  test1: z.string(),
  test2: z.string()
})

type ItemSchema = z.output<typeof itemSchema>


const state = reactive<Partial<Schema & { items: Partial<ItemSchema>[] }>>({})

function addItem() {
  if (!state.items) {
    state.items = []
  }
  state.items.push({})
}

function removeItem() {
  if (state.items) {
    state.items.pop()
  }
}

function onSubmit() {

}
</script>

<template>
<!--  <UForm-->
<!--      :state="state"-->
<!--      :schema="schema"-->
<!--      class="gap-4 flex flex-col w-60"-->
<!--      @submit="onSubmit"-->
<!--  >-->
<!--    <UFormField label="Vorgaben / Arbeitshilfen" name="vorgaben">-->
<!--      <UInput v-model="state.vorgaben" placeholder="Vorgaben / Arbeitshilfen" />-->
<!--    </UFormField>-->

    <UForm
        v-for="(item, count) in state.items"
        :key="count"
        :name="`items.${count}`"
        :schema="itemSchema"
        class="flex gap-4"
        :state="state"
        @submit="onSubmit"
    >
      <UFormField :label="!count ? 'Vorgaben / Arbeitshilfen' : undefined" name="vorgaben">
        <UInput v-model="item.test1" placeholder="Vorgaben / Arbeitshilfen"/>
      </UFormField>

      <UFormField :label="!count ? 'Price' : undefined" name="price" class="w-20">
        <UInput v-model="item.test2" type="number" />
      </UFormField>
    </UForm>

    <div class="flex gap-2">
      <UButton color="neutral" variant="subtle" size="sm" @click="addItem()">
        Add Item
      </UButton>

      <UButton color="neutral" variant="ghost" size="sm" @click="removeItem()">
        Remove Item
      </UButton>
    </div>
    <div>
      <UButton type="submit">
        Submit
      </UButton>
    </div>
<!--  </UForm>-->

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