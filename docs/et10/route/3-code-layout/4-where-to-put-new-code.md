---
title: 3.4 新增一个功能的完整落点
---

# 3.4 新增一个功能的完整落点

> **一句话**：新增功能按六步定位——**定包 → 定层 → 定模式目录 → 定依赖 → 写代码 → 编译验证**；前四步走完再动手敲代码。

**关键词**：代码落点 · 决策流程 · 新建包 · 依赖声明 · 编译验证

**目标**：把 [3.1](./1-five-layers) 到 [3.3](./3-package-dependencies) 的规则合成一套可执行的流程。

## 六步定位

| 步 | 问题 | 判据 |
|---|---|---|
| 1 | **改动属于哪个包？** | 先找现有包；只有「职责确实无处安放」才新建包 |
| 2 | **属于哪一层？** | 定义 → `Model`；逻辑 → `Hotfix`；客户端表现 → `*View` |
| 3 | **哪些端需要？** | 单端 → `Server` / `Client`；双端 → `Share` 或 `ClientServer` |
| 4 | **依赖谁？** | 跨包调用 → 在调用方 `package.json` 显式声明 |
| 5 | **写代码** | 优先复用现有结构，默认一类一文件 |
| 6 | **编译验证** | `dotnet build ET.sln`；Unity 侧热更走 F6 |

## 第 1 步最难：新建包还是复用

| 情况 | 处理 |
|---|---|
| 已有包职责匹配 | 放进那个包 |
| 是某个包的可选扩展 | 新建**可删除的独立扩展包**，单向依赖被扩展的包 |
| 谁都不像 | 先确认是不是「新的公共基础设施」——多数情况下不是 |

**新建包的三条底线**（来自工程约定）：

1. 扩展包**只能增加能力，不能修改核心**；核心不得反向引用扩展包；
2. 删除这个包后，它的声明、注册、资源、测试、编辑器入口必须**一起消失**——删掉后编译不过，是正确结果而不是问题；
3. **不为形式独立而新建 DLL**。能落在现有 `ET.Model` / `ET.Hotfix` 就沿用；只有低层消费者、独立发布 / AOT、或循环依赖确需时才提取，并且先写清消费者、依赖图和删除影响。

## 第 2–3 步：一张对照表

| 你要写的东西 | 放哪 |
|---|---|
| `Entity` / `Component` 定义 | `Scripts/Model/<模式>/` |
| `System` / `Handler` 实现 | `Scripts/Hotfix/<模式>/` |
| 客户端专用的表现数据 | `Scripts/ModelView/<模式>/` |
| 客户端专用的表现逻辑 | `Scripts/HotfixView/<模式>/` |
| 编辑器工具 | `Scripts/Editor/`（自动汇入 `ET.Editor`） |
| 协议 `.proto` | 该包 `Proto/` 目录 |
| 配置表 | 该包 `Excel/` 或 `Luban/` 目录 |

## 第 4 步：依赖怎么声明

```
跨包调用别人的类型/方法
        ↓
在【调用方】package.json 的 dependencies 里加被调用包
        ↓
版本号抄被调用包自己的 package.json
        ↓
重新编译 → 让分析器校验
```

如果编译报 `ET0102` / `ET0105`，就是这一步没做。

## 示例：给地图加一个「剩余时间」显示

| 步 | 结论 | 理由 |
|---|---|---|
| 1 定包 | 地图玩法相关 → `cn.etetet.mapplay` | 地图内玩法编排归它 |
| 2 定层 | 数据 → `Scripts/Model/Client/`；刷新逻辑 → `Scripts/HotfixView/Client/` | 剩余时间是客户端表现 |
| 3 定模式 | 只客户端需要 → `Client` | 服务端不关心显示 |
| 4 依赖 | 若用到 `mapplay` 以外的类型，在 `package.json` 补声明 | 分析器会校验 |
| 5 写代码 | 业务组件持有数据；UI 只读数据 | UI 不直接 `Call` 协议 |
| 6 验证 | `dotnet build ET.sln` → F6 → Play 看效果 | — |

> 上面这张表的**推理方式**比结论更重要。遇到陌生需求时，按同样六步走一遍即可。

## 检查清单

动手前：

- [ ] 这个包在 `MainPackage.txt` 里吗？（不在就不会被编译）
- [ ] 目录结构在 F6 的合法路径集合里吗？（不在就不会生成 asmref）
- [ ] 跨包调用都声明依赖了吗？
- [ ] 有没有往 `Scene` / `Unit` 这类通用基类上挂业务扩展方法？

动手后：

- [ ] `dotnet build ET.sln` 零错误
- [ ] 改动 `.cs` 后过了强制编译门禁
- [ ] 移动过 `.cs` 时，`.meta` 一起移动了

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.harness/skills/et-code/SKILL.md` | 新建 / 修改 Entity、System、Handler、包依赖的完整入口 |
| `Packages/cn.etetet.harness/skills/et-code/references/et-code-rules.md` | 文件落点、`.meta`、ECS 边界、组件契约 |
| `Packages/cn.etetet.harness/skills/et-build/SKILL.md` | 编译与导出验证 |
| `AGENTS.md`（工程根） | 「强制编译门禁」与各类禁令 |
| `Packages/cn.etetet.yiuiskill/AGENTS.md` | 独立扩展包的边界写法样本（怎么固定边界） |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 低层包范本 | `Packages/cn.etetet.map/` |
| 中层玩法包范本 | `Packages/cn.etetet.mapplay/` |
| 上层业务包范本 | `Packages/cn.etetet.transfer/` |
| 独立扩展包范本 | `Packages/cn.etetet.yiuiskill/` |

## 读完能回答

- 新增一个 `Entity` 和一个 `System`，分别放哪？
- 什么时候才该新建一个包？
- 删掉一个扩展包之后，编译报错说明什么？
- 一个新目录放进包里，为什么还需要改别的文件才会生效？

## 下一步

→ [阶段 4 · 会跟服务器说话](../4-communication/)
