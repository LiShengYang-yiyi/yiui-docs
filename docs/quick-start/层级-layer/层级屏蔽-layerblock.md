# 层级屏蔽 LayerBlock

 
1. 异步事件默认响应中会屏蔽所有UI操作 (可开关选择,默认开启) 
 2. 各UI,Panel 打开过程中默认开启 
 
 这是最常见的2个问题 在打开UI的过程中或者响应异步过程中 又在异步等待 又想用户操作UI 那肯定是冲突的需求 
 一定要明白自己想要什么 什么时候应该屏蔽什么时候不应该屏蔽, 如何合理的利用机制, 避免想操作时被屏蔽 
 
 🌅 如果觉得这个功能鸡肋是可以屏蔽整个功能的 
 以下为AI总结: 
 
 一、功能概述 
 
 • 提供一个位于所有 UI 层级之上的全局屏蔽层 LayerBlock ，在显示时屏蔽用户对界面的所有交互；在隐藏时恢复交互。 
 • 支持两种屏蔽方式： 
 ◦ 永久屏蔽（可成对恢复，引用计数）用于不确定时长但能保证配对恢复的场景。 
 ◦ 倒计时屏蔽（定时自动恢复）用于确定时长的托管场景。 
 • 适用于批量刷新、统一动画、堆栈调整、滚动定位等过程中，防止误操作或状态竞争导致的异常。 
 
 二、初始化与结构 
 
 • 初始化位置：在 UI 根节点和各层级创建完成后，添加终极屏蔽层。 
 ◦ Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/System/UIMgr/YIUIMgrComponentSystem_Root.cs:100 
 调用 InitAddUIBlock() 将 LayerBlock 以全屏方式挂载在 UILayerRoot 最顶端。 
 • 屏蔽层结构： 
 ◦ 新建 GameObject("LayerBlock") ，添加 RectTransform 、 CanvasRenderer 、 UIBlock 组件，设置为全屏并置于最顶层。 
 ◦ 默认隐藏（即可操作）。 
 ◦ 源码位置： Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/System/UIMgr/YIUIMgrComponentSystem_Block.cs:57 
 • 相关数据字段： 
 ◦ m_LayerBlock （屏蔽层对象） Packages/cn.etetet.yiuiframework/Scripts/ModelView/Client/Component/UIMgr/YIUIMgrComponent_Block.cs:17 
 ◦ m_AllForeverBlockCode （永久屏蔽引用计数集合） Packages/cn.etetet.yiuiframework/Scripts/ModelView/Client/Component/UIMgr/YIUIMgrComponent_Block.cs:21 
 ◦ 状态属性： 
 ▪ LayerBlockActiveSelf 当前屏蔽层是否显示 Packages/cn.etetet.yiuiframework/Scripts/ModelView/Client/Component/UIMgr/YIUIMgrComponent_Block.cs:12 
 ▪ CanLayerBlockOption 当前 UI 是否可交互（屏蔽层未显示） Packages/cn.etetet.yiuiframework/Scripts/ModelView/Client/Component/UIMgr/YIUIMgrComponent_Block.cs:15 
 
 三、API说明 
 
 • 永久屏蔽（引用计数） 
 ◦ BanLayerOptionForever(this YIUIMgrComponent self): long 
 ▪ 行为：显示屏蔽层并返回唯一 code ；将 code 加入计数集合。 
 ▪ 位置： Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/System/UIMgr/YIUIMgrComponentSystem_Block.cs:13 
 ▪ 使用要求：必须与 RecoverLayerOptionForever(code) 成对调用，推荐 try/finally 保证恢复。 
 ◦ RecoverLayerOptionForever(this YIUIMgrComponent self, long code): void 
 ▪ 行为：移除对应 code ，当计数清零时隐藏屏蔽层（恢复交互）。 
 ▪ 位置： Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/System/UIMgr/YIUIMgrComponentSystem_Block.cs:22 
 
 • 倒计时屏蔽（托管） 
 ◦ BanLayerOptionCountDown(this YIUIMgrComponent self, long time): ETTask 
 ▪ 行为：开始屏蔽并在 time 毫秒后自动恢复。 
 ▪ 位置： Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/System/UIMgr/YIUIMgrComponentSystem_Block.cs:37