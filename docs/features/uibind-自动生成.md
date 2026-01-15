# UIBind 自动生成

# UIBind 自动生成

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 
 将改变打包流程 
 取消反射 取消反射替代 方案由SG 自动生成 
 
![Image](/images/AFj9w2gtriFXVZk8igEc7SMBnff_1_f4f8c90d.png)
 
 实装 
 ET 8.1 
 ET 9.0 
 ET 7.2 
 通用  无此功能 
 
 
 实装后 流程变化 
 1. 将取消 生成替代反射代码功能 
 以后不用点一下了相当于已经实时动态生成了 功能其实还是一样的 
 
![Image](/images/AFj9w2gtriFXVZk8igEc7SMBnff_2_b7bb7ee0.png)
 
 2. YIUIBindHelper 
 将直接使用SG生成的数据作为源数据 
 不用考虑ET什么版本 DLL名称不一样导致拿不到数据等等操作 
 
 YIUIBind 这个文档中的内容都可以无视了 
 
 3. 发布流程 
 不需要发布了 
 打包发布 可无视 
 
 4. 会提示脚本重复 YIUIBindProvider 
 手动删除本地之前的脚本  使用自动生成的脚本 
 
 相关联方案将被弃用 
 
 弃用 
 
 独立SGDLL 
 独立SGDLL 
 优点 
 防止ET官方改SG带来的影响 
 因为独立所以不需要出对应的文档说明 免得错了不知道怎么改 
 缺点 
 因为需要提前编译DLL 如果你没有源码或者不会改源码的情况下 
 那么你就不能改这个生成器依赖的部分