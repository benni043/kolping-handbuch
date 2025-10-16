<script setup lang="ts">
import NavMenu from "~/component/nav/nav-menu.vue";

function test() {
  alert("hoii");
}
</script>

<template>
  <div class="mt-5 ml-5 mb-10 flex justify-between">
    <img class="w-60" src="/img/logo.png" alt="logo" />

    <div class="mr-5 flex gap-5">
      <button class="text-2xl">Login</button>
      <button class="text-2xl">Einleitung</button>
    </div>
  </div>

  <div class="mb-15 flex justify-center items-start gap-1">
    <nav-menu></nav-menu>

    <div class="relative">
      <div class="flex flex-col absolute h-full justify-center ml-20">
        <h1 class="text-6xl">
          <b>Kolping</b>
        </h1>
        <h1 class="text-6xl"><b>Handbuch</b></h1>
      </div>

      <img class="h-77 w-150" src="/img/header.png" alt="header" />
    </div>
  </div>

  <div class="h-10 bg-gray-200 mb-10"></div>
</template>

<style scoped></style>
