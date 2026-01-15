# 取消YIUIMgrComponent.Inst

 
这个组件本质就是所有UI的管理器 
 以前的Inst 是为了快捷访问 但是他是一个单例始终会存在隐患 
 特别是有人跨纤程访问 为了防止出现这个问题 
 以前的Inst 当你在其他fiber的时候 也是可以访问到的 
 但是改成这样了过后 访问是一定会报错的 还是有区别的 
 所以取消了Inst 使用其他方式访问 
 
 访问 YIUIMgrComponent.Inst 本质是想快捷拿到这个组件 
 所以修改方案通过扩展快捷还是快捷拿到这个组件 
 
 已知这个组件在客户端根目录下 
 所以提供扩展方法 
 通过任意Entity 都可以直接访问到 
 你要说本质有什么区别 从结果来讲是没有任何区别的 
 如果跨纤程有人就是要  entity.YIUIMgr 他还是会错这个是没有办法避免的 
 另外就是有人问访问效率问题 之前是单例存起来的 理论上这个是UI 全程也不可能销毁 
 现在每次使用都要去访问一次有没有消耗 
 消耗是有的 但是UI的访问频率以及本身这个访问就没什么大消耗 
 又不是极限的1帧内多次且频繁的访问 所以这个消耗忽略不计 
 至于到底这个更改有没有必要就仁者见仁智者见智了  根据自身需求更新 
 
 本次取消的单例包含 
 YIUIMgrComponent 
 YIUILoadComponent 
 CountDownMgr 
 
 同样也做了对应扩展 
 YIUIMgr = 管理器本身 
 YIUIRoot = 根场景的Root节点 
 YIUISceneRoot = 当前场景的Root节点 
 
![Image](/images/EP2iwlgski3WblktFp7coei3nLg_1_2bde20ce.png)
 40% 
![Image](/images/EP2iwlgski3WblktFp7coei3nLg_2_cfa426e4.png)
 
![Image](/images/EP2iwlgski3WblktFp7coei3nLg_3_4a453da4.png)
 60% YIUIMgrComponent.Inst.Root = self.YIUIRoot() 
 YIUIMgrComponent.Inst = self.YIUIMgr() 
 YIUILoadComponent.Inst = self.YIUILoad() 
 YIUICountDownMgr.Inst = self.YIUICountDown() 
 
 
 升级思路 
 建议直接全局替换 然后在根据方法一个一个修改