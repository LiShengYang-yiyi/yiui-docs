// ⚠️ 由 .workbuddy/tools/gen-site-modules.js 生成，请勿手改。
// pages 为该版本下真实存在的页面 slug（不含版本前缀），切换器据此决定能否保留当前路径。

export interface VersionInfo {
  /** 版本 id，同时是 URL 前缀里的段名 */
  id: string
  /** 界面上显示的版本号 */
  label: string
  /** 该版本的 URL 前缀，始终以 / 开头并以 / 结尾 */
  prefix: string
  /** 是否已正式可读；false 时切换器会标注「不可用」并只跳该版本落地页 */
  released: boolean
  /** 是否已冻结：不再新增内容，界面上会被建议迁往最新版 */
  frozen: boolean
  /** 版本状态的一句话说明 */
  note: string
  /** 该版本下真实存在的页面 slug 列表 */
  pages: string[]
}

export const VERSIONS: VersionInfo[] = [
  {
    "id": "et9",
    "label": "ET9",
    "prefix": "/et9/",
    "released": true,
    "frozen": true,
    "note": "已进入维护状态",
    "pages": [
      "/",
      "/cde-table/",
      "/cde-table/component",
      "/cde-table/data",
      "/cde-table/event",
      "/changelog/",
      "/changelog/v0-1-0",
      "/changelog/v0-2-0",
      "/changelog/v0-3-0",
      "/changelog/v0-4-0",
      "/changelog/v0-5-0",
      "/changelog/v0-6-0",
      "/changelog/v0-7-0",
      "/changelog/v0-8-0",
      "/changelog/v1-0-0",
      "/changelog/v1-1-0",
      "/changelog/v1-1-2",
      "/changelog/v1-2-0",
      "/changelog/v2-0-0",
      "/changelog/v2-0-5",
      "/changelog/v3-0-0",
      "/changelog/v3-1-0",
      "/faq/",
      "/faq/aot",
      "/faq/cannot-add-event",
      "/faq/choose-et-version",
      "/faq/cross-prefab-binding",
      "/faq/et8-1-f6-error",
      "/faq/examples/",
      "/faq/examples/init-settings-invalid",
      "/faq/examples/multi-panel",
      "/faq/examples/old-panel-add-view",
      "/faq/examples/ui-block",
      "/faq/examples/view-open-view",
      "/faq/hot-update",
      "/faq/model-hotfix-noengine",
      "/faq/odin",
      "/faq/package-code-no-ref",
      "/faq/panel-anim-repeat",
      "/faq/prefab-load-lag",
      "/faq/remove-unused-ui",
      "/faq/server-odin",
      "/faq/unitask-dotween",
      "/faq/wechat-web",
      "/faq/wps-vba",
      "/faq/yooasset-addressable",
      "/faq/yooasset-unitask",
      "/features/",
      "/features/builtin/",
      "/features/builtin/automation/",
      "/features/builtin/automation/gm-command-ext",
      "/features/builtin/automation/macro-ext",
      "/features/builtin/automation/window-ext",
      "/features/builtin/check",
      "/features/builtin/codegen",
      "/features/builtin/constant",
      "/features/builtin/event-analyzer",
      "/features/builtin/invoke/",
      "/features/builtin/invoke/invoke-2",
      "/features/builtin/invoke/invoke-listener-3",
      "/features/builtin/invoke/invoke-listener-common-4",
      "/features/builtin/localization",
      "/features/builtin/misc",
      "/features/builtin/nino",
      "/features/builtin/wait",
      "/features/builtin/yooasset",
      "/features/dynamic-message",
      "/features/event-lifecycle",
      "/features/gm-command",
      "/features/infinite-scroll/",
      "/features/infinite-scroll/async",
      "/features/infinite-scroll/changelog-0-1",
      "/features/infinite-scroll/changelog-0-2",
      "/features/infinite-scroll/changelog-0-3",
      "/features/infinite-scroll/changelog-0-5-4",
      "/features/infinite-scroll/changelog-1-0-0",
      "/features/infinite-scroll/click",
      "/features/infinite-scroll/other-scroll-plugins",
      "/features/infinite-scroll/preload-1-2-0",
      "/features/infinite-scroll/v2-0-0-et10",
      "/features/localization",
      "/features/red-dot/",
      "/features/red-dot/red-dot-1-2-0",
      "/features/tips",
      "/features/tools/",
      "/features/tools/atlas",
      "/features/tools/component-table-shortcut",
      "/features/tools/countdown",
      "/features/tools/et-codegen",
      "/features/tools/macro/",
      "/features/tools/macro/yiui-macro",
      "/features/tools/open-close-animation",
      "/features/tools/resource",
      "/features/tools/safe-area",
      "/features/tools/single-column",
      "/features/tools/ui-effect/",
      "/features/tools/ui-effect/changelog",
      "/features/ui-3d-model/",
      "/features/ui-3d-model/changelog-0-3",
      "/features/ui-3d-model/changelog-0-7",
      "/features/ui-3d-model/click-interaction",
      "/features/ui-3d-model/demo",
      "/features/ui-3d-model/observer-camera",
      "/features/ui-3d-model/sync-camera",
      "/features/ui-3d-model/ui-3d-layer",
      "/features/uibind",
      "/framework/et10-note",
      "/framework/package-list/",
      "/framework/package-list/paid-packages",
      "/framework/package-list/structure",
      "/framework/video-tutorial/",
      "/framework/video-tutorial/detail",
      "/integration/",
      "/integration/et",
      "/integration/general",
      "/integration/run-guide",
      "/package-manager/",
      "/package-manager/et-loader",
      "/package-manager/init-demo",
      "/package-manager/one-click-package/",
      "/package-manager/one-click-package/normal",
      "/package-manager/plugin-library",
      "/package-manager/update-check",
      "/package-manager/upgrade",
      "/package-manager/version-management",
      "/package-manager/window-extension",
      "/packages/",
      "/packages/ai",
      "/packages/audio/",
      "/packages/audio/enum-codegen",
      "/packages/audio/quick-start",
      "/packages/audio/visual-extension",
      "/packages/behave",
      "/packages/box2d",
      "/packages/condition/",
      "/packages/condition/changelog",
      "/packages/condition/config",
      "/packages/condition/config-2",
      "/packages/condition/demo",
      "/packages/condition/enum-codegen",
      "/packages/condition/quick-start",
      "/packages/damage-tips/",
      "/packages/damage-tips/changelog",
      "/packages/damage-tips/floating-text-demo",
      "/packages/damage-tips/quick-start",
      "/packages/dialog",
      "/packages/gameobject-pool/",
      "/packages/gameobject-pool/changelog",
      "/packages/gameobject-pool/examples",
      "/packages/gameobject-pool/quick-start",
      "/packages/guide",
      "/packages/localization-pro/",
      "/packages/localization-pro/changes",
      "/packages/localization-pro/quick-start",
      "/packages/localization-pro/xlsx-import",
      "/packages/luban/",
      "/packages/luban/basic-config",
      "/packages/luban/changelog",
      "/packages/luban/codegen-to-package",
      "/packages/luban/config-extension",
      "/packages/luban/config-visual-tool",
      "/packages/luban/contact",
      "/packages/luban/create-template",
      "/packages/luban/et-excel-replace",
      "/packages/luban/et-excel-to-luban",
      "/packages/luban/export",
      "/packages/luban/faq/",
      "/packages/luban/faq/boot-errors",
      "/packages/luban/faq/custom-boot-config",
      "/packages/luban/faq/edit-template",
      "/packages/luban/faq/export-garbled",
      "/packages/luban/faq/upgrade-errors",
      "/packages/luban/luban-invoke",
      "/packages/luban/official-doc",
      "/packages/luban/quick-start",
      "/packages/luban/unity-visual-tool",
      "/packages/numeric/",
      "/packages/numeric/changelog",
      "/packages/numeric/check",
      "/packages/numeric/comparison",
      "/packages/numeric/config/",
      "/packages/numeric/config/examples",
      "/packages/numeric/demo",
      "/packages/numeric/design",
      "/packages/numeric/effect",
      "/packages/numeric/fixed-point",
      "/packages/numeric/format-string",
      "/packages/numeric/formula",
      "/packages/numeric/gm-debug",
      "/packages/numeric/limit/",
      "/packages/numeric/limit/reset-and-effect",
      "/packages/numeric/listener/",
      "/packages/numeric/listener/numeric-handler",
      "/packages/numeric/listener/numeric-handler-dynamic",
      "/packages/numeric/localization",
      "/packages/numeric/quick-start",
      "/packages/numeric/replace-et-numeric",
      "/packages/numeric/safe-range",
      "/packages/ps2ugui",
      "/packages/skill",
      "/packages/superscroll",
      "/packages/unity-mcp",
      "/packages/video/",
      "/packages/video/examples",
      "/packages/video/harmonyos-unsupported",
      "/packages/video/quick-start",
      "/start/",
      "/start/quick-start/",
      "/start/quick-start/common",
      "/start/quick-start/layer",
      "/start/quick-start/source"
    ]
  },
  {
    "id": "et10",
    "label": "ET10",
    "prefix": "/et10/",
    "released": false,
    "frozen": false,
    "note": "文档整理中",
    "pages": [
      "/"
    ]
  }
]

