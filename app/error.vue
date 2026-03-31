<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="error-page">
    <img class="logo" src="/img/logo.png" alt="logo" />
    <h1 class="status">{{ error?.status || "Error" }}</h1>
    <p class="message">
      {{ error?.statusText || "Es ist ein unerwarteter Fehler aufgetreten." }}
    </p>
    <button class="button" @click="handleError">Zur Startseite</button>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
  background-color: #f9fafb;
}

.logo {
  width: 260px;
  max-width: 60%;
  margin-bottom: 1.5rem;
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 1;
}

.status {
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.message {
  color: #4b5563;
  margin-bottom: 1.5rem;
  max-width: 400px;
}

.button {
  padding: 0.75rem 1.5rem;
  background-color: #fbbf24;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition:
    transform 0.1s ease,
    background-color 0.2s ease;
}

.button:active {
  transform: scale(0.95);
}

.button:hover {
  background-color: #f59e0b;
}
</style>
