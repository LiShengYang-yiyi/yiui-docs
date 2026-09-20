<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { VERSIONS, switchUrl, type VersionInfo } from '../versions'
import { useCurrentVersion } from './useCurrentVersion'

const { pathname, current } = useCurrentVersion()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const btn = ref<HTMLButtonElement | null>(null)

const options = computed(() => VERSIONS)

function choose(v: VersionInfo) {
  open.value = false
  if (v.id === current.value.id) {
    btn.value?.focus()
    return
  }
  window.location.href = withBase(switchUrl(pathname.value, v))
}

function onDocClick(e: MouseEvent) {
  if (!open.value) return
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    open.value = false
    btn.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="yiui-ver">
    <button
      ref="btn"
      type="button"
      class="yiui-ver-btn"
      :aria-expanded="open"
      aria-haspopup="listbox"
      aria-label="切换文档版本"
      @click="open = !open"
    >
      <span class="yiui-ver-label">{{ current.label }}</span>
      <svg class="yiui-ver-caret" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6.5 8 10.5 12 6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <ul v-show="open" class="yiui-ver-menu" role="listbox" aria-label="文档版本">
      <li v-for="v in options" :key="v.id" role="none">
        <button
          type="button"
          role="option"
          :aria-selected="v.id === current.id"
          class="yiui-ver-item"
          :class="{ 'is-current': v.id === current.id }"
          @click="choose(v)"
        >
          {{ v.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
