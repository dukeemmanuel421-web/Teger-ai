import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Brain, 
  Fingerprint, 
  Zap, 
  ShieldCheck, 
  Search, 
  Activity, 
  AlertTriangle,
  Terminal,
  ChevronRight,
  Info,
  Lock,
  Eye
} from 'lucide-react';

/**
 * TEGER AI - SOC Dashboard
 * A high-fidelity reasoning lab for Social Engineering Forensic Analysis.
 */

const apiKey = ""; // Runtime provided
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

const App = () => {
  const [text, setText] = useState("");
  const [sender, setSender] = useState("");
  const [platform, setPlatform] = useState("Email");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  // Exponential Backoff Fetch Utility
  const fetchWithRetry = useCallback(async (url, options, retries = 5, backoff = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(r => setTimeout(r, backoff));
          return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw new Error(`Engine Error: ${response.statusText}`);
      }
      return response;
    } catch (err) {
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, backoff * 2));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
  }, []);

  const runForensicScan = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const systemPrompt = `
      You are the Teger AI Forensic Reasoning Engine. 
      Analyze the provided communication for Social Engineering "Linguistic Dissonance."
      
      Your goal is to identify if the sender's tone and request match their claimed identity.
      Check for:
      1. Authority Drift: Is a "CEO" or "Admin" using uncharacteristic language?
      2. Artificial Urgency: Panicked deadlines to bypass user logic.
      3. Psychological Anchoring: Forcing focus on a risky action (gift cards, passwords, wire transfers).

      RESPONSE FORMAT: You MUST return a valid JSON object:
      {
        "risk_score": (int 0-100),
        "threat_level": "Low" | "Medium" | "High" | "Critical",
        "tactics": ["List of detected social engineering patterns"],
        "dissonance_report": "A detailed forensic explanation of the tone-identity mismatch",
        "psychological_triggers": ["Specific words or phrases flagged"],
        "mitigation_steps": "Actionable advice for the security team"
      }
    `;

    const userPrompt = `
      PLATFORM: ${platform}
      CLAIMED_SENDER: ${sender || "Unknown"}
      CONTENT:
      ---
      ${text}
      ---
    `;

    try {
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
        setAnalysis(JSON.parse(rawText));
      } else {
        throw new Error("Reasoning engine returned an empty assessment.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
              <ShieldAlert size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                TEGER <span className="text-blue-500">AI</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase">
                Forensic Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-blue-400">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
              ENGINE: GEMINI-3-REASONING
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Lab */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
              <Search size={200} />
            </div>
            
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Fingerprint size={16} className="text-blue-500" /> Evidence Ingestion
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Platform</label>
                  <select 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                  >
                    <option>Email</option>
                    <option>Slack</option>
                    <option>Teams</option>
                    <option>SMS/WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Claimed Sender</label>
                  <input 
                    type="text"
                    placeholder="e.g. CEO, IT Admin"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none transition-all placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Communication Content</label>
                <textarea 
                  className="w-full h-80 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-blue-500/40 outline-none transition-all placeholder:text-slate-800 leading-relaxed resize-none"
                  placeholder="Paste the suspicious message content here for deep reasoning analysis..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button 
                onClick={runForensicScan}
                disabled={loading || !text}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-blue-900/20 group"
              >
                {loading ? (
                  <>
                    <Activity size={20} className="animate-spin" />
                    <span>Analyzing Dissonance...</span>
                  </>
                ) : (
                  <>
                    <Brain size={20} className="group-hover:animate-pulse" />
                    <span>Run Deep Reasoning Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-300">How it works</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Teger AI utilizes Gemini 3's high-reasoning capabilities to simulate the logical flow of a forensic linguist. It analyzes "Authority Drift"—the gap between who the sender claims to be and how they are behaving.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-7">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-center gap-4 text-red-400 mb-6 animate-in slide-in-from-top-4">
              <AlertTriangle size={24} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[3rem]">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                <Brain size={40} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-300 tracking-tight">Engaging Gemini 3</h3>
                <p className="text-sm text-slate-500 mt-2">Performing psychological pattern matching...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Primary Assessment Card */}
              <div className={`border-2 rounded-[3rem] p-10 relative overflow-hidden ${
                analysis.risk_score > 75 ? 'bg-red-500/5 border-red-500/20' : 
                analysis.risk_score > 40 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                      analysis.risk_score > 75 ? 'bg-red-500 text-white' : 
                      analysis.risk_score > 40 ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'
                    }`}>
                      {analysis.threat_level} THREAT
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-7xl font-black tracking-tighter ${
                      analysis.risk_score > 75 ? 'text-red-500' : 
                      analysis.risk_score > 40 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {analysis.risk_score}%
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Dissonance Score</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white leading-tight">Forensic Intelligence Report</h3>
                  <p className="text-lg text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-8 py-2">
                    "{analysis.dissonance_report}"
                  </p>
                </div>
              </div>

              {/* Grid: Tactics & Triggers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={14} className="text-blue-400" /> Detected Patterns
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tactics.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:border-blue-500/50 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock size={14} className="text-blue-400" /> Risky Anchors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.psychological_triggers.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono font-bold text-red-400">
                        "{t}"
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mitigation Strategy */}
              <div className="bg-blue-600 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl shadow-blue-900/20 group cursor-default">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Mitigation Strategy</h4>
                    <p className="text-blue-100 text-sm">{analysis.mitigation_steps}</p>
                  </div>
                </div>
                <ChevronRight className="text-white/40" />
              </div>

              {/* Raw Reasoning Data Toggle */}
              <div className="pt-4">
                <button 
                  onClick={() => setShowRaw(!showRaw)}
                  className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                  <Eye size={12} />
                  {showRaw ? "Hide Raw Intelligence" : "View Raw Intelligence"}
                </button>
                {showRaw && (
                  <div className="mt-4 bg-black/40 border border-slate-800 rounded-2xl p-6 font-mono text-[10px] text-slate-500 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(analysis, null, 2)}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[3rem] p-12">
              <div className="bg-slate-900 p-8 rounded-full text-slate-700">
                <Terminal size={64} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-400 tracking-tight">Intelligence Lab Idle</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto mt-3 leading-relaxed">
                  Ingest evidence on the left to begin a high-reasoning linguistic audit. 
                  Teger AI will uncover the hidden psychological patterns within the intent.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between border-t border-slate-900">
        <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
          <ShieldAlert size={16} />
          <span className="text-[10px] font-black tracking-widest uppercase">Teger AI Framework</span>
        </div>
        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          Build What's Next • Gemini 3 Hackathon
        </div>
      </footer>
    </div>
  );
};

export default App;
