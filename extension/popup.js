// Popup script for PitchLense Chrome Extension
document.addEventListener('DOMContentLoaded', async () => {
    const popup = new PitchLensePopup();
    await popup.init();
});

class PitchLensePopup {
    constructor() {
        this.settings = {};
        this.currentTab = null;
    }

    async init() {
        // Get current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        this.currentTab = tab;

        // Load settings
        await this.loadSettings();

        // Setup event listeners
        this.setupEventListeners();

        // Check connection status
        await this.checkConnectionStatus();

        // Load recent analysis
        await this.loadRecentAnalysis();
    }

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['pitchlenseSettings'], (result) => {
                this.settings = result.pitchlenseSettings || {
                    apiEndpoint: 'https://pitchlense.com',
                    autoAnalyze: false,
                    notifications: true
                };
                this.updateSettingsUI();
                resolve();
            });
        });
    }

    updateSettingsUI() {
        document.getElementById('autoAnalyze').checked = this.settings.autoAnalyze || false;
        document.getElementById('notifications').checked = this.settings.notifications !== false;
        document.getElementById('apiEndpoint').value = this.settings.apiEndpoint || 'https://pitchlense.com';
    }

    setupEventListeners() {
        // Analyze current page button
        document.getElementById('analyzeCurrentPage').addEventListener('click', () => {
            this.analyzeCurrentPage();
        });

        // Open web app button
        document.getElementById('openWebApp').addEventListener('click', () => {
            this.openWebApp();
        });

        // View full report button
        document.getElementById('viewFullReport').addEventListener('click', () => {
            this.viewFullReport();
        });

        // Settings change handlers
        document.getElementById('autoAnalyze').addEventListener('change', (e) => {
            this.updateSetting('autoAnalyze', e.target.checked);
        });

        document.getElementById('notifications').addEventListener('change', (e) => {
            this.updateSetting('notifications', e.target.checked);
        });

        document.getElementById('apiEndpoint').addEventListener('change', (e) => {
            this.updateSetting('apiEndpoint', e.target.value);
        });

        // Footer links
        document.getElementById('helpLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.openHelp();
        });

        document.getElementById('aboutLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.openAbout();
        });
    }

    async analyzeCurrentPage() {
        const button = document.getElementById('analyzeCurrentPage');
        const originalText = button.innerHTML;
        
        try {
            // Show loading state
            button.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';
            button.disabled = true;

            // First check if content script is available
            try {
                await chrome.tabs.sendMessage(this.currentTab.id, {
                    action: 'getPageContent'
                });
            } catch (checkError) {
                throw new Error('Content script not available. Please refresh the page and try again.');
            }

            // Send message to content script
            const response = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'analyzePage'
            });

            if (response && response.success) {
                this.showStatus('Analysis started successfully!', 'success');
                // Close popup after successful start
                setTimeout(() => window.close(), 1000);
            } else {
                throw new Error('Failed to start analysis');
            }

        } catch (error) {
            console.error('Analysis error:', error);
            
            // Check if it's a connection error (content script not available)
            if (error.message.includes('Could not establish connection') || 
                error.message.includes('Receiving end does not exist')) {
                this.showStatus('Content script not available. Please refresh the page and try again.', 'error');
            } else {
                this.showStatus('Failed to analyze page: ' + error.message, 'error');
            }
        } finally {
            // Restore button state
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    async openWebApp() {
        try {
            await chrome.tabs.create({
                url: this.settings.apiEndpoint
            });
            window.close();
        } catch (error) {
            console.error('Failed to open web app:', error);
            this.showStatus('Failed to open web app', 'error');
        }
    }

    async viewFullReport() {
        try {
            const result = await chrome.storage.local.get(['lastAnalysis']);
            if (result.lastAnalysis) {
                await chrome.tabs.create({
                    url: `${this.settings.apiEndpoint}/report/${result.lastAnalysis.id || 'latest'}`
                });
                window.close();
            } else {
                this.showStatus('No recent analysis found', 'warning');
            }
        } catch (error) {
            console.error('Failed to open report:', error);
            this.showStatus('Failed to open report', 'error');
        }
    }

    async updateSetting(key, value) {
        this.settings[key] = value;
        
        try {
            await new Promise((resolve, reject) => {
                chrome.storage.sync.set({ pitchlenseSettings: this.settings }, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });
            
            // If API endpoint changed, check connection
            if (key === 'apiEndpoint') {
                await this.checkConnectionStatus();
            }
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showStatus('Failed to save settings', 'error');
        }
    }

    async checkConnectionStatus() {
        const connectionStatus = document.getElementById('connectionStatus');
        const apiStatus = document.getElementById('apiStatus');
        
        try {
            connectionStatus.textContent = 'Checking...';
            connectionStatus.className = 'status-value checking';
            
            // Check if we can reach the API
            const response = await fetch(`${this.settings.apiEndpoint}/api/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                connectionStatus.textContent = 'Connected';
                connectionStatus.className = 'status-value connected';
                apiStatus.textContent = 'Online';
                apiStatus.className = 'status-value connected';
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
            
        } catch (error) {
            connectionStatus.textContent = 'Disconnected';
            connectionStatus.className = 'status-value disconnected';
            apiStatus.textContent = 'Offline';
            apiStatus.className = 'status-value disconnected';
            console.error('Connection check failed:', error);
        }
    }

    async loadRecentAnalysis() {
        try {
            const result = await chrome.storage.local.get(['lastAnalysis']);
            if (result.lastAnalysis) {
                this.showRecentAnalysis(result.lastAnalysis);
            }
        } catch (error) {
            console.error('Failed to load recent analysis:', error);
        }
    }

    showRecentAnalysis(analysis) {
        const recentSection = document.getElementById('recentAnalysis');
        const scoreElement = document.getElementById('recentScore');
        const urlElement = document.getElementById('recentUrl');
        const timeElement = document.getElementById('recentTime');
        
        if (analysis.overallScore !== undefined) {
            scoreElement.textContent = analysis.overallScore;
        }
        
        if (analysis.url) {
            try {
                const url = new URL(analysis.url);
                urlElement.textContent = url.hostname + url.pathname;
            } catch {
                urlElement.textContent = 'Unknown page';
            }
        }
        
        if (analysis.timestamp) {
            const date = new Date(analysis.timestamp);
            timeElement.textContent = this.formatTimeAgo(date);
        }
        
        recentSection.style.display = 'block';
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    showStatus(message, type = 'info') {
        // Create status message element
        const statusEl = document.createElement('div');
        statusEl.className = `status-message status-${type}`;
        statusEl.textContent = message;
        
        Object.assign(statusEl.style, {
            position: 'fixed',
            top: '10px',
            left: '10px',
            right: '10px',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center',
            zIndex: '1000'
        });

        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#ff9800',
            error: '#f44336'
        };

        statusEl.style.backgroundColor = colors[type] || colors.info;
        statusEl.style.color = 'white';

        document.body.appendChild(statusEl);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (statusEl.parentNode) {
                statusEl.remove();
            }
        }, 3000);
    }

    openHelp() {
        chrome.tabs.create({
            url: 'https://github.com/your-repo/pitchlense#help'
        });
        window.close();
    }

    openAbout() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('about.html')
        });
        window.close();
    }
}
