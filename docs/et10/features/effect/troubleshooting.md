---
title: 排查
---

# 排查

> 特效不显示绝大多数不是代码问题，而是「这一帧没烘出网格」。按早退条件逐条对，比读代码快。

**关键词**：顶点数上限 · 缩放为 0 · MaskableGraphic · UI shader · 不自动销毁 · 渲染模式

## 1 先按现象分岔

| 现象 | 往哪查 |
|---|---|
| 完全看不到 | 早退条件命中，这一帧没烘网格 |
| 粒子没了但节点还在 | 正常行为，播完不自动销毁 |
| 被遮罩裁不到 | 材质缺模板缓冲属性 |
| 点不到 | `raycastTarget` 恒为假，设计如此 |
| 层级盖住不该盖的 | sibling index 或网格共享分组 |
| 编辑器报着色器不支持 | 粒子用了非 UI 着色器 |
| 动态改分辨率后卡一帧 | 世界空间下的刻意行为 |

## 2 看不到时的五个早退条件

组件在一帧里遇到下面任一条，就直接清空网格、什么都不画：

| 条件 | 说明 |
|---|---|
| 缩放为 0 | `scale3D` 有分量为 0，或父节点缩放为 0 |
| 没有存活粒子且不在播放 | 粒子已经全部消亡 |
| 拖尾渲染节点但拖尾未开启 | 拖尾节点在占位但没内容 |
| 网格共享模式为副本 | 由主节点代画，自己不烘 |
| 渲染模式是 `None`，或 `Mesh` 模式但网格为空 | 粒子自身的渲染模式问题 |

**排查顺序：先看缩放，再看粒子死活，最后看渲染模式。** 缩放是最容易忽略的一条——父节点缩放为 0 也会命中。

## 3 顶点数超限

单帧顶点数达到 65535 时会报错并清空该帧网格：

```
Too many vertices to render. index={0}, isTrail={1}, vertexCount={2}(>=65535)
```

处理办法是降粒子数量、降发射率，或把一条大特效拆成多条。

## 4 裁不到 Mask

粒子和普通图元一样，靠材质上的模板缓冲属性被裁剪。**材质必须同时具备全部模板属性**，缺任何一个编辑器就会给出警告，运行时则表现为「裁不到」。

需要的是这一类属性：模板值、比较方式、通过 / 失败操作、读写掩码、颜色掩码。用 UGUI 自带的 UI 着色器通常都有；自定义着色器要自己补。

调试图层时先确认目标是 `Mask` 还是 `RectMask2D` —— 后者走的是矩形裁剪判断，不依赖模板属性。

## 5 点不到特效

`UIParticle` 与渲染节点的 `raycastTarget` **恒返回 `false`，写入无效**。这是刻意的：特效不该参与点击。

需要在特效区域响应点击，把按钮或可见图片放在同一位置，特效叠在上面。

## 6 特效不消失

非循环粒子播完后，组件只做两件事：停止模拟、清空网格。**节点不会自动销毁。**

所以「特效播完还占着层级」是预期行为。要它消失，业务侧得自己销毁或回收。反过来，如果界面是靠销毁节点来回收特效的，注意销毁时机不要早于播放结束。

## 7 层级不对

`UIParticle` 以自身在父节点里的位置参与排序，和普通 UI 元素同一条队列。层级不对时按这个顺序查：

1. 这个节点在父级里排第几
2. 父级所在的 Canvas 排序设置
3. 是否开了网格共享 —— 分组内的从节点不自己烘焙，跟着主节点画

网格共享能显著省性能，但会让从节点失去独立的网格数据。层级表现异常时先关掉它验证。

## 8 编辑器里的常见提示

| 提示 | 含义 |
|---|---|
| `Built-in shader '{name}' is not supported. Use UI shaders instead.` | 粒子材质不是 UI 着色器 |
| `Shader '{name}' doesn't have '{propName}' property. This graphic cannot be masked.` | 缺模板属性，裁不到 |
| 提示应移除 UIParticle 组件并提供修复按钮 | 旧版拖尾写法留下的组件 |
| 着色器变体未注册 | 变体注册表没覆盖，可忽略或补注册 |

## 9 两个性能相关的坑

**静态缓冲不可重入。** 网格合并用的是静态共享缓冲，多个特效同帧处理时共用同一份临时数据。这不是线程安全问题（都在主线程），但意味着同一帧内不要嵌套触发另一次烘焙。

**改分辨率或画布缩放会停顿一帧。** 世界空间粒子在分辨率变化时会把粒子位置批量补偿，该帧刻意不推进模拟。这是已知行为，不是卡顿。

## 10 编辑器下视图不刷新

改完粒子列表、或打开场景后特效看不到，是编辑器视图没有重建。点组件的刷新按钮，或等一次编辑器重绘即可。运行时不涉及这个问题。

## 真源

- **早退条件、顶点数校验、裁剪判断**<br>`Packages/cn.etetet.yiuieffect/Plugins/UIParticle/UIParticleRenderer.cs`
- **可烘焙判定与排序**<br>`Packages/cn.etetet.yiuieffect/Plugins/UIParticle/Utilities/ParticleSystemExtensions.cs`
- **编辑器警告文案**<br>`Packages/cn.etetet.yiuieffect/Editor/UIParticleEditor/UIParticleEditor.cs`
- **材质特效的材质替换**<br>`Packages/cn.etetet.yiuieffect/Plugins/UIEffect/Runtime/UIEffectBase.cs`

## 源码落点

- **网格共享分组**<br>`Plugins/UIParticle/UIParticleUpdater.cs`
- **缩放自动补偿**<br>`Plugins/UIParticle/UIParticle.cs` 里的 `UpdateTransformScale`
- **世界空间分辨率补偿**<br>`Plugins/UIParticle/UIParticleRenderer.cs`
- **着色器变体处理**<br>`Editor/UIEffect/RemoveSoftMaskableVariantsIfNeeded.cs`

## 下一步

→ [UI 挂点](../mountpoint/)
