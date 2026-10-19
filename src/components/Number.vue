<template>
    <button
        type="button"
        class="number"
        :class="[stateClass, color]"
        :aria-label="`${id}, ${stateLabel}`"
        @click="updateState">
        <span class="number-text">{{ id }}</span>
        <span class="dots" aria-hidden="true">
          <span v-for="dot in dots + 1" :key="dot" class="dot" />
        </span>
    </button>
</template>

<script setup>
import { computed } from 'vue'
import { useNumbersStateStore } from '@/stores/numbersState.js'

const numbersStateStore = useNumbersStateStore()

const props = defineProps({
  id: { type: Number, required: true },
  dots: { type: Number, required: true },
  color: { type: String, required: true },
})

// 0 -> Inactive
// 1 -> Range
// 2 -> Active
const stateValue = computed(() => numbersStateStore.states[props.id - 1])

const stateClass = computed(() => ['inactive', 'range', 'active'][stateValue.value])
const stateLabel = computed(() => ['disponible', 'à portée', 'utilisé'][stateValue.value])

function updateState() {
  numbersStateStore.cycleState(props.id - 1)
  navigator.vibrate?.(10)
}
</script>

<style scoped>
  .number {
    --c: var(--type-green);

    position: relative;
    min-width: 0;
    min-height: 0;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 0.35em;
    background-color: var(--c);
    color: #fff;
    font: inherit;
    font-size: var(--cell-font);
    font-weight: 700;
    line-height: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.12em;
    cursor: pointer;
    box-shadow: 0 0.08em 0 rgb(0 0 0 / 0.2);
    transition: transform 80ms ease, background-color 150ms ease, opacity 150ms ease;

    &:active {
      transform: scale(0.92);
    }

    &:focus-visible {
      outline: 3px solid var(--active-color);
      outline-offset: 2px;
    }

    .number-text {
      text-shadow: 0 1px 3px rgb(0 0 0 / 0.45);
    }

    .dots {
      display: flex;
      gap: 0.12em;
    }

    .dot {
      width: 0.2em;
      height: 0.2em;
      border-radius: 50%;
      background-color: currentColor;
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
    }

    &.type-green { --c: var(--type-green); }
    &.type-pink { --c: var(--type-pink); }
    &.type-blue { --c: var(--type-blue); }
    &.type-red { --c: var(--type-red); }
    &.type-orange { --c: var(--type-orange); }

    /* In range: light tint, dashed outline, colored text */
    &.range {
      background-color: color-mix(in srgb, var(--c) 22%, var(--inactive-color));
      border: 2px dashed var(--c);
      color: color-mix(in srgb, var(--c) 80%, #000);
      box-shadow: none;

      .number-text, .dot {
        text-shadow: none;
        box-shadow: none;
      }
    }

    /* Used: faded and crossed out */
    &.active {
      background-color: transparent;
      border: 2px solid color-mix(in srgb, var(--c) 25%, transparent);
      color: color-mix(in srgb, var(--active-color) 35%, transparent);
      box-shadow: none;

      .number-text, .dot {
        text-shadow: none;
        box-shadow: none;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 18%;
        background: linear-gradient(
          to top right,
          transparent calc(50% - 1.5px),
          color-mix(in srgb, var(--c) 70%, transparent) calc(50% - 1.5px),
          color-mix(in srgb, var(--c) 70%, transparent) calc(50% + 1.5px),
          transparent calc(50% + 1.5px)
        );
        pointer-events: none;
      }
    }
  }
</style>
