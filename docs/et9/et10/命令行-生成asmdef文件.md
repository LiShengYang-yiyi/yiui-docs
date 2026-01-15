# 命令行 生成asmdef文件 

**URL**: https://ai.feishu.cn/wiki/OgKywVZoaiZBpjkUeGvc62z1npe

**Parent**: ET10

**Depth**: 3

---
命令行 生成asmdef文件
输入“/”快速插入内容
命令行 生成asmdef文件
亦亦
报错导致没有菜单的问题
根据运行指南
编译ET.CodeMode工程，然后在命令行执行dotnet ./Bin/ET.CodeMode.dll,这样会生成asmdef文件
因为各种原因可能出现包的asmdef文件错误 导致的编译问题
本身是在Unity上有按钮解决的 但是因为报错这个按钮出不来 这不就死循环了
新解决方案
1.
编译ET.CodeMode工程
2.
运行命令
打开Rider编辑里面就有的命令行 输入 dotnet ./Bin/ET.CodeMode.dll
3.
编译完成 回到Unity 刷新Ctrl+R