---
title: 导出乱码报错
et9: true
---

# 导出乱码报错

已在底层解决 强制转换了格式 所以不会出现这个问题了

如果你独立使用.bat 可以参考

## 原因

文件不是CRLF 换行格式

具体是不是这个原因 用文本程序打开.bat文件看看就知道了

![](/images/et9/img/TqyYbRg5GoEliDxX3k4cU2osn8f.png)

![](/images/et9/img/ThfNbEkBsoefGpxLVIycPByenBX.png)

![](/images/et9/img/ZHrtbOlcTo4i6xxvby0cM4o2n7f.png)

## 解决方案

Packages\cn.etetet.yiuiluban\\.ToolsGen

找到文件LubanGen.bat

### 使用工具自动转换

如:

![](/images/et9/img/N3jWbuXvUocgjRxbmfocyT6BnZf.png)

![](/images/et9/img/ZPAZbnYqaoEM4lx5Zx6coyeynme.png)

### 手动

复制他的名称  把原本的名称随便改一个

创建一个新的文本文件扩展改为.bat 名称 = LubanGen.bat  (新的创建的 不是复制的)

然后把之前老的文本打开把里面的内容全选复制下来

拷贝到刚刚新建的里面保存

回到Unity 重新导出 即可成功
