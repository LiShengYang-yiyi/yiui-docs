# YIUI事件分析器

# YIUI事件分析器

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 0.7.0+版本 
 
 ❤️ 有YIUI相关事件接口 
 但是System未实现时报错提示 
 
![Image](/images/XA97wMAzgiWTVHkeVGHc8AMmnSh_1_12954bc5.png)
 可Alt + Enter 使用自动生成相关System 
 
![Image](/images/XA97wMAzgiWTVHkeVGHc8AMmnSh_2_52d84304.png)
 自动生成演示 
 
![Image](/images/XA97wMAzgiWTVHkeVGHc8AMmnSh_3_7299dcb7.gif)
 
 注意DLL的meta文件需要分析器标签 
 需要为其设置 RoslynAnalyzer 标签。这个标签的作用是告诉 Unity 编译系统， 
 该 DLL 文件是一个 Roslyn 分析器或源代码生成器 
 
![Image](/images/XA97wMAzgiWTVHkeVGHc8AMmnSh_4_da9490f9.png)
 其他人自己接的自动生成的meta文件是没有这个的 所以需要手动调整 
 或者直接拷贝YIUI的分析器meta文件