# 图集

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
  图集怎么加载的 怎么打包的 等等问题... 
 图片在不同平台下的压缩格式 不够清晰 等等... 
 你要来问我 我也只能让你百度,AI... 
 
 不了解的情况下可以考虑不用图集 无非就是 Draw Call高 内存大而已... 
 
 
 
 文件夹结构 
 
![Image](/images/LDFqwjaljiMSg3kh3rVcSyesn0f_1_475a4dc4.png)
 每一个YIUI模块都会生成这样的文件夹结构 
 其中 Sprites 文件夹对应精灵文件夹  也就是放所有图片文件的 
 
 文件夹规则 
 生成图集 
 AtlasX  => 代表图集名称 名称可以任意命名 并没有特殊要求 
 
![Image](/images/LDFqwjaljiMSg3kh3rVcSyesn0f_2_c2a7a8e9.png)
 最后生成时就会以文件夹名称生成对应的图集 
 
 忽略图集 
 AtlasIgnore 
 此名称代表 忽略图集 这个文件夹下的所有图片不会打图集 
 
 图集设置 
 在YIUI工具中 全局设置包涵了 全局图集设置 
 Unity顶部菜单栏 >> Tools >> YIUI自动化工具 >> 全局设置 
 
![Image](/images/LDFqwjaljiMSg3kh3rVcSyesn0f_3_93c0539d.png)