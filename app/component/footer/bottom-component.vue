<script setup lang="ts">
function contact() {
  navigateTo("/contact");
}

function impressum() {
  navigateTo("/impressum");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div class="h-20 bg-[#F18700] mt-10 mb-10"></div>

  <div class="flex justify-center items-center text-3xl text-[#F18700]">
    <button @click="scrollToTop()" class="cursor-pointer">&#708;</button>
  </div>

  <div class="flex justify-between items-center ml-5">
    <img src="/img/logo.png" alt="logo" class="w-60" />

    <div class="mr-5 flex gap-5 text-xl">
      <button class="cursor-pointer" @click="contact()">Kontakt</button>
      <button class="cursor-pointer" @click="impressum()">Impressum</button>
    </div>
  </div>

  <div class="mb-10"></div>
</template>

<style scoped></style>
