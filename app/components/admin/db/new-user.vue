<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  allowedRoles: ["admin"],
});

const credentials = reactive({
  username: "",
  password: "",
  role: "",
});

function createAccount() {
  console.log(credentials);
}
</script>

<template>
  <div class="flex justify-center mb-15">
    <div class="w-100 p-8">
      <h1 class="text-2xl font-semibold text-center mb-10">
        Neuen Benutzer erstellen
      </h1>

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

        <div>
          <UInput
            v-model="credentials.role"
            placeholder="Rolle"
            type="text"
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
          @click="createAccount()"
        >
          Erstellen
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<style scoped></style>
