---
title: YooAsset 可寻址修改
et9: true
---

# YooAsset 可寻址修改

> 本段内容同步自：[ET 接入](/et9/integration/et)

## 总结

嫌麻烦的可以直接看总结

不建议改

## 如果想改看这里 ↓

如果看不懂改不来 建议参考总结

已知YIUI在加载UI时都会传入UI所在包的包名

![](/images/et9/img/XIAcbgGBOoiBunx6ZNKcL56anjh.png)

包名 = 所在文件夹

资源名 = 资源名称

已知YIUIConst

![](/images/et9/img/AhiLbI6zroAk1gxIggDcYkqunTK.png)

那么可以根据规则拼接出资源路径

缺点每个包下面就不能自己创建文件夹了否则规则就不统一了

所以根据自己的实际情况拼接实现

![](/images/et9/img/MEi3b1AgwoQyaWx5EaacxSAOnuc.png)

举例:

![](/images/et9/img/DHVnb2E7yoyhsqxuRcpcmf47nzg.png)

这里的arg1 = 包名 arg2=资源名

相关可能需要参考修改的类

YIUI工厂  扩展的Mono快捷调用 如图片 等等...
