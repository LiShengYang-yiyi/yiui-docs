---
title: 替换ET.Numeric
et9: true
---

# 替换ET.Numeric

## 全通过后

本包与ET.Numeric 不冲突 相互独立

自行选择一起用还是 只用本包

如果用本包

手动删除本地的ET.Numeric 包中的Scripts内容

![](/images/et9/img/NiCmbQGjIoIFBWxDyn8cCKTHnIS.png)

然后代码肯定会报错

如果你打算一起用则可以无视下面的内容了

## 修改方式

有报错的地方一一修改

![](/images/et9/img/BCAobQ82MofIekxXVXncGsTunfh.png)

![](/images/et9/img/MIDdbHHikobgZrxX7WxchYNYnOc.png)

![](/images/et9/img/UpQybTBt8o0p5KxD3jmcPagknXE.png)

```C#
float speed = unit.GetComponent<NumericComponent>().GetAsFloat(NumericType.Speed);

float speed = unit.GetComponent<NumericDataComponent>().GetAsFloat(ENumericType.Speed0);

```

| 原 | 改 |
|-|-|
| NumericComponent | NumericDataComponent |
| NumericType | ENumericType |

UnitFactory.cs  修改初始化流程

numericComponent.InitToServer(unitInfo.KV);

![](/images/et9/img/PAk9bzIf9oyr0yxBOLgcCjeOnFe.png)

![](/images/et9/img/W44Kbb5R3om8OHxDJWHcHsSNnHb.png)

Get的地方 使用 Speed0

## 服务器的初始化

![](/images/et9/img/RsZPbR3ztoIVWgxfppccAnbbnug.png)

```C#
NumericComponent numericComponent = unit.AddComponent<NumericDataComponent>();
numericComponent.Set(ENumericType.Speed, 6f); // 速度是6米每秒
numericComponent.Set(ENumericType.AOI, 15000); // 视野15米

改为
var numericComponent = unit.AddComponent<NumericDataComponent>();
numericComponent.Set(ENumericType.Speed1, 6f); // 速度是6米每秒
numericComponent.Set(ENumericType.AOI1, 15f); // 视野15米
```

这里修改了源码  因为这是成长类型 是不能直接set  0 的

这里是服务器demo 初始化数值

以后正式项目  初始化肯定是读取的配置  或者数据库里面拿出来

1. 只能set非0数值 所以这里改为  Speed1, AOI1
2. AOI1的设置不能是 150000 因为他是float类型 只能设置15f  = 15米  (万分比)

## 建议一键替换

![](/images/et9/img/OgVwbSJj5ofvqpxOCh9cIxf3nCe.png)

(NumericType

(ENumericType

![](/images/et9/img/AcRubkKUnoCTdHx12oPcbc6EnXb.png)

## 初始化

UnitFactory.cs

客户端的初始化player的数值  由服务器下发的unitinfo

unitinfo.kv 这个是 服务器下发的就是全数据 包括 0-6 如果直接设置肯定会报不允许修改最终数据

假设1-6 都有数据  那你每次设置都会触发一次 计算0 结果 所以初始化有专门的API 优化

![](/images/et9/img/Qzexb4qQdoGhHlxzyEDceF7snrc.png)

numericComponent.InitToServer(unitInfo.KV);

使用InitToServer替代

![](/images/et9/img/GoDKbXPNSowpUoxQQk0cpHljnde.png)

如果没有报错了 担心哪里是不是少改了 不用担心  Set错误  Init错误都会直接报错有检查提示的

![](/images/et9/img/DloUb6TM0ol7bKxAO0bcdNmVnkf.png)
