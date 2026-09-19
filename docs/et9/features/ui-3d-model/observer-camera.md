---
title: 观察摄像机
et9: true
---

# 观察摄像机

自动创建时会有一个主摄像机 这个就是渲染摄像机

![](/images/et9/img/XGTCbf9pzohnFHxkvMXckdPrnWb.png)

如果在同一个显示模式下 有很多模型  他们的大小不一样 那么这个通用摄像机就无法达到需求

如果你的所有模型都差不多大 也没有什么特殊需求 那么可以直接用默认摄像机 不传入参数即可

可以在不同模型下显示不同的样子

![](/images/et9/img/B1yQbAhvwooD3txsopWcSxaonlb.png)

1. 节点的名称 = 传入时的名称

可以有多个 在不同显示时使用不同的

1. 节点建议放在根节点最上面  可以减少遍历消耗
2. 节点不需要打开 可以选择关闭节点 / Camera的关闭
3. 预览里面的内容就是UI上呈现的效果 (预制体不能太小否则这个预览效果会有误差)
4. 预览相机的设置 = 渲染时的设置

## 调用案例

ET9

![](/images/et9/img/UGlIb7DCWoqCQrxXg0wcthnXnIc.png)
