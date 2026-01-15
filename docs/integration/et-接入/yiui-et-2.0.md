# YIUI-ET 2.0

# YIUI-ET 2.0

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 以此为分界线区分YIUI ET版本 
 
 YIUIRoot 
 新增了逻辑层root节点 
 在此之前 所有Panel的打开都是在YIUIMgr这个逻辑节点下 
 目前打开UI必须使用yiuiroot中提供的方法打开 
 则目标会打开在目标root下 
 所以可以把root挂在不同的场景中  跟随目标场景生命周期 
 
 (这个root是给panel用的 并不是任何ui都需要这个root) 
 (从逻辑上讲任何entity都可以作为YIUI对象的父级) 
 (比如一个角色的血条 你可以使用YIUIFactory 直接把对应UI初始化在角色下 角色被摧毁时 UI也会自动移除 等等) 
 
 
 以RedDotPanel为案例 
 如果使用YIUIMgr为root 那么这个UI将会打开在Client场景下 
 
![Image](/images/DlCmwm5cRiAL2bk9ucXcy8l8naf_1_ec93f909.png)
 
![Image](/images/DlCmwm5cRiAL2bk9ucXcy8l8naf_2_6cafb67e.png)
 
 
 如果使用CurrentScene打开UI 则逻辑层中UI是挂在目标场景下 
 
![Image](/images/DlCmwm5cRiAL2bk9ucXcy8l8naf_3_d5553b2b.png)
 
![Image](/images/DlCmwm5cRiAL2bk9ucXcy8l8naf_4_53207650.png)
 
 支持切换父级 比如先用Aroot打开 没有关闭的情况下 又用Broot打开 则会修改父级 
 
 为什么需要Root 有什么好处 
 
 1. Panel有了跟随目标场景的生命周期 
 比如独立的战斗UI  关闭战斗时 只需要摧毁对应的scene 
 其他的UI 也就跟随关闭了  更加契合ET的设计 
 
 2. 消息的定位发送 
 比如战斗时 我只是想吧一个UI消息发给战斗UI