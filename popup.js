// 加载保存的设置
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

// 加载设置
async function loadSettings() {
  const settings = await chrome.storage.sync.get([
    'enabled', 'replaceRatio', 'difficulty', 'autoSpeak',
    'useAI', 'aiApiKey', 'aiEndpoint', 'aiModel', 'aiService'
  ]);

  // 设置开关状态
  if (settings.enabled !== undefined) {
    document.getElementById('enableSwitch').checked = settings.enabled;
  }

  // 设置替换比例
  if (settings.replaceRatio !== undefined) {
    document.getElementById('ratioSlider').value = settings.replaceRatio;
    document.getElementById('ratioValue').textContent = settings.replaceRatio;
  }

  // 设置难度
  if (settings.difficulty) {
    document.getElementById(settings.difficulty).checked = true;
  }

  // 设置自动发音
  if (settings.autoSpeak !== undefined) {
    document.getElementById('autoSpeakSwitch').checked = settings.autoSpeak;
  }

  // 设置选词模式
  const mode = settings.useAI ? 'ai' : 'dict';
  document.getElementById(mode === 'ai' ? 'modeAI' : 'modeDict').checked = true;
  toggleAISettings(mode === 'ai');

  // 设置AI服务
  const aiService = settings.aiService || 'qwen';
  document.getElementById('aiService').value = aiService;
  toggleCustomSettings(aiService === 'custom');

  // 设置AI配置
  if (settings.aiApiKey) {
    document.getElementById('aiApiKey').value = settings.aiApiKey;
  }
  if (settings.aiEndpoint) {
    document.getElementById('aiEndpoint').value = settings.aiEndpoint;
  }
  if (settings.aiModel) {
    document.getElementById('aiModel').value = settings.aiModel;
  }
}

// 切换AI设置显示
function toggleAISettings(show) {
  document.getElementById('aiSettings').style.display = show ? 'block' : 'none';
}

// 切换自定义设置显示
function toggleCustomSettings(show) {
  document.getElementById('customEndpoint').style.display = show ? 'block' : 'none';
  document.getElementById('customModel').style.display = show ? 'block' : 'none';
}

// 设置事件监听
function setupEventListeners() {
  // 滑块变化
  const ratioSlider = document.getElementById('ratioSlider');
  const ratioValue = document.getElementById('ratioValue');

  ratioSlider.addEventListener('input', (e) => {
    ratioValue.textContent = e.target.value;
  });

  // 应用按钮
  document.getElementById('applyBtn').addEventListener('click', saveSettings);

  // 开关变化时立即保存
  document.getElementById('enableSwitch').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ enabled: e.target.checked });

    // 刷新当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.reload(tab.id);
  });

  // 自动发音开关
  document.getElementById('autoSpeakSwitch').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ autoSpeak: e.target.checked });
  });

  // 选词模式切换
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleAISettings(e.target.value === 'ai');
    });
  });

  // AI服务切换
  document.getElementById('aiService').addEventListener('change', (e) => {
    toggleCustomSettings(e.target.value === 'custom');
  });
}

// 保存设置
async function saveSettings() {
  const enabled = document.getElementById('enableSwitch').checked;
  const replaceRatio = parseInt(document.getElementById('ratioSlider').value);
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  const autoSpeak = document.getElementById('autoSpeakSwitch').checked;
  const useAI = document.querySelector('input[name="mode"]:checked').value === 'ai';
  const aiService = document.getElementById('aiService').value;
  const aiApiKey = document.getElementById('aiApiKey').value.trim();

  // 根据选择的服务设置endpoint和model
  let aiEndpoint, aiModel;

  if (aiService === 'qwen') {
    aiEndpoint = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    aiModel = 'qwen-turbo';
  } else if (aiService === 'openai') {
    aiEndpoint = 'https://api.openai.com/v1/chat/completions';
    aiModel = 'gpt-3.5-turbo';
  } else {
    // 自定义
    aiEndpoint = document.getElementById('aiEndpoint').value.trim();
    aiModel = document.getElementById('aiModel').value.trim();
  }

  // 验证AI模式配置
  if (useAI && !aiApiKey) {
    alert('AI模式需要配置API密钥！');
    return;
  }

  if (useAI && aiService === 'custom' && (!aiEndpoint || !aiModel)) {
    alert('自定义模式需要配置API地址和模型名称！');
    return;
  }

  await chrome.storage.sync.set({
    enabled: enabled,
    replaceRatio: replaceRatio,
    difficulty: difficulty,
    autoSpeak: autoSpeak,
    useAI: useAI,
    aiService: aiService,
    aiApiKey: aiApiKey,
    aiEndpoint: aiEndpoint,
    aiModel: aiModel
  });

  // 显示保存成功提示
  const status = document.getElementById('status');
  status.classList.add('show');

  // 刷新当前标签页
  setTimeout(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.reload(tab.id);
    window.close();
  }, 500);
}