/** 默认版本：访问 / 或站内未带版本前缀的页面时，切换器高亮它 */
export const DEFAULT_VERSION = 'et9'

/** 最新版本：ET9 的冻结提示会引导到这里 */
export const LATEST_VERSION = 'et10'

/** 从 pathname 里解析出版本 id，解析不出返回 null */
export function versionOfPath(pathname: string): string | null {
  for (const v of VERSIONS) {
    if (pathname === '/' + v.id || pathname.startsWith(v.prefix)) return v.id
  }
  return null
}

/** 去掉版本前缀后的 slug，'/' 表示该版本落地页 */
export function slugWithin(pathname: string, v: VersionInfo): string {
  if (pathname === '/' + v.id) return '/'
  if (pathname.startsWith(v.prefix)) {
    const rest = pathname.slice(v.prefix.length - 1)
    return rest === '' ? '/' : rest
  }
  return '/'
}

/**
 * 计算切到目标版本后应去的地址。
 * 目标版本存在同 slug 页面 → 保留路径；否则退到该版本的落地页。
 * ET10 尚未 released 时，始终退到落地页（占位页会说明情况）。
 */
export function switchUrl(pathname: string, target: VersionInfo): string {
  const from = VERSIONS.find((v) => versionOfPath(pathname) === v.id)
  if (!from || !target.released) return target.prefix
  const slug = slugWithin(pathname, from)
  const normalized = slug === '/' ? '/' : slug.replace(/\/$/, '')
  const hit = target.pages.some((p) => (p === '/' ? normalized === '/' : p.replace(/\/$/, '') === normalized))
  return hit ? target.prefix.replace(/\/$/, '') + (normalized === '/' ? '/' : normalized) : target.prefix
}
