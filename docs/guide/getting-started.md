# 快速开始

## 添加新文档

1. 在 `docs` 目录下创建 `.md` 文件
2. 编写 Markdown 内容
3. 在 `docs/.vitepress/config.mts` 中添加侧边栏链接
4. 提交并推送到 GitHub

## Markdown 基础语法

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体** *斜体*

- 无序列表
- 列表项

1. 有序列表
2. 列表项

[链接文字](url)

![图片描述](图片url)

`行内代码`
```

## 本地预览

```bash
npm run docs:dev
```

访问 `http://localhost:5173` 查看效果。
