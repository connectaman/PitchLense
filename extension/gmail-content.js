// Gmail-specific content script for PitchLense Chrome Extension
// This script runs specifically on Gmail pages to add email analysis functionality

class GmailPitchLense {
  constructor() {
    this.processedEmails = new Set();
    this.analysisButtons = new Map();
    this.isAnalyzing = false;
    this.observer = null;
    this.init();
  }

  init() {
    // Wait for Gmail to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('PitchLense Gmail content script initialized');
    
    // Listen for messages from popup or background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
    });

    // Listen for Gmail navigation changes
    this.setupNavigationListener();
    
    // Start observing for new emails
    this.startObserving();
    
    // Process existing emails
    this.processExistingEmails();
    
    // Set up periodic button visibility check
    this.setupButtonVisibilityCheck();
  }

  setupNavigationListener() {
    // Listen for Gmail's navigation changes
    let lastUrl = window.location.href;
    const navigationObserver = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        console.log('Gmail navigation detected, reinitializing...');
        lastUrl = currentUrl;
        
        // Clean up and reinitialize after a short delay
        setTimeout(() => {
          this.cleanupExistingButtons();
          this.processExistingEmails();
        }, 2000);
      }
    });

    // Observe changes to the document body
    navigationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupButtonVisibilityCheck() {
    // Check every 3 seconds to ensure buttons remain visible
    setInterval(() => {
      this.ensureButtonsVisible();
    }, 3000);
  }

  ensureButtonsVisible() {
    // Check all existing buttons and ensure they're visible
    const existingButtons = document.querySelectorAll('.pitchlense-gmail-button');
    existingButtons.forEach(button => {
      if (button.style.display === 'none' || button.style.opacity === '0') {
        button.style.display = 'flex';
        button.style.opacity = '0.9';
      }
    });
  }

  startObserving() {
    // Use MutationObserver to detect new emails being loaded
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if new email rows were added
            const emailRows = node.querySelectorAll ? 
              node.querySelectorAll('[role="listitem"]:not([data-pitchlense-processed]), .zA:not([data-pitchlense-processed]), .yP:not([data-pitchlense-processed])') : [];
            
            emailRows.forEach(emailRow => {
              if (emailRow && !this.processedEmails.has(emailRow)) {
                // Add a marker to prevent duplicate processing
                emailRow.setAttribute('data-pitchlense-processed', 'true');
                this.addAnalysisButtonToEmail(emailRow);
              }
            });

            // Also check if the node itself is an email row
            if (this.isEmailRow(node) && !node.hasAttribute('data-pitchlense-processed')) {
              node.setAttribute('data-pitchlense-processed', 'true');
              this.addAnalysisButtonToEmail(node);
            }
          }
        });
      });
    });

    // Start observing
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processExistingEmails() {
    // First, clean up any existing PitchLense buttons to prevent duplicates
    this.cleanupExistingButtons();
    
    // Process emails that are already on the page
    const emailRows = document.querySelectorAll('[role="listitem"]:not([data-pitchlense-processed]), .zA:not([data-pitchlense-processed]), .yP:not([data-pitchlense-processed])');
    emailRows.forEach(emailRow => {
      if (!this.processedEmails.has(emailRow)) {
        // Add a marker to prevent duplicate processing
        emailRow.setAttribute('data-pitchlense-processed', 'true');
        this.addAnalysisButtonToEmail(emailRow);
      }
    });
  }

  cleanupExistingButtons() {
    // Only remove buttons that are orphaned (not attached to valid email rows)
    const existingButtons = document.querySelectorAll('.pitchlense-gmail-button');
    existingButtons.forEach(button => {
      const emailRow = button.closest('[role="listitem"], .zA, .yP');
      if (!emailRow || !document.body.contains(emailRow)) {
        // Button is orphaned, remove it
        if (button.parentNode) {
          button.parentNode.removeChild(button);
        }
      }
    });
    
    // Don't clear processed emails and buttons - keep them for persistence
    // this.processedEmails.clear();
    // this.analysisButtons.clear();
  }

  isEmailRow(element) {
    // Check if element is an email row based on Gmail's structure
    return element && (
      element.getAttribute('role') === 'listitem' ||
      element.classList.contains('zA') ||
      element.classList.contains('yP') ||
      element.querySelector('[role="listitem"]') ||
      element.querySelector('.zA') ||
      element.querySelector('.yP')
    );
  }

  addAnalysisButtonToEmail(emailRow) {
    if (!emailRow) {
      return;
    }

    // Check if there's already a PitchLense button in this email row
    const existingButton = emailRow.querySelector('.pitchlense-gmail-button');
    if (existingButton) {
      // Button already exists, just ensure it's visible and functional
      existingButton.style.display = 'flex';
      existingButton.style.opacity = '0.8';
      return;
    }

    // Mark as processed
    this.processedEmails.add(emailRow);

    // Find the email actions area (where star, archive, etc. buttons are)
    const actionsArea = this.findActionsArea(emailRow);
    if (!actionsArea) {
      return;
    }

    // Check if there's already a PitchLense button in the actions area
    const existingButtonInArea = actionsArea.querySelector('.pitchlense-gmail-button');
    if (existingButtonInArea) {
      return;
    }

    // Create analysis button
    const analysisButton = this.createAnalysisButton(emailRow);
    
    // Insert the button into the actions area
    actionsArea.appendChild(analysisButton);
    
    // Store reference
    this.analysisButtons.set(emailRow, analysisButton);
  }

  findActionsArea(emailRow) {
    // Try multiple selectors to find the actions area in Gmail
    const selectors = [
      '.T-I[data-tooltip*="More"], .T-I[aria-label*="More"]',
      '.T-I[data-tooltip*="Reply"], .T-I[aria-label*="Reply"]',
      '.yP .T-I',
      '.zA .T-I',
      '[role="listitem"] .T-I',
      '.bq4'
    ];

    for (const selector of selectors) {
      const actionsArea = emailRow.querySelector(selector)?.parentElement;
      if (actionsArea) {
        return actionsArea;
      }
    }

    // Fallback: create our own container
    const fallbackContainer = document.createElement('div');
    fallbackContainer.className = 'pitchlense-actions';
    fallbackContainer.style.cssText = `
      display: inline-flex;
      align-items: center;
      margin-left: 8px;
    `;
    
    // Insert after the email content
    const emailContent = emailRow.querySelector('.yW span, .zA span, [role="listitem"] span');
    if (emailContent) {
      emailContent.parentElement.appendChild(fallbackContainer);
      return fallbackContainer;
    }

    return null;
  }

  createAnalysisButton(emailRow) {
    const button = document.createElement('div');
    button.className = 'pitchlense-gmail-button';
    button.innerHTML = '🎯';
    button.title = 'Analyze email proposal with PitchLense';
    
    // Style the button to match PitchLense theme
    button.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(241,216,91,0.2);
      border: 1px solid rgba(241,216,91,0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      margin: 0 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.9;
      box-shadow: 0 2px 8px rgba(241,216,91,0.3);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1000;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(241,216,91,0.25)';
      button.style.borderColor = 'rgba(241,216,91,0.5)';
      button.style.opacity = '1';
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 4px 16px rgba(241,216,91,0.3)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(241,216,91,0.15)';
      button.style.borderColor = 'rgba(241,216,91,0.3)';
      button.style.opacity = '0.8';
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 2px 8px rgba(241,216,91,0.2)';
    });

    // Click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.analyzeEmail(emailRow);
    });

    return button;
  }

  async analyzeEmail(emailRow) {
    if (this.isAnalyzing) {
      return;
    }

    this.isAnalyzing = true;
    const button = this.analysisButtons.get(emailRow);
    
    if (button) {
      button.innerHTML = '⏳';
      button.style.background = '#fff3cd';
    }

    try {
      // Extract email content
      const emailContent = this.extractEmailContent(emailRow);
      
      if (!emailContent || emailContent.length < 50) {
        this.showMessage('Not enough content to analyze in this email.', 'warning');
        return;
      }

      // Send to background script for analysis
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: 'analyzeEmail',
          data: {
            content: emailContent,
            url: window.location.href,
            emailId: this.getEmailId(emailRow)
          }
        }, resolve);
      });

      if (response && response.success) {
        this.showEmailAnalysisResults(response.data, emailRow);
      } else {
        this.showMessage('Analysis failed: ' + (response?.error || 'Unknown error'), 'error');
      }

    } catch (error) {
      console.error('Gmail email analysis error:', error);
      this.showMessage('Failed to analyze email: ' + error.message, 'error');
    } finally {
      this.isAnalyzing = false;
      if (button) {
        button.innerHTML = '🎯';
        button.style.background = '#f1f3f4';
      }
    }
  }

  extractEmailContent(emailRow) {
    // Extract sender information
    const senderElement = emailRow.querySelector('.yW .bA4, .zA .bA4, [role="listitem"] .bA4, .yW .bog, .zA .bog');
    const sender = senderElement ? senderElement.textContent.trim() : 'Unknown sender';

    // Extract subject
    const subjectElement = emailRow.querySelector('.yW .bog, .zA .bog, [role="listitem"] .bog, .yW span, .zA span');
    const subject = subjectElement ? subjectElement.textContent.trim() : 'No subject';

    // Extract preview text
    const previewElement = emailRow.querySelector('.yW .y2, .zA .y2, [role="listitem"] .y2');
    const preview = previewElement ? previewElement.textContent.trim() : '';

    // Extract timestamp
    const timeElement = emailRow.querySelector('.yW .bA4 .yP, .zA .bA4 .yP, [role="listitem"] .bA4 .yP');
    const timestamp = timeElement ? timeElement.textContent.trim() : '';

    // Combine all content
    let content = `From: ${sender}\n`;
    content += `Subject: ${subject}\n`;
    if (timestamp) content += `Time: ${timestamp}\n`;
    content += `\nContent: ${preview}`;

    // If we're in an opened email, try to get more content
    if (window.location.pathname.includes('/mail/u/') && window.location.search.includes('#')) {
      const emailBody = this.extractOpenedEmailContent();
      if (emailBody) {
        content += `\n\nFull Email Body:\n${emailBody}`;
      }
    }

    return content;
  }

  extractOpenedEmailContent() {
    // Try to extract content from opened email view
    const selectors = [
      '.ii.gt .a3s.aiL', // Gmail's email body selector
      '.email-body',
      '[role="main"] .a3s',
      '.message-body'
    ];

    for (const selector of selectors) {
      const bodyElement = document.querySelector(selector);
      if (bodyElement) {
        return bodyElement.innerText || bodyElement.textContent || '';
      }
    }

    return null;
  }

  getEmailId(emailRow) {
    // Try to extract a unique email ID
    const idAttribute = emailRow.getAttribute('data-legacy-thread-id') || 
                       emailRow.getAttribute('data-thread-id') ||
                       emailRow.getAttribute('id');
    return idAttribute || `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  showEmailAnalysisResults(data, emailRow) {
    // Create a floating analysis panel
    const analysisPanel = document.createElement('div');
    analysisPanel.className = 'pitchlense-email-analysis';
    analysisPanel.innerHTML = this.createAnalysisHTML(data);
    
    // Style the panel to match PitchLense theme
    analysisPanel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #2E3137;
      border-radius: 14px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.35);
      z-index: 10000;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: 'Inter', 'Google Sans', Roboto, Arial, sans-serif;
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(10px);
    `;

    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'pitchlense-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(30,30,33,0.8);
      backdrop-filter: blur(8px);
      z-index: 9999;
    `;

    // Close functionality
    const closeButton = analysisPanel.querySelector('.pitchlense-close');
    closeButton.addEventListener('click', () => this.closeAnalysisPanel());
    backdrop.addEventListener('click', () => this.closeAnalysisPanel());

    // Add to page
    document.body.appendChild(backdrop);
    document.body.appendChild(analysisPanel);

    // Store references for cleanup
    this.currentBackdrop = backdrop;
    this.currentAnalysisPanel = analysisPanel;
  }

  createAnalysisHTML(data) {
    return `
      <div style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">🎯 Email Analysis</h2>
          <button class="pitchlense-close" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #8b949e; transition: color 0.3s ease;">&times;</button>
        </div>
        
        <div style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Overall Score: ${data.overallScore || 'N/A'}/10</h3>
            <div style="margin-left: 16px; flex: 1; height: 10px; background: rgba(255,255,255,0.08); border-radius: 6px; overflow: hidden;">
              <div style="height: 100%; background: linear-gradient(90deg, #f1d85b 0%, #78e6d0 100%); width: ${(data.overallScore || 0) * 10}%; transition: width 0.3s ease; border-radius: 6px;"></div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 24px;">
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
        
        <div style="margin-bottom: 24px;">
          <h4 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Feedback:</h4>
          <p style="margin: 0; color: #cfd4dd; line-height: 1.6; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 16px; border-radius: 8px; border-left: 4px solid #f1d85b;">${data.feedback || 'No specific feedback available.'}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h4 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Recommendations:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #cfd4dd; line-height: 1.6;">
            ${(data.recommendations || []).map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  closeAnalysisPanel() {
    if (this.currentBackdrop) {
      this.currentBackdrop.remove();
      this.currentBackdrop = null;
    }
    if (this.currentAnalysisPanel) {
      this.currentAnalysisPanel.remove();
      this.currentAnalysisPanel = null;
    }
  }

  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `pitchlense-message pitchlense-${type}`;
    messageEl.textContent = message;
    
    Object.assign(messageEl.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: 'white',
      zIndex: '10002',
      maxWidth: '350px',
      fontFamily: 'Inter, Google Sans, Roboto, Arial, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)'
    });

    const colors = {
      info: '#78e6d0',
      success: '#78e6d0',
      warning: '#f1d85b',
      error: '#f87171'
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
      case 'analyzeEmail':
        // This would be called from popup if needed
        sendResponse({ success: true });
        break;
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  destroy() {
    // Cleanup when extension is disabled/uninstalled
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Clean up any existing buttons
    this.cleanupExistingButtons();
    
    // Clear all references
    this.processedEmails.clear();
    this.analysisButtons.clear();
  }
}

// Initialize the Gmail content script
const gmailPitchLense = new GmailPitchLense();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  gmailPitchLense.destroy();
});
