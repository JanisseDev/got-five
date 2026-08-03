<template>
    <button 
        class="number"
        :class="[stateClass, color]"
        @click="updateState">
        <span class="number-text">{{ id }}</span>
        <span class="dots">{{ dotsStr }}</span>
    </button>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useNumbersStateStore } from '@/stores/numbersState.js'

const numbersStateStore = useNumbersStateStore()

const props = defineProps({
  id: { type: Number, required: true },
  dots: { type: Number, required: true },
  color: { type: String, required: true },
})

const stateClass = computed(() => {
  switch(stateValue.value) {
    case 0: return 'inactive'
    case 1: return 'range'
    case 2: return 'active'
  }
})

const dotsStr = computed(() => {
  switch(props.dots) {
    case 0: return '.'
    case 1: return '..'
    case 2: return '...'
  }
})

// 0 -> Inactive
// 1 -> Range
// 2 -> Active
const stateValue = computed(() => numbersStateStore.states[props.id - 1])

function updateState() {
  numbersStateStore.states[props.id - 1] = (stateValue.value + 1) % 3
}
</script>

<style scoped>
  .number {
    border: none;
    border-radius: 4px;
    font-size: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .number-text {
      text-shadow: 0px 0px 4px #000000;
      color: #fff;
    }

    .dots {
      text-shadow: 0px 0px 4px #000000;
      color: #fff;
      margin-top: -25px;
    }

    &.type-green {
      background-color: var(--type-green);
    }

    &.type-pink {
      background-color: var(--type-pink);
    }

    &.type-blue {
      background-color: var(--type-blue);
    }

    &.type-red {
      background-color: var(--type-red);
    }

    &.type-orange {
      background-color: var(--type-orange);
    }

    &.range {
      opacity: 0.5;
    }

    &.active {
      background-color: transparent;
      opacity: 0.25;

      .number-text {
        text-shadow: none;
        color: #000;
      }
    }
  }
</style>