import type { DefaultTheme } from 'vitepress'

// ET10 侧边栏：以「学习路线」为骨架。
// 层级命名：阶段（一级分组）/ 小节（二级条目，编号 0.1、0.2 …）。
// 不使用「课 / 课时」这类课程用语——站点是公开的学习与检索入口。
export default [
  {
    text: '学习路线',
    collapsed: true,
    items: [
      { text: '路线总览', link: '/et10/route/' },
      {
        text: '阶段 0 · 环境',
        link: '/et10/route/0-environment/',
        collapsed: true,
        items: [
          { text: '0.1 环境与工具链', link: '/et10/route/0-environment/1-toolchain' },
          { text: '0.2 工程目录与构建入口', link: '/et10/route/0-environment/2-project-layout' }
        ]
      },
      {
        text: '阶段 1 · 跑起来',
        link: '/et10/route/1-run-it/',
        collapsed: true,
        items: [
          { text: '1.1 编译并启动服务端', link: '/et10/route/1-run-it/1-build-and-start-server' },
          { text: '1.2 登录 → 进地图', link: '/et10/route/1-run-it/2-login-to-map' },
          { text: '1.3 日志与排障', link: '/et10/route/1-run-it/3-logs-and-troubleshooting' }
        ]
      },
      {
        text: '阶段 2 · ET 世界观',
        link: '/et10/route/2-et-model/',
        collapsed: true,
        items: [
          { text: '2.1 一切皆实体', link: '/et10/route/2-et-model/1-everything-is-entity' },
          { text: '2.2 组件式设计', link: '/et10/route/2-et-model/2-component-based-design' },
          { text: '2.3 单线程异步', link: '/et10/route/2-et-model/3-single-thread-async' },
          { text: '2.4 事件机制', link: '/et10/route/2-et-model/4-event-system' }
        ]
      },
      {
        text: '阶段 3 · 代码怎么组织',
        link: '/et10/route/3-code-layout/',
        collapsed: true,
        items: [
          { text: '3.1 五层分层', link: '/et10/route/3-code-layout/1-five-layers' },
          { text: '3.2 Package 与程序集', link: '/et10/route/3-code-layout/2-package-and-assembly' },
          { text: '3.3 包依赖：单向 · 显式 · 无环', link: '/et10/route/3-code-layout/3-package-dependencies' },
          { text: '3.4 新增一个功能的完整落点', link: '/et10/route/3-code-layout/4-where-to-put-new-code' }
        ]
      },
      {
        text: '阶段 4 · 会跟服务器说话',
        link: '/et10/route/4-communication/',
        collapsed: true,
        items: [
          { text: '4.1 Proto 定义与导出', link: '/et10/route/4-communication/1-proto-and-export' },
          { text: '4.2 消息与 Handler', link: '/et10/route/4-communication/2-message-and-handler' },
          { text: '4.3 内网消息 NetInner', link: '/et10/route/4-communication/3-netinner' },
          { text: '4.4 Router 与 ServiceDiscovery', link: '/et10/route/4-communication/4-router-and-service-discovery' }
        ]
      },
      {
        text: '阶段 5 · 懂服务端链路',
        link: '/et10/route/5-server-chain/',
        collapsed: true,
        items: [
          { text: '5.1 Login → Realm → Gate → Map', link: '/et10/route/5-server-chain/1-login-chain' },
          { text: '5.2 Scene / Unit / Actor', link: '/et10/route/5-server-chain/2-scene-unit-actor' },
          { text: '5.3 地图与切换', link: '/et10/route/5-server-chain/3-map-and-transfer' },
          { text: '5.4 移动 · AOI · 寻路', link: '/et10/route/5-server-chain/4-move-aoi-pathfinding' },
          { text: '5.5 配置表与数值系统', link: '/et10/route/5-server-chain/5-config-and-numeric' }
        ]
      },
      {
        text: '阶段 6 · YIUI 客户端 UI',
        link: '/et10/route/6-yiui-ui/',
        collapsed: true,
        items: [
          { text: '6.1 YIUI 是什么', link: '/et10/route/6-yiui-ui/1-what-is-yiui' },
          { text: '6.2 Panel / View 生命周期', link: '/et10/route/6-yiui-ui/2-panel-lifecycle' },
          { text: '6.3 数据绑定与事件', link: '/et10/route/6-yiui-ui/3-data-binding-and-event' },
          { text: '6.4 动态消息', link: '/et10/route/6-yiui-ui/4-dynamic-message' },
          { text: '6.5 常用组件', link: '/et10/route/6-yiui-ui/5-common-components' },
          { text: '6.6 表现增强', link: '/et10/route/6-yiui-ui/6-presentation' }
        ]
      },
      {
        text: '阶段 7 · 工具链与 AI 协作',
        link: '/et10/route/7-toolchain/',
        collapsed: true,
        items: [
          { text: '7.1 编译门禁与 F6 流程', link: '/et10/route/7-toolchain/1-compile-gate-and-f6' },
          { text: '7.2 MCP 让 AI 操作 Unity', link: '/et10/route/7-toolchain/2-mcp-unity' },
          { text: '7.3 MCP 拼 UI', link: '/et10/route/7-toolchain/3-mcp-ai-ui' },
          { text: '7.4 行为树 YIUIBT', link: '/et10/route/7-toolchain/4-yiuibt' },
          { text: '7.5 技能与 Buff', link: '/et10/route/7-toolchain/5-skill-and-buff' },
          { text: '7.6 测试闭环', link: '/et10/route/7-toolchain/6-test-loop' }
        ]
      }
    ]
  }
] satisfies DefaultTheme.SidebarItem[]
