# 图标文件说明

## 当前状态

已创建 `icon.svg` 文件，这是一个矢量图标。

## 如何生成PNG图标

### 方法1：使用在线转换工具（推荐）

1. 访问 https://cloudconvert.com/svg-to-png
2. 上传 `icon.svg` 文件
3. 分别设置输出尺寸为 16x16、48x48、128x128
4. 下载转换后的PNG文件
5. 重命名为 `icon16.png`、`icon48.png`、`icon128.png`

### 方法2：使用浏览器

1. 在Chrome/Edge中打开 `icon.svg`
2. 使用浏览器的开发者工具调整显示尺寸
3. 使用截图工具截取图标
4. 保存为对应尺寸的PNG文件

### 方法3：使用命令行工具（需要安装ImageMagick）

```bash
# 安装 ImageMagick (Windows)
# 下载地址: https://imagemagick.org/script/download.php

# 转换命令
magick convert -background none icon.svg -resize 16x16 icon16.png
magick convert -background none icon.svg -resize 48x48 icon48.png
magick convert -background none icon.svg -resize 128x128 icon128.png
```

### 方法4：使用在线图标生成器

访问以下网站下载现成的翻译图标：
- https://www.flaticon.com/ (搜索 "translate")
- https://icons8.com/ (搜索 "translation")
- https://www.iconfinder.com/ (搜索 "translate")

## 临时方案

如果暂时不想处理图标，插件仍然可以正常工作。Chrome/Edge会显示默认的扩展图标。

## 图标设计说明

当前SVG图标设计：
- 背景：紫色渐变 (#667eea 到 #764ba2)
- 图标：白色的"中"字和"A"字，中间有箭头
- 圆角矩形背景，现代简洁风格

你可以根据自己的喜好修改 `icon.svg` 文件。
