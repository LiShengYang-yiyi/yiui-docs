---
title: UGUI 特效
---

# UGUI 特效

> 普通粒子系统走相机渲染，不进 Canvas 的排序和裁剪管线。特效包把粒子烘成网格灌进 UGUI 的渲染节点，让特效和普通界面元素排在同一个层级里。

**关键词**：yiuieffect · UIParticle · UIParticleRenderer · UIEffect · UIDataBindGray · BakeMesh · MaskableGraphic

## 1 为什么需要这一层

`ParticleSystem` 由 `ParticleSystemRenderer` 交给相机画，**不参与 Canvas 的层级与模板缓冲**。直接挂在 UI 节点下会有两个问题：

- `Mask` / `RectMask2D` 裁不到它
- 它只能整体盖在上面或垫在下面，插不到两个 UI 元素中间

`UIParticle` 的做法是把粒子烘成网格，当成 `MaskableGraphic` 提交给 `CanvasRenderer`。这样它和普通 Image、Text 走同一条渲染队列，排序与裁剪自动生效。

**没有用 RenderTexture，也没有额外的显示用相机**——粒子的原始渲染器被关掉，画面完全由烘焙网格承载。

## 2 包里有什么

| 部分 | 内容 |
|---|---|
| UI 粒子 | `UIParticle` —— UGUI 上的粒子容器 |
| 材质级特效 | `UIEffect` —— 灰度、色调、模糊、溶解这一类的顶点 / 材质效果 |
| YIUI 置灰绑定 | `UIDataBindGray` / `UIDataBindGrayAll` |

前两部分是内置的第三方实现，在本包里按原样保留（`UIParticle` 4.12.1、`UIEffect` 5.10.8）；置灰绑定是 YIUI 侧新增的，跟着数据绑定走。

三者分属三个程序集：粒子、材质特效各自独立，置灰绑定编进 `ET.YIUIFramework`。

## 3 关键类

| 类 | 角色 |
|---|---|
| `UIParticle` | 挂在 UI 节点上的粒子容器，`MaskableGraphic` |
| `UIParticleRenderer` | 实际提交网格的渲染节点，**内部类型** |
| `UIParticleUpdater` | 每帧驱动全场景 `UIParticle` 刷新 |
| `UIParticleAttractor` | 吸附特效，让粒子飞向目标 |
| `UIEffect` | 材质级特效组件 |
| `UIDataBindGray` | 按数据绑定结果开关置灰 |

`UIParticleRenderer` 是内部类型，业务侧拿不到，也不能手动 `AddComponent`——它由 `UIParticle` 在收集粒子时自动创建。

## 4 每帧发生什么

1. Canvas 重建后，`UIParticleUpdater` 遍历已注册的 `UIParticle`
2. 同一帧只跑一次，重复调用直接返回
3. 计算画布缩放与父节点缩放，必要时把自身缩放反向抵消
4. 手动推进粒子模拟
5. 把粒子烘焙成网格，合并到一张工作网格上
6. 重算包围盒，跑一遍 UGUI 的网格修饰流程 —— **`Mask` 裁剪在这一步生效**
7. 提交给 `CanvasRenderer`

粒子模拟是**手动推进**的，不是让 Unity 自己跑。这也是它能和 UI 刷新节奏对齐的原因。

## 5 缩放约定

`UIParticle` 有一个独立于 `Transform` 的缩放系数 `scale3D`，默认是 `(10, 10, 10)`。

原因是粒子的尺寸通常按世界单位设计，而 UGUI 的单位是像素。默认值把两者对齐到「大致可用」的量级，改这个值比改粒子本身的尺寸更方便。

自动缩放模式下，组件会在运行时把自身 `localScale` 强制设成父节点缩放的倒数，原始缩放被另存。**这时候手动改 `localScale` 是无效的**，要调尺寸请用 `scale3D`。

## 6 硬约束

- **不会自动销毁自己**：非循环粒子播完后只停止模拟并清空网格，节点还留在层级里。回收必须由调用方负责。
- 粒子材质必须是 UI 着色器。非 `UI/` 前缀的内置着色器会报错。
- 可被 `Mask` 裁剪的前提是材质同时具备完整的模板缓冲属性，缺一个就只是一个警告，实际裁不到。
- `raycastTarget` 恒为 `false`，设置无效——**特效不接收点击**。
- 单帧顶点数上限 65535，超出直接报错并当帧不显示。
- 缩放为 0、没有存活粒子、拖尾未开启等情况下不烘焙网格，画面为空是预期行为。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuieffect/Plugins/UIParticle/UIParticle.cs` | 粒子容器与对外 API |
| `Packages/cn.etetet.yiuieffect/Plugins/UIParticle/UIParticleRenderer.cs` | 烘焙与网格提交 |
| `Packages/cn.etetet.yiuieffect/Plugins/UIParticle/UIParticleUpdater.cs` | 每帧驱动 |
| `Packages/cn.etetet.yiuieffect/Plugins/UIEffect/Runtime/UIEffect.cs` | 材质级特效 |
| `Packages/cn.etetet.yiuieffect/Runtime/YIUIBind/Data/UIDataBindGray.cs` | 数据绑定置灰 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 粒子排序工具 | `Plugins/UIParticle/Utilities/ParticleSystemExtensions.cs` |
| 材质实例复用 | `Plugins/UIParticle/Internal/Utilities/MaterialRepository.cs` |
| 工程级设置 | `Plugins/UIParticle/UIParticleProjectSettings.cs` · `Plugins/UIEffect/Runtime/UIEffectProjectSettings.cs` |
| 编辑器面板 | `Editor/UIParticleEditor/` · `Editor/UIEffect/` |
| 置灰的全量版 | `Runtime/YIUIBind/Data/UIDataBindGrayAll.cs` |

## 下一步

→ [怎么用](./usage)
