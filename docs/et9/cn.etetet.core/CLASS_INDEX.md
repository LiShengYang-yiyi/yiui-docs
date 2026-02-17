# cn.etetet.core 类索引

本文档列出 cn.etetet.core 包中所有核心类及其用途。

## Entity 系统

| 类名 | 文件 | 说明 |
|------|------|------|
| Entity | Entity/Entity.cs | 实体基类 |
| Scene | Entity/Scene.cs | 场景类 |
| ComponentView | Entity/ComponentView.cs | Unity 编辑器组件视图 |
| EntityRef | Entity/EntityRef.cs | 实体引用 |
| ChildrenCollection | Entity/ChildrenCollection.cs | 子实体集合 |
| ComponentsCollection | Entity/ComponentsCollection.cs | 组件集合 |
| EntityHelper | Entity/EntityHelper.cs | 实体辅助类 |
| EntitySceneFactory | Entity/EntitySceneFactory.cs | 场景工厂 |
| EntitySystemSingleton | Entity/EntitySystemSingleton.cs | 实体系统单例 |

### 系统接口

| 接口名 | 文件 | 说明 |
|--------|------|------|
| IAwake | Entity/IAwakeSystem.cs | 唤醒接口 |
| IUpdate | Entity/IUpdateSystem.cs | 更新接口 |
| IDestroy | Entity/IDestroySystem.cs | 销毁接口 |
| ISerialize | Entity/ISerializeSystem.cs | 序列化接口 |
| IDeserialize | Entity/IDeserializeSystem.cs | 反序列化接口 |

## World 系统

| 类名 | 文件 | 说明 |
|------|------|------|
| World | World/World.cs | 世界单例管理 |
| Singleton | World/Singleton.cs | 单例基类 |
| ASingleton | World/Singleton.cs | 抽象单例 |

## EventSystem

| 类名 | 文件 | 说明 |
|------|------|------|
| EventSystem | World/EventSystem/EventSystem.cs | 事件系统 |
| IEvent | World/EventSystem/IEvent.cs | 事件接口 |
| AEvent | World/EventSystem/AEvent.cs | 事件基类 |
| IInvoke | World/EventSystem/IInvoke.cs | 调用接口 |
| TypeSystems | World/EventSystem/TypeSystems.cs | 类型系统 |

## Fiber

| 类名 | 文件 | 说明 |
|------|------|------|
| Fiber | World/Fiber/Fiber.cs | 纤程 |
| FiberManager | World/Fiber/FiberManager.cs | 纤程管理器 |
| EntitySystem | World/Fiber/EntitySystem.cs | 实体系统 |
| MainThreadScheduler | World/Fiber/MainThreadScheduler.cs | 主线程调度器 |
| ThreadPoolScheduler | World/Fiber/ThreadPoolScheduler.cs | 线程池调度器 |
| ThreadSynchronizationContext | Core/Share/ThreadSynchronizationContext.cs | 线程同步上下文 |

## Network 网络层

| 类名 | 文件 | 说明 |
|------|------|------|
| KService | Network/KService.cs | KCP 服务 |
| KChannel | Network/KChannel.cs | KCP 通道 |
| AService | Network/AService.cs | 服务基类 |
| AChannel | Network/AChannel.cs | 通道基类 |
| IKcpTransport | Network/IKcpTransport.cs | KCP 传输接口 |
| TService | Network/TService.cs | TCP 服务 |
| TChannel | Network/TChannel.cs | TCP 通道 |

### KCP 实现

| 类名 | 文件 | 说明 |
|------|------|------|
| Kcp | Network/Kcp/Kcp.cs | KCP 协议实现 |
| ikcpc | Network/Kcp/ikcpc.cs | KCP C# 实现 |
| ikcph | Network/Kcp/ikcph.cs | KCP 头文件 |

### 消息处理

| 类名 | 文件 | 说明 |
|------|------|------|
| MessageSerializeHelper | Network/MessageSerializeHelper.cs | 消息序列化 |
| PacketParser | Network/PacketParser.cs | 数据包解析 |
| OpcodeType | Network/OpcodeType.cs | 消息码类型 |

## 集合 Collection

