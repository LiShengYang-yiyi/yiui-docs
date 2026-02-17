# YIUI SuperScroll 无限滚动系统

## 概述

SuperScroll 无限滚动系统是 YIUI 框架中的高性能列表滚动组件，基于 Unity 的 ScrollRect 二次开发，实现了无限滚动、对象池复用、自动加载等功能。该系统可以处理大量数据的列表显示，支持垂直/水平/网格/交错等多种布局方式。

## 包结构

| 包名 | 说明 |
|------|------|
| `cn.etetet.yiuisuperscroll` | 无限滚动核心实现 |
| `cn.etetet.yiuisuperscrolldemo` | 无限滚动使用示例 |

## 核心组件

### 1. LoopListView2 - 列表视图

核心列表视图组件，支持垂直/水平滚动。

```csharp
public partial class LoopListView2 : MonoBehaviour
{
    // 列表项预制体配置
    public List<ItemPrefabConfData> ItemPrefabDataList { get; }
    
    // 当前显示的列表项
    public List<LoopListViewItem2> ItemList { get; }
    
    // 是否是垂直列表
    public bool IsVertList { get; }
    
    // 总数据项数
    public int ItemTotalCount { get; }
}
```

### 2. LoopGridView - 网格视图

网格布局的列表视图。

```csharp
public partial class LoopGridView : MonoBehaviour
{
    // 网格列数
    public int ColumnCount { get; set; }
}
```

### 3. LoopStaggeredGridView - 交错网格视图

支持不同高度项的交错网格布局。

```csharp
public partial class LoopStaggeredGridView : MonoBehaviour
{
    // 网格列数
    public int ColumnCount { get; set; }
}
```

### 4. LoopListViewItem2 - 列表项

列表中的单个项：

```csharp
public class LoopListViewItem2 : MonoBehaviour
{
    public int ItemIndex { get; set; }      // 项的索引
    public string ItemPrefabName { get; set; } // 预制体名称
    public bool IsInitHandlerCalled { get; set; } // 是否已初始化
    public RectTransform CachedRectTransform { get; }
}
```

### 5. ItemPrefabConfData - 预制体配置

```csharp
[System.Serializable]
public class ItemPrefabConfData
{
    public GameObject mItemPrefab;    // 预制体
    public float mPadding;           // 间距
    public int mInitCreateCount;     // 初始创建数量
    public float mStartPosOffset;    // 起始偏移
}
```

### 6. LoopListViewInitParam - 初始化参数

```csharp
public class LoopListViewInitParam
{
    public float mDistanceForRecycle0 = 300;  // 回收距离阈值0
    public float mDistanceForNew0 = 200;       // 新建距离阈值0
    public float mDistanceForRecycle1 = 300;   // 回收距离阈值1
    public float mDistanceForNew1 = 200;      // 新建距离阈值1
    public float mSmoothDumpRate = 0.3f;       // 平滑滚动衰减率
    public float mSnapFinishThreshold = 0.01f; // 吸附完成阈值
    public float mSnapVecThreshold = 145;       // 吸附向量阈值
    public float mItemDefaultWithPaddingSize = 100; // 默认项大小
    public bool mNeedReplaceScrollbarEventHandler = true; // 是否替换滚动条事件
}
```

## 列表项数据模型

### 基础数据模型

```csharp
// 简单数据项
public class SimpleItemData
{
    public int mId;
    public string mName;
    public string mDesc;
    public Sprite mIcon;
}

// 带展开的数据项
public class SimpleExpandItemData
{
    public int mId;
    public string mName;
    public bool mIsExpanded;
    public List<SimpleItemData> mChildItemList;
}

// 可拖拽数据项
public class DraggableItemData
{
    public int mId;
    public Vector2 mItemSize;
}
```

### 数据管理器

```csharp
public class DataSourceMgr<T> where T : ItemDataBase, new()
{
    public int TotalItemCount { get; }          // 总数据量
    public List<T> mItemList { get; }           // 数据列表
    
    public T GetItemDataByIndex(int index);     // 根据索引获取数据
    public void SetDataTotalCount(int count);   // 设置总数据量
    public T InsertData(int index);             // 插入数据
    public void RemoveData(int index);          // 删除数据
}
```

