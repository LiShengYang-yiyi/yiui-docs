---
title: 等待
et9: true
---

# 等待

通用的UI等待

实际项目中发现有大量的需求

逻辑需要等待某个UI进行系列操作后继续执行

如:

幸存者类游戏 弹出来的 三选一UI界面  等待玩家选择后 继续执行某个操作

弱引导 打开某个UI玩家执行自定义操作后 关闭UI 继续执行XX

UI上会有非常多这种需求

以前要么用回调 要么用通知 等方式实现

现在也可以使用异步方式

## 常规写法

```C#

//1 需要等待的地方
var objWait = xx.GetComponent<ObjectWait>();
await objWait.Wait<Event_WaitXxxxx>();

//2 其他地方抛出等待完成
var objWait = xx.GetComponent<ObjectWait>();
objWait.Notify(new Event_WaitXxxxx());

功能:
ETCancellationToken 可提前取消等待
int timeout 超时

notify 不光是完成 还可传递数据
var result = await objWait.Wait<Event_WaitXxxxx>();
result.XX

需要提前定义Event_WaitXxxxx
```

## 需求

不想提前定义xx  因为每次还要定义这个很麻烦

因为没有提前定义 所以就没有了数据传递功能

打开某个UI时  就开始等待这个UI关闭/摧毁 然后等待完成 继续其他流程

超时

不需要超时功能 因为UI打开了就是打开了只能等他关闭

不能要求某个UI必须多少秒关闭  如果有请用其他方式实现

取消

不需要取消功能 也是一样的

如果打开UI失败者判定等待完成

## 综上所述

不能直接用ObjectWait 所以仿照写一个类似的UI等待用

## HashWait

具体看源码

本质上去掉了 需要提前定义Event_WaitXxxxx

所有wait 统一返回错误码 去掉了自定义的结构

根据设定相同hashcode 值成对使用

所以不光是UI可用 其实任意地方都可用

有取消 有超时

::: info 内嵌表格
此处在飞书原文中是一张内嵌表格，暂未迁移。可在飞书文档中查看。
:::

> 有人提出疑问

> 用ObjectWait 定义一个通用的结构体消息不是也可以嘛

> 在这里统一回复

> 因为UI存在同时多个 或者同一个UI多个的情况 敢问阁下如何应对

> 所以没办法只有一个结构体数据时做到同时处理很多UI

> 这个时候自己创建的一个通用的结构体是肯定不够的

## 使用

### Tips

已扩展  TipsHelper.OpenWait

具体使用案例参考GM命令 GM_Command_WaitTips

### Panel

OpenPanelWaitAsync

::: tip 👓 未全明白的情况下不建议使用
:::
