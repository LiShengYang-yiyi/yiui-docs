# UniTask DOTweenAsyncExtensions

 
ET中有自带的ETTask异步方案 
 
 其中Dotween 插件的动画也可以被异步 所以框架中有用到 
 UniTask本身也是支持Dotween的 但是需要手动开启 
 
 原生插件是自带扩展的 但是需要手动开启后才能使用 
 
![Image](/images/YX8nwAsRtiVD7ck6Y97cVz46njg_1_f6148137.png)
 方法一: 
 添加宏  UNITASK_DOTWEEN_SUPPORT 
 因为这个自带的扩展是用宏限制的 要打开需要自己手动添加这个宏 
 
![Image](/images/YX8nwAsRtiVD7ck6Y97cVz46njg_2_bb849fe4.png)
 
 方法二: 
 如果觉得宏添加麻烦 可以直接改这个源码 吧宏限制直接删除了 
 或者在宏上面添加 #define UNITASK_DOTWEEN_SUPPORT 
 
![Image](/images/YX8nwAsRtiVD7ck6Y97cVz46njg_3_e253c697.png)