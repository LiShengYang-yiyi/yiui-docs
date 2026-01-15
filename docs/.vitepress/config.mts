import { defineConfig } from 'vitepress'
import sidebar from './sidebar.json'

export default defineConfig({
  title: "YIUI",
  description: "YIUI - Unity UI 框架文档",
  lang: 'zh-CN',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '入门', link: '/intro/' },
      { text: '更新日志', link: '/changelog/' },
      { text: '常见问题', link: '/faq/' }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/egametang/ET' }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新'
    }
  }
})
