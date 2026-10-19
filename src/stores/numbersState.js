import { ref } from 'vue'
import { defineStore } from 'pinia'

export const NUMBER_COUNT = 60
export const STATE_COUNT = 3

// 0 -> Inactive
// 1 -> Range
// 2 -> Active
export const useNumbersStateStore = defineStore('numbersState', () => {
  const states = ref(Array(NUMBER_COUNT).fill(0))

  function cycleState(index) {
    states.value[index] = (states.value[index] + 1) % STATE_COUNT
  }

  function clearStates() {
    states.value = Array(NUMBER_COUNT).fill(0)
  }

  return {
    // States
    states,

    // Functions
    cycleState,
    clearStates,
  }
}, {
  persist: {
    // Older saves may contain null/undefined entries or a wrong length
    afterHydrate: ({ store }) => {
      store.states = Array.from({ length: NUMBER_COUNT }, (_, i) => {
        const value = store.states?.[i]
        return Number.isInteger(value) && value >= 0 && value < STATE_COUNT ? value : 0
      })
    },
  },
})
