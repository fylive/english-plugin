// 后台服务脚本

// 监听安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // 设置默认配置
    chrome.storage.sync.set({
      enabled: true,
      replaceRatio: 30,
      difficulty: 'medium',
      autoSpeak: true,
      useAI: false, // 默认使用词表模式
      aiApiKey: '',
      aiEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      aiModel: 'qwen-turbo'
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    // 使用AI分析文本并选择要替换的词汇
    analyzeTextWithAI(request.text, request.ratio, request.difficulty, request.pageLanguage)
      .then(result => sendResponse({ success: true, words: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // 保持消息通道开放
  }
});

// 使用AI分析文本
async function analyzeTextWithAI(text, ratio, difficulty, pageLanguage) {
  const config = await chrome.storage.sync.get(['aiApiKey', 'aiEndpoint', 'aiModel']);

  // 如果没有配置API，返回错误
  if (!config.aiApiKey) {
    throw new Error('请先配置AI API密钥');
  }

  // 构建提示词
  const prompt = buildPrompt(text, ratio, difficulty, pageLanguage);

  // 调用AI API - 支持通义千问和OpenAI
  const endpoint = config.aiEndpoint || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  const model = config.aiModel || 'qwen-turbo';

  console.log('[翻译插件] 使用API:', endpoint);
  console.log('[翻译插件] 使用模型:', model);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.aiApiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个英语学习助手，帮助用户选择合适的中文词汇替换为英文，用于沉浸式学习。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[翻译插件] API响应错误:', response.status, errorText);
      throw new Error(`AI API错误: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[翻译插件] 非JSON响应:', text.substring(0, 200));
      throw new Error('API返回了非JSON格式的响应，请检查API地址和密钥是否正确');
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('[翻译插件] 无效的响应格式:', data);
      throw new Error('AI返回了无效的响应格式');
    }

    const result = data.choices[0].message.content;
    console.log('[翻译插件] AI原始响应:', result);

    // 尝试解析JSON
    try {
      // 移除可能的markdown代码块标记
      let jsonStr = result.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(jsonStr);
      console.log('[翻译插件] 解析成功:', parsed);
      return parsed;
    } catch (parseError) {
      console.error('[翻译插件] JSON解析失败:', parseError, '原始内容:', result);
      throw new Error('AI返回的内容无法解析为JSON格式');
    }
  } catch (error) {
    console.error('[翻译插件] AI分析失败:', error);
    throw error;
  }
}

// 构建AI提示词
function buildPrompt(text, ratio, difficulty, pageLanguage) {
  const difficultyDesc = {
    easy: '简单（日常基础词汇）',
    medium: '中等（常用词汇和一些专业词汇）',
    hard: '困难（包括专业术语和复杂词汇）'
  };

  if (pageLanguage === 'chinese') {
    // 中文→英文
    return `
请分析以下中文文本，选择合适的词汇替换为英文，用于英语学习。

文本内容：
${text}

要求：
1. 替换比例：约${ratio}%的词汇
2. 难度级别：${difficultyDesc[difficulty]}
3. 优先选择：
   - 高频常用词
   - 适合学习的词汇
   - 不影响阅读理解的词汇
4. 避免替换：
   - 专有名词
   - 数字和日期
   - 标点符号

请返回JSON格式，格式如下：
{
  "words": [
    {"chinese": "学习", "english": "study"},
    {"chinese": "重要", "english": "important"}
  ]
}

只返回JSON，不要其他说明文字。
`.trim();
  } else {
    // 英文→中文
    return `
Please analyze the following English text and select appropriate words to replace with Chinese for Chinese learning.

Text content:
${text}

Requirements:
1. Replacement ratio: approximately ${ratio}% of words
2. Difficulty level: ${difficultyDesc[difficulty]}
3. Priority selection:
   - High-frequency common words
   - Words suitable for learning
   - Words that don't affect reading comprehension
4. Avoid replacing:
   - Proper nouns
   - Numbers and dates
   - Punctuation marks

Please return JSON format as follows:
{
  "words": [
    {"english": "study", "chinese": "学习"},
    {"english": "important", "chinese": "重要"}
  ]
}

Only return JSON, no other explanatory text.
`.trim();
  }
}
