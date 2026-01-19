<script setup lang="ts">
const { user, fetch: refreshSession, clear: clearSession } = useUserSession();

const toast = useToast();

const credentials = reactive({
  username: "",
  password: "",
});

const visible = ref(false);

async function login() {
  try {
    await $fetch("/api/login", {
      method: "POST",
      body: credentials,
    });

    toast.add({
      title: "Anmeldung erfolgreich!",
      description: `Willkommen ${credentials.username}!`,
      color: "success",
      icon: "i-heroicons-check",
    });

    await refreshSession();
    await navigateTo("/");
  } catch {
    toast.add({
      title: "Fehler",
      description:
        "Anmeldung fehlgeschlagen! Ungültige Benutzer, Passwort Kombination",
      color: "error",
      icon: "i-heroicons-x-mark",
    });
  }
}

async function logout(username: string) {
  toast.add({
    title: "Abmeldung erfolgreich!",
    description: `Aufwiedersehen ${username}!`,
    color: "success",
    icon: "i-heroicons-check",
  });

  await clearSession();
}
</script>

<template>
  <div class="flex justify-center mb-10">
    <div v-if="!user" class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">Anmelden</h1>

      <UForm class="space-y-5">
        <div>
          <UInput
            v-model="credentials.username"
            placeholder="Benutzername"
            type="text"
            size="xl"
            class="w-full"
          />
        </div>

        <div>
          <UInput
            v-model="credentials.password"
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
        </div>

        <UButton
          color="primary"
          size="xl"
          variant="outline"
          type="submit"
          block
          icon="i-heroicons-lock-closed"
          class="cursor-pointer"
          @click="login()"
        >
          Login
        </UButton>
      </UForm>
    </div>

    <div v-else class="w-100 px-10">
      <h1 class="text-2xl font-semibold text-center my-5">
        Eingeloggt als <b>{{ user?.username }}</b>
      </h1>

      <UButton
        color="error"
        variant="outline"
        size="xl"
        icon="i-heroicons-arrow-left-start-on-rectangle"
        class="cursor-pointer"
        block
        @click="logout(user?.username)"
      >
        Logout
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
