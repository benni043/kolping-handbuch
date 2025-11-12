<script setup lang="ts">
const { user, fetch: refreshSession, clear: clearSession } = useUserSession();

const toast = useToast();

const credentials = reactive({
  username: "",
  password: "",
});

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

async function logout() {
  await clearSession();
}
</script>

<template>
  <div class="flex justify-center mb-15">
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
            type="password"
            size="xl"
            class="w-full"
          />
        </div>

        <UButton
          color="primary"
          size="xl"
          variant="solid"
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

    <div v-else class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">
        Eingeloggt als <b>{{ user?.username }}</b>
      </h1>

      <UButton
        color="error"
        variant="solid"
        size="xl"
        icon="i-heroicons-arrow-left-on-rectangle"
        class="cursor-pointer"
        block
        @click="logout()"
      >
        Logout
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
