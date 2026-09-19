---
title: YIUI UnityMCP 编辑器AI操作
et9: true
---

# YIUI UnityMCP 编辑器AI操作

PPT 概念介绍

[B 站视频 BV1sLQmBuEYF](https://www.bilibili.com/video/BV1sLQmBuEYF)

开源GIT

[https://github.com/LiShengYang-yiyi/UnityCLI](https://github.com/LiShengYang-yiyi/UnityCLI)

![](/images/et9/img/Da3gbBOHJoav9kxIAEAcwlHbnCd.png)

默认关闭启动, 首次安装后需要切换到  自动模式或者手动模式才可以使用

端口支持修改, 如果与本地其他冲突可自行修改

::: info 📌
下面的内容添加到你的 AGENTS.md 中, 开启后AI任意修改代码就会自动编译了
:::

````Plain Text
### ⚠️ 强制编译验证规则（最高优先级）

**每次修改任何 .cs 文件后，必须立即执行编译验证！**

#### 编译验证流程

1. **执行编译脚本**（强制）
   ```powershell
powershell -ExecutionPolicy Bypass -Command "& '项目根目录\Packages\cn.etetet.yiuimcp\Config\compile-unity-flow.ps1' -Force 0 -NoWait 1"
```
   参数 Force = 是否强制编译,默认情况下都不需要强制编译 = 0
   如果需要可以改变参数传入 -Force 1
   -NoWait 1 不要修改,这样才可以直接得到编译结果

   直接执行,不需要查看PS内容,除非执行报错,
   不允许修改内容,除非用户明确表达需要修改,否者不允许修改此文件!!!
   执行后,会在控制台输出编译结果,得到编译结果.

2. **检查编译结果**
   - ✅ 如果编译成功（没有错误）→ 继续下一步
   - ❌ 如果编译失败（有错误）→ 立即修复错误，然后重新执行步骤 1
   - ❌ 如果编译失败（有错误）→ 任何情况下都不允许忽视,必须先解决

3. **循环直到成功**
   - 必须重复执行编译验证，直到没有任何编译错误为止
   - 不允许跳过编译验证步骤
   - 不允许使用 `dotnet build` 或其他编译方式替代

   以下情况包括但不限于必须触发编译验证：
✏️ 创建新的 .cs 文件
✏️ 修改现有 .cs 文件
✏️ 删除 .cs 文件
✏️ 重命名 .cs 文件或类名
✏️ 修改命名空间
✏️ 添加/删除/修改方法、属性、字段
````
