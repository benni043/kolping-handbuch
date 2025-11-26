<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const emit = defineEmits(["cancle", "add"]);

const usernameRef = ref("");
const passwordRef = ref("");
const password2Ref = ref("");
const roleRef = ref("user");

const visible = ref(false);

const usernameError = ref("");
const passwordError = ref("");
const password2Error = ref("");

watch(usernameRef, () => {
  usernameError.value = validateUsername(usernameRef.value);
});
watch(passwordRef, () => {
  passwordError.value = validatePassword(passwordRef.value);
  password2Error.value = validatePasswordMatch(
    passwordRef.value,
    password2Ref.value,
  );
});
watch(password2Ref, () => {
  password2Error.value = validatePasswordMatch(
    passwordRef.value,
    password2Ref.value,
  );
});

async function add() {
  usernameError.value = validateUsername(usernameRef.value);
  passwordError.value = validatePassword(passwordRef.value);
  password2Error.value = validatePasswordMatch(
    passwordRef.value,
    password2Ref.value,
  );

  if (usernameError.value || passwordError.value || password2Error.value)
    return;

  emit("add", usernameRef.value, passwordRef.value, roleRef.value);
}

function cancle() {
  emit("cancle");
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <UForm class="space-y-5">
      <div>
        <h1 class="mb-4 text-xl font-semibold">Benutzername</h1>
        <UInput
          v-model="usernameRef"
          placeholder="Benutzername"
          type="text"
          size="xl"
          class="w-full"
        />
        <p v-if="usernameError" class="text-red-500 mt-2 font-medium">
          {{ usernameError }}
        </p>
      </div>

      <div>
        <h1 class="mb-4 text-xl font-semibold">Passwort</h1>

        <UInput
          v-model="passwordRef"
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
          v-model="password2Ref"
          placeholder="Passwort wiederholen"
          :type="!visible ? 'password' : 'text'"
          size="xl"
          class="w-full"
        />
        <p v-if="password2Error" class="text-red-500 mt-2 font-medium">
          {{ password2Error }}
        </p>
      </div>

      <div>
        <h1 class="mb-4 text-xl font-semibold">Rolle</h1>
        <select v-model="roleRef" class="w-full border rounded-lg p-2">
          <option value="user">user</option>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
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
            usernameError !== '' ||
            passwordError !== '' ||
            password2Error !== '' ||
            usernameRef === '' ||
            passwordRef === '' ||
            password2Ref === ''
          "
          @click.prevent="add"
        >
          Erstellen
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
  </div>
</template>
