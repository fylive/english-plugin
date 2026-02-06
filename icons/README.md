# 图标说明

由于无法直接生成PNG图标，你需要自己创建以下尺寸的图标：

- icon16.png (16x16像素)
- icon48.png (48x48像素)
- icon128.png (128x128像素)

## 快速创建图标的方法

### 方法1：使用在线工具
访问 https://www.favicon-generator.org/ 或类似网站，上传一个图片后自动生成多种尺寸。

### 方法2：使用设计工具
使用Figma、Photoshop或任何图像编辑软件创建一个简单的图标：
- 背景：紫色渐变 (#667eea 到 #764ba2)
- 图标：白色的"译"字或"A⇄中"符号

### 方法3：临时使用占位图标
在开发阶段，可以从以下网站下载免费图标：
- https://www.flaticon.com/ (搜索 "translate")
- https://icons8.com/ (搜索 "translation")

### 方法4：使用Emoji作为临时图标
创建一个简单的HTML文件，用浏览器截图：

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 128px;
      height: 128px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-size: 80px;
    }
  </style>
</head>
<body>🌐</body>
</html>
```

将此文件保存为icon.html，在浏览器中打开，然后截图并调整为所需尺寸。

## 注意
在没有图标的情况下，插件仍然可以正常工作，只是在扩展管理页面会显示默认图标。