## 使用指南

### 1. 场景设置

1. 创建一个 Canvas
2. 添加 ScrollRect 作为容器
3. 添加 LoopListView2 组件
4. 在 Inspector 中配置：
   - 设置 Viewport
   - 配置 Content
   - 添加 ItemPrefab（预制体）
   - 设置滚动方向

### 2. 基础使用

```csharp
public class MyListViewScript : MonoBehaviour
{
    public LoopListView2 mLoopListView;
    private DataSourceMgr<SimpleItemData> mDataSourceMgr;
    
    void Start()
    {
        // 创建数据管理器
        mDataSourceMgr = new DataSourceMgr<SimpleItemData>(100);
        
        // 初始化列表视图
        mLoopListView.InitListView(mDataSourceMgr.TotalItemCount, OnGetItemByIndex);
    }
    
    // 获取列表项回调
    LoopListViewItem2 OnGetItemByIndex(LoopListView2 listView, int index)
    {
        if (index < 0 || index >= mDataSourceMgr.TotalItemCount)
            return null;
            
        SimpleItemData itemData = mDataSourceMgr.GetItemDataByIndex(index);
        if (itemData == null)
            return null;
            
        // 创建列表项
        LoopListViewItem2 item = listView.NewListViewItem("ItemPrefab");
        SimpleItem itemScript = item.GetComponent<SimpleItem>();
        
        if (!item.IsInitHandlerCalled)
        {
            item.IsInitHandlerCalled = true;
            itemScript.Init(OnItemClicked);
        }
        
        itemScript.SetItemData(itemData);
        return item;
    }
    
    // 项点击回调
    void OnItemClicked(int itemId)
    {
        Log.Info($"Clicked item: {itemId}");
    }
}
```

### 3. 列表操作

#### 3.1 刷新列表

```csharp
// 刷新所有显示的项
mLoopListView.RefreshAllShownItem();

// 设置新的列表项数量
mLoopListView.SetListItemCount(newCount, false); // false: 不滚动到顶部
```

#### 3.2 滚动到指定项

```csharp
// 滚动到指定索引
mLoopListView.MovePanelToItemIndex(itemIndex, 0);

// 带偏移滚动
mLoopListView.MovePanelToItemIndex(itemIndex, offset);
```

#### 3.3 添加/删除数据

```csharp
// 添加数据
SimpleItemData newData = mDataSourceMgr.InsertData(index);
mLoopListView.SetListItemCount(mDataSourceMgr.TotalItemCount, false);
mLoopListView.RefreshAllShownItem();

// 删除数据
mDataSourceMgr.RemoveData(index);
mLoopListView.SetListItemCount(mDataSourceMgr.TotalItemCount, false);
mLoopListView.RefreshAllShownItem();

// 设置总数
mDataSourceMgr.SetDataTotalCount(newCount);
mLoopListView.SetListItemCount(newCount, false);
```

### 4. 网格视图 (LoopGridView)

```csharp
public class GridViewDemoScript : MonoBehaviour
{
    public LoopGridView mLoopGridView;
    
    void Start()
    {
        mLoopGridView.InitGridView(rowCount, columnCount, OnGetItemByIndex);
    }
    
    LoopGridViewItem OnGetItemByIndex(LoopGridView listView, int row, int column)
    {
        int index = row * mColumnCount + column;
        // ... 类似于 ListView 的处理
    }
}
```

### 5. 交错网格视图 (LoopStaggeredGridView)

适用于不同高度的项：

```csharp
public class StaggeredViewDemoScript : MonoBehaviour
{
    public LoopStaggeredGridView mLoopStaggeredGridView;
    
    void Start()
    {
        mLoopStaggeredGridView.InitStaggeredGridView(
            itemCount,
            columnCount,
            OnGetItemSizeByIndex,
            OnGetItemByIndex
        );
    }
    
    // 获取项大小
    (float, float) OnGetItemSizeByIndex(int index)
    {
        // 根据数据返回 (width, height)
        return (100, Random.Range(50, 200));
    }
}
```

