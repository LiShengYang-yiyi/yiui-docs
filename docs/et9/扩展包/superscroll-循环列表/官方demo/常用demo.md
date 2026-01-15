# 常用Demo

 
从上到下 最简单的 
 
 代码块 
 public LoopListView2 mLoopListView 
 void Start() 
 { 
 mDataSourceMgr = new DataSourceMgr&lt;ItemData&gt;(mTotalDataCount); 
 mLoopListView.InitListView(mDataSourceMgr.TotalItemCount, OnGetItemByIndex); 
 InitButtonPanel(); 
 } 
 InitListView 方法用于启动 LoopListView2 组件。有 3 个参数：itemTotalCount：列表视图中的总项目数。如果此参数设置为 -1，则表示有无限项，并且不支持滚动条，并且 ItemIndex 可以从 –MaxInt 到 +MaxInt。如果此参数设置为值 >=0 ，则 ItemIndex 只能从 0 到 itemTotalCount -1。onGetItemByIndex：当一个项目进入 scrollrect 视口时，将调用此 Action 时，将使用项目的索引作为参数，以允许您创建该项目并更新其内容。onGetItemSizeByIndex：如果你可以事先知道每个项目的大小，你可以设置这个委托，以返回给定 itemIndex 的大小和填充。目前，该委托主要用于 UpdateItemSizeAtOnce 方法 
 
 
 TODO