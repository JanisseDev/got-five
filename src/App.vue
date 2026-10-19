<template>
  <div class="app">
    <main class="board-wrap">
      <div class="board">
        <number
          v-for="(num, index) in NUMBER_COUNT"
          :key="num"
          :id="num"
          :dots="getDots(index)"
          :color="getNumberColor(index)"
        />
      </div>
    </main>

    <!--<template v-for="(_, rowId) in 5">
      <number
        :id="getLonelyNumberInRow(rowId) ?? 0"
        :dots="getDots(getLonelyNumberInRow(rowId)-1 ?? 0)"
        :color="getNumberColor(rowId)"
      />
    </template>-->

    <nav class="toolbar">
      <button
        v-if="fullscreenSupported"
        type="button"
        class="tool"
        :aria-label="isFullscreen ? 'Quitter le plein écran' : 'Plein écran'"
        @click="toggleFullscreen"
      >
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
      </button>
      <button type="button" class="tool tool-reset" aria-label="Réinitialiser le plateau" @click="showResetDialog = true">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" /></svg>
        <span class="tool-label">Réinitialiser</span>
      </button>
    </nav>

    <div v-if="showResetDialog" class="dialog-backdrop" @click.self="showResetDialog = false">
      <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="reset-title">
        <p id="reset-title" class="dialog-title">Réinitialiser le plateau ?</p>
        <p class="dialog-text">Tous les nombres redeviendront disponibles.</p>
        <div class="dialog-actions">
          <button type="button" class="btn" @click="showResetDialog = false">Annuler</button>
          <button type="button" class="btn btn-danger" @click="confirmReset">Réinitialiser</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import number from '@/components/Number.vue'
import { NUMBER_COUNT, useNumbersStateStore } from '@/stores/numbersState.js'

const numbersStateStore = useNumbersStateStore()

const COLORS = ['type-green', 'type-pink', 'type-blue', 'type-red', 'type-orange']

function getNumberColor(index) {
  return COLORS[index % COLORS.length]
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

// Reset
const showResetDialog = ref(false)

function confirmReset() {
  numbersStateStore.clearStates()
  showResetDialog.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') showResetDialog.value = false
}

// Fullscreen (not available on iPhone: use "Add to Home Screen" instead)
const root = document.documentElement
const fullscreenSupported = !!(root.requestFullscreen || root.webkitRequestFullscreen)
const isFullscreen = ref(false)

function updateFullscreenState() {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement)
}

async function toggleFullscreen() {
  try {
    if (isFullscreen.value) {
      await (document.exitFullscreen || document.webkitExitFullscreen).call(document)
    } else {
      await (root.requestFullscreen || root.webkitRequestFullscreen).call(root, { navigationUI: 'hide' })
    }
  } catch {
    // Ignore: the browser refused
  }
}

// Keep the screen awake during the game
let wakeLock = null

async function requestWakeLock() {
  if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
  } catch {
    wakeLock = null
  }
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') requestWakeLock()
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreenState)
  document.addEventListener('webkitfullscreenchange', updateFullscreenState)
  document.addEventListener('visibilitychange', onVisibilityChange)
  document.addEventListener('keydown', onKeydown)
  requestWakeLock()
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState)
  document.removeEventListener('webkitfullscreenchange', updateFullscreenState)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  document.removeEventListener('keydown', onKeydown)
  wakeLock?.release()
})
</script>

<style scoped>
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding:
      max(8px, env(safe-area-inset-top))
      max(8px, env(safe-area-inset-right))
      max(8px, env(safe-area-inset-bottom))
      max(8px, env(safe-area-inset-left));
    gap: 8px;
  }

  .board-wrap {
    flex: 1;
    min-width: 0;
    min-height: 0;
    container-type: size;
  }

  /* Portrait: one column per color */
  .board {
    --cols: 5;
    --rows: 12;
    --cell-font: calc(min(100cqw / var(--cols), 100cqh / var(--rows)) * 0.42);

    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-auto-flow: row;
    gap: clamp(3px, 1.2cqmin, 10px);
    width: 100%;
    height: 100%;
  }

  .toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .tool {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    min-width: 40px;
    padding: 0 10px;
    border: none;
    border-radius: 10px;
    background-color: var(--inactive-color);
    color: var(--active-color);
    font: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 0 rgb(0 0 0 / 0.12);

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  .tool-reset {
    color: var(--type-red);
  }

  /* Landscape: one row per color, toolbar on the side */
  @media (orientation: landscape) {
    .app {
      flex-direction: row;
    }

    .board {
      --cols: 12;
      --rows: 5;
      grid-auto-flow: column;
    }

    .toolbar {
      flex-direction: column;
      justify-content: flex-end;
    }

    .tool-label {
      display: none;
    }
  }

  .dialog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background-color: rgb(0 48 73 / 0.45);
  }

  .dialog {
    width: min(100%, 340px);
    padding: 20px;
    border-radius: 16px;
    background-color: var(--inactive-color);
    color: var(--active-color);
    box-shadow: 0 10px 30px rgb(0 0 0 / 0.25);
  }

  .dialog-title {
    margin: 0 0 6px;
    font-size: 1.15rem;
    font-weight: 700;
  }

  .dialog-text {
    margin: 0 0 18px;
    opacity: 0.75;
  }

  .dialog-actions {
    display: flex;
    gap: 8px;
  }

  .btn {
    flex: 1;
    height: 44px;
    border: none;
    border-radius: 10px;
    background-color: color-mix(in srgb, var(--active-color) 10%, transparent);
    color: var(--active-color);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-danger {
    background-color: var(--type-red);
    color: #fff;
  }
</style>

<style>
:root {
  --bg-color: #fdf0d5;
  --inactive-color: #fef8ed;
  --range-color: #669bbc;
  --active-color: #003049;

  --type-green: #489249;
  --type-pink: #c86d95;
  --type-blue: #5081a8;
  --type-red: #cf3e24;
  --type-orange: #ea923e;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #app {
  margin: 0;
  width: 100%;
  height: 100%;
  /* dvh avoids the overflow caused by mobile browser bars */
  height: 100dvh;
  overflow: hidden;
}

body {
  background-color: var(--bg-color);
  color: var(--active-color);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  overscroll-behavior: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
