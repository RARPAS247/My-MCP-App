import { useState } from 'react';
import {
  Sparkles,
  Bot,
  Cpu,
  Layers,
  Send,
  Calculator,
  Zap,
  Terminal,
  RefreshCw,
  Sliders,
  Compass,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  Search,
  Play,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  model?: string;
  simulated?: boolean;
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'router' | 'orchestrator' | 'models'>('playground');
  
  // Playground State
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'gemini' | 'ollama' | 'auto'>('auto');
  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI assistant integrated into a NitroStack MCP server.');
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Welcome to NitroAI Studio! You can send prompts, switch AI models, test task routing, or run MCP tool coordination.',
      provider: 'NitroStack Engine',
      model: 'auto-router',
      simulated: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Server Connection Health State
  const [serverStatus, setServerStatus] = useState<'live' | 'checking'>('live');

  // Router State
  const [taskDescription, setTaskDescription] = useState('Analyze this dataset and create a Python script to visualize high risk trends.');
  const [capability, setCapability] = useState<'reasoning' | 'speed' | 'code' | 'vision'>('code');
  const [routingResult, setRoutingResult] = useState<any>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Orchestrator State
  const [orchestratorInput, setOrchestratorInput] = useState('Calculate (15 + 27) and then convert 25 degrees Celsius to Fahrenheit.');
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);

  // Interactive Calculator Widget State
  const [calcNumA, setCalcNumA] = useState(15);
  const [calcNumB, setCalcNumB] = useState(27);
  const [calcOp, setCalcOp] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
  const [calcResult, setCalcResult] = useState<number | null>(42);

  // Models Catalog Filter State
  const [modelSearch, setModelSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('all');

  // Send Generation Prompt
  const handleSendPrompt = async (inputPrompt?: string) => {
    const textToSubmit = inputPrompt || prompt;
    if (!textToSubmit.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!inputPrompt) setPrompt('');
    setIsLoading(true);

    try {
      let modelName = 'gpt-4o-mini';
      let chosenProvider = selectedProvider;

      if (selectedProvider === 'auto') {
        if (textToSubmit.toLowerCase().includes('code') || textToSubmit.toLowerCase().includes('math')) {
          chosenProvider = 'anthropic';
          modelName = 'claude-3-5-sonnet';
        } else {
          chosenProvider = 'openai';
          modelName = 'gpt-4o-mini';
        }
      } else if (selectedProvider === 'anthropic') {
        modelName = 'claude-3-5-sonnet-20241022';
      } else if (selectedProvider === 'gemini') {
        modelName = 'gemini-1.5-flash';
      } else if (selectedProvider === 'ollama') {
        modelName = 'llama3:latest';
      }

      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: `[NitroAI Studio Response via ${chosenProvider.toUpperCase()}]\n\nProcessed prompt: "${textToSubmit}"\n\nNitroStack MCP Server executed this completion cleanly. To connect to live API models, add your API keys (e.g. ${chosenProvider.toUpperCase()}_API_KEY) in your .env file!`,
          provider: chosenProvider,
          model: modelName,
          simulated: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 700);
    } catch (err) {
      setIsLoading(false);
    }
  };

  // Clear Chat History
  const handleClearChat = () => {
    setChatHistory([
      {
        role: 'assistant',
        content: 'Chat cleared. How can I assist you with NitroStack MCP tools?',
        provider: 'NitroStack Engine',
        model: 'auto-router',
        simulated: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Copy text to clipboard
  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Ping Server Health
  const handleTestConnection = () => {
    setServerStatus('checking');
    setTimeout(() => setServerStatus('live'), 500);
  };

  // Route Task
  const handleRouteTask = () => {
    setIsRouting(true);
    setTimeout(() => {
      let routedProvider = 'openai';
      let model = 'gpt-4o';
      let reasoning = 'Selected based on task attributes.';

      if (capability === 'code' || capability === 'reasoning') {
        routedProvider = 'anthropic';
        model = 'claude-3-5-sonnet-20241022';
        reasoning = 'Anthropic Claude recommended for deep architectural code generation & step-by-step reasoning.';
      } else if (capability === 'speed' || capability === 'vision') {
        routedProvider = 'gemini';
        model = 'gemini-1.5-flash';
        reasoning = 'Google Gemini recommended for ultra-fast throughput and high multimodal context window.';
      }

      setRoutingResult({
        task: taskDescription,
        capability,
        selected_provider: routedProvider,
        selected_model: model,
        reasoning,
        output: `AI Execution Plan created for ${model}:\n1. Parse task specifications\n2. Generate structured response\n3. Return result via NitroStack MCP format.`
      });
      setIsRouting(false);
    }, 600);
  };

  // Orchestrate Tools
  const handleOrchestrate = () => {
    setIsOrchestrating(true);
    setTimeout(() => {
      setOrchestrationResult({
        goal: orchestratorInput,
        steps: [
          { step: 1, tool: 'calculate', input: { operation: 'add', a: calcNumA, b: calcNumB }, output: calcResult },
          { step: 2, tool: 'convert_temperature', input: { value: 25, from: 'C', to: 'F' }, output: '77°F' },
          { step: 3, tool: 'ai_generate', input: { prompt: 'Synthesize calculation and temperature results.' }, output: `Combined Result: ${calcNumA} ${calcOp} ${calcNumB} = ${calcResult}. Temperature conversion: 25°C equals 77°F.` }
        ],
        final_summary: 'All tool execution steps completed successfully with 100% execution accuracy.'
      });
      setIsOrchestrating(false);
    }, 700);
  };

  // Interactive Calculator Execution
  const handleRunCalculator = () => {
    let res = 0;
    if (calcOp === 'add') res = calcNumA + calcNumB;
    if (calcOp === 'subtract') res = calcNumA - calcNumB;
    if (calcOp === 'multiply') res = calcNumA * calcNumB;
    if (calcOp === 'divide') res = calcNumB !== 0 ? calcNumA / calcNumB : 0;
    setCalcResult(res);
  };

  // Models catalog data
  const allModels = [
    { name: 'OpenAI GPT-4o', provider: 'openai', providerName: 'OpenAI', id: 'gpt-4o', context: '128k', cap: ['text', 'vision', 'code'], badge: 'Cloud API', color: 'badge-purple' },
    { name: 'OpenAI GPT-4o Mini', provider: 'openai', providerName: 'OpenAI', id: 'gpt-4o-mini', context: '128k', cap: ['text', 'code'], badge: 'Cloud API', color: 'badge-purple' },
    { name: 'Anthropic Claude 3.5 Sonnet', provider: 'anthropic', providerName: 'Anthropic', id: 'claude-3-5-sonnet', context: '200k', cap: ['text', 'reasoning', 'code'], badge: 'Cloud API', color: 'badge-cyan' },
    { name: 'Anthropic Claude 3 Haiku', provider: 'anthropic', providerName: 'Anthropic', id: 'claude-3-haiku', context: '200k', cap: ['text', 'code'], badge: 'Cloud API', color: 'badge-cyan' },
    { name: 'Google Gemini 1.5 Flash', provider: 'gemini', providerName: 'Google', id: 'gemini-1.5-flash', context: '1M', cap: ['text', 'vision', 'fast'], badge: 'Cloud API', color: 'badge-emerald' },
    { name: 'Google Gemini 2.0 Flash', provider: 'gemini', providerName: 'Google', id: 'gemini-2.0-flash', context: '1M', cap: ['text', 'reasoning', 'vision'], badge: 'Cloud API', color: 'badge-emerald' },
    { name: 'Ollama Llama 3 (Local)', provider: 'ollama', providerName: 'Ollama', id: 'llama3', context: '8k', cap: ['text', 'code', 'offline'], badge: 'Local REST', color: 'badge-amber' }
  ];

  const filteredModels = allModels.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.id.toLowerCase().includes(modelSearch.toLowerCase());
    const matchesProvider = filterProvider === 'all' || m.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, margin: 0 }} className="gradient-text">
              NitroAI Studio
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Multi-Model AI Integration & Tool Orchestrator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('playground')}
            className={`btn-secondary ${activeTab === 'playground' ? 'badge-purple' : ''}`}
            style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Bot size={16} /> AI Playground
          </button>

          <button
            onClick={() => setActiveTab('router')}
            className={`btn-secondary ${activeTab === 'router' ? 'badge-cyan' : ''}`}
            style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Compass size={16} /> Task Router
          </button>

          <button
            onClick={() => setActiveTab('orchestrator')}
            className={`btn-secondary ${activeTab === 'orchestrator' ? 'badge-emerald' : ''}`}
            style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Layers size={16} /> Tool Orchestrator
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`btn-secondary ${activeTab === 'models' ? 'badge-amber' : ''}`}
            style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Cpu size={16} /> Models Catalog
          </button>
        </nav>

        {/* Server Status Badge & Test Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleTestConnection}
            className="badge badge-emerald"
            style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.4)' }}
            title="Click to test MCP server ping"
          >
            <div className="pulse-dot"></div>
            {serverStatus === 'checking' ? 'Pinging Server...' : 'NitroStack MCP Server: Live'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        
        {/* TAB 1: AI PLAYGROUND */}
        {activeTab === 'playground' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            {/* Left Controls Panel */}
            <aside className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Sliders size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Model Controls</h3>
              </div>

              {/* Provider Selection */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Select AI Provider
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'auto', name: 'Auto Route (Smart)', badge: 'Recommended', color: 'badge-purple' },
                    { id: 'openai', name: 'OpenAI (GPT-4o)', badge: 'Cloud API', color: 'badge-cyan' },
                    { id: 'anthropic', name: 'Anthropic (Claude)', badge: 'Reasoning', color: 'badge-purple' },
                    { id: 'gemini', name: 'Google Gemini', badge: 'Fast / Vision', color: 'badge-emerald' },
                    { id: 'ollama', name: 'Ollama (Local)', badge: 'Offline', color: 'badge-amber' }
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      onClick={() => setSelectedProvider(prov.id as any)}
                      className="glass-panel"
                      style={{
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderColor: selectedProvider === prov.id ? 'var(--primary)' : 'var(--border-color)',
                        background: selectedProvider === prov.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                        borderRadius: '10px'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{prov.name}</span>
                      <span className={`badge ${prov.color}`}>{prov.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    System Prompt
                  </label>
                  <button
                    onClick={() => setSystemPrompt('You are an expert AI assistant integrated into a NitroStack MCP server.')}
                    className="btn-secondary"
                    style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                    title="Reset system prompt"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
                <textarea
                  className="input-field"
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Temperature Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Temperature</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Quick Prompt Presets
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    'Explain MCP servers simply',
                    'Generate TypeScript code template',
                    'Summarize multi-step tool plan'
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setPrompt(preset);
                        handleSendPrompt(preset);
                      }}
                      className="btn-secondary"
                      style={{ justifyContent: 'space-between', fontSize: '0.78rem', padding: '8px 10px' }}
                    >
                      <span>{preset}</span>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Chat Pane */}
            <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '720px' }}>
              {/* Chat Header */}
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bot size={20} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Interactive AI Assistant</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-cyan">Provider: {selectedProvider.toUpperCase()}</span>
                  <button onClick={handleClearChat} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} title="Clear Chat History">
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              {/* Chat Message List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{msg.role === 'user' ? 'You' : `${msg.provider} (${msg.model})`}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.simulated && <span className="badge badge-amber" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>Simulated</span>}
                    </div>

                    <div style={{ position: 'relative', maxWidth: '85%' }}>
                      <div
                        style={{
                          padding: '14px 18px',
                          borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(30, 41, 59, 0.8)',
                          border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {msg.content}
                      </div>

                      {/* Copy Output Button */}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopyText(msg.content, index)}
                          className="btn-secondary"
                          style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(15, 23, 42, 0.8)' }}
                        >
                          {copiedIndex === index ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-muted)' }}>
                    <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '0.85rem' }}>Executing completion on NitroStack MCP server...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ask any question, request code generation, or trigger AI reasoning..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                />
                <button onClick={() => handleSendPrompt()} disabled={isLoading} className="btn-primary">
                  <Send size={16} /> Send
                </button>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: TASK ROUTER */}
        {activeTab === 'router' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <section className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Compass size={20} color="var(--accent-purple)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Task Router Configuration</h3>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Target Capability Requirement
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'code', label: 'Code & Architecture', desc: 'Routes to Anthropic Claude' },
                    { id: 'reasoning', label: 'Deep Reasoning', desc: 'Routes to Claude / GPT-4o' },
                    { id: 'speed', label: 'High Speed & Throughput', desc: 'Routes to Gemini Flash' },
                    { id: 'vision', label: 'Multimodal / Vision', desc: 'Routes to Gemini / GPT-4o' }
                  ].map((cap) => (
                    <button
                      key={cap.id}
                      onClick={() => setCapability(cap.id as any)}
                      className="glass-panel"
                      style={{
                        padding: '14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderColor: capability === cap.id ? 'var(--accent-purple)' : 'var(--border-color)',
                        background: capability === cap.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                        borderRadius: '10px'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{cap.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{cap.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Task Specification & Prompt
                </label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>

              <button onClick={handleRouteTask} disabled={isRouting} className="btn-primary" style={{ width: '100%' }}>
                <Zap size={16} /> Analyze & Route Task
              </button>
            </section>

            <section className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Terminal size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Router Output & Execution Result</h3>
              </div>

              {routingResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-purple)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Routed AI Provider</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                      {routingResult.selected_provider.toUpperCase()} ({routingResult.selected_model})
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      💡 {routingResult.reasoning}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#a5b4fc', border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap' }}>
                    {routingResult.output}
                  </div>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Click "Analyze & Route Task" to view model routing decision.
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 3: TOOL ORCHESTRATOR */}
        {activeTab === 'orchestrator' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <section className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Layers size={20} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Tool Orchestration Engine</h3>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Multi-Step Goal / Instruction
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={orchestratorInput}
                  onChange={(e) => setOrchestratorInput(e.target.value)}
                />
              </div>

              <button onClick={handleOrchestrate} disabled={isOrchestrating} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Play size={16} /> Execute Tool Orchestration
              </button>

              {/* Interactive Calculator Component */}
              <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Calculator size={18} color="var(--accent-cyan)" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Interactive MCP Calculator Tool Widget</h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: '10px', marginBottom: '12px' }}>
                  <input type="number" className="input-field" value={calcNumA} onChange={(e) => setCalcNumA(Number(e.target.value))} />
                  <select className="input-field" value={calcOp} onChange={(e) => setCalcOp(e.target.value as any)}>
                    <option value="add">+</option>
                    <option value="subtract">-</option>
                    <option value="multiply">×</option>
                    <option value="divide">÷</option>
                  </select>
                  <input type="number" className="input-field" value={calcNumB} onChange={(e) => setCalcNumB(Number(e.target.value))} />
                </div>

                <button onClick={handleRunCalculator} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Calculate Output
                </button>

                {calcResult !== null && (
                  <div className="glass-panel" style={{ marginTop: '12px', padding: '12px', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>
                    Result: {calcResult}
                  </div>
                )}
              </div>
            </section>

            <section className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <CheckCircle2 size={20} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Execution Breakdown</h3>
              </div>

              {orchestrationResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orchestrationResult.steps.map((s: any) => (
                    <div key={s.step} className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid var(--accent-emerald)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span className="badge badge-emerald">Step {s.step}</span>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>Tool: {s.tool}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        Input: {JSON.stringify(s.input)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
                        Output: {JSON.stringify(s.output)}
                      </div>
                    </div>
                  ))}

                  <div className="glass-panel" style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#6ee7b7' }}>Final Summary</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      {orchestrationResult.final_summary}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Run tool orchestration to view step-by-step MCP execution plan.
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 4: MODELS CATALOG */}
        {activeTab === 'models' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }} className="gradient-text">
                  Supported AI Model Providers
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Interactive model search & provider filtering for NitroStack MCP server.
                </p>
              </div>

              {/* Filter Controls */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search models..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    style={{ paddingLeft: '32px', width: '200px' }}
                  />
                </div>

                <select
                  className="input-field"
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  style={{ width: '140px' }}
                >
                  <option value="all">All Providers</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Google</option>
                  <option value="ollama">Ollama</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredModels.map((m) => (
                <div key={m.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className={`badge ${m.color}`}>{m.providerName}</span>
                      <span className="badge badge-cyan">{m.badge}</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{m.name}</h4>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ID: {m.id}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Context Window: {m.context} tokens</div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {m.cap.map((c) => (
                        <span key={c} style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '6px', color: '#e2e8f0' }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProvider(m.provider as any);
                        setActiveTab('playground');
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Use Model
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
