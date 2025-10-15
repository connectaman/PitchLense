// Content script for PitchLense Chrome Extension
// This script runs on web pages and can interact with page content

class PitchLenseContentScript {
  constructor() {
    this.analysisButton = null;
    this.overlay = null;
    this.isAnalyzing = false;
    this.init();
  }

  init() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Add floating analysis button to the page
    this.createAnalysisButton();
    
    // Listen for messages from popup or background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
    });

    // Add keyboard shortcut (Ctrl+Shift+P for PitchLense)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.analyzeCurrentPage();
      }
    });
  }

  createAnalysisButton() {
    // Create floating button
    this.analysisButton = document.createElement('div');
    this.analysisButton.id = 'pitchlense-float-button';
    this.analysisButton.innerHTML = '🎯';
    this.analysisButton.title = 'Analyze this page with PitchLense';
    
    // Style the button to match PitchLense theme
    Object.assign(this.analysisButton.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '56px',
      height: '56px',
      background: 'linear-gradient(135deg, #f1d85b 0%, #e6c547 100%)',
      color: '#1E1E21',
      border: '1px solid rgba(241,216,91,0.3)',
      borderRadius: '50%',
      fontSize: '24px',
      cursor: 'pointer',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(241,216,91,0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      fontWeight: 'bold'
    });

    // Add hover effects
    this.analysisButton.addEventListener('mouseenter', () => {
      this.analysisButton.style.transform = 'scale(1.1)';
      this.analysisButton.style.background = 'linear-gradient(135deg, #f8e066 0%, #f1d85b 100%)';
      this.analysisButton.style.boxShadow = '0 12px 32px rgba(241,216,91,0.4)';
    });

    this.analysisButton.addEventListener('mouseleave', () => {
      this.analysisButton.style.transform = 'scale(1)';
      this.analysisButton.style.background = 'linear-gradient(135deg, #f1d85b 0%, #e6c547 100%)';
      this.analysisButton.style.boxShadow = '0 8px 24px rgba(241,216,91,0.3)';
    });

    // Add click handler
    this.analysisButton.addEventListener('click', () => {
      this.analyzeCurrentPage();
    });

    // Add to page
    document.body.appendChild(this.analysisButton);
  }

  async analyzeCurrentPage() {
    if (this.isAnalyzing) {
      throw new Error('Analysis already in progress');
    }

    this.isAnalyzing = true;
    this.showLoadingState();

    try {
      // Extract text content from the page
      const pageText = this.extractPageContent();
      
      if (!pageText || pageText.trim().length < 50) {
        throw new Error('Not enough content to analyze. Please select text or ensure the page has sufficient content.');
      }

      // Send to background script for analysis
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'analyzePitch',
          data: {
            text: pageText,
            url: window.location.href,
            title: document.title
          }
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });

      if (response && response.success) {
        this.showAnalysisResults(response.data);
      } else {
        throw new Error(response?.error || 'Analysis failed with unknown error');
      }

    } catch (error) {
      console.error('PitchLense analysis error:', error);
      this.showMessage('Failed to analyze page: ' + error.message, 'error');
      throw error; // Re-throw to be caught by the message handler
    } finally {
      this.isAnalyzing = false;
      this.hideLoadingState();
    }
  }

  extractPageContent() {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, footer, header, aside');
    scripts.forEach(el => el.remove());

    // Get main content areas
    const mainContent = document.querySelector('main, article, .content, #content, .main-content');
    const content = mainContent || document.body;

    // Extract text content
    let text = content.innerText || content.textContent || '';
    
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    // Limit text length for analysis (first 5000 characters)
    if (text.length > 5000) {
      text = text.substring(0, 5000) + '...';
    }

    return text;
  }

  showLoadingState() {
    if (this.analysisButton) {
      this.analysisButton.innerHTML = '⏳';
      this.analysisButton.style.background = 'linear-gradient(135deg, #78e6d0 0%, #5dd5c0 100%)';
    }
  }

  hideLoadingState() {
    if (this.analysisButton) {
      this.analysisButton.innerHTML = '🎯';
      this.analysisButton.style.background = 'linear-gradient(135deg, #f1d85b 0%, #e6c547 100%)';
    }
  }

  showAnalysisResults(data) {
    // Create overlay to show results
    this.overlay = document.createElement('div');
    this.overlay.id = 'pitchlense-overlay';
    
    const html = `
      <div class="pitchlense-modal">
        <div class="pitchlense-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">🎯 PitchLense Analysis</h2>
          <button class="pitchlense-close" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #8b949e; transition: color 0.3s ease;">&times;</button>
        </div>
        <div class="pitchlense-content">
          <div class="score-section" style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Overall Score: ${data.overallScore || 'N/A'}/10</h3>
            <div class="score-bar" style="height: 10px; background: rgba(255,255,255,0.08); border-radius: 6px; overflow: hidden;">
              <div class="score-fill" style="height: 100%; background: linear-gradient(90deg, #f1d85b 0%, #78e6d0 100%); width: ${(data.overallScore || 0) * 10}%; transition: width 0.3s ease; border-radius: 6px;"></div>
            </div>
          </div>
          
          <div class="metrics-section" style="margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Key Metrics:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
              <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #cfd4dd; margin-bottom: 6px; font-weight: 500;">Clarity</div>
                <div style="font-size: 20px; font-weight: 700; color: #f1d85b;">${data.clarity || 'N/A'}</div>
              </div>
              <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #cfd4dd; margin-bottom: 6px; font-weight: 500;">Persuasiveness</div>
                <div style="font-size: 20px; font-weight: 700; color: #78e6d0;">${data.persuasiveness || 'N/A'}</div>
              </div>
              <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; color: #cfd4dd; margin-bottom: 6px; font-weight: 500;">Structure</div>
                <div style="font-size: 20px; font-weight: 700; color: #f1d85b;">${data.structure || 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div class="feedback-section" style="margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Feedback:</h4>
            <p style="margin: 0; color: #cfd4dd; line-height: 1.6; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 16px; border-radius: 8px; border-left: 4px solid #f1d85b;">${data.feedback || 'No specific feedback available.'}</p>
          </div>
          
          <div class="recommendations-section" style="margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Recommendations:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #cfd4dd; line-height: 1.6;">
              ${(data.recommendations || []).map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    this.overlay.innerHTML = html;
    
    // Style the overlay
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(30,30,33,0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: '10001',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });

    // Add modal styles
    const modal = this.overlay.querySelector('.pitchlense-modal');
    Object.assign(modal.style, {
      backgroundColor: '#2E3137',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '24px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      backdropFilter: 'blur(10px)',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff'
    });

    // Add close functionality
    const closeBtn = this.overlay.querySelector('.pitchlense-close');
    closeBtn.addEventListener('click', () => this.hideOverlay());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hideOverlay();
    });

    document.body.appendChild(this.overlay);
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `pitchlense-message pitchlense-${type}`;
    messageEl.textContent = message;
    
    Object.assign(messageEl.style, {
      position: 'fixed',
      top: '80px',
      right: '20px',
      padding: '10px 20px',
      borderRadius: '5px',
      color: 'white',
      zIndex: '10002',
      maxWidth: '300px'
    });

    const colors = {
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#ff9800',
      error: '#f44336'
    };

    messageEl.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(messageEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }

  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'analyzePage':
        this.analyzeCurrentPage()
          .then(() => {
            sendResponse({ success: true });
          })
          .catch((error) => {
            sendResponse({ success: false, error: error.message });
          });
        return true; // Keep message channel open for async response
      case 'getPageContent':
        sendResponse({ content: this.extractPageContent() });
        break;
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }
}

// Initialize the content script
new PitchLenseContentScript();
