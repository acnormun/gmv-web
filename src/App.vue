<template>
  <header id="header" class="w-full h-[65px] border-b bg-white shadow-sm flex items-center justify-center">
    <div class="w-full max-w-[1920px] px-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'scale-balanced']" />
        <span class="title text-xl font-semibold text-neutral-800">Gabinete - Márcio Vidal</span>
      </div>
    </div>
  </header>

  <RouterView />
</template>


<script setup lang="ts">
import { RouterView } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<style scoped>
.title{
  font-family: Inter;
}
</style>