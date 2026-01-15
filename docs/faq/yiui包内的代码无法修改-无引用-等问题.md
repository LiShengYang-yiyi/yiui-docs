# YIUI包内的代码无法修改 无引用 等问题

**URL**: https://ai.feishu.cn/wiki/TYCwwGQcvi2HoHkZN5acKSthnIU

**Parent**: 常见问题

**Depth**: 2

---
YIUI包内的代码无法修改 无引用 等问题
输入“/”快速插入内容
YIUI包内的代码无法修改 无引用 等问题
亦亦
其他任意ET包同理
1.
看一下YIUI的包在那个目录
Packages 目录下 才是可修改的
Library\PackageCache 这个目录下是只读的
2.
ET工程 看下有没有加入yiui相关包的DLL