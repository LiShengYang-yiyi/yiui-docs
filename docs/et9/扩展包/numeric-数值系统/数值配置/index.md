# 数值配置

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
  最大的考虑分离设计 
 
 所以数值系统的包分了2个 
 一个原始包  cn.etetet.yiuinumeric 
 一个配置包  cn.etetet.yiuinumericconfig 
 
 配置包的更新频率绝对远低于主包 
 更新上也会更多的考虑兼容问题尽可能的不更新配置包 
 但是无法保证一定不更新 
 虽然无法达到完美 
 至少可以减少部分操作 
 
 自动生成 
 配置包由原始包提供的方法 
 
![Image](/images/Sx86wDViniKzzVkhlUOc2s0VnEh_1_4ee9407d.png)
 
![Image](/images/Sx86wDViniKzzVkhlUOc2s0VnEh_2_0ae8c98c.png)
 会自动生成包 
 
![Image](/images/Sx86wDViniKzzVkhlUOc2s0VnEh_3_5d17b66d.png)
 这个包由本地管理  这样你自己扩展配置里的数值 增加配置都可以 
 代码扩展请参考ET的官方方案  自己建个包引用相同DLL 然后使用扩展方法 扩展代码 
 
 版本不一致时 
 2个包中都有一个configversions 
 以本包为准  当本包与配置包版本ID对不上的时候就会有提示 
 这个时候你需要先备份现在的包 
 重新点上面的按钮 覆盖配置包 
 最后根据实际更新内容 调整你的配置 
 
 更新日志 先看更新日志 看为什么改动配置包 
 如果只是一些其他改动就可以把备份的直接拷贝回来就可以用了 
 如果有改动也会详细教学 怎么修改配置