<script setup lang="ts">
import { ref } from "vue";
import type { Structure } from "~/utils/type/structure";
import { categories } from "~/utils/nav-menu";
import { useDevice } from "#imports";

defineProps<{
  data: Structure[];
  active: boolean;
}>();

const emit = defineEmits(["emit-route", "refetch", "active"]);

const toast = useToast();

const { user } = useUserSession();

const hoveredCategory = ref<number | null>(null);
const hoveredSub = ref<number | null>(null);
const hoveredSubSub = ref<number | null>(null);

let categoryTimeout: ReturnType<typeof setTimeout> | null = null;
let subTimeout: ReturnType<typeof setTimeout> | null = null;
let subSubTimeout: ReturnType<typeof setTimeout> | null = null;

const timeout = 500;

const addingLvl1 = ref(false);
const addingLvl2 = ref(false);

const currentPathId = ref("");
const currentPathUuid = ref("");

const { isMobile } = useDevice();

function click(
  pathId: string,
  subPathId: string | null,
  category: string | null,
) {
  emit("emit-route", pathId, subPathId, category);

  hoveredSub.value = null;
  hoveredSubSub.value = null;
  hoveredCategory.value = null;

  emit("active");
}

function enterCategory(index: number) {
  if (categoryTimeout) clearTimeout(categoryTimeout);
  hoveredCategory.value = index;
}

function leaveCategory(mobile: boolean) {
  const to = mobile ? 0 : timeout;

  categoryTimeout = setTimeout(() => {
    hoveredCategory.value = null;
    hoveredSub.value = null;
  }, to);
}

function enterSub(subIndex: number) {
  if (subTimeout) clearTimeout(subTimeout);
  hoveredSub.value = subIndex;
}

function leaveSub(mobile: boolean) {
  const to = mobile ? 0 : timeout;

  subTimeout = setTimeout(() => {
    hoveredSub.value = null;
  }, to);
}

function enterSubSub(subIndex: number) {
  if (subSubTimeout) clearTimeout(subSubTimeout);
  hoveredSubSub.value = subIndex;
}

function leaveSubSub(mobile: boolean) {
  const to = mobile ? 0 : timeout;

  subSubTimeout = setTimeout(() => {
    hoveredSubSub.value = null;
  }, to);
}

function addLvl1() {
  addingLvl1.value = true;
}

function addLvl2(pathUuid: string, pathId: string) {
  currentPathId.value = pathId;
  currentPathUuid.value = pathUuid;

  addingLvl2.value = true;
}

function cancleAdding() {
  addingLvl1.value = false;
  addingLvl2.value = false;

  currentPathId.value = "";
}

