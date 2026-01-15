# YIUI包内的代码无法修改 无引用 等问题

 
![Image](/images/TYCwwGQcvi2HoHkZN5acKSthnIU_1_61fd1ef9.png)
 
 1. 看一下YIUI的包在那个目录 
 Packages 目录下 才是可修改的 
 Library\PackageCache 这个目录下是只读的 
 
 2. ET工程 看下有没有加入yiui相关包的DLL 
 
![Image](/images/TYCwwGQcvi2HoHkZN5acKSthnIU_2_7695ab13.png)