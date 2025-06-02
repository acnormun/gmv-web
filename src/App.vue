<template>
  <main>
    <header
      id="header"
      class="w-full h-[65px] py-3 border-b bg-white shadow-sm flex items-center justify-center"
    >
      <div class="w-full max-w-[1920px] px-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="./assets/scale-balanced-solid.svg" class="w-6 h-6" ></img><span class="title text-xl font-semibold text-neutral-800">Gabinete - Márcio Vidal</span>
        </div>
      </div>
    </header>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { checkFrontendVersion } from '@/utils/checkVersion'

onMounted(async () => {
  const novaVersao = await checkFrontendVersion()
  if (novaVersao) {
    alert(`🚀 Nova versão do frontend disponível: ${novaVersao}. Atualize a página!`)
  }
})

</script>

<style scoped>
main{
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F9FAFB;
  font-family: Inter;
}
.title {
  font-family: Inter;
}
</style>
