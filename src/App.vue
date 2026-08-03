<template>
  <h1>Got five board</h1>
  <div class="board">
    <number
      v-for="index in 60"
      :id="index"
      :color="getNumberColor(index)"
    />
  </div>

  <button @click="numbersStateStore.clearStates">Clear board</button>
</template>

<script setup>
import number from '@/components/Number.vue'
import { useNumbersStateStore } from '@/stores/numbersState.js'

const numbersStateStore = useNumbersStateStore()

function getNumberColor(id) {
  switch(id%5) {
    case 0: return 'type-green'
    case 1: return 'type-pink'
    case 2: return 'type-blue'
    case 3: return 'type-red'
    case 4: return 'type-orange'
  }
}
</script>

<style scoped>
  .board {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-auto-flow: column;
    gap: 10px;
    margin-bottom: 60px;
  }

  .clear-all {
    margin-top: 20px;
    padding: 10px;
    font-size: 1.5em;
    border-radius: 4px;
    border: none;
    background-color: var(--type-blue);
    color: #fff;
  }
</style>

<style>
body {
    background-color: #fdf0d5;
    --inactive-color: #fef8ed;
    --range-color: #669bbc;
    --active-color: #003049;

    --type-green: #489249;
    --type-pink: #c86d95;
    --type-blue: #5081a8;
    --type-red: #cf3e24;
    --type-orange: #ea923e;
  }
</style>