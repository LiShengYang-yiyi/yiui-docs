---
title: 配置
et9: true
---

# 配置

![](/images/et9/img/TeDJbWC8uogtsKxOOELcjZeznCe.png)

## 枚举

![](/images/et9/img/VWrxb389LonNV2x4gINcJjDlnlf.png)

### ECompareType

比较类型

条件系统中的基础类型

### EOperatorType

运算符类型

条件系统中的基础类型

### EConditionType

条件类型

由自己根据需求扩展

每个枚举代表一个条件类型

## EConditionId

根据需求扩展

## EConditionGroupId

根据需求扩展

## Condition

条件基础配置

单一条件配置

![](/images/et9/img/IeqobZnpcoM5J5xHO6XcipFMnhf.png)

### ID

单一ID 判断时 可快捷传入ID直接判断条件是否满足 枚举扩展

### 类型

由枚举表申明

### 条件可以被监听

可被监听标识

否则这个条件只能主动判断 不能使用监听回调

### 比较类型

使用枚举表中的类型

### 动态条件

比如有一个条件是判断角色等级 >= 10级 如果写死可以算静态条件

但是这种判断必然很多 如果角色有1000级难道配1000个条件吗

所以这里动态条件就表示配置时不会直接配置判断值

需要外部判断时传入

### 判断值

由Luban 抽象实现 根据自己的需求定制

![](/images/et9/img/XBpIbPeS6oVYbjxwabGctjWDnpe.png)

根据自己的判断条件需要多少个参数而定

比如判断一个角色的等级 一般来说就一个判断值 就是等级是多少

### 提示

String.Format的填充值

可配合多语言使用

经常会遇到一种需求 进入某个关卡需要100点战斗力

如果玩家战斗力不足 那么需要点击时提示 或者直接就在UI上展示

在这里判断条件是100战力

想显示的提示是  需要满足100战力

则配置: 需要满足{0}战力

在条件特性时使用String.Format填充返回即可

## 扩展

除了上述的配置 你还可以根据需求自行扩展其他

## ConditionGroup

条件组配置

需要同时判断多条件时

![](/images/et9/img/PaDwbOYTkovROAxsVg7cbbbEnBd.png)

### ID

组ID 判断时 可快捷传入ID直接判断条件是否满足 枚举扩展

### 是否使用组判断

true = value里面的值代表的是 condition里面的ID  false = baseCondition里面的ID

### 与或类型

组内的单条条件之间的关系

如果你想  A & B | C  可以考虑多组配合

### 判断值

![](/images/et9/img/JqlkbcRGAoe7Z3x6A3lc0YLanxg.png)

#### 根据自己的需求 抽象实现
