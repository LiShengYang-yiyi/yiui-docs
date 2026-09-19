import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { VERSIONS, DEFAULT_VERSION, versionOfPath, type VersionInfo } from '../versions'

/**
 * 当前页所属版本。
 * cleanUrls:false 时 route.path 会带 .html（如 /et9/start/quick-start.html），
 * 必须先剥掉再解析，否则永远匹配不上版本前缀。
 */
export function useCurrentVersion() {
  const route = useRoute()

  const pathname = computed(() => route.path.replace(/\.html$/, ''))

  const current = computed<VersionInfo>(() => {
    const id = versionOfPath(pathname.value)
    return (
      VERSIONS.find((v) => v.id === id) ??
      VERSIONS.find((v) => v.id === DEFAULT_VERSION) ??
      VERSIONS[0]
    )
  })

  return { pathname, current }
}
