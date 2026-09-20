<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import VersionSwitcher from './VersionSwitcher.vue'

const { Layout } = DefaultTheme
const route = useRoute()
const { theme, page, frontmatter } = useData()

interface SidebarItem {
  text?: string
  link?: string
  items?: SidebarItem[]
}

/** 从 sidebar 配置推导当前页的面包屑，不依赖 VitePress 内部模块。 */
const trail = computed<string[]>(() => {
  // cleanUrls: false 时 route.path 带 .html（如 /guide/quick-start.html），
  // 而 sidebar 里写的是 /guide/quick-start —— 比较前必须归一化，
  // 否则永远匹配不上，会静默退化成「文档 › 页标题」。
  const slug = (p: string) =>
    p.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/'

  if (slug(route.path) === '/' || frontmatter.value.breadcrumb === false) return []

  const sidebar = theme.value.sidebar as
    | Record<string, SidebarItem[]>
    | SidebarItem[]
    | undefined

  const here = slug(route.path)

  let groups: SidebarItem[] = []
  if (Array.isArray(sidebar)) {
    groups = sidebar
  } else if (sidebar) {
    const key = Object.keys(sidebar)
      .filter((k) => here === slug(k) || here.startsWith(k))
      .sort((a, b) => b.length - a.length)[0]
    groups = key ? sidebar[key] ?? [] : []
  }

  const out: string[] = []
  const walk = (items: SidebarItem[], ancestors: string[]): boolean => {
    for (const item of items) {
      const link = item.link ? slug(item.link) : ''
      // 分组项也可能自带落地页（sidebar 里同时写了 link 与 items）。
      // 这种情况它本身就是当前页，必须先按叶子匹配再递归，
      // 否则匹配不到、整条面包屑退化成「文档 › 页标题」。
      if (link && link === here) {
        out.push(...ancestors)
        if (item.text) out.push(item.text)
        return true
      }
      if (item.items?.length) {
        const next = item.text ? [...ancestors, item.text] : ancestors
        if (walk(item.items, next)) return true
      }
    }
    return false
  }
  walk(groups, [])

  // 侧边栏没覆盖到的页面（如 /api/）：退化成「文档 › 页标题」
  if (!out.length && page.value?.title) out.push('文档', page.value.title)
  return out
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <VersionSwitcher />
    </template>

    <template #doc-before>
      <nav v-if="trail.length" class="yiui-crumbs" aria-label="面包屑">
        <template v-for="(crumb, i) in trail" :key="i">
          <span v-if="i" class="yiui-crumbs-sep" aria-hidden="true">›</span>
          <span class="yiui-crumbs-item" :class="{ 'is-last': i === trail.length - 1 }">
            {{ crumb }}
          </span>
        </template>
      </nav>
    </template>
  </Layout>
</template>
