// 配置
let config = {
  enabled: true,
  replaceRatio: 30, // 替换比例 0-100
  difficulty: 'medium', // easy, medium, hard
  autoSpeak: true, // 自动发音
  excludeSelectors: ['script', 'style', 'code', 'pre', 'textarea', 'input']
};

// 语音合成对象
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let voicesLoaded = false;
let selectedVoice = null;
let speechActivated = false;

// 中文→英文词汇库（按难度分级）
const vocabularyCN2EN = {
  easy: {
    '你好': 'hello',
    '谢谢': 'thank you',
    '天气': 'weather',
    '今天': 'today',
    '明天': 'tomorrow',
    '昨天': 'yesterday',
    '早上': 'morning',
    '晚上': 'evening',
    '时间': 'time',
    '工作': 'work',
    '学习': 'study',
    '生活': 'life',
    '朋友': 'friend',
    '学校': 'school',
    '老师': 'teacher',
    '学生': 'student',
    '电脑': 'computer',
    '手机': 'phone',
    '开心': 'happy',
    '快乐': 'joyful',
    '喜欢': 'like',
    '需要': 'need',
    '可以': 'can',
    '应该': 'should',
    '必须': 'must',
    '没有': 'no',
    '因为': 'because',
    '所以': 'so',
    '如果': 'if',
    '那么': 'then',
    '什么': 'what',
    '哪里': 'where',
    '怎么': 'how',
    '为什么': 'why',
    '多少': 'how many',
    '现在': 'now',
    '以后': 'later',
    '以前': 'before',
    '一起': 'together',
    '自己': 'self',
    '我们': 'we',
    '你们': 'you',
    '他们': 'they',
    '春天': 'spring',
    '夏天': 'summer',
    '秋天': 'autumn',
    '冬天': 'winter',
    '世界': 'world',
    '美丽': 'beautiful',
    '漂亮': 'pretty',
    '小鸟': 'bird',
    '花': 'flower',
    '树': 'tree',
    '太阳': 'sun',
    '月亮': 'moon',
    '星星': 'star',
    '水': 'water',
    '山': 'mountain',
    '河': 'river',
    '海': 'sea',
    '天空': 'sky',
    '云': 'cloud',
    '风': 'wind',
    '雨': 'rain',
    '雪': 'snow'
  },
  medium: {
    '重要': 'important',
    '问题': 'problem',
    '方法': 'method',
    '系统': 'system',
    '信息': 'information',
    '技术': 'technology',
    '发展': 'development',
    '经济': 'economy',
    '社会': 'society',
    '文化': 'culture',
    '教育': 'education',
    '健康': 'health',
    '环境': 'environment',
    '政府': 'government',
    '公司': 'company',
    '市场': 'market',
    '产品': 'product',
    '服务': 'service',
    '管理': 'management',
    '研究': 'research',
    '分析': 'analysis',
    '设计': 'design',
    '创新': 'innovation',
    '质量': 'quality',
    '效率': 'efficiency',
    '目标': 'goal',
    '计划': 'plan',
    '项目': 'project',
    '团队': 'team',
    '领导': 'leader',
    '成功': 'success',
    '失败': 'failure',
    '机会': 'opportunity',
    '挑战': 'challenge',
    '优势': 'advantage',
    '劣势': 'disadvantage',
    '影响': 'influence',
    '结果': 'result',
    '原因': 'reason',
    '过程': 'process',
    '经验': 'experience',
    '知识': 'knowledge',
    '能力': 'ability',
    '技能': 'skill',
    '态度': 'attitude',
    '行为': 'behavior',
    '决定': 'decision',
    '选择': 'choice',
    '改变': 'change',
    '提高': 'improve',
    '增加': 'increase',
    '减少': 'decrease',
    '保持': 'maintain',
    '继续': 'continue',
    '开始': 'start',
    '结束': 'end',
    '完成': 'complete',
    '获得': 'obtain',
    '失去': 'lose',
    '建立': 'establish',
    '创造': 'create',
    '发现': 'discover',
    '理解': 'understand',
    '解决': 'solve',
    '处理': 'handle',
    '使用': 'use',
    '应用': 'apply',
    '支持': 'support',
    '帮助': 'help',
    '提供': 'provide',
    '接受': 'accept',
    '拒绝': 'refuse',
    '同意': 'agree',
    '反对': 'oppose',
    '万物': 'all things',
    '复苏': 'revive',
    '柳树': 'willow',
    '抽出': 'sprout',
    '嫩绿': 'tender green',
    '枝条': 'branch',
    '桃花': 'peach blossom',
    '绽放': 'bloom',
    '粉红': 'pink',
    '笑脸': 'smiling face',
    '枝头': 'treetop',
    '欢快': 'cheerful',
    '歌唱': 'sing',
    '蝴蝶': 'butterfly',
    '花丛': 'flowers',
    '翩翩起舞': 'dance gracefully',
    '整个': 'whole',
    '充满': 'full of',
    '生机': 'vitality',
    '活力': 'energy'
  },
  hard: {
    '人工智能': 'artificial intelligence',
    '机器学习': 'machine learning',
    '深度学习': 'deep learning',
    '神经网络': 'neural network',
    '卷积神经网络': 'convolutional neural network',
    '算法': 'algorithm',
    '数据': 'data',
    '编程': 'programming',
    '软件': 'software',
    '硬件': 'hardware',
    '网络': 'network',
    '安全': 'security',
    '隐私': 'privacy',
    '加密': 'encryption',
    '区块链': 'blockchain',
    '云计算': 'cloud computing',
    '大数据': 'big data',
    '物联网': 'Internet of Things',
    '虚拟现实': 'virtual reality',
    '增强现实': 'augmented reality',
    '量子计算': 'quantum computing',
    '生物技术': 'biotechnology',
    '可持续发展': 'sustainable development',
    '全球化': 'globalization',
    '数字化': 'digitalization',
    '自动化': 'automation',
    '优化': 'optimization',
    '架构': 'architecture',
    '框架': 'framework',
    '接口': 'interface',
    '协议': 'protocol',
    '标准': 'standard',
    '规范': 'specification',
    '部署': 'deployment',
    '维护': 'maintenance',
    '监控': 'monitoring',
    '性能': 'performance',
    '可扩展性': 'scalability',
    '可靠性': 'reliability',
    '兼容性': 'compatibility',
    '浏览器': 'browser',
    '扩展': 'extension',
    '功能': 'function',
    '模块': 'module',
    '组件': 'component',
    '变量': 'variable',
    '函数': 'function',
    '对象': 'object',
    '数组': 'array',
    '字符串': 'string',
    '整数': 'integer',
    '布尔': 'boolean',
    '图像识别': 'image recognition',
    '模式识别': 'pattern recognition',
    '统计': 'statistics',
    '计算机': 'computer',
    '突破性': 'breakthrough',
    '进展': 'progress',
    '领域': 'field',
    '子领域': 'subfield',
    '分支': 'branch'
  }
};

