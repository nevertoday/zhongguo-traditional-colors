# GitHub 发布指南

这份指南用于把当前项目发布为 GitHub 开源仓库，并启用 GitHub Pages 和 Release 下载包。

## 1. 初始化仓库

如果当前目录还不是 Git 仓库：

```bash
git init
git add .
git commit -m "Create open traditional colors archive"
```

由于 `downloads/*.zip` 已在 `.gitignore` 中，完整 ZIP 不会被提交。

## 2. 创建 GitHub 仓库

在 GitHub 创建一个空仓库，例如：

```text
zhongguo-traditional-colors
```

然后关联远程仓库：

```bash
git remote add origin git@github.com:<your-name>/zhongguo-traditional-colors.git
git branch -M main
git push -u origin main
```

如果使用 HTTPS，把远程地址替换为 GitHub 提供的 HTTPS 地址。

## 3. 启用 GitHub Pages

在 GitHub 仓库中进入：

```text
Settings -> Pages
```

推荐配置：

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

保存后，GitHub 会提供一个 Pages 地址。页面入口就是仓库根目录下的 `index.html`。

如果使用自定义域名：

```text
Custom domain: colors.xiaoxiaodong.ai
Enforce HTTPS: enabled
```

仓库根目录保留 `CNAME` 文件，内容为：

```text
colors.xiaoxiaodong.ai
```

Cloudflare DNS 中为 `xiaoxiaodong.ai` 添加一条记录：

```text
Type: CNAME
Name: colors
Target: nevertoday.github.io
Proxy status: DNS only
TTL: Auto
```

先用 `DNS only` 等 GitHub Pages 签发证书并显示可用，再按需评估是否开启 Cloudflare 代理。

## 4. 发布完整图片下载包

本地生成 ZIP：

```bash
npm run package:images
```

在 GitHub 仓库中进入：

```text
Releases -> Draft a new release
```

上传：

```text
downloads/zhongguo-traditional-colors-images.zip
```

建议 Release 标题：

```text
Image pack v0.1.0
```

建议说明：

```text
包含当前 742 张中华传统色色卡图片。后续新增色卡后会继续发布新版图片包。
```

## 5. 后续更新流程

新增图片后：

```bash
npm run manifest
npm run start
```

确认页面正常后提交：

```bash
git add images assets/data/images.js README.md README.en.md README.zh-CN.md README.ja.md
git commit -m "Add more traditional color cards"
git push
```

如果需要新版完整下载包：

```bash
npm run package:images
```

然后上传新的 Release 附件。
