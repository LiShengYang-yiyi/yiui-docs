# Xlsx 导入数据

 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_1_c87c5be1.png)
 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_2_417c0c94.png)
 
 重复检查 
 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_3_af0fe9ff.png)
 47% 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_4_baa151a6.png)
 53% 
 默认填写与检查 
 语言很多的时候可能会遇到没有填内容的情况 
 这里会默认使用指定语言  比如 默认中文  如果 有日文但是没有填 会默认日文这里填上中文 
 如果中文也没有填会找其他有值的比如英文 
 如果全部都没有填则会报错 
 为什么要自动填充 
 因为不填 切换语言时可能导致报错 
 所以开发期间自动填充  如果想强制比如填 也可以小改源码实现 
 扩展可选参数 
 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_5_763db430.png)
 自动填充 & 自动填充的加填充 
 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_6_27e7ba80.png)
 如果空则报错 
 
![Image](/images/DD1Twex5MiVYtokf9kEcdJsgn6b_7_7e29d680.png)
 
 配合Luban 检查Key 是否存在 
 防止其他配置多语言的地方 配错Key 
 这个key 在运行时其实是用不到的 那么会额外增加配置大小 
 所以在这里测试了一下 
 
 1000条数据测试 
 Key 长度 15 - 20 个字符串 
 源文件Json 大约30KB