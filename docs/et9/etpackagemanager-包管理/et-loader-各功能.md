# ET-Loader-各功能

**URL**: https://ai.feishu.cn/wiki/M4NuwB05CiCDdikEAJocuBbdnJc

**Parent**: ETPackageManager 包管理

**Depth**: 3

---
ET-Loader-各功能
输入“/”快速插入内容
ET-Loader-各功能
亦亦
2025年4月28日修改
RepairDependencies (修复依赖关系)
吧 所有包从缓存目录移动到Packages 目录
如果移动失败 可以尝试手动
就是找到 Library\PackageCache 文件夹里面要移动的文件 移动到 Packages
ReGenerateProjectFiles (生成项目文件)
ReGenerateProjectAssemblyReference (生成引用程序集)
根据当前的模式 :  C, S, CS
自动生成程序集 达到模式切换  代码在对应模式下才有dll 就会生效
UpdateScriptsReferences (更新程序集相互引用)
自动把各个包中的引用加到对应的包中去
如: cn.etetet.yiuiframework 包
这里则表示需要在 ModelView.DLL 中 加入 以下2个DLL
"ET.YIUIFramework",
"Unity.TextMeshPro"
所以不要手动的修改 ET的DLL 那些DLL 都会被这个脚本刷新