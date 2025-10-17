<script setup lang="ts">
import KernprozessTemplate from "~/component/kernprozess/kernprozess-template.vue";

const schrittCount = 1;
const vorgabenList = [
  "Statuten",
  "AH01 'Checkliste Generalversammlung'",
  "AH02 'Netzmodell'",
  "AH03 'Tagesordnung Generalversammlung'",
];
const vorlagenAbschlussberichteList = ["demo1", "demo2", "demo3"];
const middleHead = "middle Head";
const middleList = ["demo1", "demo2", "demo3"];
const dokumentationList = ["demo1", "demo2", "demo3"];
const verantwortlicherList = "verantwortlihce";
const informationAn = "vorstand";
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
    :information-an="informationAn"
  >
  </kernprozess-template>
</template>

<style scoped></style>
