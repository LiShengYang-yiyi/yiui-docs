# Model/Hotfix, NoEngine 问题

 
![Image](/images/KXPtwUvgQi5kKpkMXxjcexNCnsb_1_9fe7cfe5.png)
 
 在ET默认设置中  这里是√上的 也就是 在Model/Hotfix 下是不允许有UnityAPI的 
 这些表现层的东西不都应该在ModelView 上面操作吗 
 但是在实际开发中可能就是需要 
 所以这里需要取舍一下 
 
 如果关闭这个 你写了对应Unity的API  服务器会报错 如果是Share下的公共代码 
 处理办法就是用宏  UNITY 
 这样共用代码就不会报错了 
 
 虽然开放了 还是要有限制 不能滥用 
 建议只少数 底层 工具层面的使用 
 该做在表现层的还是要在表现层 
 
 根据实际需求选择 
 如果关闭 那就要吧规范定制好别滥用 
 如果开启 对应报错的地方注释就好了