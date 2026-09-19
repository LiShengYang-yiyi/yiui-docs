import { defineConfig } from 'vitepress'
import et9Sidebar from './et9-sidebar'
import { VERSIONS, DEFAULT_VERSION } from './versions'

export default defineConfig({
  title: 'YIUI',
  description: 'YIUI - Unity 数据驱动 UI 框架',
  lang: 'zh-CN',

  // 注意：不要开 cleanUrls —— 它输出 guide.html 但链接是 /guide，
  // 在 GitHub Pages 上会 404。保持默认的 目录/index.html 结构。

  // 浅色优先，深色为等价的一套，右上角仍可切换。
  //
  // 注意：不能写 appearance: 'light'。VitePress 内部是
  //   useDark({ initialValue: () => appearance === 'dark' ? 'dark' : 'auto' })
  // 只有 'dark' 有专门分支，'light' 会退化成 'auto'（跟随系统偏好），
  // 在系统偏好为深色的机器上会直接渲染成深色。
  // 只有对象形式才能覆盖 initialValue。
  appearance: { initialValue: 'light' },

  // 不再忽略死链：内容重建后，问题应当在构建期暴露
  ignoreDeadLinks: false,

  // 不显示「最后更新于」。读者关心的是怎么用框架，不是这页哪天改的；
  // 何况时间来自 git 提交，迁移过来的页面会显示成飞书那边的历史日期，反而误导。
  lastUpdated: false,

  themeConfig: {
    nav: [
      { text: '文档', link: '/et9/' },
      { text: '更新日志', link: '/et9/changelog/' },
      {
        text: '相关链接',
        items: [
          { text: 'YIUI 仓库', link: 'https://github.com/LiShengYang-yiyi/YIUI' },
          { text: 'ET 框架', link: 'https://github.com/egametang/ET' }
        ]
      }
    ],

    // /et9/ 与 /et10/ 的侧边栏分别由 .workbuddy/tools/gen-site-modules.js 生成，
    // 版本切换器读的是同一份 versions.ts，两处不会漂移。
    sidebar: {
      '/et9/': et9Sidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiShengYang-yiyi' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,

    // 深色页脚带。两处约束：
    // 1. VitePress 自带页脚在文档页会被隐藏，custom.css 里已显式恢复；
    // 2. VPFooter 把 message 渲染在 <p> 里，里面的块级元素会被 HTML 解析器
    //    丢弃（<div> 会整块消失）。所以三栏只能用 <span> 搭，
    //    由 custom.css 把那个 <p> 本身变成 grid 容器。
    footer: {
      message: `
        <span class="yiui-footer-col">
          <span class="yiui-footer-title">文档</span>
          <a href="/et9/">ET9 文档</a>
          <a href="/et9/start/quick-start/">快速入门</a>
          <a href="/et9/packages/">扩展包</a>
          <a href="/et9/changelog/">更新日志</a>
        </span>
        <span class="yiui-footer-col">
          <span class="yiui-footer-title">仓库</span>
          <a href="https://github.com/LiShengYang-yiyi/YIUI" target="_blank" rel="noreferrer">YIUI 源码</a>
          <a href="https://github.com/egametang/ET" target="_blank" rel="noreferrer">ET 框架</a>
        </span>
        <span class="yiui-footer-col">
          <span class="yiui-footer-title">更多</span>
          <a href="/et9/faq/">常见问题</a>
          <a href="https://yiui.xyz">yiui.xyz</a>
        </span>
      `,
      copyright: `Copyright © ${new Date().getFullYear()} YIUI`
    }
  }
})
