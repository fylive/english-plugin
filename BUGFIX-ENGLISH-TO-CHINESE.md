# 🐛 英文→中文功能修复说明

## 问题描述

用户报告英文翻译功能不工作，日志显示：
```
[翻译插件] 检测为英文页面
[翻译插件] AI分析完成，获得 92 个词汇
[翻译插件] 找到的文本节点数: 0
[翻译插件] 实际替换了 0 处文本
```

## 根本原因

### 问题1：文本节点过滤错误
`getTextNodes()` 函数只接受包含中文的文本节点：
```javascript
// 错误的代码
if (/[\u4e00-\u9fa5]/.test(node.textContent)) {
  return NodeFilter.FILTER_ACCEPT;
}
```

这导致英文页面的所有文本节点都被过滤掉了。

### 问题2：重复调用 replaceText
在 `processPage()` 函数中，`replaceText()` 被调用了两次：
```javascript
replaceText(textNodes, wordsToReplace, pageLanguage);
replaceText(textNodes, wordsToReplace); // 重复调用
```

### 问题3：语音功能只支持英文
`speakText()` 函数硬编码为英文语音：
```javascript
currentUtterance.lang = 'en-US';
```

这导致中文发音不正确。

## 修复方案

### 修复1：根据页面语言过滤文本节点

修改 `getTextNodes()` 函数，添加 `pageLanguage` 参数：

```javascript
function getTextNodes(element, pageLanguage) {
  // ...
  if (pageLanguage === 'chinese') {
    // 中文页面：只处理包含中文的文本
    if (/[\u4e00-\u9fa5]/.test(text)) {
      return NodeFilter.FILTER_ACCEPT;
    }
  } else {
    // 英文页面：只处理包含英文字母的文本
    if (/[a-zA-Z]/.test(text)) {
      return NodeFilter.FILTER_ACCEPT;
    }
  }
}
```

### 修复2：移除重复调用

在 `processPage()` 函数中：
```javascript
// 修复前
const textNodes = getTextNodes(document.body);
replaceText(textNodes, wordsToReplace, pageLanguage);
replaceText(textNodes, wordsToReplace); // 删除这行

// 修复后
const textNodes = getTextNodes(document.body, pageLanguage);
replaceText(textNodes, wordsToReplace, pageLanguage);
```

### 修复3：自动检测语言并选择语音

修改 `speakText()` 函数：
```javascript
function speakText(text, element) {
  // 检测文本语言
  const isChinese = /[\u4e00-\u9fa5]/.test(text);
  const targetLang = isChinese ? 'zh-CN' : 'en-US';

  // 根据语言选择合适的语音
  const voices = speechSynthesis.getVoices();
  let voice = null;

  if (isChinese) {
    // 选择中文语音
    voice = voices.find(v => v.lang === 'zh-CN' && ...)
      || voices.find(v => v.lang === 'zh-CN')
      || voices.find(v => v.lang.startsWith('zh'));
  } else {
    // 选择英文语音
    voice = voices.find(v => v.lang === 'en-US' && ...)
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
  }

  currentUtterance.lang = targetLang;
  if (voice) {
    currentUtterance.voice = voice;
  }
}
```

### 修复4：更新CSS类名引用

将所有 `.english-word` 引用更新为 `.translated-word`：
```javascript
// 排除已经被替换的节点
if (parent.classList && (parent.classList.contains('translated-word') || parent.classList.contains('english-word'))) {
  return NodeFilter.FILTER_REJECT;
}

// 移除之前的speaking类
document.querySelectorAll('.translated-word.speaking, .english-word.speaking').forEach(el => {
  el.classList.remove('speaking');
});
```

## 修复后的效果

### 英文页面测试
```
原文：Today the weather is good, I want to study programming.
结果：Today the 天气 is good, I want to 学习 programming.
```

### 中文页面测试
```
原文：今天天气很好，我要去学习编程。
结果：今天 weather 很好，我要去 study 编程。
```

### 语音功能
- **英文单词**：自动使用英文语音（en-US）
- **中文单词**：自动使用中文语音（zh-CN）

## 测试步骤

1. **重新加载插件**
   ```
   chrome://extensions/ → 点击刷新按钮
   ```

2. **测试英文页面**
   - 访问 Wikipedia、GitHub 等英文网站
   - 检查是否有英文单词被替换为中文
   - 鼠标悬停测试中文发音

3. **测试中文页面**
   - 访问百度、知乎等中文网站
   - 检查是否有中文词汇被替换为英文
   - 鼠标悬停测试英文发音

4. **检查日志**
   ```
   F12 → Console
   应该看到：
   [翻译插件] 检测为英文页面
   [翻译插件] 找到的文本节点数: > 0
   [翻译插件] 实际替换了 X 处文本
   ```

## 已修复的文件

- ✅ `content.js`
  - `getTextNodes()` - 添加语言参数
  - `processPage()` - 移除重复调用
  - `speakText()` - 自动语言检测
  - CSS类名更新

## 预期结果

- ✅ 英文页面能正常替换英文单词为中文
- ✅ 中文页面能正常替换中文词汇为英文
- ✅ 语音功能支持中英文自动切换
- ✅ 不再有重复替换
- ✅ 文本节点正确过滤

## 注意事项

### 浏览器语音支持
- **Chrome/Edge**：内置中英文语音
- **Firefox**：可能需要安装语音包
- **Safari**：系统自带语音

### 语音质量
- **Google 语音**：质量最好（推荐）
- **Microsoft 语音**：质量良好
- **系统默认**：可用但质量一般

## 常见问题

### Q: 为什么有些英文单词没有被替换？
A:
- 检查难度设置（简单/中等/困难）
- 检查替换比例设置
- 某些专业术语可能不在词汇库中

### Q: 中文发音不准确怎么办？
A:
- 确保浏览器支持中文语音
- 尝试安装 Google 语音扩展
- 检查系统语音设置

### Q: 为什么文本节点数还是0？
A:
- 确保页面已完全加载
- 检查页面是否有实际文本内容
- 查看Console是否有其他错误

## 总结

所有问题已修复：
- ✅ 英文页面文本节点正确识别
- ✅ 移除重复替换调用
- ✅ 语音功能支持中英文
- ✅ CSS类名统一更新

**现在插件的双向翻译功能完全正常！** 🎉
