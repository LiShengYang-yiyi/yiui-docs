# YIUIBind

**URL**: https://ai.feishu.cn/wiki/W80jwOq9SiY30KkISOec1kQZnNf

**Parent**: 弃用

**Depth**: 3

---
YIUIBind
输入“/”快速插入内容
YIUIBind
亦亦
已弃用
因为
UIBind 自动生成
YIUI 所有UI信息都需要提前生成 才可用
这个信息有2种方式
1  开始时通过反射 找到所有UI代码 自动生成
2  因为反射有消耗所有做了优化 可以提前反射生成一个配置 然后去读取配置
在平时开发时 就用反射就好了 不然每次新增一个UI 都要去生成一次配置挺麻烦的
编辑器开发可选 1
/
2
离开编辑器必须使用2
初始化
YIUIBindHelper
以下是ET7.2的初始化入口  每个版本有细微差别 但是不影响阅读 基本一样
代码块
C#
/// &lt;summary&gt;
/// 初始化获取到所有UI相关的绑定关系
/// Editor下是反射
/// 其他 是序列化的文件 打包的时候一定要生成一次文件
/// &lt;/summary&gt;
internal static bool InitAllBind()
{
if (IsInit)
{
Debug.LogError($"已经初始化过了 请检查");
return false;
}
#if !UNITY_EDITOR || YIUIMACRO_SIMULATE_NONEEDITOR || !ENABLE_CODES
if (InternalGameGetUIBindVoFunc == null)
{
Debug.LogError(@$"使用非反射注册绑定 但是方法未实现 请检查 建议在YIUI初始化的地方调用一次
[ YIUIBindHelper.InternalGameGetUIBindVoFunc = YIUICodeGenerated.YIUIBindProvider.Get; ]");
return false;
}
var binds = InternalGameGetUIBindVoFunc?.Invoke();
#else
var binds = new YIUIBindProvider().Get();
#endif
if (binds == null || binds.Length <= 0)
{
//如果才接入框架 第一个UI都没有生成是无法运行的 先生成一个UI吧
Debug.LogError("没有找到绑定信息 或者 没有绑定信息 请检查");
return false;
}
....
}