### 6. 吸附功能

列表支持滚动停止后自动吸附到指定项：

```csharp
// 启用吸附
mLoopListView.mItemSnapEnable = true;

// 设置吸附完成回调
mLoopListView.mOnSnapItemFinished = OnSnapFinished;

// 吸附完成回调
void OnSnapFinished(LoopListView2 listView, LoopListViewItem2 item)
{
    Log.Info($"Snapped to item: {item.ItemIndex}");
}
```

### 7. 拖拽加载更多

支持下拉刷新和上拉加载更多：

```csharp
// 下拉刷新
mLoopListView.mOnBeginDragAction = OnBeginDrag;
mLoopListView.mOnEndDragAction = OnEndDrag;

// 监听滚动位置实现加载更多
// 当滚动到底部时加载新数据
```

### 8. 多预制体支持

```csharp
// 在 Inspector 中添加多个预制体

// 代码中根据数据返回不同预制体
LoopListViewItem2 OnGetItemByIndex(LoopListView2 listView, int index)
{
    SimpleItemData data = mDataSourceMgr.GetItemDataByIndex(index);
    
    // 根据数据类型选择预制体
    string prefabName = data.mType == 0 ? "ItemPrefab1" : "ItemPrefab2";
    LoopListViewItem2 item = listView.NewListViewItem(prefabName);
    
    // ...
}
```

## 列表项组件开发

### 自定义列表项

```csharp
public class MyItem : MonoBehaviour
{
    private Action<int> mOnClick;
    private Text mNameText;
    private Image mIconImage;
    
    public void Init(Action<int> onClick)
    {
        mOnClick = onClick;
        GetComponent<Button>().onClick.AddListener(OnClick);
    }
    
    public void SetItemData(SimpleItemData data)
    {
        mNameText.text = data.mName;
        // ...
    }
    
    void OnClick()
    {
        mOnClick?.Invoke(itemId);
    }
}
```

## 布局类型

### 1. 垂直列表 (TopToBottom / BottomToTop)

```
┌─────────────┐
│    Item 0   │
├─────────────┤
│    Item 1   │
├─────────────┤
│    Item 2   │
├─────────────┤
│    Item 3   │
└─────────────┘
```

### 2. 水平列表 (LeftToRight / RightToLeft)

```
┌────┬────┬────┬────┐
│ 0  │ 1  │ 2  │ 3  │
└────┴────┴────┴────┘
```

### 3. 网格列表

```
┌────┬────┬────┐
│ 0  │ 1  │ 2  │
├────┼────┼────┤
│ 3  │ 4  │ 5  │
└────┴────┴────┘
```

### 4. 交错网格

```
┌────┬────┬────┐
│ 0  │ 1  │ 2  │
│    ├────┤    │
├────┤ 4  ├────┤
│ 3  │    │ 5  │
└────┴────┴────┘
```

## 特殊功能

### 1. 展开/折叠动画

```csharp
// 展开项
public class ExpandAnimationItem : MonoBehaviour
{
    // 支持展开/折叠动画
}
```

### 2. 删除动画

```csharp
// 带删除动画的项
public class DeleteAnimationItem : MonoBehaviour
{
    // 支持滑动删除等动画
}
```

### 3. 嵌套列表

```csharp
// 支持嵌套的列表项
public class NestedItemData
{
    public LoopListView2 NestedListView { get; }
}
```

### 4. 树形列表

```csharp
// 支持树形结构的列表
public class TreeViewItemData
{
    public List<TreeViewItemData> Children { get; }
    public int IndentLevel { get; }
}
```

### 5. 聊天视图

```csharp
// 专门用于聊天界面的滚动视图
// 自动底部对齐，新消息自动滚动
```

### 6. 选择删除

```csharp
// 支持选中多个项并删除
```

## 性能优化

