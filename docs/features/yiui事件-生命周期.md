# YIUI事件 生命周期

# YIUI事件 生命周期

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 
![Image](/images/GQb8wtMiYibrxaklR9ic6RHUnUe_1_132cc8ba.png)
 Invoke 
 所有的Invoke事件 
 
![Image](/images/GQb8wtMiYibrxaklR9ic6RHUnUe_2_0a728904.png)
 
 详细的内容 自行了解  多数都是框架内部使用消息 
 Publish 
 所有的Publish事件 
 
![Image](/images/GQb8wtMiYibrxaklR9ic6RHUnUe_3_5e0825f4.png)
 
 初始化 
 YIUIEventInitializeAfter 
 代码块 
 
 public static async ETTask&lt;bool&gt; Initialize(this YIUIMgrComponent self) 
 { 
 ... 
 
 //其他模块各自初始化 
 await EventSystem.Instance.PublishAsync(self.Scene(), new YIUIEventInitializeAfter()); 
 } 
 
 
 //YIUI初始化过后的事件 其他模块各自初始化 
 public struct YIUIEventInitializeAfter 
 { 
 //ET9 拆分模块后将会有统一发出此消息 
 //各自模块自己监听 初始化自己 
 } 
 
 //案例 比如GM模块 
 [Event(SceneType.All)] 
 public class YIUIEventInitializeAfterGMHandler : AEvent<Scene, YIUIEventInitializeAfter> 
 { 
 protected override async ETTask Run(Scene scene, YIUIEventInitializeAfter arg) 
 { 
 //根据需求自行处理 在editor下自动打开  也可以根据各种外围配置 或者 GM等级打开 
 //if (Define.IsEditor) //这里默认都打开 
 { 
 scene.AddComponent&lt;GMCommandComponent&gt;(); 
 } 
 
 await ETTask.CompletedTask; 
 } 
 }