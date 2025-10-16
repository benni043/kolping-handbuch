<script setup lang="ts">
import KernprozessTemplate from "~/component/kernprozess/kernprozess-template.vue";

let schrittCount = 1;
let vorgabenList = [
  "Statuten",
  "AH01 'Checkliste Generalversammlung'",
  "AH02 'Netzmodell'",
  "AH03 'Tagesordnung Generalversammlung'",
];
let vorlagenAbschlussberichteList = ["demo1", "demo2", "demo3"];
let middleHead = "middle Head";
let middleList = ["demo1", "demo2", "demo3"];
let dokumentationList = ["demo1", "demo2", "demo3"];
let verantwortlicherList = "verantwortlihce";
let informationAn = "vorstand";
</script>

<template>
  <kernprozess-template
    :schritt-count="schrittCount"
    :vorgaben-list="vorgabenList"
    :vorlagen-abschlussberichte-list="vorlagenAbschlussberichteList"
    :middle-head="middleHead"
    :middle-list="middleList"
    :dokumentationen-list="dokumentationList"
    :verantwortlicher="verantwortlicherList"
    :informationAn="informationAn"
  >
  </kernprozess-template>
</template>

<style scoped></style>