### 1. 对象池

系统使用对象池管理列表项，减少 GC：
- 滚动出视野的项会被回收
- 滚动进视野的项从池中获取

### 2. 回收阈值

通过 `mDistanceForRecycle0/1` 控制何时回收项：
- 距离视口一定距离外的项会被回收

### 3. 初始创建数量

通过 `mInitCreateCount` 设置初始创建的项数：
- 适当设置可以减少初始滚动时的创建开销

### 4. 避免频繁刷新

```csharp
// 批量更新数据后统一刷新
mDataSourceMgr.SetDataTotalCount(newCount);
mLoopListView.SetListItemCount(newCount, false);
mLoopListView.RefreshAllShownItem();
```

## 完整示例

### 简单列表示例

```csharp
using System.Collections.Generic;
using UnityEngine;
using SuperScrollView;

public class ListViewSimpleDemoScript : MonoBehaviour
{
    public LoopListView2 mLoopListView;
    public int mTotalDataCount = 10000;
    DataSourceMgr<SimpleItemData> mDataSourceMgr;
    
    void Start()
    {
        // 1. 创建数据
        mDataSourceMgr = new DataSourceMgr<SimpleItemData>(mTotalDataCount);
        
        // 2. 初始化列表
        mLoopListView.InitListView(mDataSourceMgr.TotalItemCount, OnGetItemByIndex);
    }
    
    LoopListViewItem2 OnGetItemByIndex(LoopListView2 listView, int index)
    {
        if (index < 0 || index >= mDataSourceMgr.TotalItemCount)
            return null;
            
        SimpleItemData itemData = mDataSourceMgr.GetItemDataByIndex(index);
        if (itemData == null)
            return null;
            
        // 3. 创建列表项
        LoopListViewItem2 item = listView.NewListViewItem("ItemPrefab");
        SimpleItem itemScript = item.GetComponent<SimpleItem>();
        
        if (!item.IsInitHandlerCalled)
        {
            item.IsInitHandlerCalled = true;
            itemScript.Init(OnItemClicked);
        }
        
        // 4. 设置数据
        itemScript.SetItemData(itemData);
        return item;
    }
    
    void OnItemClicked(int itemId)
    {
        Debug.Log($"Clicked item: {itemId}");
    }
}
```

### 网格视图示例

```csharp
public class GridViewDemoScript : MonoBehaviour
{
    public LoopGridView mLoopGridView;
    public int mColumnCount = 3;
    DataSourceMgr<SimpleItemData> mDataSourceMgr;
    
    void Start()
    {
        mDataSourceMgr = new DataSourceMgr<SimpleItemData>(100);
        mLoopGridView.InitGridView(mDataSourceMgr.TotalItemCount, mColumnCount, OnGetItemByIndex);
    }
    
    LoopGridViewItem OnGetItemByIndex(LoopGridView listView, int row, int column)
    {
        int index = row * mColumnCount + column;
        if (index < 0 || index >= mDataSourceMgr.TotalItemCount)
            return null;
            
        SimpleItemData itemData = mDataSourceMgr.GetItemDataByIndex(index);
        LoopGridViewItem item = listView.NewListViewItem("GridItemPrefab");
        
        // 设置数据...
        return item;
    }
}
```

## 注意事项

1. **预制体命名**：预制体名称必须与 Inspector 中配置的一致
2. **Content 设置**：确保 Content 的 LayoutGroup 组件正确配置
3. **项大小**：确保列表项的 RectTransform 大小正确设置
4. **回收机制**：理解回收机制，避免不必要的数据刷新
5. **异步加载**：对于包含图片的项，考虑使用异步加载避免卡顿

## 依赖项

- Unity UI (ugui)
- Event System

## 扩展开发

可以通过继承现有类实现自定义功能：

```csharp
// 自定义数据项
public class MyItemData : ItemDataBase
{
    public int customField;
}

// 自定义列表项组件
public class MyListItem : MonoBehaviour
{
    public virtual void SetData(MyItemData data) { }
}
```
