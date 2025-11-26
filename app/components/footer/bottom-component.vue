<script setup lang="ts">
function contact() {
  navigateTo(`/kolping/${contactLower}`);
}

function impressum() {
  navigateTo(`/kolping/${impressumLower}`);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div>
    <div class="h-15 bg-[#F18700] my-5 lg:my-10"></div>

    <div class="flex justify-center items-center text-6xl text-[#F18700] mb-5">
      <button class="cursor-pointer" @click="scrollToTop()">
        <b
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 18.75 7.5-7.5 7.5 7.5"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </b>
      </button>
    </div>

    <div
      class="flex justify-between items-center flex-col lg:flex-row lg:justify-around"
    >
      <img src="/img/logo.png" alt="logo" class="w-60 mb-5 lg:mt-0 lg:mb-0" />

      <div class="flex gap-5 text-xl flex-col lg:flex-row">
        <button class="cursor-pointer" @click="contact()">Kontakt</button>
        <button class="cursor-pointer" @click="impressum()">Impressum</button>
      </div>
    </div>

    <div class="h-10"></div>
  </div>
</template>

<style scoped></style>
