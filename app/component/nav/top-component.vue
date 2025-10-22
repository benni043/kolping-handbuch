<script setup lang="ts">
import NavMenu from "~/component/nav/nav-menu.vue";
import { mapping } from "~/utils/utils";
import type { Structure } from "~/types/structure";

const { data } = await useFetch<Structure[]>(`/api/structure`, {
  method: "GET",
});

const path = ref("");
const subPath = ref("");
const category = ref("");

function post(
  pathNew: string,
  pathNewId: string,
  subPathNew: string,
  subPathNewId: string,
  categoryNew: string,
) {
  path.value = pathNew;
  subPath.value = subPathNew;
  category.value = categoryNew;

  subPathNewId = subPathNewId.replace(".", "-");

  navigateTo(`/${pathNewId}/${subPathNewId}/${mapping[category.value]}`);
}

function login() {
  alert("clicked login");
}

function introduction() {
  navigateTo("/introduction");
}

function returnToHome() {
  navigateTo("/");
}
</script>

<template>
  <div class="mt-5 ml-5 mb-10 flex justify-between">
    <img
      class="w-60 cursor-pointer"
      src="/img/logo.png"
      alt="logo"
      @click="returnToHome()"
    />

    <div class="mr-5 flex gap-5">
      <button class="text-xl cursor-pointer" @click="login()">Login</button>
      <button class="text-xl cursor-pointer" @click="introduction()">
        Einleitung
      </button>
    </div>
  </div>

  <div class="mb-15 flex justify-center items-start gap-1">
    <nav-menu
      v-if="data"
      :data="data"
      @emit-route="
        (pathNew, pathIdNew, subPathNew, subPathNewId, categoryNew) =>
          post(pathNew, pathIdNew, subPathNew, subPathNewId, categoryNew)
      "
    ></nav-menu>

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

  <div class="flex gap-3 ml-20 mb-10">
    <a class="cursor-pointer">Handbuch</a>
    <span v-if="path !== ''">></span>
    <a v-if="path !== ''" class="cursor-pointer">{{ path }}</a>
    <span v-if="subPath !== ''">></span>
    <a v-if="subPath !== ''" class="cursor-pointer">{{ subPath }}</a>
    <span v-if="category !== ''">></span>
    <span v-if="category !== ''">{{ category }}</span>
  </div>
</template>

<style scoped></style>
