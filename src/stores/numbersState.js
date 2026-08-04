import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useNumbersStateStore = defineStore('numbersState', () => {
  const states = ref(Array(60))

  function clearStates() {
    if (window.confirm("Do you really want to reset the board ?")) {
      for (let i = 0; i < states.value.length; i++) {
        states.value[i] = 0
      }
    }
  }

  return {
    // States
    states,

    // Fuctions
    clearStates,
  }
}, {
  persist: true
})
