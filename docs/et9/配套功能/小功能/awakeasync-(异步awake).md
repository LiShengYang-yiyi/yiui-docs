# AwakeAsync (异步Awake)

**URL**: https://ai.feishu.cn/wiki/N671wVzlzi2wBrkMTFCcL6UJnib

**Parent**: 小功能

**Depth**: 4

---
AwakeAsync (异步Awake)
输入“/”快速插入内容
AwakeAsync (异步Awake)
亦亦
官方建议方式:
await XX.AddComponent&lt;XXXComponent&gt;().InitAsync();
YIUI扩展了一个通用的方案 可以少写点 不过也是微不足道的优化
有需要的可以自用
案例:
用Unit 举例 这是原生只能add 如果有异步需求就自己额外调用
实现接口
IAwakeAsync  最大支持5个泛型参数
System实现接口
分析器提示 缺少实现 可以使用快捷键自动生成
YIUI事件分析器
假设内容是这样的
异步
如果你只需要调用异步 也就是 awake 方法不要了
可以这样使用 直接调用
AddComponentAsync<>
AddComponentWithIdAsync<>
AddChildAsync<>
AddChildWithIdAsync<>
再次提醒 这样调用的
不会触发Awake
如果你确定这样 逻辑就不需要写在Awake里面了
👍
TODO
一般来说如果你有异步Awake 理应抛弃同步 本来就是2选一
所以这里可以加一个分析器: 当一个Entity有异步Awake时禁止调用同步
然后再扩展一个特性标记: 当前Entity可以跳过这个分析