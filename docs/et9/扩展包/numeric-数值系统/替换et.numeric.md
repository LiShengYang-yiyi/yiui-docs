# 替换ET.Numeric

 
本包与ET.Numeric 不冲突 相互独立 
 自行选择一起用还是 只用本包 
 如果用本包 
 手动删除本地的ET.Numeric 包中的Scripts内容 
 
![Image](/images/T3RZwSXxzirMc1kHrcvciozynGg_1_ad22b4ba.png)
 然后代码肯定会报错 
 
 如果你打算一起用则可以无视下面的内容了 
 
 修改方式 
 
 有报错的地方一一修改 
 
![Image](/images/T3RZwSXxzirMc1kHrcvciozynGg_2_92b8507e.png)
 
 
![Image](/images/T3RZwSXxzirMc1kHrcvciozynGg_3_a0b39ac9.png)
 49% 
![Image](/images/T3RZwSXxzirMc1kHrcvciozynGg_4_b84cd3f1.png)
 51% 
 代码块 
 float speed = unit.GetComponent&lt;NumericComponent&gt;().GetAsFloat(NumericType.Speed); 
 
 float speed = unit.GetComponent&lt;NumericDataComponent&gt;().GetAsFloat(ENumericType.Speed0); 
 
 
| 原
 | 改
 |
| --- | --- |
| NumericComponent
 | NumericDataComponent
 |
| NumericType
 | ENumericType
 |
 UnitFactory.cs  修改初始化流程 
 numericComponent.InitToServer(unitInfo.KV); 
 
![Image](/images/T3RZwSXxzirMc1kHrcvciozynGg_5_8e90266a.png)