import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ChatMessage,
  HistoryListResponse,
  HistoryMessage,
  ServerEventPayload,
  StreamingResponse
} from './types/chat';

function App() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    startedRef.current = false;

    const res = (await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })) as unknown as StreamingResponse;

    const reader = res.body?.getReader();
    if (!reader) {
      console.error('响应流为空');
      setLoading(false);
      return;
    }

    const decoder = new TextDecoder('utf-8');
    let botMessage = '';
    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line) as ServerEventPayload;
          if (data.response) {
            if (!startedRef.current) {
              startedRef.current = true;
              setLoading(false);
            }
            botMessage += data.response;

            setMessages(prev => {
              const next = [...prev];
              // 更新最后一条 bot 消息
              next[next.length - 1] = { role: 'bot', text: botMessage };
              return next;
            });
          }
        } catch (e) {
          console.error('JSON解析失败☹️', e);
        }
      }
    }
    // 保险起见，循环结束时也确保关闭 loading
    setLoading(false);
  }

  // console.log(messages, 'messages');

  async function showHistory() {
    try {
      const response = (await fetch('/api/history')) as unknown as StreamingResponse;
      if (response.ok) {
        const data = (await response.json()) as HistoryListResponse;
        setHistoryData(data.conversations);
        setShowHistoryModal(true);
      } else {
        alert('获取历史记录失败☹️');
      }
    } catch (error) {
      alert('获取历史记录失败，请检查网络');
    }
  }

  function closeHistory() {
    setShowHistoryModal(false);
  }

  async function clearHistory() {
    if (!confirm('确定是否要清除所有的会话历史记录？该操作不可逆')) return;
    try {
      const response = (await fetch('/api/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })) as unknown as StreamingResponse;
      if (response.ok) {
        setMessages([]);
        alert('对话历史已删除');
      } else alert('清除失败，请稍候再试');
    } catch (error) {
      alert('清除失败，请检查网络');
    }
  }

  return (
    <div className="flex h-11/12 w-11/12 flex-col bg-white rounded-lg  ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300 bg-white rounded-t-lg rounded-tl-lg">
        <h1 className=" text-xl font-bold">AI助手</h1>
        <div className="flex gap-2">
          <button
            onClick={showHistory}
            className="cursor-pointer rounded-md bg-cyan-600 text-white px-3 py-2 text-sm hover:bg-cyan-700"
          >
            查看历史
          </button>
          <button
            onClick={clearHistory}
            className="cursor-pointer rounded-md bg-cyan-600 text-white px-3 py-2 text-sm hover:bg-cyan-700"
          >
            删除会话历史
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-[18px] px-3.5 py-2.5 leading-6 relative ${
                msg.role === 'user'
                  ? 'bg-[#daf1ff] text-gray-800 rounded-br-[4px]'
                  : 'bg-[#e6e6e6] text-gray-900 rounded-bl-[4px]'
              }`}
            >
              <span className="block text-xs text-gray-500 mb-1">{msg.role === 'user' ? '🧑‍💻 我' : '🤖 模型'}</span>
              <div className="whitespace-pre-wrap break-words">{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="max-w-[70%] rounded-[18px] px-3.5 py-2.5 leading-6 relative bg-[#e6e6e6] text-gray-900 rounded-bl-[4px]">
              <span className="block text-xs text-gray-500 mb-1">🤖 模型</span>
              <div className="whitespace-pre-wrap break-words">
                正在思考<span className="animate-pulse">.</span>
                <span className="animate-pulse [animation-delay:200ms]">.</span>
                <span className="animate-pulse [animation-delay:400ms]">.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 border-t border-gray-300 bg-white rounded-b-lg rounded-bl-lg"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="请输入您的问题..."
          className="flex-1 rounded-full border border-gray-300 px-3.5 py-2 text-base outline-none"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="cursor-pointer ml-2 rounded-full bg-blue-600 text-white px-4 py-2 text-base disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          发送
        </button>
      </form>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center" onClick={closeHistory}>
          <div
            className="bg-white rounded-lg w-[80%] max-w-[600px] max-h-[80%] flex flex-col shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="m-0 text-lg">对话历史记录</h3>
              <button onClick={closeHistory} className="text-gray-600 text-base">
                ✖️
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
              {historyData.length === 0 ? (
                <div className="text-center text-gray-600 italic py-10">暂时没有历史会话</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {historyData.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-[12px] px-3 py-2 leading-6 ${
                          msg.role === 'user' ? 'bg-[#daf1ff] text-gray-800' : 'bg-[#e6e6e6] text-gray-900'
                        }`}
                      >
                        <span className="block text-xs text-gray-500 mb-1">
                          {msg.role === 'user' ? '🧑‍💻 我' : '🤖 模型'}
                        </span>
                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 text-right">
              <button onClick={closeHistory} className="px-3 py-2 rounded bg-gray-600 text-white">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
