// Background script for PitchLense Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('PitchLense extension installed');
  
  // Set default settings
  chrome.storage.sync.set({
    pitchlenseSettings: {
      apiEndpoint: 'https://pitchlense.com',
      autoAnalyze: false,
      notifications: true
    }
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'analyzePitch':
      handlePitchAnalysis(request.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'analyzeEmail':
      handleEmailAnalysis(request.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'getSettings':
      chrome.storage.sync.get(['pitchlenseSettings'], (result) => {
        sendResponse(result.pitchlenseSettings || {});
      });
      return true;
      
    case 'saveSettings':
      chrome.storage.sync.set({ pitchlenseSettings: request.settings }, () => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Handle pitch analysis
async function handlePitchAnalysis(data, sendResponse) {
  try {
    const settings = await new Promise((resolve) => {
      chrome.storage.sync.get(['pitchlenseSettings'], (result) => {
        resolve(result.pitchlenseSettings || {});
      });
    });
    
    const response = await fetch(`${settings.apiEndpoint}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: data.text,
        url: data.url,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Store analysis result
    chrome.storage.local.set({
      lastAnalysis: {
        ...result,
        timestamp: new Date().toISOString(),
        url: data.url
      }
    });
    
    sendResponse({ success: true, data: result });
    
    // Show notification if enabled
    if (settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'PitchLense Analysis Complete',
        message: 'Your pitch analysis is ready!'
      });
    }
    
  } catch (error) {
    console.error('Pitch analysis error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Failed to analyze pitch' 
    });
  }
}

// Handle email analysis
async function handleEmailAnalysis(data, sendResponse) {
  try {
    const settings = await new Promise((resolve) => {
      chrome.storage.sync.get(['pitchlenseSettings'], (result) => {
        resolve(result.pitchlenseSettings || {});
      });
    });
    
    const response = await fetch(`${settings.apiEndpoint}/api/analyze-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: data.content,
        emailId: data.emailId,
        url: data.url,
        timestamp: new Date().toISOString(),
        source: 'gmail'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Store email analysis result
    chrome.storage.local.set({
      lastEmailAnalysis: {
        ...result,
        timestamp: new Date().toISOString(),
        url: data.url,
        emailId: data.emailId
      }
    });
    
    sendResponse({ success: true, data: result });
    
    // Show notification if enabled
    if (settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'PitchLense Email Analysis Complete',
        message: 'Your email proposal analysis is ready!'
      });
    }
    
  } catch (error) {
    console.error('Email analysis error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Failed to analyze email' 
    });
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open popup or perform action when icon is clicked
  console.log('Extension icon clicked on tab:', tab.url);
});
