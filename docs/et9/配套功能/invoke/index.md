# Invoke

 
[YIUIInvoke] 
 特性 
 在任意类的System中标记静态方法则可生成对应的System类 
 
 要求 
 必须是Entity的System类中 
 这个类必须是部类 partial 
 
![Image](/images/TpyYwbWIUizhfKkcubocTZgInse_1_ed17c38e.png)
 
 案例 
 总结: 支持最多5个参数 1个返回值 的任意System的任意方法 
 代码块 
 //无返回值 无参数 
 [YIUIInvoke] 
 private static void OpenGMView(this GMPanelComponent self) 
 { 
 } 
 
 //无返回值 有参数 
 [YIUIInvoke] 
 private static void OpenGMView2(this GMPanelComponent self,bool a) 
 { 
 } 
 
 //有返回值 无参数 
 [YIUIInvoke] 
 private static bool OpenGMView3(this GMPanelComponent self) 
 { 
 return true; 
 } 
 
 //有返回值 有参数 
 [YIUIInvoke] 
 private static int OpenGMView4(this GMPanelComponent self, bool a) 
 { 
 return 1; 
 } 
 
 //异步 无返回值 无参数 
 [YIUIInvoke] 
 private static async ETTask CloseGMView(this GMPanelComponent self) 
 { 
 await ETTask.CompletedTask; 
 } 
 
 //异步 有返回值 无参数 
 [YIUIInvoke] 
 private static async ETTask&lt;bool&gt; CloseGMView2(this GMPanelComponent self) 
 { 
 await ETTask.CompletedTask; 
 return true; 
 } 
 
 //异步 无返回值 有参数 
 [YIUIInvoke] 
 private static async ETTask CloseGMView3(this GMPanelComponent self,string a) 
 { 
 await ETTask.CompletedTask; 
 } 
 
 //异步 有返回值 有参数 
 [YIUIInvoke] 
 private static async ETTask&lt;bool&gt; CloseGMView4(this GMPanelComponent self, int a) 
 { 
 await ETTask.CompletedTask; 
 return true; 
 }