<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession();
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

    // Refresh the session on client-side and redirect to the home page
    await refreshSession();
    await navigateTo("/");
  } catch {
    alert("Bad credentials");
  }
}
</script>

<template>
  <h1>Welcome {{ user! }}</h1>
  <form @submit.prevent="login">
    <input v-model="credentials.username" type="text" placeholder="Username" />
    <input
      v-model="credentials.password"
      type="password"
      placeholder="Password"
    />
    <button type="submit">Login</button>
  </form>
</template>
