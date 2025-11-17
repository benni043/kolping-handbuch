<script setup lang="ts">
import { useBlurStore } from "~/stores/useBlur";

const blurStore = useBlurStore();

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
  <div :class="{ 'blur-sm': blurStore.blur }">
    <div class="h-20 bg-[#F18700] mt-10 mb-10"></div>

    <div class="flex justify-center items-center text-6xl text-[#F18700]">
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

    <div class="flex justify-between items-center ml-5">
      <img src="/img/logo.png" alt="logo" class="w-60" />

      <div class="mr-5 flex gap-5 text-xl">
        <button class="cursor-pointer" @click="contact()">Kontakt</button>
        <button class="cursor-pointer" @click="impressum()">Impressum</button>
      </div>
    </div>

    <div class="mb-10"></div>
  </div>
</template>

<style scoped></style>
