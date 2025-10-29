<script setup lang="ts">
const { user, fetch: refreshSession, clear: clearSession } = useUserSession();

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

    await refreshSession();
    await navigateTo("/");
  } catch {
    alert("Bad credentials");
  }
}

async function logout() {
  await clearSession();
}
</script>

<template>
  <div>
    <h1 v-if="user" class="text-xl text-center">
      Sie sind im Moment als <b>{{ user?.username }}</b> eingeloggt!
    </h1>

    <h1 v-if="!user" class="text-xl text-center">
      Sie sind im Moment nicht eingeloggt!
    </h1>

    <UCard v-if="!user" class="max-w-xl mx-auto mt-10 border-none">
      <UForm class="space-y-5">
        <UCard>
          <h1 class="mb-4 text-xl">Benutzername</h1>

          <UInput
            v-model="credentials.username"
            placeholder="Benutzername"
            type="text"
            icon="i-heroicons-document-plus"
          />
        </UCard>

        <UCard>
          <h1 class="mb-4 text-xl">Passwort</h1>

          <UInput
            v-model="credentials.password"
            placeholder="Passwort"
            type="password"
            icon="i-heroicons-document-plus"
          />
        </UCard>

        <UButton
          color="primary"
          variant="solid"
          type="submit"
          icon="i-heroicons-paper-airplane"
          @click="login()"
        >
          Login
        </UButton>
      </UForm>
    </UCard>

    <button v-if="user" @click="logout()">Logout</button>
  </div>
</template>
