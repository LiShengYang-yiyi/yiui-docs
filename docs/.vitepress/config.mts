import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "YIUI Docs",
  description: "YIUI 个人文档站",
  lang: 'zh-CN',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/' },
          { text: '快速开始', link: '/guide/getting-started' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiShengYang-yiyi/yiui-docs' }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      label: '页面导航'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
