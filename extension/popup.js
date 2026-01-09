/**
 * Teger AI: Popup Reasoning Controller
 * * This script interacts with the Gemini 3 API to perform psychological intent 
 * analysis on messages captured by the content script.
 */

// API Configuration
const apiKey = ""; // Runtime provides this key
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

// UI Elements
const statusText = document.getElementById('status-text');
const resultsArea = document.getElementById('results-area');
const threatLevel = document.getElementById('threat-level');
const riskScore = document.getElementById('risk-score');
const explanationText = document.getElementById('explanation-text');
const tacticsList = document.getElementById('tactics-list');
const riskCard = document.getElementById('risk-card');
const analyzeBtn = document.getElementById('analyze-trigger');

/**
 * Initialize Popup
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Retrieve the captured context from Chrome Storage
  const data = await chrome.storage.local.get('lastCaptured');
  
  if (data.lastCaptured) {
    statusText.innerHTML = `Captured context from <b>${data.lastCaptured.sender}</b> via ${data.lastCaptured.platform}. Ready for intelligence audit.`;
    analyzeBtn.disabled = false;
  } else {
    statusText.innerHTML = "No context captured. Use the <b>Teger Scan</b> button in Gmail or Slack to ingest evidence.";
    analyzeBtn.disabled = true;
  }
});

/**
 * Main Analysis Trigger
 */
analyzeBtn.onclick = async () => {
  const data = await chrome.storage.local.get('lastCaptured');
  if (!data.lastCaptured) return;

  setLoadingState(true);

  const systemPrompt = `
    You are a Forensic Social Engineering Analyst. 
    Analyze the provided communication for psychological manipulation and linguistic dissonance.
    
    Examine the following:
    1. Authority Drift: Is the sender's tone inconsistent with their claimed role?
    2. Artificial Urgency: Is there a manufactured deadline designed to bypass logical friction?
    3. Psychological Anchoring: Does the message narrow the user's focus onto a high-risk action?

    Return ONLY a valid JSON object with the following structure:
    {
      "risk_score": (integer 0-100),
      "threat_level": "Low" | "Medium" | "High" | "Critical",
      "explanation": "Brief, human-friendly security advice regarding the intent",
      "tactics": ["List", "of", "detected", "patterns"]
    }
  `;

  const userQuery = `
    SENDER_IDENTITY: ${data.lastCaptured.sender}
    COMMUNICATION_PLATFORM: ${data.lastCaptured.platform}
    EXTRACTED_MESSAGE:
    ---
    ${data.lastCaptured.text}
    ---
  `;

  try {
    const analysis = await callGeminiEngine(systemPrompt, userQuery);
    displayResults(analysis);
  } catch (err) {
    displayError(err.message);
  } finally {
    setLoadingState(false);
  }
};

/**
 * Gemini 3 Engine Call with Exponential Backoff (MANDATORY)
 */
async function callGeminiEngine(systemInstruction, userText, retries = 5, delay = 1000) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { 
          responseMimeType: "application/json" 
        }
      })
    });

    if (!response.ok) {
      // Exponential backoff logic for retries
      if (retries > 0) {
        await new Promise(r => setTimeout(r, delay));
        return callGeminiEngine(systemInstruction, userText, retries - 1, delay * 2);
      }
      throw new Error("Teger reasoning engine is currently unresponsive.");
    }

    const result = await response.json();
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) throw new Error("Forensic data stream interrupted.");
    
    return JSON.parse(textResponse);

  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return callGeminiEngine(systemInstruction, userText, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * UI State Management
 */
function setLoadingState(isLoading) {
  analyzeBtn.disabled = isLoading;
  if (isLoading) {
    analyzeBtn.innerHTML = `<span>⏳</span> Analyzing Reasoning...`;
    statusText.innerText = "Gemini 3 is evaluating linguistic dissonance and intent vectors...";
    resultsArea.style.display = 'none';
  } else {
    analyzeBtn.innerHTML = `<span>🧠</span> Deep Reasoning Scan`;
  }
}

function displayResults(data) {
  resultsArea.style.display = 'block';
  statusText.style.display = 'none';

  riskScore.innerText = `${data.risk_score}%`;
  threatLevel.innerText = data.threat_level;
  explanationText.innerText = data.explanation;

  // Render detected tactics
  tacticsList.innerHTML = '';
  data.tactics.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tactic-tag';
    span.innerText = t;
    tacticsList.appendChild(span);
  });

  // Dynamic Theme Adaptation
  const isCritical = data.risk_score > 75;
  const isHigh = data.risk_score > 50 && data.risk_score <= 75;
  const isMed = data.risk_score > 25 && data.risk_score <= 50;

  const color = isCritical || isHigh ? 'var(--risk-high)' : isMed ? 'var(--risk-med)' : 'var(--risk-low)';
  
  riskScore.style.color = color;
  threatLevel.style.background = color;
  riskCard.style.borderColor = `rgba(${isCritical || isHigh ? '239, 68, 68' : '16, 185, 129'}, 0.3)`;
  riskCard.style.background = `linear-gradient(145deg, rgba(${isCritical || isHigh ? '239, 68, 68' : '16, 185, 129'}, 0.08), transparent)`;
}

function displayError(msg) {
  statusText.style.display = 'block';
  statusText.innerHTML = `<span style="color: var(--risk-high); font-weight: bold;">⚠️ Error:</span> ${msg}`;
}