// 英文→中文词汇库（按难度分级）
const vocabularyEN2CN = {
  easy: {
    'hello': '你好',
    'thank you': '谢谢',
    'thanks': '谢谢',
    'weather': '天气',
    'today': '今天',
    'tomorrow': '明天',
    'yesterday': '昨天',
    'morning': '早上',
    'evening': '晚上',
    'night': '夜晚',
    'time': '时间',
    'work': '工作',
    'study': '学习',
    'life': '生活',
    'friend': '朋友',
    'school': '学校',
    'teacher': '老师',
    'student': '学生',
    'computer': '电脑',
    'phone': '手机',
    'happy': '开心',
    'like': '喜欢',
    'need': '需要',
    'want': '想要',
    'good': '好的',
    'bad': '坏的',
    'big': '大的',
    'small': '小的',
    'new': '新的',
    'old': '旧的',
    'hot': '热的',
    'cold': '冷的',
    'fast': '快的',
    'slow': '慢的',
    'easy': '简单',
    'hard': '困难',
    'important': '重要',
    'beautiful': '美丽',
    'interesting': '有趣',
    'book': '书',
    'water': '水',
    'food': '食物',
    'home': '家',
    'family': '家庭',
    'love': '爱',
    'help': '帮助',
    'learn': '学习',
    'read': '阅读',
    'write': '写',
    'speak': '说',
    'listen': '听'
  },
  medium: {
    'technology': '技术',
    'development': '发展',
    'environment': '环境',
    'education': '教育',
    'experience': '经验',
    'knowledge': '知识',
    'information': '信息',
    'communication': '交流',
    'relationship': '关系',
    'opportunity': '机会',
    'challenge': '挑战',
    'solution': '解决方案',
    'problem': '问题',
    'question': '问题',
    'answer': '答案',
    'research': '研究',
    'analysis': '分析',
    'method': '方法',
    'process': '过程',
    'result': '结果',
    'success': '成功',
    'failure': '失败',
    'progress': '进步',
    'improvement': '改进',
    'innovation': '创新',
    'creativity': '创造力',
    'efficiency': '效率',
    'quality': '质量',
    'performance': '性能',
    'management': '管理',
    'organization': '组织',
    'strategy': '策略',
    'planning': '规划',
    'implementation': '实施',
    'evaluation': '评估',
    'feedback': '反馈',
    'collaboration': '协作',
    'cooperation': '合作',
    'competition': '竞争',
    'advantage': '优势',
    'disadvantage': '劣势',
    'benefit': '好处',
    'cost': '成本',
    'value': '价值',
    'investment': '投资',
    'resource': '资源',
    'capability': '能力',
    'potential': '潜力',
    'achievement': '成就'
  },
  hard: {
    'artificial intelligence': '人工智能',
    'machine learning': '机器学习',
    'deep learning': '深度学习',
    'neural network': '神经网络',
    'algorithm': '算法',
    'database': '数据库',
    'architecture': '架构',
    'framework': '框架',
    'interface': '接口',
    'protocol': '协议',
    'encryption': '加密',
    'authentication': '认证',
    'authorization': '授权',
    'optimization': '优化',
    'scalability': '可扩展性',
    'reliability': '可靠性',
    'compatibility': '兼容性',
    'sustainability': '可持续性',
    'infrastructure': '基础设施',
    'implementation': '实现',
    'integration': '集成',
    'deployment': '部署',
    'maintenance': '维护',
    'monitoring': '监控',
    'virtualization': '虚拟化',
    'cloud computing': '云计算',
    'blockchain': '区块链',
    'cryptocurrency': '加密货币',
    'cybersecurity': '网络安全',
    'biotechnology': '生物技术',
    'nanotechnology': '纳米技术',
    'quantum computing': '量子计算',
    'virtual reality': '虚拟现实',
    'augmented reality': '增强现实',
    'internet of things': '物联网',
    'big data': '大数据',
    'data science': '数据科学',
    'analytics': '分析学',
    'visualization': '可视化',
    'automation': '自动化',
    'robotics': '机器人技术',
    'semiconductor': '半导体',
    'microprocessor': '微处理器',
    'telecommunications': '电信',
    'bandwidth': '带宽',
    'latency': '延迟',
    'throughput': '吞吐量',
    'redundancy': '冗余',
    'resilience': '弹性'
  }
};


