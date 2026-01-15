# Panel预加载

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
  针对超大型预制,需要提前加载 
 就算有异步加载还是会有延迟情况的 
 需要无延迟打开的时候使用 
 
 预加载只针对多有Panel界面 
 也就是可以通过OpenPanel / xxOpen 结尾的界面才能使用 
 其他View... 自行处理 
 
 API 
 代码块 
 public static async ETTask&lt;bool&gt; PreLoadPanelAsync&lt;T&gt;(this YIUIRootComponent self, bool loadEntity = true) 
 where T : Entity, IAwake, IYIUIOpen 
 { 
 return await self.YIUIMgr.PreLoadPanelAsync&lt;T&gt;(self, loadEntity); 
 } 
 
 public static async ETTask&lt;bool&gt; PreLoadPanelAsync(this YIUIRootComponent self, string panelName, bool loadEntity = true) 
 { 
 return await self.YIUIMgr.PreLoadPanelAsync(panelName, self, loadEntity); 
 } 
 
 
 预加载分2种情况 
 
 loadEntity = true 
 代表全量加载UI 包括实例化Entity对象 
 案例: 
 
![Image](/images/U45rwIkdZizFArkM19qcLx8KnGd_1_b2781d2c.png)
 59% 
![Image](/images/U45rwIkdZizFArkM19qcLx8KnGd_2_bfaebebd.png)
 41% 
 预加载包括实例化时 会有预加载消息 
 IYIUIPreLoad, IYIUIPreLoadSystem 
 使用方式与其他生命周期相同 
 只预加载预制体不会有消息 如果需要可自行实现 
 
 
 loadEntity = false 
 代表只加载UI 不实例化Entity对象 
 案例: 
 
![Image](/images/U45rwIkdZizFArkM19qcLx8KnGd_3_2b53bd9e.png)
 61% 
![Image](/images/U45rwIkdZizFArkM19qcLx8KnGd_4_1a79d59e.png)
 39%