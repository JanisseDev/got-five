<template>
  <div class="board">
    <number
      v-for="(num, index) in 60"
      :id="num"
      :dots="getDots(index)"
      :color="getNumberColor(index)"
    />
  </div>

  <!--<template v-for="(_, rowId) in 5">
    <number
      :id="getLonelyNumberInRow(rowId) ?? 0"
      :dots="getDots(getLonelyNumberInRow(rowId)-1 ?? 0)"
      :color="getNumberColor(rowId)"
    />
  </template>-->

  <button class="clear-all" @click="numbersStateStore.clearStates">Clear board</button>
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

function getLonelyNumberInRow(rowId) {
  let activeCount = 0
  let lonelyNumber = null
  for(let i = 0; i < 12; i++) {
    const number = i*5 + rowId
    const state = numbersStateStore.states[number]
    if(state === 0) {
      lonelyNumber = number+1
      activeCount++
    }
  }
  return (activeCount == 1) ? lonelyNumber : null
}

function getDots(index) {
  return (Math.floor(index/5))%3
}
</script>

<style scoped>
  .board {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-template-columns: repeat(12, 1fr);
    grid-auto-flow: column;
    gap: 10px;
    margin-bottom: 16px;
    position: relative;
    padding: 16px;
    width: 100%;
    height: calc(100% - 64px);
  }

  .clear-all {
    margin-left: 16px;
    padding: 4px;
    font-size: 1em;
    border-radius: 4px;
    border: none;
    background-color: var(--type-red);
    text-shadow: 0px 0px 4px #000000;
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

    margin: 0;
    width: 100vw;
    height: 100vh;
  }

#app {
    width: 100vw;
    height: 100vh;
    position: relative;
  }
</style>