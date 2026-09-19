<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { VERSIONS, LATEST_VERSION } from '../versions'
import { useCurrentVersion } from './useCurrentVersion'

const { current } = useCurrentVersion()

const latest = computed(() => VERSIONS.find((v) => v.id === LATEST_VERSION) ?? null)

/** 只有「当前版本已冻结」且「新版已正式开放」时才提示，否则整块不渲染。 */
const target = computed(() => {
  const v = latest.value
  if (!v || !v.released) return null
  if (v.id === current.value.id) return null
  if (!current.value.frozen) return null
  return v
})

const KEY = 'yiui-version-notice-dismissed'
const dismissed = ref<string | null>(null)

onMounted(() => {
  try {
    dismissed.value = localStorage.getItem(KEY)
  } catch {
    dismissed.value = null
  }
})

const visible = computed(() => !!target.value && dismissed.value !== target.value.id)

function dismiss() {
  if (!target.value) return
  dismissed.value = target.value.id
  try {
    localStorage.setItem(KEY, target.value.id)
  } catch {
    /* 隐私模式下写不进去，本次会话内隐藏即可 */
  }
}
</script>

<template>
  <div v-if="visible && target" class="yiui-notice" role="status">
    <div class="yiui-notice-body">
      <strong class="yiui-notice-title">{{ current.label }} 已冻结，不再新增内容</strong>
      <span class="yiui-notice-text">
        后续更新只进 {{ target.label }}。当前页面的结论仍然有效，差异以 {{ target.label }} 为准。
      </span>
    </div>
    <div class="yiui-notice-actions">
      <a class="yiui-notice-go" :href="withBase(target.prefix)">看 {{ target.label }}</a>
      <button type="button" class="yiui-notice-close" aria-label="不再提示" @click="dismiss">&#215;</button>
    </div>
  </div>
</template>
