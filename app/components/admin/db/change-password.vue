<script setup lang="ts">
const emit = defineEmits(["cancle", "change"]);

const props = defineProps<{
  id: number;
}>();

const passwordError = ref("");
const password2Error = ref("");

const password1 = ref("");
const password2 = ref("");

watch(password1, () => {
  passwordError.value = validatePassword(password1.value);
  password2Error.value = validatePasswordMatch(
    password1.value,
    password2.value,
  );
});
watch(password2, () => {
  password2Error.value = validatePasswordMatch(
    password1.value,
    password2.value,
  );
});

async function change() {
  passwordError.value = validatePassword(password1.value);
  password2Error.value = validatePasswordMatch(
    password1.value,
    password2.value,
  );

  if (passwordError.value || password2Error.value) return;

  emit("change", props.id, password1.value);
}

function cancle() {
  emit("cancle");
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <UCard class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">
        Benutzer bearbeiten
      </h1>

      <UForm class="space-y-5">
        <div>
          <h1 class="mb-4 text-xl font-semibold">Passwort</h1>
          <UInput
            v-model="password1"
            placeholder="Passwort"
            type="password"
            size="xl"
            class="w-full"
          />
          <p v-if="passwordError" class="text-red-500 mt-2 font-medium">
            {{ passwordError }}
          </p>
        </div>

        <div>
          <h1 class="mb-4 text-xl font-semibold">Passwort wiederholen</h1>
          <UInput
            v-model="password2"
            placeholder="Passwort wiederholen"
            type="password"
            size="xl"
            class="w-full"
          />
          <p v-if="password2Error" class="text-red-500 mt-2 font-medium">
            {{ password2Error }}
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
              passwordError !== '' ||
              password2Error !== '' ||
              password1 === '' ||
              password2 === ''
            "
            @click="change()"
          >
            Ändern
          </UButton>

          <UButton
            color="error"
            size="xl"
            variant="solid"
            block
            icon="i-heroicons-x-mark"
            class="cursor-pointer"
            @click="cancle()"
          >
            Abbrechen
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
