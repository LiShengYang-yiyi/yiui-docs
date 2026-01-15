# NINO 序列化

# NINO 序列化

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 ET9 Package包 
 已加入ET9包 使用ET9的可以直接下载 
 也可以自行根据官网提示下载 
 cn.etetet.yiuinino 
 
 需求 
 本人的技能系统需要一个高效稳定的序列化工具 
 需要支持继承,泛型,多态 复杂的数据结构 
 目前遇到一个极为严重的问题 MemoryPack 在32位手机会出现序列化崩溃的问题 
 因为: MemoryPack不支持32位 
 无奈本人对这个并不擅长也没办法修改源码来解决 只能另寻他法 
 
![Image](/images/ODrzwSmz9iFBxokJefgc5p4PnAb_1_a47a6c4a.png)
 
 在TOP 100机型中 有 6款32位手机 
 目标测试区 有 15%的32位手机 
 国内要找32位手机可能是很少了 不过海外量还是很大的 
 所以这个32位支持是很有必要的 具体还是要看各位的需求了 
 
 推荐 
 [https://github.com/JasonXuDeveloper/Nino](https://github.com/JasonXuDeveloper/Nino) 
 中文文档: [https://nino.xgamedev.net/zh/doc/start](https://nino.xgamedev.net/zh/doc/start) 
 英文文档: [https://nino.xgamedev.net/en/doc/start](https://nino.xgamedev.net/en/doc/start) 
 个人一句话总结:支持32位,效率吊打MP等一众序列化,使用简单 
 
 🍰 本人项目已亲测32位真机通过 
 效率,使用体验,均高于MemoryPack 
 
 强烈推荐 
 (官方效率对比) [https://nino.xgamedev.net/zh/perf/micro](https://nino.xgamedev.net/zh/perf/micro) 
 
![Image](/images/ODrzwSmz9iFBxokJefgc5p4PnAb_2_3d223266.png)
 50% 
![Image](/images/ODrzwSmz9iFBxokJefgc5p4PnAb_3_ba424919.png)
 50% 
![Image](/images/ODrzwSmz9iFBxokJefgc5p4PnAb_4_d378908f.png)
 50% 
![Image](/images/ODrzwSmz9iFBxokJefgc5p4PnAb_5_d90f7c81.png)
 50% 
 本人项目数据对比 
 不用官方数据 用自己的真实数据对比说话 
 在原有用MemoryPack开的新分支使用Nino进行对比 
 除了序列化工具不同其他都相同 
 序列化源数据相同,对导出的持久化数据,运行时反序列化进行对比