async function addLvl2Menu(subMenuName: string) {
  try {
    await $fetch("/api/content/subMenu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        menuUuid: currentPathUuid.value,
        menuId: currentPathId.value,
        subMenuName: subMenuName,
      },
    });

    cancleAdding();

    emit("refetch");

    toast.add({
      title: "Erfolg",
      description: "Der Untermenupunkt wurde erfolgreich hinzugefügt!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function addLvl1Menu(menuName: string, subMenuName: string) {
  try {
    await $fetch("/api/content/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        menuName: menuName,
        subMenuName: subMenuName,
      },
    });

    cancleAdding();

    emit("refetch");

    toast.add({
      title: "Erfolg",
      description: "Der Menupunkt wurde erfolgreich hinzugefügt!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function deleteLvl1(uuid: string, id: string) {
  if (!confirm("Sind Sie sicher, dass sie diesen Menüpunkt löschen möchten?"))
    return;

  try {
    await $fetch(`/api/content/menu`, {
      method: "DELETE",
      body: {
        menuUuid: uuid,
        menuId: id,
      },
    });

    cancleAdding();

    emit("refetch");

    toast.add({
      title: "Erfolg",
      description: "Der Menupunkt wurde erfolgreich gelöscht!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Löschen des Menupunkts ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function deleteLvl2(id: string, subId: string) {
  if (
    !confirm("Sind Sie sicher, dass sie diesen SubMenüpunkt löschen möchten?")
  )
    return;

  try {
    await $fetch(`/api/content/subMenu`, {
      method: "DELETE",
      body: {
        menuUuid: id,
        subMenuUuid: subId,
      },
    });

    cancleAdding();

    emit("refetch");

    toast.add({
      title: "Erfolg",
      description: "Der Submenupunkt wurde erfolgreich gelöscht!",
      color: "success",
      icon: "i-heroicons-check",
    });
  } catch (e: any) {
    toast.add({
      title: "Fehler",
      description: "Beim Löschen des Subenupunkts ist ein Fehler aufgetreten!",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}
</script>

<template>
  <div v-if="active || !isMobile" class="z-10 relative not-lg:w-full">
    <ul class="hidden lg:flex text-sm">
      <!-- normal lvl 1 -->
      <li>
        <div
          v-for="(path, index) in data"
          :key="path.id"
          class="relative h-11 bg-[#50A9CE]/[0.33] min-w-88 border-b-1 border-b-gray-400"
          :class="{
            'rounded-tl-2xl': index === 0,
            'rounded-bl-2xl':
              index === data.length - 1 &&
              user?.role !== 'admin' &&
              user?.role !== 'editor',
          }"
          @mouseenter="enterCategory(index)"
          @mouseleave="leaveCategory(false)"
          @click.stop="click(path.uuid, null, null)"
        >
          <div
            class="h-full w-full flex items-center cursor-pointer"
            :class="{ 'text-[#F18700]': hoveredCategory === index }"
          >
            <b class="text-[#F18700] ml-5">{{ path.id }}&emsp;</b>
            <b>{{ path.name }}</b>
          </div>

          <ul
            v-if="hoveredCategory === index"
            class="flex absolute ml-1 top-0 left-full max-w-max text-sm"
            :class="{
              'ml-14': user?.role === 'editor' || user?.role === 'admin',
            }"
          >
            <li class="bg-white">
              <!-- normal lvl 2 -->
              <div
                v-for="(subPath, subIndex) in path.children"
                :key="subPath.id"
                class="relative h-11 bg-[#50A9CE]/[0.33] border-b-1 border-b-gray-400 min-w-88"
                @mouseenter="enterSub(subIndex)"
                @mouseleave="leaveSub(false)"
                @click.stop="click(path.uuid, subPath.uuid, null)"
              >
                <div
                  class="h-full w-full flex items-center cursor-pointer"
                  :class="{ 'text-[#F18700]': hoveredSub === subIndex }"
                >
                  <b class="text-[#F18700] ml-5">{{ subPath.id }}&emsp;</b>
                  <b>{{ subPath.name }}</b>
                </div>

                <ul
                  v-if="hoveredSub === subIndex"
                  class="bg-white absolute ml-1 top-0 left-full min-w-44 max-w-max text-sm divide-y divide-gray-400"
                  :class="{
                    'ml-14': user?.role === 'editor' || user?.role === 'admin',
                  }"
                >
                  <li
                    v-for="(category, subSubIndex) in categories"
                    :key="category"
                    class="relative h-11 bg-[#50A9CE]/[0.33]"
                    @mouseenter="enterSubSub(subSubIndex)"
                    @mouseleave="leaveSubSub(false)"
                    @click.stop="click(path.uuid, subPath.uuid, category)"
                  >
                    <div
                      class="h-full w-full flex items-center cursor-pointer ml-5"
                      :class="{
                        'text-[#F18700]': hoveredSubSub === subSubIndex,
                      }"
                    >
                      <b>{{ category }}</b>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- extra lvl 2 -->
              <div
                v-if="user?.role === 'admin' || user?.role === 'editor'"
                class="relative h-11 bg-[#ABE0D9] min-w-88"
                @mouseenter="enterSub(-1)"
                @mouseleave="leaveSub(false)"
                @click.stop="addLvl2(path.uuid, path.id)"
              >
                <div
                  class="h-full w-full flex items-center cursor-pointer ml-5"
                  :class="{ 'text-[#F18700]': hoveredSub === -1 }"
                >
                  <b class="text-[#F18700]">+</b>&emsp;
                  <b>Extra Unterpunkt</b>
                </div>
              </div>
            </li>

            <li
              v-if="user?.role === 'admin' || user?.role === 'editor'"
              class=""
            >
              <div
                v-for="subPath in path.children"
                :key="subPath.id"
                class="relative h-11 flex items-center justify-center bg-[#ABE0D9] ml-1 min-w-12 cursor-pointer hover:text-red-600 border-b-1 border-b-gray-400"
                @click.stop="deleteLvl2(path.uuid, subPath.uuid)"
              >
                <b>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </b>
              </div>
            </li>
          </ul>
        </div>

        <!-- extra lvl 1 -->
        <div
          v-if="user?.role === 'admin' || user?.role === 'editor'"
          class="relative h-11 bg-[#ABE0D9] rounded-bl-2xl min-w-88"
          @mouseenter="enterCategory(-1)"
          @mouseleave="leaveCategory(false)"
          @click.stop="addLvl1()"
        >
          <div
            class="h-full w-full flex items-center ml-5 cursor-pointer"
            :class="{ 'text-[#F18700]': hoveredCategory === -1 }"
          >
            <b class="text-[#F18700]">+</b>&emsp;
            <b>Extra Menüpunkt</b>
          </div>
        </div>
      </li>

      <li v-if="user?.role === 'admin' || user?.role === 'editor'">
        <div
          v-for="path in data"
          :key="path.id"
          class="relative h-11 flex items-center justify-center bg-[#ABE0D9] ml-1 min-w-12 cursor-pointer hover:text-red-600 border-b-1 border-b-gray-400"
          @click.stop="deleteLvl1(path.uuid, path.id)"
        >
          <b>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </b>
        </div>
      </li>
    </ul>

    <ul class="lg:hidden">
      <li v-for="(path, index) in data" :key="path.id">
        <div
          class="flex items-center h-13 bg-[#50A9CE]/[0.33] border-b-1 border-b-gray-400"
          @click="
            hoveredCategory === null || hoveredCategory !== index
              ? enterCategory(index)
              : leaveCategory(true)
          "
        >
          <b class="text-[#F18700] ml-3 mr-3">{{ path.id }}</b>
          <b
            :class="{
              'text-[#F18700]': hoveredCategory === index,
            }"
            class="flex-1"
          >
            <span @click.stop="click(path.uuid, null, null)">{{
              path.name
            }}</span>
          </b>
          <b
            v-if="user?.role === 'admin' || user?.role === 'editor'"
            class="mr-3 ml-3"
            @click.stop="deleteLvl1(path.uuid, path.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </b>
          <b class="mr-3 ml-3">
            <svg
              v-if="hoveredCategory !== index"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </b>
        </div>

        <ul v-if="hoveredCategory === index">
          <li v-for="(subPath, subIndex) in path.children" :key="subPath.id">
            <div
              class="flex items-center h-13 bg-[#50A9CE]/[0.33] min-w-88 border-b-1 border-b-gray-400"
              @click="
                hoveredSub === null || hoveredSub !== subIndex
                  ? enterSub(subIndex)
                  : leaveSub(true)
              "
            >
              <b class="text-[#F18700] ml-6 mr-3">{{ subPath.id }}</b>
              <b
                :class="{
                  'text-[#F18700]': hoveredSub === subIndex,
                }"
                class="flex-1"
              >
                <span @click.stop="click(path.uuid, subPath.uuid, null)">{{
                  subPath.name
                }}</span>
              </b>
              <b
                v-if="user?.role === 'admin' || user?.role === 'editor'"
                class="mr-3 ml-3"
                @click.stop="deleteLvl2(path.uuid, subPath.uuid)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </b>
              <b class="mr-3 ml-3">
                <svg
                  v-if="hoveredSub !== subIndex"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </b>
            </div>

            <ul v-if="hoveredSub === subIndex">
              <li v-for="(category, subSubIndex) in categories" :key="category">
                <div
                  class="flex items-center h-13 bg-[#50A9CE]/[0.33] min-w-88 border-b-1 border-b-gray-400"
                  @click.stop="click(path.uuid, subPath.uuid, category)"
                >
                  <b
                    class="ml-9"
                    :class="{
                      'text-[#F18700]': hoveredSubSub === subSubIndex,
                    }"
                    @click="
                      hoveredSubSub === null
                        ? enterSubSub(subSubIndex)
                        : leaveSubSub(true)
                    "
                    >{{ category }}</b
                  >
                </div>
              </li>
            </ul>
          </li>

          <li v-if="user?.role === 'admin' || user?.role === 'editor'">
            <div
              class="flex items-center h-13 bg-[#ABE0D9] min-w-88 border-b-1 border-b-gray-400"
              @click.stop="addLvl2(path.uuid, path.id)"
            >
              <b class="text-[#F18700] ml-6 mr-3">+</b>
              <b>
                <span>Extra Submenüpunkt</span>
              </b>
            </div>
          </li>
        </ul>
      </li>

      <li v-if="user?.role === 'admin' || user?.role === 'editor'">
        <div
          class="flex items-center h-13 bg-[#ABE0D9] min-w-88 border-b-1 border-b-gray-400"
          @click.stop="addLvl1()"
        >
          <b class="text-[#F18700] ml-3 mr-3">+</b>
          <b>
            <span>Extra Menüpunkt</span>
          </b>
        </div>
      </li>
    </ul>

    <UModal
      v-model:open="addingLvl1"
      title="Inhalt hinzufügen"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <NavMenuForm
          @add="
            (menuName: string, subMenuName: string) =>
              addLvl1Menu(menuName, subMenuName)
          "
        ></NavMenuForm>
      </template>
    </UModal>

    <UModal
      v-model:open="addingLvl2"
      title="SubInhalt hinzufügen"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <NavSubMenuForm
          @add="(subMenuName: string) => addLvl2Menu(subMenuName)"
        ></NavSubMenuForm>
      </template>
    </UModal>
  </div>
</template>
