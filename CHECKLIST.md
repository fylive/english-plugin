# ✅ 项目检查清单

## 安装前检查

- [ ] 已下载或克隆项目到本地
- [ ] 确认浏览器版本（Chrome 88+ 或 Edge 88+）
- [ ] 了解基本的浏览器扩展安装方法

## 安装步骤

### Chrome
- [ ] 打开 `chrome://extensions/`
- [ ] 启用"开发者模式"
- [ ] 点击"加载已解压的扩展程序"
- [ ] 选择项目文件夹
- [ ] 确认插件出现在列表中

### Edge
- [ ] 打开 `edge://extensions/`
- [ ] 启用"开发人员模式"
- [ ] 点击"加载解压缩的扩展"
- [ ] 选择项目文件夹
- [ ] 确认插件出现在列表中

## 功能测试

### 基础功能
- [ ] 打开 `test.html` 测试页面
- [ ] 选中中文文本
- [ ] 看到紫色翻译图标
- [ ] 点击图标弹出翻译面板
- [ ] 翻译面板显示原文
- [ ] 翻译面板显示译文
- [ ] 可以关闭翻译面板

### 多场景测试
- [ ] 简单句子翻译正常
- [ ] 长段落翻译正常
- [ ] 技术文本翻译正常
- [ ] 可以连续翻译多段文本

### 实际网页测试
- [ ] 在新闻网站测试
- [ ] 在博客网站测试
- [ ] 在社交媒体测试
- [ ] 功能正常工作

## 界面检查

- [ ] 翻译按钮样式正确
- [ ] 翻译按钮位置合适
- [ ] 翻译面板样式美观
- [ ] 翻译面板位置合理
- [ ] 动画效果流畅
- [ ] 响应式布局正常

## 设置功能

- [ ] 可以打开popup设置页面
- [ ] 设置界面显示正常
- [ ] 可以输入自定义API
- [ ] 可以保存设置
- [ ] 保存后显示成功提示

## 可选任务

### 图标生成（可选）
- [ ] 打开 `icon-generator.html`
- [ ] 生成或下载图标文件
- [ ] 将图标放入 `icons/` 文件夹
- [ ] 重新加载插件
- [ ] 确认图标显示正常

### 自定义配置（可选）
- [ ] 获取翻译API密钥
- [ ] 在popup中配置API
- [ ] 测试自定义API是否工作
- [ ] 确认翻译质量提升

## 文档阅读

- [ ] 阅读 `QUICKSTART.md`
- [ ] 阅读 `INSTALL.md`
- [ ] 阅读 `README.md`
- [ ] 阅读 `DEMO.md`
- [ ] 阅读 `PROJECT-SUMMARY.md`

## 故障排除

如果遇到问题，检查：
- [ ] 插件是否正确安装
- [ ] 插件是否已启用
- [ ] 网络连接是否正常
- [ ] 浏览器控制台是否有错误
- [ ] 是否在支持的网站上测试

## 完成标志

当以下所有项都完成时，说明插件已成功安装并可以使用：

✅ 插件已安装并启用
✅ 基础功能测试通过
✅ 在实际网页中可以正常使用
✅ 了解如何配置和自定义

---

## 快速检查命令

### 检查必需文件
```bash
# 在项目目录运行
ls -1 manifest.json content.js content.css background.js popup.html popup.js
```

### 检查文件完整性
```bash
# 确认所有核心文件存在
[ -f manifest.json ] && echo "✅ manifest.json" || echo "❌ manifest.json"
[ -f content.js ] && echo "✅ content.js" || echo "❌ content.js"
[ -f content.css ] && echo "✅ content.css" || echo "❌ content.css"
[ -f background.js ] && echo "✅ background.js" || echo "❌ background.js"
[ -f popup.html ] && echo "✅ popup.html" || echo "❌ popup.html"
[ -f popup.js ] && echo "✅ popup.js" || echo "❌ popup.js"
```

---

**祝你使用顺利！** 🎉
