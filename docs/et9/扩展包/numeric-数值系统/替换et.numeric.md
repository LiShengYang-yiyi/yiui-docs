# 替换ET.Numeric

**URL**: https://ai.feishu.cn/wiki/T3RZwSXxzirMc1kHrcvciozynGg

**Parent**: Numeric 数值系统

**Depth**: 4

---
替换ET.Numeric
输入“/”快速插入内容
替换ET.Numeric
亦亦
全通过后
本包与ET.Numeric 不冲突 相互独立
自行选择一起用还是 只用本包
如果用本包
手动删除本地的ET.Numeric 包中的Scripts内容
然后代码肯定会报错
如果你打算一起用则可以无视下面的内容了
修改方式
有报错的地方一一修改
49%
51%
代码块
C#
float speed = unit.GetComponent&lt;NumericComponent&gt;().GetAsFloat(NumericType.Speed);
float speed = unit.GetComponent&lt;NumericDataComponent&gt;().GetAsFloat(ENumericType.Speed0);
原
改
NumericComponent
NumericDataComponent
NumericType
ENumericType
UnitFactory.cs  修改初始化流程
numericComponent.InitToServer(unitInfo.KV);