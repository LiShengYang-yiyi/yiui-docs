# Config 配置工具

> 配置管理与数据工具相关包

## 包列表

| 包名 | 功能 | 文件数 |
|------|------|--------|
| cn.etetet.yiuiluban | Luban 配置 | 101 |
| cn.etetet.yiuilubangen | Luban 代码生成 | 99 |
| cn.etetet.excel | Excel 导入导出 | - |
| cn.etetet.db | MongoDB 数据库 | 7 |

---

## 1. cn.etetet.yiuiluban - Luban 配置

### 功能概述
- **配置数据加载**: 从 Luban 加载配置
- **配置表访问**: 类型安全的配置访问
- **客户端扩展**: 客户端专用配置

### 配置类型

| 配置类 | 用途 |
|--------|------|
| YIUIClientConfig | 客户端基础配置 |
| YIUIClientServerConfig | 客户端服务器配置 |
| YIUIItemConfig | 物品配置 |
| YIUIShape | 形状配置 |
| YIUIRectangle | 矩形配置 |
| YIUICircle | 圆形配置 |
| YIUIVector2/3/4 | 向量配置 |

### 使用示例

```csharp
// 加载配置
var config = YIUIClientConfigCategory.Instance.Get(id);

// 访问数据
var value = config.SomeField;
```

---

## 2. cn.etetet.yiuilubangen - Luban 代码生成

### 功能概述
- **代码生成**: 从配置定义生成 C# 代码
- **类型生成**: 生成配置表 Category 类
- **结构定义**: 生成数据结构

### 生成的代码

```csharp
// 生成的配置类
public class YIUIClientConfig
{
    public int Id { get; set; }
    public string Name { get; set; }
    // ...
}

// 生成的 Category 类
public class YIUIClientConfigCategory
{
    public static YIUIClientConfigCategory Instance { get; }
    
    public YIUIClientConfig Get(int id);
    public bool TryGet(int id, out YIUIClientConfig config);
}
```

---

## 3. cn.etetet.excel - Excel 工具

### 功能概述
- Excel 文件导入
- 数据导出到 Excel
- 配置表转换

---

## 4. cn.etetet.db - MongoDB 数据库

### 功能概述
- **MongoDB 集成**: MongoDB 数据库组件
- **异步操作**: 异步数据库操作
- **缓存管理**: 数据缓存

### 核心组件

```csharp
// DBComponent - 数据库组件
public class DBComponent: Entity
{
    public MongoClient mongoClient;
    public IMongoDatabase database;
    public HashSet<string> CollectionDic;
}

// DBManagerComponent - 数据库管理器
public class DBManagerComponent: Entity
{
    // 管理多个 DBComponent
}
```

### 使用示例

```csharp
// 保存数据
await DBComponent.SaveAsync<Player>(player);

// 加载数据
var player = await DBComponent.QueryAsync<Player>(id);

// 删除数据
await DBComponent.DeleteAsync<Player>(id);
```

### 配置

```csharp
// 初始化数据库
public void Awake(string connectionString, string databaseName)
{
    mongoClient = new MongoClient(connectionString);
    database = mongoClient.GetDatabase(databaseName);
}
```

---

## Luban 工作流

```
1. 编写配置 (Excel/JSON/TOML)
        ↓
2. Luban 工具解析配置
        ↓
3. 生成二进制/JSON 配置
        ↓
4. yiuilubangen 生成 C# 代码
        ↓
5. yiuiluban 加载配置数据
        ↓
6. 客户端使用配置
```

---

## 配置加载流程

```
启动 → Luban 初始化
       → 加载配置数据文件
       → 生成配置 Category
       → 客户端查询
```

---

*文档生成时间: 2026-02-17*
