# InvokeListener 3.0

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
  Invoke 相同Key只允许同时存在一个 
 通过快速监听可实现对任意Invoke事件 前后进行处理 
 
 一般常规功能需求可能都用不上 
 如果需要时就会很方便的功能 
 
 传统做法 
 可以在当前invoke中 直接实现 额外抛消息处理即可 
 但是会 破坏当前方法的具体实现 
 
 比如常见的功能 打点记录 
 最简单的传统做法肯定是到对应的方法里面 加上打点的代码 
 但是这样就破坏了当前方法的实现还要去改别人的代码 
 (这种案例还是很多的就不一一举例了) 
 
 现在可以通过快速监听实现 在其他任意位置 事件触发前后额外处理 
 不破坏原有代码 也 不需要自己额外定义事件 从而达到目的 
 
 使用 
 实现 YIUIListenerInvokeSystem 特性 
 包含优先级 (默认0 在Invoke之后执行) 
 
![Image](/images/XXzrwRGgti52s4kYdqFccswAnXe_1_051f9172.png)
 
 要求 
 ❤️ 监听必须保持一致 
 参数保持一致 
 
 
 案例 
 有个登录方法  我需要在其他地方监听 不改变源码的情况下实现方法的扩展 
 
![Image](/images/XXzrwRGgti52s4kYdqFccswAnXe_2_e45706fa.png)