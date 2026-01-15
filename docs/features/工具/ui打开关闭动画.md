# UI打开关闭动画

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
  
 
 打开关闭动画 适用于 Panel / View 
 
 通用版 
 
 不管是BasePanel 还是 BaseView 
 都可以重写这个方法 则可实现自己的动画逻辑 
 代码块 
 protected override async UniTask OnOpenTween() 
 { 
 
 } 
 
 protected override async UniTask OnCloseTween() 
 { 
 
 } 
 
 protected override void OnOpenTweenStart() 
 { 
 
 } 
 
 protected override void OnOpenTweenEnd() 
 { 
 
 } 
 
 protected override void OnCloseTweenStart() 
 { 
 
 } 
 
 protected override void OnCloseTweenEnd() 
 { 
 
 } 
 
 
 ET 
 
 YIUI事件 
 IYIUIOpenTween 
 IYIUICloseTween 
 实现对应事件即可