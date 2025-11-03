<script setup lang="ts">
import { ref } from "vue";
import type { TestLink } from "~/types/kernprozess";

const props = defineProps<{
  schrittCount: number;
  vorgabenBlue: TestLink[];
  vorlagenBlue: TestLink[];
  middleHead: string;
  middleList: { text: string }[];
  aufzeichnungOrange: TestLink[];
  verantwortlicherOrange: string;
  informationOrange: string;
}>();

const emit = defineEmits(["cancle"]);

const schrittCountRef: Ref<number> = ref(props.schrittCount || 0);
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
  const data = {
    schrittCount: schrittCountRef.value,
    vorgabenBlue: vorgabenBlueRef.value,
    vorlagenBlue: vorlagenBlueRef.value,
    middleHead: middleHeadRef.value,
    middleList: middleListRef.value,
    aufzeichnungOrange: aufzeichnungOrangeRef.value,
    verantwortlicherOrange: verantwortlicherOrangeRef.value,
    informationOrange: informationOrangeRef.value,
    path: "01",
    subPath: "01-01-1",
  };

  const res = await $fetch("/api/saveForm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(res);
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
}
</script>

<template>
  <div class="h-full flex items-center">
    <UCard class="max-w-7xl mx-auto h-90vh">
      <UForm class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- left -->
        <div class="flex flex-col gap-6">
          <!-- Schritt -->
          <UCard>
            <h1 class="mb-4 text-xl font-semibold">Schritt</h1>
            <UInput
              v-model="schrittCountRef"
              placeholder="Schritt"
              type="number"
              icon="i-heroicons-document-plus"
              size="lg"
              class="w-full"
            />
          </UCard>

          <!-- Vorgaben / Arbeitshilfen -->
          <UCard class="flex-1 overflow-y-auto min-h-[300px] max-h-[300px]">
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

          <!-- Vorlagen -->
          <UCard class="flex-1 overflow-y-auto min-h-[300px] max-h-[300px]">
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
        </div>

        <!-- middle -->
        <div class="flex flex-col gap-6">
          <!-- Überschrift -->
          <UCard>
            <h1 class="mb-4 text-xl font-semibold">Überschrift Kernprozess</h1>

            <UInput
              v-model="middleHeadRef"
              placeholder="Überschrift Kernprozess"
              icon="i-heroicons-document-text"
              size="lg"
              class="w-full"
            />
          </UCard>

          <!-- Middle List -->
          <UCard class="flex-1 overflow-y-auto max-h-[650px]">
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
              @click="addMiddleList"
            >
              Hinzufügen
            </UButton>
          </UCard>
        </div>

        <!-- right -->
        <div class="flex flex-col gap-6">
          <!-- Aufzeichnungen -->
          <UCard class="flex-1 overflow-y-auto min-h-[300px] max-h-[300px]">
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

          <!-- Verantwortliche -->
          <UCard>
            <h1 class="mb-4 text-xl font-semibold">Verantwortliche/r</h1>

            <UTextarea
              v-model="verantwortlicherOrangeRef"
              placeholder="Verantwortliche/r"
              class="w-full"
            />
          </UCard>

          <!-- Information an -->
          <UCard>
            <h1 class="mb-4 text-xl font-semibold">Information an</h1>
            <UTextarea
              v-model="informationOrangeRef"
              placeholder="Information an"
              class="w-full"
            />
          </UCard>
        </div>

        <!-- buttons -->
        <div class="col-span-full flex justify-center gap-6">
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-paper-airplane"
            size="lg"
            class="cursor-pointer"
            @click="postForm"
          >
            Ändern
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
    </UCard>
  </div>
</template>

<style scoped></style>
<style scoped></style>
