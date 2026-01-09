/**
 * Teger AI: Content Script (The Sensor)
 * * This script runs in the context of Gmail and Slack. It identifies message 
 * containers, injects the Teger AI scanning trigger, and captures message 
 * context for the reasoning engine.
 */

/**
 * Creates the Teger Scan UI element
 */
function createScanButton() {
  const btn = document.createElement('div');
  btn.className = 'teger-scan-button';
  btn.title = "Run Teger AI Forensic Scan";
  
  // Inline styles to ensure visibility before CSS loads
  btn.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #2563eb;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    margin: 8px 0;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 10;
  `;

  btn.innerHTML = `
    <span>🛡️ Teger Scan</span>
  `;

  // Hover effects
  btn.onmouseenter = () => { btn.style.background = '#1d4ed8'; };
  btn.onmouseleave = () => { btn.style.background = '#2563eb'; };

  return btn;
}

/**
 * Main injection logic for Gmail and Slack
 */
function injectTegerUI() {
  // Gmail selectors (Message body containers)
  const gmailMessages = document.querySelectorAll('.ii.gt:not(.teger-injected)');
  
  // Slack selectors (Message body containers)
  const slackMessages = document.querySelectorAll('.c-message__body:not(.teger-injected)');

  const allMessages = [...gmailMessages, ...slackMessages];

  allMessages.forEach(msg => {
    msg.classList.add('teger-injected');
    
    const btn = createScanButton();

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Capture metadata
      const content = msg.innerText;
      let sender = "Unknown Sender";

      if (window.location.host.includes('mail.google.com')) {
        sender = document.querySelector('.gD')?.innerText || "Gmail User";
      } else if (window.location.host.includes('slack.com')) {
        // Slack sender detection (closest parent message container to find sender)
        const parent = msg.closest('.c-message_kit__message, .c-message');
        sender = parent?.querySelector('.c-message__sender_link')?.innerText || "Slack User";
      }

      // Store in chrome storage for the popup Reasoning Engine
      chrome.storage.local.set({ 
        lastCaptured: {
          text: content,
          sender: sender,
          platform: window.location.host.includes('slack') ? 'Slack' : 'Gmail',
          timestamp: new Date().toISOString()
        }
      }, () => {
        // Feedback to user
        btn.style.background = '#10b981';
        btn.innerHTML = `<span>🛡️ Captured</span>`;
        
        console.log("Teger AI: Intent context successfully captured for analysis.");
      });
    };

    // Prepend to message body
    msg.prepend(btn);
  });
}

/**
 * MutationObserver to handle dynamically loaded messages (Single Page App support)
 */
const observer = new MutationObserver((mutations) => {
  injectTegerUI();
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial run
injectTegerUI();
