# YooAsset 可寻址修改

**URL**: https://ai.feishu.cn/wiki/ReghwdfOJi5AmKkwmSCcl5BInRf

**Parent**: 常见问题

**Depth**: 2

---
YooAsset 可寻址修改
输入“/”快速插入内容
YooAsset 可寻址修改
亦亦
总结
嫌麻烦的可以直接看总结
不建议改
如果想改看这里 ↓
如果看不懂改不来 建议参考总结
已知YIUI在加载UI时都会传入UI所在包的包名
包名 = 所在文件夹
资源名 = 资源名称
已知YIUIConst
那么可以根据规则拼接出资源路径
缺点每个包下面就不能自己创建文件夹了否则规则就不统一了
所以根据自己的实际情况拼接实现
举例:
这里的arg1 = 包名 arg2=资源名
相关可能需要参考修改的类
YIUI工厂  扩展的Mono快捷调用 如图片 等等...