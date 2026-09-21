---
title: 表定义与新增表
---

# 表定义与新增表

> 一张表由两份东西组成：结构定义（枚举 / bean / table）与数据文件。定义放各包的 `Defines/`，数据放各包的 `Datas/`。

**关键词**：module · enum · bean · table · Defines · Datas · ref · group · partial EndInit

## 1 一份完整定义

```xml
<module name="cn.etetet.map">
    <enum name="CopyType" comment="副本类型">
        <var name="Normal" value="1" alias="普通地图"/>
    </enum>
    <bean name="MapConfig" comment="地图配置">
        <var name="id" type="int" comment="Id"/>
        <var name="copy_type" type="CopyType" comment="副本类型"/>
        <var name="max_line_num" type="int" group="s" comment="最大分线数量"/>
    </bean>
    <table name="MapConfigCategory" value="MapConfig"
           input="../../../../cn.etetet.map/Luban/Config/Datas/Map/*@Map.yml"
           output="MapConfigCategory"/>
</module>
```

三块组成：

| 块 | 作用 |
|---|---|
| `enum` | 枚举，`alias` 会成为 C# 的显示名 |
| `bean` | 一条记录的结构 |
| `table` | 把 bean 注册成可访问的表 |

## 2 表定义的几个要点

| 属性 | 说明 |
|---|---|
| `name` | 生成的访问类名，约定以 `Category` 结尾 |
| `value` | 记录类型；本包内写 bean 名，跨包写完整类型名 |
| `input` | 数据文件路径，相对定义文件，用通配 + `@文件名` 写法 |
| `output` | 输出类名 |
| `comment` | 注释，会带到生成产物 |

`input` 的路径写法是**从定义文件出发回溯到仓库根，再进数据目录** —— 目录层级写错会导致扫不到数据。

## 3 字段与类型

| 类别 | 写法 |
|---|---|
| 基础类型 | `int` · `float` · `string` · `bool` |
| 容器 | `list` · `array` · `set` · `map` |
| 带元素的容器 | `list,string` · `array,float` |
| 自定义分隔符 | `(list#sep=,),string` |
| 跨表引用 | `int#ref=目标Category` |

字段属性：

| 属性 | 作用 |
|---|---|
| `group` | 该字段进哪个端：客户端 / 服务端 / 编辑器，空表示全端 |
| `comment` | 注释 |
| `alias` | 别名，用于枚举项显示名 |

## 4 分组：同一张表的不同裁剪

`group` 只认三个值：`c`（客户端）、`s`（服务端）、`e`（编辑器），空表示不裁剪。

推论：**某张表在服务端目标里不存在是正常的** —— 定义里限定了分组，不是导出出错。

## 5 多态与外部类型

两种进阶写法：

**多态父 bean**：父 bean 只声明公共字段，子 bean 用 `parent` 指向它并给 `alias`，实现一类记录多种形态。

**外部类型映射**：把自定义类型映射到工程里已有的结构（例如数学库的向量）。写法是声明一个 bean 并给 `mapper`，指定目标类型与构造函数名。

⚠️ 构造函数**必须**在 C# 侧存在（放在配置扩展的 `Util` 目录下，三个 CodeMode 各一份），否则生成的调用处直接编译失败。

## 6 数据文件

数据按 YAML 列表写，字段名与 bean 里的 `var name` 一致。

另外工程里仍保留 xlsx 写法（启动配置用），列布局约定：

| 行 | 内容 |
|---|---|
| 第 1 行 | 以 `##var` 开头，列出字段名 |
| 第 2 行 | 类型 |
| 第 3 行 | 注释 |
| 第 4 行起 | 数据 |

表结构定义用三个固定文件描述：`__tables__`（表清单）、`__beans__`（结构）、`__enums__`（枚举）。

表清单里几个关键列：

| 列 | 取值 |
|---|---|
| `mode` | `one` / `map` / `list`，空即 map |
| `index` | 空则自动取记录的第一个字段；联合主键用 `+` 连接 |
| `group` | `c` / `s` / `e`，可多值 |

## 7 新增一张表的完整步骤

1. 首次为该包建目录：用编辑器菜单「创建模版」，选目标包，从模板复制骨架并建好 `Defines` / `Datas`
2. 在 `Defines/<Xxx>.xml` 写枚举、bean、table
3. 在 `Datas/<Folder>/<File>.yml` 写数据
4. 确认该定义已进入导出配置的定义文件清单（点一次「仅生成 Conf」即可自动重写）
5. 执行导出
6. 检查生成代码与生成数据是否都在
7. 业务侧用 `XxxCategory.Instance.Get(id)` 读表
8. 需要二次索引或派生数据，在配置扩展目录写 partial 类，在 `EndInit` 里补
9. 需要在表初始化后跑逻辑，写一个配置系统子类

## 8 给表加自定义能力

生成的表类留了两个扩展点：

| 扩展点 | 时机 |
|---|---|
| `EndInit` | 数据反序列化完成后 |
| `EndRef` | 跨表引用解析完成后 |

写法是 partial 类实现这两个方法之一。扩展文件放该包的配置扩展目录，参考工程里已有的样例。

需要「表加载完后整体做点什么」时，写配置系统子类 —— 框架加载完会回调它们。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuilubangen/Luban/Config/Base/luban.conf` | 分类配置与定义清单 |
| `Packages/cn.etetet.map/Luban/Config/Base/Defines/Map.xml` | 标准 XML 定义样例 |
| `Packages/cn.etetet.yiuiluban/Luban/Config/Base/Defines/UnityMathematicsFloat2.xml` | 外部类型映射样例 |
| `Packages/cn.etetet.map/Scripts/Model/Share/MapConfig.cs` | 表的 partial 扩展样例 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 多态 bean 样例 | `Packages/cn.etetet.yiuiunit/Luban/Config/Base/Defines/Unit.xml` |
| 跨包引用定义 | `Packages/cn.etetet.yiuibattledemo/Luban/Config/Base/Defines/UIGraphTable.xml` |
| 数据文件样例 | `Packages/cn.etetet.map/Luban/Config/Datas/Map/Map.yml` |
| xlsx 结构定义样例 | `Packages/cn.etetet.yiuistartconfig/Luban/Localhost/Base/` |
| 外部类型构造函数 | `Packages/cn.etetet.yiuiluban/CodeMode/Model/ClientServer/ConfigExtend/Util/ExternalTypeUtil.cs` |
| 新建表的模板骨架 | `Packages/cn.etetet.yiuiluban/.Template/` |

## 下一步

→ [导出流程与产物](./pipeline)
