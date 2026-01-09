/**
 * Teger AI: Content Script
 * This script injects the 'Scan' button into Gmail and Slack.
 */

// Inject the scan button whenever a message is opened
function injectTegerButton() {
  const containers = document.querySelectorAll('.ii.gt, .c-message__body'); 

  containers.forEach(container => {
    if (container.querySelector('.teger-scan-btn')) return;

    const btn = document.createElement('div');
    btn.className = 'teger-scan-btn';
    btn.innerHTML = `<span title="Teger AI Scan" style="font-size: 18px; filter: grayscale(1); transition: 0.3s; cursor: pointer;">🛡️</span>`;
    btn.style.display = 'inline-block';
    btn.style.marginLeft = '10px';
    btn.style.verticalAlign = 'middle';

    btn.onclick = () => {
      const text = container.innerText;
      const sender = document.querySelector('.gD')?.innerText || "Unknown Sender";
      
      chrome.storage.local.set({ 
        pendingScan: { 
          text: text, 
          sender: sender, 
          platform: window.location.host.includes('slack') ? 'Slack' : 'Gmail' 
        } 
      }, () => {
        btn.querySelector('span').style.filter = 'none';
        btn.querySelector('span').style.transform = 'scale(1.2)';
        alert("Teger AI: Forensic context captured. Open the extension to view reasoning.");
      });
    };

    container.prepend(btn);
  });
}

const observer = new MutationObserver(injectTegerButton);
observer.observe(document.body, { childList: true, subtree: true });
