# Panel下的View如何打开另外一个View

 
![Image](/images/Jr2Wwj5IZiogVhkLVzlcmf6Wnac_1_0b804e29.png)
 结构 
 这里有一个Panel  然后有多个view 
 
 问题 
 先打开了其中一个view  如何 在view 内部让panel 打开另外一个view 
 为什么会有这个问题 因为view没有panel的实例 所以调用不到panel.openview方法 
 
 方案一 
 (不建议) 
 如果你确定你的view不存在其他任何地方使用 强关联此Panel 
 你可以强行拿到Panel实例 
 
![Image](/images/Jr2Wwj5IZiogVhkLVzlcmf6Wnac_2_b5d5d3f5.png)
 熟悉YIUI结构 所以view的2次parent就是panel的实例 
 但是不是PanelComponent  这个只是DemoPanel 
 所以你需要3层拿到最高级的 
 ET9中为了这个特意扩展了快捷方法 但是不推荐使用 只是想告诉你有这么个方式 
 (其他版本请抄下面自己实现) 
 代码块 
 //标准view(Panel下的view)(非独立View) 
 //可快捷获取panel实例 (不推荐使用)!!! 
 //这里只是告诉你有这么个方式 
 public static T GetPanel&lt;T&gt;(this YIUIViewComponent self) where T : IYIUIOpen 
 { 
 if (self?.Parent?.Parent is T panel) 
 { 
 return panel; 
 } 
 
 Log.Error($"获取失败 {self.GetType().Name} 没有找到父级 {typeof(T).Name} 请检查结构"); 
 return default; 
 } 
 
 //同上 需要标准View 
 //这里拿到的不是panel 而是panel同级的YIUIPanelComponent 
 public static YIUIPanelComponent GetPanelComponent(this YIUIViewComponent self) 
 { 
 if (self?.Parent?.Parent?.Parent is YIUIChild uiBase) 
 { 
 return uiBase.GetComponent&lt;YIUIPanelComponent&gt;(); 
 } 
 
 Log.Error($"获取失败 {self.GetType().Name} 没有找到 YIUIPanelComponent 请检查结构"); 
 return default; 
 }