<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const emit = defineEmits(["cancle", "add"]);

const menuName = ref("");
const subMenuName = ref("");

const menuError = ref("");
const subMenuError = ref("");

watch(menuName, () => {
  menuError.value = validateUsername(menuName.value);
});

watch(subMenuName, () => {
  subMenuError.value = validateUsername(subMenuName.value);
});

async function add() {
  if (!confirm("Sind Sie sicher, dass sie diesen Menupunkt hinzufügen wollen?"))
    return;

  emit("add", menuName.value, subMenuName.value);
}

function cancle() {
  emit("cancle");
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <UCard class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">
        Inhalt hinzufügen
      </h1>

      <UForm class="space-y-5">
        <div>
          <h1 class="mb-4 text-xl font-semibold">Menuname</h1>
          <UInput
            v-model="menuName"
            placeholder="Menuname"
            type="text"
            size="xl"
            class="w-full"
          />
          <p v-if="menuError" class="text-red-500 mt-2 font-medium">
            {{ menuError }}
          </p>
        </div>

        <div>
          <h1 class="mb-4 text-xl font-semibold">Untermenu</h1>

          <UInput
            v-model="subMenuName"
            placeholder="Untermenu"
            type="text"
            size="xl"
            class="w-full"
          />
          <p v-if="subMenuError" class="text-red-500 mt-2 font-medium">
            {{ subMenuError }}
          </p>
        </div>

        <div class="flex gap-5">
          <UButton
            color="primary"
            size="xl"
            variant="solid"
            type="submit"
            block
            icon="i-heroicons-lock-closed"
            class="cursor-pointer"
            :disabled="
              menuError !== '' ||
              subMenuError !== '' ||
              menuName === '' ||
              subMenuName === ''
            "
            @click.prevent="add"
          >
              Hinzufügen
          </UButton>

          <UButton
            color="error"
            size="xl"
            variant="solid"
            block
            icon="i-heroicons-x-mark"
            class="cursor-pointer"
            @click="cancle"
          >
            Abbrechen
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
