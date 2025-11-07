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

const usernameError = ref("");
const passwordError = ref("");
const password2Error = ref("");

function validateUsername() {
  usernameError.value =
    usernameRef.value.length < 4
      ? "Benutzername muss mindestens 4 Zeichen lang sein"
      : "";
}

function validatePassword() {
  const pw = passwordRef.value;
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]{8,}$/;

  passwordError.value = regex.test(pw)
    ? ""
    : "Passwort muss mind. 8 Zeichen, 1 Großbuchstaben, 1 Zahl und 1 Sonderzeichen enthalten";
}

function validatePasswordMatch() {
  password2Error.value =
    passwordRef.value === password2Ref.value
      ? ""
      : "Passwörter stimmen nicht überein";
}

watch(usernameRef, validateUsername);
watch(passwordRef, () => {
  validatePassword();
  validatePasswordMatch();
});
watch(password2Ref, validatePasswordMatch);

async function add() {
  validateUsername();
  validatePassword();
  validatePasswordMatch();

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
    <UCard class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">
        Benutzer bearbeiten
      </h1>

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
            v-model="password2Ref"
            placeholder="Passwort wiederholen"
            type="password"
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
              password2Error !== ''
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
    </UCard>
  </div>
</template>
