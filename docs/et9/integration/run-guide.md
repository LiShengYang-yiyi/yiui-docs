---
title: ET9 YIUI运行指南
et9: true
---

# ET9 YIUI运行指南

https://github.com/LiShengYang-yiyi/YIUI

已整合ET9 状态同步所有基础包.  想入门或学习的建议直接使用此分支

![](/images/et9/img/WFIXbgwcaocEM7xmC9ZczHK2nId.png)

## 官方运行指南

https://github.com/egametang/ET/blob/release9.0/Book/1.1%E8%BF%90%E8%A1%8C%E6%8C%87%E5%8D%97.md

> 本段内容同步自：[通用 接入](/et9/integration/general)

[B 站视频 BV138y6YDEG6](https://www.bilibili.com/video/BV138y6YDEG6)

![](/images/et9/img/O3Enbp1jhoi0vixMimmcLCEJnzg.png)

![](/images/et9/img/DzBAbt5MHoplO0xDKutckhosnLf.png)

仔细通看一遍 了解大概流程

然后严格仔细执行

## ET运行指南

(请以官方链接为准 不定时同步更新)

1. IDE安装
2. 使用[Rider2024.3](https://www.jetbrains.com/zh-cn/rider/)(更新到最新版)，需要安装以下内容：

   - windows上用visual studio安装最新的.Net8， mac请用homebrew安装.Net8跟powershell
   - 不支持VS，新人用VS搞出各种问题请不要来问我，我也没用过VS，后期搞熟了可以自己改用VS
3. 出现如下报错 [Package Manager Window] Error searching for packages. 不用处理，这是因为github package的注册表跟unity有些不兼容导致的，忽略即可
4. 该分支必须使用Unity6000.0.25(初学者请在此版本用熟后再切换其他版本)
5. 整个过程请开启全局翻墙，否则各种unity包 nuget包下载不下来，报memerypack等错误
6. 启动UnityHub，打开(Open) -> 选中'ET'文件夹所在目录后打开工程，特别注意，ET9的目录结构跟ET8.1完全不同，请全新下载整个工程，不要从老的工程切过来

::: tip 💡
### 以上步骤都还比较简单 注意 一定要下载一个全新的demo 别搞什么在其他分支切换到9什么的 肯定不行的 结构改变太多了
:::

::: tip 💡
### 网络问题
:::

有可能你挂了梯子还是不太好用的情况 请参考以下解决

参考Unity官方QA:

https://docs.unity3d.com/cn/2022.3/Manual/upm-config-network.html

---

1. 打开工程后，点击Unity菜单 -> Edit -> Preferences -> External Tools，点击下拉框'External ScriptEditor'选择Rider，Generate .csproj files for要勾选前两个

![](/images/et9/img/WnZUbumzIoR02qxhtw3c7T6enVg.png)

1. 在你的github中获取token，获取方法：打开 [https://github.com/](https://github.com/settings/tokens)[settings/tokens](https://github.com/settings/tokens) 选择tokens(classic),点击generate new token，下面全部勾选，点击确定，复制你的token保存
2. 打开菜单ET->Init->Manage scope registries, 点击ET-Packages Edit, 把你的github token粘贴到token里面 save，然后再看到User Credentials on this computer点+号， Registry URL填入 [https://npm.pkg.github.com/@ET-Packages](https://npm.pkg.github.com/@ET-Packages) token填入你的github token
always auth 填 true 点击add

![](/images/et9/img/CLFYb9YKEoOdyxxUYl0chRpynRh.png)

::: tip 💡
### Token
:::

这一步也尤为重要 不过也不复杂 至于为什么要填自己的token 会不会有泄密什么的就别担心了

你要实在担心 你自己随便搞个小号去用也可以的 或者用别人的 这个是Github 的需求下载那个包需这样设置

![](/images/et9/img/Rpp6bwWCjojFh0xUqWPcAaejnpd.png)

## 确定上述流程无误后 关闭unity

---

## 手动添加版本

打开最新链接确定当前最新版本号

https://github.com/ET-Packages/cn.etetet.yiuistatesync/pkgs/npm/cn.etetet.yiuistatesync

如: 现在看到的 cn.etetet.yiuistatesync 3.0.2

找到Packages/manifest.json

![](/images/et9/img/U3cQb1W96oZgzoxWg3wcJPO1nTh.png)

编辑第一行加入对应的包名称与版本 保存

![](/images/et9/img/BBZCbrEwgoFX8yx9l3ccpcpPnDf.png)

## 修改完成后启动Unity 会自动下载对应包与依赖包

等待Unity加载完毕完全打开

如果第一次感觉很慢 可以试试强制关闭 在打开试试 有时候有奇效

打开后就会看到很多ET包   右键查看路径

![](/images/et9/img/L2Z1bdTIMoJbvExsiJzcBYSLnad.png)

![](/images/et9/img/WBdnbQHv2osMMdx1AFAcMIkKnzc.png)

确定包存在的路径是  Packages

不能是 Library\PackageCache

### 如果在缓存文件夹

使用此方法 可把包移动到Packages目录

使用按钮后不用管有没有什么报错 直接 CTRL+R 强制刷新一次

再次检查包现在所在目录是不是 Packages

![](/images/et9/img/QMasbLoslo6UdBxGZeTcSZ4Pnyv.png)

如果到这里全部都已经在Packages

那么你已经完成了最难的流程 下载完整的包

1. 如果没有出现日志git Dependencies are all installed / repaire package finish，说明安装不完整，可以重新点击ET->RepairDependencies修复，直到安装成功，这时候仍然有大量报错，暂时不用管

EventSystem, partial

![](/images/et9/img/Noo6bZbyfoP6rlxC2jccbOc8n9g.png)

如果遇到这个问题跳到对应的类 改为部类

1. 安装完成点击Unity菜单，Assets->ReImport All, 这里主要是Unity有bug，有些资源无法显示

- 重启时如果有错误会提示 则点忽略

![](/images/et9/img/TJEYbjqiMou1zrxfp5hcALQxnIh.png)

![](/images/et9/img/KvKcbqu57oKA9ZxirsQc2lIMnhf.png)

1. 使用 客户端+服务器 模式

![](/images/et9/img/WAFBbFTkFo3Piox5mkXc6gXTnVc.png)

![](/images/et9/img/UKNZbTbTOoddlUxWYmWcIGrbnUb.png)

如果当前不是这个模式请切换

名称 = StateSync 如果不是请切换

1.  检查yooasset包 当前是否为编辑器模式

防止有时候默认包的模式是其他的无法运行

![](/images/et9/img/RnkibXKILo3zJ1xLMkCcqWzRnZf.png)

![](/images/et9/img/NuWDbQiujokMObxoCfAcpom1nXc.png)

1. 运行Unity菜单 ET->StateSync->Init或者ET->~~LockStep->Init~~ （这一步会导Excel 导Proto 生成assemlbyreference 添加INITED宏，并且自动链接demo中的ET.sln到根目录）

切换后会看到如下报错 属于正常 完成下一步即可解决

![](/images/et9/img/DkxZbEsNNoelupxhvIDcjaaCnJf.png)

1. 工具栏>> ET / YIUI Demo 打开Demo编辑窗口 点击切换 Demo 则可切换至YIUI可运行Demo切换至YIUIDemo当然你也可以随时选中ET后切换 可以换到之前的官方demo UI方案切换成功提示  如果没有请检查报错信息解决

   1. 看到提示: 切换成功 为止

![](/images/et9/img/T3kpbUAIYoKg8rx1IEVcy74inEn.png)

![](/images/et9/img/RlOob5fRDowQJTxWZQQcOlxwnNc.png)

![](/images/et9/img/V2Avbqn9koVVwVxZxU3cIumznUb.png)

1.  进入到YIUI工具  全局设置  设置自己的用户名  初始化项目

![](/images/et9/img/OjlSbipiIotop9x8nCFcgn8Xn1e.png)

![](/images/et9/img/M9UbbzsJZoV7LQxymIpcOzkgnch.png)

1. 点击Unity菜单 Assets->Open C# Project，这里由于修改了rider插件，会自动打开ET.sln

1. 编译整个ET.sln, 注意要翻墙，否则可能nuget包下载不下来，导致编译出错(翻墙后如果还有报错解决不了可以尝试先用VS打开ET.sln编译一次后再回到Rider重新编译一次)

::: info 📍
编译 编译 编译 IDE里的编译 (构建)    不是Unity里的编译
:::

### TMP

根据需求如果你要看GM命令那些 因为用的都是tmp中文字体所以你需要点一下 设置TMP字体

1. 如果想要好的体验建议这里先安装TMP插件  不然你运行的时候还是会给你弹提示框的

YIUIDemo 工具中 还有一个TMP一键中文设置 建议安装好TMP后点一下

1. ~~Unity中双击Packages/ET.Loader/Scenes/Init场景~~，点击Play(▶)即可运行

上面的切换YIUIDemo 已经把这个场景切换了 直接运行即可

yiuistatesync  里面的  init

---

::: tip 💡
### 帧同步
以下是帧同步相关的运行指南可以无视
:::

1. ~~帧同步默认是一个人匹配，如果需要多人匹配，修改~~**~~LSConstValue.cs~~**~~中的~~**~~MatchCount~~** ~~客户端服务端都要重新编译，都要重启即可~~
2. ~~注意要独立启动服务器，右键UnityHub，以管理员身份运行UnityHub，然后启动Unity（没有管理员启动是不行的，因为服务端要开启http服务，普通权限开不了）， 停止Unity Play，点开Unity菜单->ET->Server Tools->Start Server(Single Process)，这样就单独启动了服务端。打开Unity菜单 -> ET -> BuildTool中CodeMode改成Client，点击Unity Play，登录。~~
~~如果还是连接不上报10037错误，注意看ET/Logs目录，看有没有Error日志。 如果要用rider启动服务器，rider也必须用管理员权限启动 注意一定要用 netsh http delete urlacl 命令删除掉所有自己添加的urlacl，具体使用方法请谷歌 客户端注意要打开cn.etetet.loader/Resources/GlobalConfig, 把CodeMode换成Client~~
3. ~~注意独立运行服务器的目录不再是Bin目录，而是Bin的上一层目录，也就是Unity目录，比如 dotnet.exe Bin/ET.App.dll --Console=1~~
4. ~~有问题请论坛提问，贴出服务端error log跟客户端error log，没有日志无法回复~~

---

::: tip 💡 申明
**YIUIDemo 包中自带了插件**
1. **Odin  只能用于Demo学习测试用 请自行购买使用正版**
2. **Dotween 普通版  需要的自己换Pro版**
:::

### YooAsset

选中上面YIUI   /  ET 然后打开设置 可以得到2个不同的YOO设置 具体不需要了解 这个是我自己用的

至于yooasset为什么要这样设置  怎么设置  请自行了解

---

## 自定义接入YIUI

如果你要自己接不靠Demo一键接入 你得要了解YIUI都有那些不一样与改动才行

重点还是建议参考Demo 然后把不要的删除即可

比如你现在有一个你自己的ET9工程

现在要接入YIUI 又不想要YIUI的Demo

建议流程:

1: 接入YIUIDemo
2: 一键切换

3: 确定自己项目中是否有YIUI依赖的插件 比如 Odin  Dotween

4: 接入完毕后删除不需要的包即可

---

## 相关连接

::: tip 💡
[ET官网](https://github.com/egametang/ET)
:::

::: tip 💡
[ET9运行指南](https://github.com/egametang/ET/blob/release9.0/Book/1.1%E8%BF%90%E8%A1%8C%E6%8C%87%E5%8D%97.md) 请务必仔细 逐条执行
:::

::: tip 💡
YIUIDemo: [GitHub - ET-Packages/cn.etetet.yiuistatesync](https://github.com/ET-Packages/cn.etetet.yiuistatesync)
:::

::: tip 💡
[所有YIUI包](https://github.com/orgs/ET-Packages/repositories?language=&q=yiui&sort=&type=all)
:::

根据需求自行使用  建议都先通过Demo了解

之后根据需求加减

(以后也会随着需求有新包)

![](/images/et9/img/XDGSbAR63oL8hjxjzaEcdSgdnFq.png)

---

## 建议

不要跑通了就开始搞什么服务端分离  打包 热更等等高级操作...

这其中每一项都需要熟悉整体框架 流程 大量相关知识

别还不会跑就想着全都要  如果你只是想测试 那更没必要了

ET这么大个框架难道还能有问题 有问题自然有人去解决 不是你现在需要考虑的

等你把业务开发完了 回头慢慢搞

如果你非要搞又搞不明白 那当我啥也没说  不要把时间浪费在这种事上面

![](/images/et9/img/IR5XbJMfXohqx4xOaJlc0Y3fnGd.png)

![](/images/et9/img/VtGUbos1XoZowqxQpOCcJTrsnmd.png)

![](/images/et9/img/NRoTbi0ofofzyuxNsNJc0jvqnyA.png)
