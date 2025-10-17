<script setup lang="ts">
defineProps<{
  schrittCount: number;
  vorgabenList: string[];
  vorlagenAbschlussberichteList: string[];
  middleHead: string;
  middleList: string[];
  dokumentationenList: string[];
  verantwortlicher: string;
  informationAn: string;
}>();
</script>

<template>
  <div class="flex mt-10 ml-[10vw] mr-[10vw] gap-5">
    <div>
      <h2 class="text-[#50A9CE] font-bold text-2xl">
        Schritt {{ schrittCount }}
      </h2>

      <hr class="text-[#50A9CE] mb-2 mt-3 border-t-4 border-dotted" />

      <div>
        <h2 class="text-[#50A9CE] font-bold">VORGABEN / ARBEITSHILFEN</h2>

        <ul class="list-disc pl-6">
          <li
            v-for="elem in vorgabenList"
            :key="elem"
            class="marker:text-[#50A9CE]"
          >
            {{ elem }}
          </li>
        </ul>
      </div>
    </div>

    <div class="relative w-[450px] flex flex-col">
      <h3 class="absolute top-2 left-3 text-white font-bold text-2xl z-10">
        testhead
      </h3>

      <img
        src="https://handbuch.kolping.at/tl_files/kolping_handbuch/kernprozess_header_blue.png"
        alt="blue"
      />

      <div class="bg-[#F18700]">
        <p class="text-white font-bold ml-3">
          TÄTIGKEIT / ENTSCHEIDUNG / PRÜFSCHRITT
        </p>

        <ul class="list-disc pl-6">
          <li v-for="elem in middleList" :key="elem" class="text-white ml-3">
            {{ elem }}
          </li>
        </ul>
      </div>

      <img
        src="https://handbuch.kolping.at/tl_files/kolping_handbuch/kernprozess_bottom_orange.png"
        alt="orange"
      />
    </div>

    <div>
      <h3 class="text-[#F18700] font-bold">AUFZEICHNUNGEN / DOKUMENTATION</h3>

      <ul class="list-disc pl-6">
        <li v-for="elem in dokumentationenList" :key="elem" class="ml-3">
          {{ elem }}
        </li>
      </ul>

      <h3 class="text-[#F18700] mt-3 font-bold">VERANTWORTLICHE/R</h3>
      <p class="pl-2">{{ verantwortlicher }}</p>

      <h3 class="text-[#F18700] mt-3 font-bold">INFORMATION AN</h3>
      <p class="pl-2">{{ informationAn }}</p>

      <hr class="text-gray-400 mb-2 mt-3 border-t-4 border-dotted" />
    </div>
  </div>
</template>

<style scoped></style>
