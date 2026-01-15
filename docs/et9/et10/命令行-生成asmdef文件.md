# 命令行 生成asmdef文件 

# 命令行 生成asmdef文件

 
根据运行指南 
 编译ET.CodeMode工程，然后在命令行执行dotnet ./Bin/ET.CodeMode.dll,这样会生成asmdef文件 
 
 因为各种原因可能出现包的asmdef文件错误 导致的编译问题 
 本身是在Unity上有按钮解决的 但是因为报错这个按钮出不来 这不就死循环了 
 新解决方案 
 
 1. 编译ET.CodeMode工程 
 
![Image](/images/OgKywVZoaiZBpjkUeGvc62z1npe_1_44fd5fc2.png)
 
 2. 运行命令 
 打开Rider编辑里面就有的命令行 输入 dotnet ./Bin/ET.CodeMode.dll 
 
![Image](/images/OgKywVZoaiZBpjkUeGvc62z1npe_2_4ac4f06e.png)
 
 3. 编译完成 回到Unity 刷新Ctrl+R 
 
![Image](/images/OgKywVZoaiZBpjkUeGvc62z1npe_3_d3731250.png)