# Panel预加载

**URL**: https://ai.feishu.cn/wiki/U45rwIkdZizFArkM19qcLx8KnGd

**Parent**: 小功能

**Depth**: 4

---
Panel预加载
输入“/”快速插入内容
Panel预加载
亦亦
新增预加载功能
针对超大型预制,需要提前加载
就算有异步加载还是会有延迟情况的
需要无延迟打开的时候使用
预加载只针对多有Panel界面
也就是可以通过OpenPanel / xxOpen 结尾的界面才能使用
其他View... 自行处理
API
代码块
C#
public static async ETTask&lt;bool&gt; PreLoadPanelAsync&lt;T&gt;(this YIUIRootComponent self, bool loadEntity = true)
where T : Entity, IAwake, IYIUIOpen
{
return await self.YIUIMgr.PreLoadPanelAsync&lt;T&gt;(self, loadEntity);
}
public static async ETTask&lt;bool&gt; PreLoadPanelAsync(this YIUIRootComponent self, string panelName, bool loadEntity = true)
{
return await self.YIUIMgr.PreLoadPanelAsync(panelName, self, loadEntity);
}
预加载分2种情况
loadEntity = true
代表全量加载UI 包括实例化Entity对象
案例:
59%
41%
预加载包括实例化时 会有预加载消息
IYIUIPreLoad, IYIUIPreLoadSystem
使用方式与其他生命周期相同
只预加载预制体不会有消息 如果需要可自行实现
loadEntity = false
代表只加载UI 不实例化Entity对象
案例:
61%
39%