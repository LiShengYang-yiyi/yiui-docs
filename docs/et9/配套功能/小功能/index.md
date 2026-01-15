# 小功能

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
  0.6.0 
 
 GM 
 1. GM命令添加常量 快捷打开按键设置 
 None 可以关闭快捷键 
 (这里只是切换快速响应的快捷键 并不是关闭GM) 
 
![Image](/images/O3uSww0f2iOqtBk4BqIcJ9OjnJf_1_cc7e3ee9.png)
 2. 会保存上一次选的页签 下次重开会选上一次的页签 
 
 3. 彻底关闭GM功能 
 
![Image](/images/O3uSww0f2iOqtBk4BqIcJ9OjnJf_2_62d651d2.png)
 启动时会 添加 GMCommandComponent  内部会启动GM功能 
 如果不想要这个GM功能 根据需求 可注释 可根据不同环境,情况 添加 等操作 
 
 4. 新增配置关闭GM功能 
 
![Image](/images/O3uSww0f2iOqtBk4BqIcJ9OjnJf_3_bdd18d81.png)
 
![Image](/images/O3uSww0f2iOqtBk4BqIcJ9OjnJf_4_8ba46832.png)
 这样就有2种判断 
 通过常规的可关闭, 也可以根据需求增加2级判断 
 
 这样就方便每个人本地修改,不用改代码 
 
 公共关闭UI组件 
 同时也作为公共组件案例 
 
 问题! 
 不管是Panel 还是 View  都会涉及到关闭操作 
 那是不是每个对应的都需要定义一个close事件? 
 然后对应close方法还要写 xx.close 
 大多数情况下都没有额外操作 就是单纯的关闭