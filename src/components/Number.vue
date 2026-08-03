<template>
    <button 
        class="number"
        :class="[stateClass, color]"
        @click="updateState">
        <span>{{ id }}</span>
    </button>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useNumbersStateStore } from '@/stores/numbersState.js'

const numbersStateStore = useNumbersStateStore()

const props = defineProps({
  id: { type: Number, required: true },
  color: { type: String, required: true },
})

const stateClass = computed(() => {
  switch(stateValue.value) {
    case 0: return 'inactive'
    case 1: return 'range'
    case 2: return 'active'
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
    height: 40px;
    font-size: 2em;

    &.type-green {
      background-color: var(--type-green);
      color: #fff;
    }

    &.type-pink {
      background-color: var(--type-pink);
      color: #fff;
    }

    &.type-blue {
      background-color: var(--type-blue);
      color: #fff;
    }

    &.type-red {
      background-color: var(--type-red);
      color: #fff;
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
      color: #000;
    }
  }
</style>