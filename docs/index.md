---
outline: false
aside: false
---

<div class="yiui-hero">
  <h1 class="yiui-hero-title">YIUI</h1>
  <div class="yiui-hero-lead">Unity 数据驱动 UI 框架</div>
  <div class="yiui-hero-actions">
    <a class="yiui-btn yiui-btn--primary" href="/et10/route/">ET10</a>
    <a class="yiui-btn" href="/et9/">ET9</a>
  </div>
</div>

## YIUI 包目录

ET10 工程里的 28 个 YIUI 系包。包名统一带 `yiui` 前缀是为了避免命名冲突，其中一部分与 UI 无关，属于独立功能包。

| 包 | 说明 |
|---|---|
| `yiuiframework` | 框架本体。运行期是基础库（对象池、列表池、缓存、释放器与一批 Unity 类型扩展）；编辑器侧是自动化工具窗口，负责生成 Panel / Component / View / System 代码，另有 UICheck、UIPublish、UIMacro；还带 Roslyn 分析器与源生成器，用来补全绑定代码并对写法把关。 |
| `yiui` | 框架的生成落地包，放多语言词条常量与本地化入口，以及全局图集设置。内容在本地自动生成，避免与其他包同步时冲突。 |
| `yiuiinvoke` | 独立的调用系统，不依赖 YIUI。给实体之间提供带返回值、可校验的调用与监听，比走协议轻，比直接引用解耦。 |
| `yiuisuperscroll` | 循环列表。内置虚拟化的列表、网格、瀑布流三套控件与各自的 Item 池，在 YIUI 里以组件方式使用，支持一键刷新，并带点击、加载完成等事件。 |
| `yiuireddot` | 红点系统。负责红点数据的标记、父子传播与界面绑定，提供红点、文本、TMP 三种绑定组件；编辑器里还有红点链路 DAG 视图与配置窗口。 |
| `yiuitips` | 提示弹窗。统一的显示与排队机制，业务侧一行调用即可，不用关心具体弹窗实例。 |
| `yiuigm` | 运行期 GM 命令面板。各业务包把自己的命令注册进来，在游戏里直接改数值、开关功能、触发流程。 |
| `yiuimountpoint` | UI 挂点。给界面节点打标记，运行时收集成结构化的挂点数据，供逻辑层按语义取用。 |
| `yiuieffect` | UGUI 特效插件集成（UIEffect + UIParticle），独立可用。提供灰度、描边、渐变、过渡等特效组件与一套 Timeline 轨道，并让粒子正确显示在 UI 上。 |
| `yiuiaudio` | 声音播放与管理。背景音乐、音效、跟随音源、对象池与全局监听，配置表由 Luban 生成；另有一组可直接挂在界面上的音频绑定组件。 |
| `yiuilocalizationpro` | 多语言方案（基于 I2 Localization Pro）。词条表导入导出、运行时切换语言、参数替换，并接进 ET 的事件与 Invoke；配套 Excel 工具生成词条。 |
| `yiui3ddisplay` | 在 UI 里显示 3D 模型。支持同步与异步加载、多模型并存、点击交互，常用于角色展示、装备预览这类界面。 |
| `yiuidamagetips` | 伤害数字提示。把战斗产生的伤害数字按不同样式刷到界面上，底层接入 DamageNumbersPro。 |
| `yiuicondition` | 条件系统。把「满足什么条件才显示 / 才开放」抽象成可配置的注册、求值、监听与派发，供界面与玩法共用。 |
| `yiuigameobjectpool` | 游戏对象缓存池。按配置复用对象并自动回收，减少频繁创建销毁的开销，本身可独立使用。 |
| `yiuiyooassets` | 把 YooAssets 资源系统接进 YIUI。统一处理界面资源与图片的异步加载、释放，并支持图集管理。 |
| `yiuianimancer` | 基于 Animancer 的动画系统。用「动画意图」这种纯数据方式提交与仲裁播放，避免多处代码抢同一个播放器；意图可带优先级与权重，由统一的调度器决定谁真正占用播放器。 |
| `yiuibt` | 行为树系统。以文本 DSL 为唯一事实源，编译成二进制后在任意实体上逐帧 Tick；核心不绑定单位、UI、网络与资源，扩展方只需声明自己的树类型与 Action。 |
| `yiuiskill` | 技能与 Buff 基础系统，建立在行为树之上。技能按配置与固定帧冷却施法；Buff 支持时间、层数、时间层数与替换等多种叠加规则，并带技能时间轴逐帧推进。 |
| `yiuibox2d` | 2D 物理与碰撞。内置 Box2DSharp 并封装成 ET 组件（世界、碰撞体、碰撞监听、阵营），配齐 Luban 碰撞配置与编辑器可视化。 |
| `yiuiunit` | 单位系统。统一管理玩家、英雄、怪物、NPC 的创建与查询，配置通过类型安全的接口扩展。 |
| `yiuinumeric` | 数值系统。可配置的数值定义、读写与变化通知，支持公式、上限限制、影响链与本地化；分普通处理器与动态处理器两套监听机制，内部走定点数以避免浮点误差。 |
| `yiuiluban` | Luban 配置工具的运行时与导出底座，可脱离 YIUI 独立使用，负责读表、导出与反序列化。 |
| `yiuipsd2ui` | PSD 转 UI。把 Photoshop 里标记好的图层直接导出成 Unity 预制体，支持按钮、图片、文本、输入框等类型，也能对已有预制体做增删改，并带自动九宫格工具。 |
| `yiuimcp` | Unity MCP 服务，让 AI 助手直接操作 Unity。编辑器内提供原子工具（编译、控制运行、读日志、查界面、改预制体、模拟点击）；外部由 Node.js 编排层负责批量执行，并处理域重载后的恢复。 |
| `yiuicodeanalysis` | 提供 Roslyn 与 NPOI 等程序集引用，供其他工具做代码分析与表格读写。 |
| `yiuizstring` | ZString 零分配字符串库，适合热路径拼接字符串，另带 TextMeshPro 扩展。 |
| `yiuinino` | Nino 高性能二进制序列化库。 |

## 开始阅读

1. [ET10 学习路线](/et10/route/) —— 8 个阶段、34 个小节，从环境到工具链，按顺序读。
2. [ET9 快速入门](/et9/start/quick-start/) —— 从安装包到打开第一个界面的完整流程。
3. [ET9 接入](/et9/integration/) —— 把 YIUI 接进已有工程，含 ET9 与通用两条路径。
4. [ET9 扩展包](/et9/packages/) —— 逐个说明官方包能做什么、怎么配。
5. [示例仓库](https://github.com/LiShengYang-yiyi/YIUI) —— 完整可运行的工程，直接对照阅读。

## 官方资源

- 源码：[LiShengYang-yiyi/YIUI](https://github.com/LiShengYang-yiyi/YIUI)
- 依赖框架：[ET](https://github.com/egametang/ET)
- 更新记录：[更新日志](/et9/changelog/)