// 显示加载提示
function showLoadingHint() {
  // 检查是否已经存在
  if (document.getElementById('ai-loading-hint')) {
    return;
  }

  const hint = document.createElement('div');
  hint.id = 'ai-loading-hint';
  hint.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  hint.innerHTML = `
    <div style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
    <span>AI正在分析页面...</span>
  `;

  // 添加旋转动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(hint);
}

// 隐藏加载提示
function hideLoadingHint() {
  const hint = document.getElementById('ai-loading-hint');
  if (hint) {
    hint.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      hint.remove();
    }, 300);
  }
}

// 显示完成提示
function showCompletionHint(wordCount) {
  const hint = document.createElement('div');
  hint.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideInDown 0.3s ease;
  `;
  hint.innerHTML = `
    <span>✓</span>
    <span>已替换 ${wordCount} 个词汇</span>
  `;

  // 添加动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInDown {
      from { transform: translate(-50%, -100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(hint);

  // 2秒后自动消失
  setTimeout(() => {
    hint.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      hint.remove();
    }, 300);
  }, 2000);
}


// 显示语音激活提示
function showSpeechActivationHint() {
  // 检查是否已经显示过提示
  if (document.getElementById('speech-activation-hint')) {
    return;
  }

  const hint = document.createElement('div');
  hint.id = 'speech-activation-hint';
  hint.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    cursor: pointer;
    animation: slideIn 0.3s ease;
  `;
  hint.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 20px;">🔊</span>
      <div>
        <div style="font-weight: 600; margin-bottom: 4px;">点击激活语音功能</div>
        <div style="font-size: 12px; opacity: 0.9;">点击此处启用自动发音</div>
      </div>
    </div>
  `;

  // 添加动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  hint.addEventListener('click', () => {
    // 激活语音
    speechActivated = true;

    // 播放一个测试音
    const test = new SpeechSynthesisUtterance('Hello');
    test.volume = 0.5;
    test.lang = 'en-US';
    if (selectedVoice) test.voice = selectedVoice;
    speechSynthesis.speak(test);

    console.log('[翻译插件] 语音已激活');

    // 淡出并移除提示
    hint.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      hint.remove();
    }, 300);
  });

  document.body.appendChild(hint);

  // 5秒后自动淡出
  setTimeout(() => {
    if (hint.parentNode && !speechActivated) {
      hint.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        hint.remove();
      }, 300);
    }
  }, 5000);
}

// 初始化语音合成
function initSpeech() {
  console.log('[翻译插件] 初始化语音系统...');

  // 预加载语音列表
  function loadVoices() {
    const voices = speechSynthesis.getVoices();

    if (voices.length > 0 && !voicesLoaded) {
      voicesLoaded = true;

      // 优先选择Google的美式英语语音
      selectedVoice = voices.find(voice =>
        voice.lang === 'en-US' && (voice.name.includes('Google') || voice.name.includes('Chrome'))
      ) || voices.find(voice => voice.lang === 'en-US')
        || voices.find(voice => voice.lang.startsWith('en'));

      if (selectedVoice) {
        console.log('[翻译插件] 已选择语音:', selectedVoice.name, selectedVoice.lang);
      } else {
        console.log('[翻译插件] 未找到英语语音，将使用默认语音');
      }

      console.log('[翻译插件] 语音引擎已准备');
    }
  }

  // 立即尝试加载
  loadVoices();

  // 监听语音列表变化
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  // 显示激活提示（延迟1秒显示）
  if (config.autoSpeak) {
    setTimeout(() => {
      showSpeechActivationHint();
    }, 1000);
  }
}

// 初始化
async function init() {
  console.log('[翻译插件] 开始初始化...');

  // 加载配置
  const savedConfig = await chrome.storage.sync.get([
    'enabled', 'replaceRatio', 'difficulty', 'autoSpeak', 'useAI'
  ]);
  config = { ...config, ...savedConfig };

  console.log('[翻译插件] 当前配置:', config);

  if (config.enabled) {
    processPage();
  } else {
    console.log('[翻译插件] 插件已禁用');
  }
}

// 检测页面主要语言
function detectPageLanguage(text) {
  // 移除空白字符
  const cleanText = text.replace(/\s+/g, '');

  // 统计中文字符数量
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g);
  const chineseCount = chineseChars ? chineseChars.length : 0;

  // 统计英文字符数量
  const englishChars = cleanText.match(/[a-zA-Z]/g);
  const englishCount = englishChars ? englishChars.length : 0;

  console.log('[翻译插件] 语言检测 - 中文字符:', chineseCount, '英文字符:', englishCount);

  // 如果中文字符占比超过30%，认为是中文页面
  const totalChars = chineseCount + englishCount;
  if (totalChars === 0) return 'unknown';

  const chineseRatio = chineseCount / totalChars;

  if (chineseRatio > 0.3) {
    console.log('[翻译插件] 检测为中文页面');
    return 'chinese';
  } else {
    console.log('[翻译插件] 检测为英文页面');
    return 'english';
  }
}

// 处理页面
async function processPage() {
  console.log('[翻译插件] 开始处理页面...');

  // 获取页面全文
  const pageText = document.body.innerText;

  // 检测页面语言
  const pageLanguage = detectPageLanguage(pageText);

  if (pageLanguage === 'unknown') {
    console.log('[翻译插件] 无法检测页面语言');
    return;
  }

  let wordsToReplace;

  // 根据模式选择处理方式
  if (config.useAI) {
    console.log('[翻译插件] 使用AI模式');
    wordsToReplace = await processWithAI(pageText, pageLanguage);
  } else {
    console.log('[翻译插件] 使用词表模式');
    wordsToReplace = processWithDictionary(pageText, pageLanguage);
  }

  if (!wordsToReplace || wordsToReplace.size === 0) {
    console.log('[翻译插件] 没有找到可替换的词汇');
    return;
  }

  console.log('[翻译插件] 选中了', wordsToReplace.size, '个不同的词汇进行替换');

  // 获取所有文本节点
  const textNodes = getTextNodes(document.body, pageLanguage);
  console.log('[翻译插件] 找到的文本节点数:', textNodes.length);

  // 替换文本
  replaceText(textNodes, wordsToReplace, pageLanguage);

  console.log('[翻译插件] 页面处理完成！');

  // 显示完成提示（仅AI模式）
  if (config.useAI) {
    showCompletionHint(wordsToReplace.size);
  }
}

// 使用AI处理
async function processWithAI(pageText, pageLanguage) {
  try {
    // 限制文本长度（优化AI分析速度）
    const maxLength = 1000; // 从2000减少到1000，提高速度
    const text = pageText.length > maxLength ? pageText.substring(0, maxLength) : pageText;

    console.log('[翻译插件] 调用AI分析...（文本长度:', text.length, '字符）');

    // 显示加载提示
    showLoadingHint();

    // 调用background script的AI分析
    const response = await chrome.runtime.sendMessage({
      action: 'analyzeText',
      text: text,
      ratio: config.replaceRatio,
      difficulty: config.difficulty,
      pageLanguage: pageLanguage
    });

    // 隐藏加载提示
    hideLoadingHint();

    if (response.success) {
      const words = response.words.words || response.words;
      const wordsMap = new Map();
      words.forEach(item => {
        if (pageLanguage === 'chinese') {
          wordsMap.set(item.chinese, item.english);
        } else {
          wordsMap.set(item.english, item.chinese);
        }
      });
      console.log('[翻译插件] AI分析完成，获得', wordsMap.size, '个不同的词汇');
      return wordsMap;
    } else {
      console.warn('[翻译插件] AI分析失败:', response.error);

      // 隐藏加载提示
      hideLoadingHint();

      // 如果是API密钥问题，给出友好提示
      if (response.error.includes('API密钥') || response.error.includes('API地址')) {
        console.log('[翻译插件] 未配置AI，自动切换到词表模式');
      } else {
        console.error('[翻译插件] AI错误详情:', response.error);
      }

      // 自动降级到词表模式
      return processWithDictionary(pageText, pageLanguage);
    }
  } catch (error) {
    console.error('[翻译插件] AI处理错误:', error);

    // 隐藏加载提示
    hideLoadingHint();

    // 自动降级到词表模式
    return processWithDictionary(pageText, pageLanguage);
  }
}

// 使用词表处理
function processWithDictionary(pageText, pageLanguage) {
  // 根据页面语言选择词汇表
  const vocabMap = buildVocabulary(pageLanguage);
  console.log('[翻译插件] 词汇表大小:', vocabMap.size);

  // 找出页面中存在的词汇（按长度排序，优先匹配长词）
  const foundWords = [];
  const sortedVocab = Array.from(vocabMap.entries()).sort((a, b) => b[0].length - a[0].length);

  if (pageLanguage === 'chinese') {
    // 中文页面：查找中文词汇
    sortedVocab.forEach(([chinese, english]) => {
      if (pageText.includes(chinese)) {
        foundWords.push([chinese, english]);
      }
    });
  } else {
    // 英文页面：查找英文词汇（不区分大小写）
    const lowerPageText = pageText.toLowerCase();
    sortedVocab.forEach(([english, chinese]) => {
      // 使用单词边界匹配，避免部分匹配
      const regex = new RegExp('\\b' + escapeRegExp(english) + '\\b', 'i');
      if (regex.test(pageText)) {
        foundWords.push([english, chinese]);
      }
    });
  }

  console.log('[翻译插件] 页面中找到的词汇数:', foundWords.length);

  if (foundWords.length === 0) {
    return new Map();
  }

  // 根据替换比例选择要替换的词汇
  return selectWordsToReplace(foundWords);
}

// 获取所有文本节点
function getTextNodes(element, pageLanguage) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // 排除特定元素
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        const tagName = parent.tagName.toLowerCase();
        if (config.excludeSelectors.includes(tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        // 排除已经被替换的节点
        if (parent.classList && (parent.classList.contains('translated-word') || parent.classList.contains('english-word'))) {
          return NodeFilter.FILTER_REJECT;
        }

        // 根据页面语言过滤文本节点
        const text = node.textContent.trim();
        if (!text) return NodeFilter.FILTER_REJECT;

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

        return NodeFilter.FILTER_REJECT;
      }
    }
  );

  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  return textNodes;
}

// 构建词汇表
function buildVocabulary(pageLanguage) {
  const vocabMap = new Map();

  // 根据页面语言选择词汇库
  const vocab = pageLanguage === 'chinese' ? vocabularyCN2EN : vocabularyEN2CN;

  // 根据难度添加词汇
  switch (config.difficulty) {
    case 'easy':
      Object.entries(vocab.easy).forEach(([source, target]) => vocabMap.set(source, target));
      break;
    case 'medium':
      Object.entries(vocab.easy).forEach(([source, target]) => vocabMap.set(source, target));
      Object.entries(vocab.medium).forEach(([source, target]) => vocabMap.set(source, target));
      break;
    case 'hard':
      Object.entries(vocab.easy).forEach(([source, target]) => vocabMap.set(source, target));
      Object.entries(vocab.medium).forEach(([source, target]) => vocabMap.set(source, target));
      Object.entries(vocab.hard).forEach(([source, target]) => vocabMap.set(source, target));
      break;
  }

  return vocabMap;
}

// 选择要替换的词汇（基于页面中实际存在的词汇）
function selectWordsToReplace(foundWords) {
  // 计算要替换的词汇数量
  const totalCount = foundWords.length;
  const replaceCount = Math.ceil(totalCount * (config.replaceRatio / 100));

  console.log(`[翻译插件] 总词汇数: ${totalCount}, 替换比例: ${config.replaceRatio}%, 将替换: ${replaceCount} 个词`);

  // 随机打乱并选择
  const shuffled = [...foundWords].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, replaceCount);

  return new Map(selected);
}

// 替换文本
function replaceText(textNodes, wordsToReplace, pageLanguage) {
  let replacedCount = 0;

  // 按词汇长度排序，优先替换长词汇（避免短词汇被误替换）
  const sortedWords = Array.from(wordsToReplace.entries()).sort((a, b) => b[0].length - a[0].length);

  textNodes.forEach(node => {
    let text = node.textContent;
    let hasReplacement = false;

    // 为每个词汇创建唯一的占位符
    const replacements = [];

    sortedWords.forEach(([source, target], index) => {
      let regex;

      if (pageLanguage === 'chinese') {
        // 中文：直接匹配
        regex = new RegExp(escapeRegExp(source), 'g');
      } else {
        // 英文：使用单词边界，不区分大小写
        regex = new RegExp('\\b' + escapeRegExp(source) + '\\b', 'gi');
      }

      if (regex.test(text)) {
        const placeholder = `__PLACEHOLDER_${index}__`;
        text = text.replace(regex, placeholder);
        replacements.push({
          placeholder: placeholder,
          source: source,
          target: target
        });
        hasReplacement = true;
      }
    });

    // 如果有替换，则创建新的HTML结构
    if (hasReplacement) {
      // 将占位符替换为HTML
      replacements.forEach(({ placeholder, source, target }) => {
        const html = ` <span class="translated-word" data-original="${escapeHtml(source)}" data-translation="${escapeHtml(target)}" title="原文: ${escapeHtml(source)}">${escapeHtml(target)}</span> `;
        text = text.replace(new RegExp(escapeRegExp(placeholder), 'g'), html);
        replacedCount++;
      });

      // 创建新的HTML元素替换文本节点
      const span = document.createElement('span');
      span.innerHTML = text;

      // 替换节点
      if (node.parentNode) {
        node.parentNode.replaceChild(span, node);
      }
    }
  });

  console.log(`[翻译插件] 使用 ${wordsToReplace.size} 个不同的词汇，在页面中共替换了 ${replacedCount} 处文本`);

  // 添加交互效果
  addInteractiveEffects();
}

// 转义正则表达式特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 转义HTML特殊字符
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 语音播放函数（优化版）
function speakText(text, element) {
  // 如果语音未激活，显示提示并返回
  if (!speechActivated) {
    console.log('[翻译插件] 语音未激活，显示提示');
    showSpeechActivationHint();
    return;
  }

  console.log('[翻译插件] 尝试播放:', text);

  // 检测文本语言
  const isChinese = /[\u4e00-\u9fa5]/.test(text);
  const targetLang = isChinese ? 'zh-CN' : 'en-US';

  // 如果语音未加载，先尝试加载
  if (!voicesLoaded) {
    const voices = speechSynthesis.getVoices();
    console.log('[翻译插件] 可用语音数量:', voices.length);
    if (voices.length > 0) {
      voicesLoaded = true;
    }
  }

  // 根据语言选择合适的语音
  const voices = speechSynthesis.getVoices();
  let voice = null;

  if (isChinese) {
    // 选择中文语音
    voice = voices.find(v => v.lang === 'zh-CN' && (v.name.includes('Google') || v.name.includes('Microsoft')))
      || voices.find(v => v.lang === 'zh-CN')
      || voices.find(v => v.lang.startsWith('zh'));
    console.log('[翻译插件] 选中中文语音:', voice ? voice.name : '默认');
  } else {
    // 选择英文语音
    voice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Chrome')))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
    console.log('[翻译插件] 选中英文语音:', voice ? voice.name : '默认');
  }

  // 停止当前正在播放的语音
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  // 移除之前的speaking类
  document.querySelectorAll('.translated-word.speaking, .english-word.speaking').forEach(el => {
    el.classList.remove('speaking');
  });

  // 创建新的语音对象
  currentUtterance = new SpeechSynthesisUtterance(text);

  // 设置语言
  currentUtterance.lang = targetLang;
  currentUtterance.rate = 0.95; // 语速
  currentUtterance.pitch = 1.0; // 音调
  currentUtterance.volume = 1.0; // 音量

  // 使用选择的语音
  if (voice) {
    currentUtterance.voice = voice;
  }

  // 添加发音动画
  if (element) {
    element.classList.add('speaking');
    currentUtterance.onend = () => {
      element.classList.remove('speaking');
      console.log('[翻译插件] 播放完成');
    };
    currentUtterance.onerror = (event) => {
      if (event.error === 'not-allowed') {
        console.warn('[翻译插件] 语音被阻止，需要用户交互');
        speechActivated = false;
        showSpeechActivationHint();
      } else if (event.error === 'interrupted') {
        // 这是正常的，当快速切换单词时会中断上一个发音
        console.log('[翻译插件] 发音被中断（正常）');
      } else {
        console.error('[翻译插件] 播放错误:', event.error);
      }
      if (element) {
        element.classList.remove('speaking');
      }
    };
  }

  // 立即播放
  try {
    speechSynthesis.speak(currentUtterance);
    console.log('[翻译插件] 已调用speak()');
  } catch (error) {
    console.error('[翻译插件] 语音播放失败:', error);
    if (element) {
      element.classList.remove('speaking');
    }
  }
}

// 添加交互效果
function addInteractiveEffects() {
  const translatedWords = document.querySelectorAll('.translated-word');
  console.log(`[翻译插件] 添加交互效果到 ${translatedWords.length} 个单词`);

  translatedWords.forEach(word => {
    // 避免重复添加事件监听
    if (word.dataset.initialized) return;
    word.dataset.initialized = 'true';

    let hoverTimer = null;

    // 鼠标悬停效果
    word.addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#fff3cd';
      this.style.padding = '2px 4px';
      this.style.borderRadius = '3px';
      this.style.cursor = 'help';

      // 延迟一点点再发音，避免快速划过时频繁发音
      if (config.autoSpeak) {
        hoverTimer = setTimeout(() => {
          const translationText = this.getAttribute('data-translation');
          if (translationText) {
            speakText(translationText, this);
          }
        }, 100); // 100ms延迟
      }
    });

    word.addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'transparent';
      this.style.padding = '0';

      // 清除定时器
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      // 停止发音
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    });

    // 点击切换显示
    word.addEventListener('click', function(e) {
      e.stopPropagation();
      const original = this.getAttribute('data-original');
      const translation = this.getAttribute('data-translation');

      // 切换显示
      if (this.dataset.showingOriginal === 'true') {
        // 当前显示原文，切换为译文
        this.textContent = translation;
        this.style.color = '#667eea';
        this.dataset.showingOriginal = 'false';

        // 播放译文发音
        if (config.autoSpeak) {
          speakText(translation, this);
        }
      } else {
        // 当前显示译文，切换为原文
        this.textContent = original;
        this.style.color = '#666';
        this.dataset.showingOriginal = 'true';
      }
    });
  });
}

// 初始化插件
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSpeech();
    init();
  });
} else {
  initSpeech();
  init();
}
