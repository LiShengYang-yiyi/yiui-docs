# Demo

# Demo

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 
![Image](/images/CRLfwOdrSi8zQWkQjjScZu01n6b_1_c41cb128.png)
 创建与删除 
 
![Image](/images/CRLfwOdrSi8zQWkQjjScZu01n6b_2_65523ed4.png)
 50% 
![Image](/images/CRLfwOdrSi8zQWkQjjScZu01n6b_3_0ef5e679.png)
 50% 
 根据需求 安装Demo包  看完不需要就可以删除了 
 
 
 GM的监听案例 
 代码块 
 namespace ET 
 { 
 /// &lt;summary&gt; 
 /// GM命令监听 
 /// 服务器的修改也可以响应 测试用 
 /// &lt;/summary&gt; 
 [Event(SceneType.All)] 
 public partial class NumericGMChangeEvent : AEvent<Scene, NumericGMChange> 
 { 
 protected override async ETTask Run(Scene scene, NumericGMChange args) 
 { 
 if (args.OwnerEntity == null || args.OwnerEntity.IsDisposed) 
 { 
 Log.Info($"NumericGMChange: 无目标 或已摧毁"); 
 return; 
 } 
 
 /* 
 这里只是演示 使用的强制修改数值 实际使用时需要根据实际情况修改 
 比如:  GM命令 通知修改 客户端发一个对应的修改协议到服务器 服务器收到协议后修改数值 
 服务器修改过后 正式流程中的数值同步来更新客户端  而不是自己更新自己 
 等等... 
 */ 
 
 if (args.OwnerEntity is NumericComponent numericComponent) 
 { 
 numericComponent.Set(args.NumericType, args.New); 
 } 
 else 
 { 
 Log.Error($"NumericGMChange: 消息错误 OwnerEntity != NumericComponent {args.OwnerEntity.GetType()}"); 
 } 
 
 await ETTask.CompletedTask; 
 } 
 } 
 }