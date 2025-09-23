<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>AI助手</h1>
      <div class="header-buttons">
        <button class="header-btn history-btn" title="查看历史" @click="showHistory">查看历史</button>
        <button class="header-btn history-btn" title="清除历史" @click="clearHistory">删除会话历史</button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div ref="chatBox" class="chat-box">
      <!-- 渲染 messages 里面的消息 -->
      <div v-for="(msg, index) in messages" :key="index" :class="['chat-msg', msg.role]">
        <div class="bubble">
          <span class="role-label">{{ msg.role === 'user' ? '🧑‍💻 我' : '🤖 模型' }}</span>
          <div class="text">
            {{ msg.text }}
          </div>
        </div>
      </div>
      <!-- loading效果 -->
      <div v-if="loading" class="chat-msg bot">
        <div class="bubble">
          <span class="role-label">🤖 模型</span>
          <div class="text">正在思考<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
        </div>
      </div>
    </div>

    <form class="input-area" @submit.prevent="handleSubmit">
      <input v-model="input" type="text" placeholder="请输入您的问题..." />
      <button type="submit">发送</button>
    </form>

    <!-- 历史记录的模态框 -->
    <div v-if="showHistoryModal" class="modal-overlay" @click="closeHistory">
      <div class="modal-content" @click.stop>
        <!-- header -->
        <div class="modal-header">
          <h3>对话历史记录</h3>
          <button class="close-btn" @click="closeHistory">✖️</button>
        </div>
        <!-- content -->
        <div class="modal-body">
          <div v-if="historyData.length === 0" class="no-history">暂时没有历史会话</div>
          <div v-else class="history-list">
            <div v-for="(msg, index) in historyData" :key="index" :class="['history-msg', msg.role]">
              <div class="history-bubble">
                <span class="role-label">{{ msg.role === 'user' ? '🧑‍💻 我' : '🤖 模型' }}</span>
                <div class="text">
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- footer -->
        <div class="modal-footer">
          <button class="modal-btn" @click="closeHistory">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import type {
  ChatMessage,
  HistoryListResponse,
  HistoryMessage,
  ScrollableElement,
  ServerEventPayload,
  StreamingResponse
} from './types/chat';
const input = ref(''); // 和输入框做双向绑定
const chatBox = ref<ScrollableElement | null>(null); // 绑定聊天框，通过这个 ref 拿到聊天框的 DOM 元素

const messages = ref<ChatMessage[]>([]); // 用于存放模型以及用户的消息
const loading = ref(false); // 控制 loading 是否显示

async function handleSubmit() {
  // 1. 拿到用户输入的内容
  const question = input.value.trim();
  if (!question) return;

  // 2.将用户的消息放入 messages
  messages.value.push({
    role: 'user',
    text: question
  });
  // 将输入框清空
  input.value = '';
  loading.value = true;

  // 拿到 DOM 元素的最新状态
  await nextTick();

  // 让聊天页面做一个滚动
  chatBox.value?.scrollTo({
    top: chatBox.value.scrollHeight,
    behavior: 'smooth'
  });

  // 3. 发送请求到代理服务器
  const res = (await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  })) as unknown as StreamingResponse;

  // 现在 res 拿到的是流
  const reader = res.body?.getReader(); // 先创建一个 reader 对象
  if (!reader) {
    console.error('响应流为空');
    loading.value = false;
    return;
  }

  // 创建一个解码器
  const decoder = new TextDecoder('utf-8');

  let botMessage = ''; // 用于拼接大模型返回的完整消息
  const newMessage = reactive<ChatMessage>({ role: 'bot', text: '' }); // 记录机器人回复的消息
  messages.value.push(newMessage);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 对于当前读取出来的块儿的数据进行处理
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const data = JSON.parse(line) as ServerEventPayload; // data = {"response":"你好"}
        if (data.response) {
          // 只要开始有数据回来了
          if (loading.value) {
            loading.value = false; // 关闭 loading
          }
          botMessage += data.response; // 每次回来的数据拼接到之前的数据里面
          newMessage.text = botMessage; // 更新 newMessage
        }
      } catch (e) {
        console.error('JSON解析失败☹️', e);
      }
    }
  }

  // 拿到 DOM 元素的最新状态
  await nextTick();

  // 让聊天页面做一个滚动
  chatBox.value?.scrollTo({
    top: chatBox.value.scrollHeight,
    behavior: 'smooth'
  });
}

const showHistoryModal = ref(false);
const historyData = ref<HistoryMessage[]>([]);

// 关闭模态框
function closeHistory() {
  showHistoryModal.value = false;
}

// 展示会话记录的回调
async function showHistory() {
  try {
    const response = (await fetch('/api/history')) as unknown as StreamingResponse;

    if (response.ok) {
      const data = (await response.json()) as HistoryListResponse;
      historyData.value = data.conversations;
      showHistoryModal.value = true; // 打开模态框
    } else {
      alert('获取历史记录失败☹️');
    }
  } catch (error) {
    alert('获取历史记录失败，请检查网络');
  }
}

// 清除历史记录
async function clearHistory() {
  if (!confirm('确定是否要清除所有的会话历史记录？该操作不可逆')) return;

  try {
    const response = (await fetch('/api/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })) as unknown as StreamingResponse;
    if (response.ok) {
      messages.value = [];
      alert('对话历史已删除');
    } else alert('清除失败，请稍候再试');
  } catch (error) {
    alert('清除失败，请检查网络');
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background: #f7f7f7;
}

.chat-header h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.header-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-btn {
  background-color: #17a2b8;
  color: white;
}

.history-btn:hover {
  background-color: #138496;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
}

.clear-btn:hover {
  background-color: #c82333;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.chat-msg {
  display: flex;
  margin-bottom: 12px;
}

.chat-msg.user {
  justify-content: flex-end;
}

.chat-msg.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  line-height: 1.4;
  position: relative;
}

.chat-msg.user .bubble {
  background: #daf1ff;
  color: #333;
  border-bottom-right-radius: 4px;
}

.chat-msg.bot .bubble {
  background: #e6e6e6;
  color: #222;
  border-bottom-left-radius: 4px;
}

.role-label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: #fff;
}

.input-area input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
}

.input-area button {
  margin-left: 10px;
  padding: 10px 18px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.input-area button:hover {
  background-color: #0056b3;
}

.input-area button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.no-history {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-msg {
  display: flex;
}

.history-msg.user {
  justify-content: flex-end;
}

.history-msg.assistant {
  justify-content: flex-start;
}

.history-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1.4;
}

.history-msg.user .history-bubble {
  background: #daf1ff;
  color: #333;
}

.history-msg.assistant .history-bubble {
  background: #e6e6e6;
  color: #222;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
}

.modal-btn:hover {
  background-color: #5a6268;
}

.dot {
  animation: blink 1s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
