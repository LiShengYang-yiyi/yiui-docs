# YIUI-Docs 侧边栏维护指南

## 文件位置
- 侧边栏配置: `docs/.vitepress/sidebar.json`
- 文档目录: `docs/`

## 侧边栏结构说明

### 1. 普通文档项（无子菜单）
```json
{
  "text": "显示名称",
  "link": "/目录/文件名"
}
```

### 2. 父级菜单（有子菜单）
```json
{
  "text": "父级名称",
  "collapsed": true,
  "items": [
    { "text": "介绍", "link": "/目录/" },
    { "text": "子项1", "link": "/目录/子项1" },
    { "text": "子项2", "link": "/目录/子项2" }
  ]
}
```

**重要**: 父级菜单必须在 `items` 开头添加 `"介绍"` 子项指向 `index.md`，否则点击父级只会展开/收缩，无法显示内容。

## 常见操作

### 添加新文档
1. 在 `docs/对应目录/` 下创建 `.md` 文件
2. 在 `sidebar.json` 对应位置添加:
```json
{ "text": "文档名称", "link": "/目录/文件名" }
```

### 添加新分类（父级菜单）
1. 在 `docs/` 下创建新目录
2. 创建 `index.md` 作为介绍页
3. 在 `sidebar.json` 添加:
```json
{
  "text": "分类名称",
  "collapsed": true,
  "items": [
    { "text": "介绍", "link": "/新目录/" }
  ]
}
```

### 修改文档
直接编辑对应的 `.md` 文件，无需修改 `sidebar.json`（除非改名）

## Git 提交流程
```bash
git add .
git commit -m "docs: 描述修改内容"
git push
```

## 注意事项
- 文件名使用小写，空格用 `-` 替代
- `link` 路径不需要 `.md` 后缀
- 目录的介绍页必须命名为 `index.md`
