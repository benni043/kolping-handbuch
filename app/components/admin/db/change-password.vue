<script setup lang="ts">
const emit = defineEmits(["cancle", "change"]);

const props = defineProps<{
  id: number;
}>();

const passwordError = ref("");
const password2Error = ref("");

const password1 = ref("");
const password2 = ref("");

const visible = ref(false);

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
            :type="!visible ? 'password' : 'text'"
            size="xl"
            class="w-full"
          >
            <template #trailing>
              <svg
                v-if="!visible"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 cursor-pointer"
                @click="visible = !visible"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 cursor-pointer"
                @click="visible = !visible"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </template>
          </UInput>
          <p v-if="passwordError" class="text-red-500 mt-2 font-medium">
            {{ passwordError }}
          </p>
        </div>

        <div>
          <h1 class="mb-4 text-xl font-semibold">Passwort wiederholen</h1>
          <UInput
            v-model="password2"
            placeholder="Passwort wiederholen"
            :type="!visible ? 'password' : 'text'"
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
