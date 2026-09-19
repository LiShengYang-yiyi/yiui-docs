---
title: 更新日志
et9: true
---

# 更新日志

## 4.1.0

动态监听 精准响应重构 **注意不兼容之前的代码 API级别重构**

## 4.0.0

[数值公式](/et9/packages/numeric/formula)

[数值重置+数值影响案例](/et9/packages/numeric/limit/reset-and-effect)

## 3.3.0

数值影响没有同步最终值的问题

GM面板还是显示通用的名称不需要取多语言名称

报错日志显示堆栈信息

## 3.2.1

前面一个消息可能吧对象摧毁的问题

(增加释放判断)

## 3.2.0

抛消息 数值错误的问题 应该使用被限制后的值

## 3.1.0

多表合一功能

可以读取其他包的NumericType / NumericValueAffect

任意包 cn.etetet.\**/Assets/Editor/Luban/Other/* \*  就可以被读取到

![](/images/et9/img/HGDZba7QqoPZ9ixxm5Rc5KpfnPf.png)

最后会整合到一起

移动多语言位置 因为服务器在Unity独立运行时也需要

新增一个无的数值枚举值

新增可获取真实数值值的API

## 3.0.0

[数值影响](/et9/packages/numeric/effect)

---

## 2.0.0

增加新功能 [数值限制](/et9/packages/numeric/limit/)

注意增加了对应的新配置 修改了导出规则

### 1 type表增加

![](/images/et9/img/ZSjWbvz2foo0gQxFcKtc5mOBn8c.png)

新增2个配置

是否存数据库 与 广播类型

目前没有代码使用这2个地方

这2个配置为功能扩展 需要的就用不需要的可以不要 按需更新

### 2 数值限制

具体看文档 怎么使用 [数值限制](/et9/packages/numeric/limit/)

---

## 1.1.0

修复BUG: 多数值相加后owner丢失 导致消息发送失败的问题

---

无 0.1.0版本发布