| 类名 | 文件 | 说明 |
|------|------|------|
| DoubleMap | Collection/DoubleMap.cs | 双键映射 |
| ListComponent | Collection/ListComponent.cs | 列表封装 |
| MultiDictionary | Collection/MultiDictionary.cs | 多值字典 |
| MultiMap | Collection/MultiMap.cs | 多值映射 |
| MultiMapSet | Collection/MultiMapSet.cs | 多值 Set |
| SortedDictionary | Collection/SortedDictionary.cs | 有序字典 |
| SortedSet | Collection/SortedSet.cs | 有序 Set |
| UnOrderMultiMap | Collection/UnOrderMultiMap.cs | 无序多值映射 |
| HashSetComponent | Collection/HashSetComponent.cs | HashSet 封装 |

## 协程锁 CoroutineLock

| 类名 | 文件 | 说明 |
|------|------|------|
| CoroutineLockComponent | CoroutineLock/CoroutineLockComponent.cs | 协程锁组件 |
| CoroutineLockComponentSystem | CoroutineLock/CoroutineLockComponentSystem.cs | 协程锁系统 |
| CoroutineLockQueue | CoroutineLock/CoroutineLockQueue.cs | 协程锁队列 |
| CoroutineLockQueueType | CoroutineLock/CoroutineLockQueueType.cs | 锁队列类型 |

## 定时器 Timer

| 类名 | 文件 | 说明 |
|------|------|------|
| TimerComponent | Timer/TimerComponent.cs | 定时器组件 |
| ATimer | Timer/ATimer.cs | 定时器基类 |

## 对象池 ObjectPool

| 类名 | 文件 | 说明 |
|------|------|------|
| ObjectPool | World/ObjectPool/ObjectPool.cs | 对象池 |

## 异步任务 ETTask

| 类名 | 文件 | 说明 |
|------|------|------|
| ETTask | ETTask/ETTask.cs | 异步任务 |
| ETTaskExtensions | ETTask/ETTaskExtensions.cs | 扩展方法 |
| ETVoid | ETTask/ETVoid.cs | 空返回值 |
| AsyncETTaskMethodBuilder | ETTask/AsyncETTaskMethodBuilder.cs | 异步方法构建器 |

## 配置 Config

| 类名 | 文件 | 说明 |
|------|------|------|
| IConfig | Config/IConfig.cs | 配置接口 |
| ConfigLoader | Config/ConfigLoader.cs | 配置加载器 |
| ConfigProcessAttribute | Config/ConfigProcessAttribute.cs | 配置处理属性 |
| ConfigType | Config/ConfigType.cs | 配置类型 |

## 序列化 Serialize

| 类名 | 文件 | 说明 |
|------|------|------|
| MemoryPackHelper | Serialize/MemoryPackHelper.cs | MemoryPack 序列化 |
| MongoHelper | Serialize/MongoHelper.cs | MongoDB 序列化 |
| MemoryBuffer | Serialize/MemoryBuffer.cs | 内存缓冲区 |

## 辅助工具 Helper

| 类名 | 文件 | 说明 |
|------|------|------|
| FileHelper | Helper/FileHelper.cs | 文件辅助 |
| StringHelper | Helper/StringHelper.cs | 字符串辅助 |
| ByteHelper | Helper/ByteHelper.cs | 字节辅助 |
| NetworkHelper | Helper/NetworkHelper.cs | 网络辅助 |
| RandomGenerator | Helper/RandomGenerator.cs | 随机数生成 |
| ProcessHelper | Helper/ProcessHelper.cs | 进程辅助 |

## 日志 Log

| 类名 | 文件 | 说明 |
|------|------|------|
| Log | World/Log/Log.cs | 日志类 |
| Logger | World/Log/Logger.cs | 日志接口 |
| ILog | World/Log/ILog.cs | 日志接口 |

## 时间 TimeInfo

| 类名 | 文件 | 说明 |
|------|------|------|
| TimeInfo | World/TimeInfo/TimeInfo.cs | 时间信息 |

## 其他

| 类名 | 文件 | 说明 |
|------|------|------|
| ErrorCore | Core/Share/ErrorCore.cs | 错误码定义 |
| IdGenerater | World/IdGenerater/IdGenerater.cs | ID 生成器 |
| Options | World/Options/Options.cs | 配置选项 |
