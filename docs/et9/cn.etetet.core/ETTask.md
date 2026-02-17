# ETTask 异步任务详细文档

## 概述

`ETTask` 是 ET 框架的异步任务实现，类似于 C# 的 Task，但更轻量且支持纤程。

## 命名空间

```csharp
namespace ET
```

## 核心类型

### ETTask

基础异步任务，不带返回值。

### ETTask<T>

带返回值的异步任务。

### ETVoid

无返回值的异步调用标记。

## 创建任务

### 静态创建

```csharp
// 创建可取消的任务
static ETTask Create(bool cancelable = false)

// 创建带返回值的任务
static ETTask<T> Create<T>(bool cancelable = false)
```

### 使用 async/await

```csharp
// 异步方法返回 ETTask
public async ETTask DoSomethingAsync()
{
    await Task.Delay(1000);  // 等待 1 秒
    Log.Info("Done!");
}

// 带返回值的异步方法
public async ETTask<int> CalculateAsync()
{
    await Task.Delay(1000);
    return 42;
}

// 等待其他 ETTask
public async ETTask ProcessAsync()
{
    await otherTask;  // 等待另一个任务完成
}
```

### 从 Task 转换

```csharp
// Task 转换为 ETTask
public static async ETTask ToETTask(this Task task)
{
    await task;
}

// Task<T> 转换为 ETTask<T>
public static async ETTask<T> ToETTask<T>(this Task<T> task)
{
    return await task;
}
```

## 设置结果

### ETTask

```csharp
ETTask task = ETTask.Create();
task.SetResult();  // 标记任务完成
```

### ETTask<T>

```csharp
ETTask<int> task = ETTask<int>.Create();
task.SetResult(42);  // 设置返回值
```

## 等待任务

### 等待单个任务

```csharp
// 在 async ETTask 方法中
await someTask;

// 或者
someTask.Wait();
```

### 等待多个任务

```csharp
// 等待所有任务完成
await ETTask.WaitAll(tasks);

// 等待任意一个任务完成
await ETTask.WaitAny(tasks);
```

## 取消任务

```csharp
// 创建可取消的任务
var task = ETTask.Create(true);

// 取消任务
task.SetCanceled();

// 检查是否已取消
if (task.IsCanceled())
{
    // 任务已取消
}
```

## 异常处理

```csharp
try
{
    await riskyTask;
}
catch (Exception e)
{
    Log.Error(e);
}
```

## 扩展方法

### ETTaskExtensions

```csharp
// 安全等待，不抛异常
await task.Safe();

// 超时等待
await task.Timeout(5000);  // 5 秒超时
```

## 使用示例

### 1. 异步加载配置

```csharp
public async ETTask<Dictionary<int, ItemConfig>> LoadItemsAsync()
{
    var items = new Dictionary<int, ItemConfig>();
    
    using var fileStream = File.OpenRead("Items.bin");
    using var reader = new BinaryReader(fileStream);
    
    int count = reader.ReadInt32();
    for (int i = 0; i < count; i++)
    {
        var config = new ItemConfig();
        config.Id = reader.ReadInt32();
        config.Name = reader.ReadString();
        items[config.Id] = config;
        
        // 每帧处理一部分，避免卡顿
        if (i % 100 == 0)
        {
            await Fiber.WaitFrameFinish();
        }
    }
    
    return items;
}
```

### 2. 异步网络请求

```csharp
public async ETTask<LoginResponse> LoginAsync(string account, string password)
{
    var request = new LoginRequest
    {
        Account = account,
        Password = password
    };
    
    // 发送请求
    var response = await networkClient.Call<LoginResponse>(request);
    
    return response;
}

// 调用
var response = await LoginAsync("test", "password");
if (response.Error == 0)
{
    Log.Info("Login success!");
}
```

### 3. 带超时的异步操作

```csharp
public async ETTask<bool> ConnectWithTimeout(string address, int port, int timeoutMs = 5000)
{
    var connectTask = networkClient.ConnectAsync(address, port);
    
    // 等待连接或超时
    if (await Task.WhenAny(connectTask, Task.Delay(timeoutMs)) == connectTask)
    {
        return await connectTask;
    }
    
    // 超时
    networkClient.Disconnect();
    return false;
}
```

### 4. 并行执行多个任务

```csharp
public async ETTask LoadAllDataAsync()
{
    // 创建多个加载任务
    var loadConfigTask = LoadConfigAsync();
    var loadPlayerTask = LoadPlayerDataAsync();
    var loadItemsTask = LoadItemsAsync();
    
    // 等待所有任务完成
    await ETTask.WaitAll(new[] { loadConfigTask, loadPlayerTask, loadItemsTask });
    
    Log.Info("All data loaded!");
}
```

### 5. 顺序执行多个任务

```csharp
public async ETTask ProcessSequentiallyAsync()
{
    await LoadConfigAsync();
    Log.Info("Config loaded");
    
    await LoadPlayerDataAsync();
    Log.Info("Player data loaded");
    
    await LoadItemsAsync();
    Log.Info("Items loaded");
}
```

### 6. 协程中使用 Wait

```csharp
public async ETTask CountdownAsync(int seconds)
{
    for (int i = seconds; i > 0; i--)
    {
        Log.Info($"Countdown: {i}");
        await TimerComponent.Instance.WaitAsync(1000);
    }
    
    Log.Info("Boom!");
}
```

## 与 C# Task 的区别

| 特性 | ETTask | Task |
|------|--------|------|
| 纤程支持 | ✅ 支持 | ❌ 不支持 |
| 性能 | 更轻量 | 较重 |
| 线程池 | 可配置 | 系统决定 |
| 结构体 | 是 | 引用类 |

## 注意事项

1. **必须在 async ETTask 方法中使用 await**
2. **不要阻塞主线程**: 使用 await 而非 .Result 或 .Wait()
3. **异常处理**: 使用 try-catch 捕获异常
4. **资源清理**: 使用 using 语句处理可释放对象
