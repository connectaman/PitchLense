// Market News JavaScript - FMP Integration

// Current active tab
let activeTab = 'general';

// Initialize cache manager
const apiCache = new CacheManager('pitchlense_news');

// Clear old cache on page load
apiCache.clearOldCache();

// Log cache statistics
const cacheStats = apiCache.getStats();
if (cacheStats) {
  }

// Auth check
fetch('/api/auth/me')
  .then(r => r.json())
  .then(d => {
    if (!d.user) {
      window.location.href = '/auth.html';
    } else {
      const userEmailText = document.getElementById('userEmailText');
      if (userEmailText) {
        userEmailText.textContent = d.user.email;
      }
      loadNews('general'); // Load general news by default
      initializeTabs();
    }
  })
  .catch(() => window.location.href = '/auth.html');

// Sign out
document.getElementById('signoutBtn')?.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {}
  window.location.href = '/auth.html';
});

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes === 0 ? 'Just now' : `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Full date
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

// Load news for a specific type
async function loadNews(type = 'general') {
  const loadingState = document.getElementById(`${type}Loading`);
  const emptyState = document.getElementById(`${type}Empty`);
  const newsGrid = document.getElementById(`${type}Grid`);

  if (!loadingState || !emptyState || !newsGrid) {
    console.error(`Elements not found for news type: ${type}`);
    return;
  }

  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  newsGrid.innerHTML = '';

  try {
    const params = new URLSearchParams();
    params.set('type', type);
    params.set('page', '0');
    params.set('limit', '20');

    const response = await cachedFetch(`/api/news?${params.toString()}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[${type}] Backend Error:`, errorData);
      
      // Show detailed error message
      Swal.fire({
        title: `Error Loading ${type.charAt(0).toUpperCase() + type.slice(1)} News`,
        html: `<div style="text-align: left;">
          <p><strong>Error:</strong> ${errorData.error || 'Failed to load news'}</p>
          ${errorData.details ? `<p><strong>Details:</strong> ${errorData.details}</p>` : ''}
          ${errorData.status ? `<p><strong>HTTP Status:</strong> ${errorData.status}</p>` : ''}
          ${errorData.endpoint ? `<p><strong>Endpoint:</strong> ${errorData.endpoint}</p>` : ''}
          <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
        </div>`,
        icon: 'error',
        confirmButtonColor: '#f1d85b',
        width: 600
      });
      
      loadingState.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const data = await response.json();
    const feed = data.feed || [];

    loadingState.classList.add('hidden');

    if (feed.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    // Display news articles
    feed.forEach(article => {
      const card = createNewsCard(article);
      newsGrid.appendChild(card);
    });

  } catch (error) {
    console.error(`Error loading ${type} news:`, error);
    loadingState.classList.add('hidden');
    
    Swal.fire({
      title: `Error Loading ${type.charAt(0).toUpperCase() + type.slice(1)} News`,
      html: `<div style="text-align: left;">
        <p><strong>Error:</strong> ${error.message || 'Failed to load news'}</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
      </div>`,
      icon: 'error',
      confirmButtonColor: '#f1d85b',
      width: 600
    });
    
    emptyState.classList.remove('hidden');
  }
}

// Create news card for FMP data
function createNewsCard(article) {
  const card = document.createElement('div');
  card.className = 'bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer glare-card';
  
  // Get symbol or publisher
  const source = article.publisher || article.site || 'Unknown Source';
  const symbol = article.symbol || '';
  
  // Truncate text
  const text = article.text || 'No summary available';
  const truncatedText = text.length > 200 ? text.substring(0, 200) + '...' : text;
  
  card.innerHTML = `
    <div class="flex items-start gap-3 mb-3">
      ${article.image ? `
        <img src="${article.image}" alt="" class="w-20 h-20 object-cover rounded-lg flex-shrink-0" onerror="this.style.display='none'">
      ` : ''}
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-base font-bold text-white line-clamp-2 flex-1">${article.title}</h3>
        </div>
        <div class="flex items-center gap-2 text-xs text-white/60">
          <span>${source}</span>
          <span>•</span>
          <span>${formatDate(article.publishedDate)}</span>
          ${symbol ? `<span>•</span><span class="text-accent font-semibold">${symbol}</span>` : ''}
        </div>
      </div>
    </div>
    
    <p class="text-sm text-white/70 mb-3 line-clamp-3">${truncatedText}</p>
    
    <div class="flex items-center justify-between pt-3 border-t border-white/10">
      <div class="flex items-center gap-2">
        ${symbol ? `<span class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold">${symbol}</span>` : ''}
        <span class="text-xs text-white/60">${source}</span>
      </div>
      <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-accent hover:underline flex items-center gap-1" onclick="event.stopPropagation()">
        Read More
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
              </div>
  `;
  
  // Click to open in new tab
  card.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
      window.open(article.url, '_blank');
    }
  });
  
  return card;
}

// Initialize tabs
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

// Switch tabs
function switchTab(tab) {
  activeTab = tab;
  
  // Update button styles
  document.querySelectorAll('.tab-button').forEach(btn => {
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Show/hide content
  const newsTypes = ['general', 'press', 'stock', 'crypto', 'forex'];
  newsTypes.forEach(type => {
    const tabElement = document.getElementById(`${type}Tab`);
    if (tabElement) {
      tabElement.classList.toggle('hidden', tab !== type);
    }
  });
  
  // Insider trades tab
  const insiderTab = document.getElementById('insiderTab');
  if (insiderTab) {
    insiderTab.classList.toggle('hidden', tab !== 'insider');
  }
  
  // Crowdfunding tab
  const crowdfundingTab = document.getElementById('crowdfundingTab');
  if (crowdfundingTab) {
    crowdfundingTab.classList.toggle('hidden', tab !== 'crowdfunding');
  }
  
  // Equity offerings tab
  const equityTab = document.getElementById('equityTab');
  if (equityTab) {
    equityTab.classList.toggle('hidden', tab !== 'equity');
  }
  
  // Ownership tab
  const ownershipTab = document.getElementById('ownershipTab');
  if (ownershipTab) {
    ownershipTab.classList.toggle('hidden', tab !== 'ownership');
  }
  
  // Load data for the active tab
  if (newsTypes.includes(tab)) {
    loadNews(tab);
  } else if (tab === 'insider') {
    loadInsiderTrades();
  } else if (tab === 'crowdfunding') {
    loadCrowdfunding();
  } else if (tab === 'equity') {
    loadEquityOfferings();
  } else if (tab === 'ownership') {
    // Populate quick search buttons if not already done
    populateQuickSearchButtons();
    
    // Show empty state initially, wait for user to search
    const ownershipEmpty = document.getElementById('ownershipEmpty');
    if (ownershipEmpty) {
      ownershipEmpty.classList.remove('hidden');
    }
    // Focus on search input
    setTimeout(() => {
      document.getElementById('ownershipSymbolInput')?.focus();
    }, 100);
  }
}

// Top 50 companies for quick search
const top50Companies = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'V', 'UNH',
  'JNJ', 'WMT', 'JPM', 'XOM', 'MA', 'PG', 'LLY', 'HD', 'CVX', 'MRK',
  'ABBV', 'KO', 'COST', 'PEP', 'AVGO', 'ADBE', 'MCD', 'CRM', 'TMO', 'CSCO',
  'ACN', 'ABT', 'NKE', 'TXN', 'DIS', 'ORCL', 'DHR', 'VZ', 'CMCSA', 'NFLX',
  'WFC', 'AMD', 'INTC', 'PM', 'NEE', 'COP', 'UNP', 'BMY', 'RTX', 'QCOM'
];

// Populate quick search buttons
function populateQuickSearchButtons() {
  const container = document.getElementById('quickSearchButtons');
  if (!container) return;
  
  // Only populate once
  if (container.children.length > 0) return;
  
  top50Companies.forEach(symbol => {
    const button = document.createElement('button');
    button.className = 'px-3 py-1.5 bg-[#1E1E21] hover:bg-accent hover:text-[#1E1E21] border border-white/10 hover:border-accent rounded-lg text-xs font-semibold text-white transition-all';
    button.textContent = symbol;
    button.onclick = () => {
      const input = document.getElementById('ownershipSymbolInput');
      if (input) {
        input.value = symbol;
      }
      loadOwnership(symbol);
    };
    container.appendChild(button);
  });
}

// Load insider trades
async function loadInsiderTrades() {
  const loadingState = document.getElementById('insiderLoading');
  const emptyState = document.getElementById('insiderEmpty');
  const tradesGrid = document.getElementById('insiderGrid');

  if (!loadingState || !emptyState || !tradesGrid) {
    console.error('Insider trades elements not found');
    return;
  }

  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  tradesGrid.innerHTML = '';

  try {
    const params = new URLSearchParams();
    params.set('page', '0');
    params.set('limit', '100');

    const response = await cachedFetch(`/api/news/insider-trades?${params.toString()}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      let errorData = { error: 'Failed to load insider trades', details: `HTTP ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) {
        // Response is not JSON (probably HTML error page)
        const text = await response.text();
        console.error('[insider] Non-JSON response:', text.substring(0, 200));
        errorData.details = 'Server returned an error page. Check backend console.';
      }
      
      console.error('[insider] Backend Error:', errorData);
      
      Swal.fire({
        title: 'Error Loading Insider Trades',
        html: `<div style="text-align: left;">
          <p><strong>Error:</strong> ${errorData.error || 'Failed to load insider trades'}</p>
          ${errorData.details ? `<p><strong>Details:</strong> ${errorData.details}</p>` : ''}
          <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
        </div>`,
        icon: 'error',
        confirmButtonColor: '#f1d85b',
        width: 600
      });
      
      loadingState.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const data = await response.json();
    const trades = data.trades || [];

    loadingState.classList.add('hidden');

    if (trades.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    // Display insider trades
    trades.forEach(trade => {
      const card = createInsiderTradeCard(trade);
      tradesGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading insider trades:', error);
    loadingState.classList.add('hidden');
    
    Swal.fire({
      title: 'Error Loading Insider Trades',
      html: `<div style="text-align: left;">
        <p><strong>Error:</strong> ${error.message || 'Failed to load insider trades'}</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
      </div>`,
      icon: 'error',
      confirmButtonColor: '#f1d85b',
      width: 600
    });
    
    emptyState.classList.remove('hidden');
  }
}

// Create insider trade card
function createInsiderTradeCard(trade) {
  const card = document.createElement('div');
  card.className = 'bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all glare-card';
  
  // Determine if it's a buy or sell
  const isBuy = trade.acquisitionOrDisposition === 'A';
  const actionColor = isBuy ? 'text-green-400' : 'text-red-400';
  const actionBg = isBuy ? 'bg-green-500/20' : 'bg-red-500/20';
  const actionText = isBuy ? 'BUY' : 'SELL';
  const actionIcon = isBuy ? '📈' : '📉';
  
  // Format price
  const priceDisplay = trade.price > 0 ? `$${trade.price.toFixed(2)}` : 'N/A';
  const totalValue = trade.price > 0 && trade.securitiesTransacted > 0 
    ? `$${(trade.price * trade.securitiesTransacted).toLocaleString()}` 
    : 'N/A';
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl font-bold text-accent">${trade.symbol || 'N/A'}</span>
          <span class="text-xs px-2 py-1 rounded-full ${actionBg} ${actionColor} font-semibold flex items-center gap-1">
            ${actionIcon} ${actionText}
          </span>
        </div>
        <div class="text-white font-semibold mb-1">${trade.reportingName || 'Unknown Insider'}</div>
        <div class="text-xs text-white/60">${trade.typeOfOwner || 'N/A'}</div>
      </div>
      <div class="text-right">
        <div class="text-sm text-white/60">Transaction Date</div>
        <div class="text-white font-semibold">${formatDate(trade.transactionDate)}</div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Shares</div>
        <div class="text-lg font-bold text-white">${trade.securitiesTransacted?.toLocaleString() || '0'}</div>
      </div>
        <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Price</div>
        <div class="text-lg font-bold text-white">${priceDisplay}</div>
        </div>
        <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Total Value</div>
        <div class="text-lg font-bold ${actionColor}">${totalValue}</div>
        </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Shares Owned</div>
        <div class="text-lg font-bold text-white">${trade.securitiesOwned?.toLocaleString() || '0'}</div>
      </div>
    </div>

    <div class="pt-3 border-t border-white/10 space-y-2 text-xs">
      <div class="flex justify-between">
        <span class="text-white/60">Transaction Type:</span>
        <span class="text-white font-medium">${trade.transactionType || 'N/A'}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-white/60">Security:</span>
        <span class="text-white font-medium">${trade.securityName || 'N/A'}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-white/60">Filing Date:</span>
        <span class="text-white font-medium">${formatDate(trade.filingDate)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-white/60">Form Type:</span>
        <span class="text-white font-medium">${trade.formType || 'N/A'}</span>
      </div>
    </div>
    
    ${trade.url ? `
      <div class="mt-3 pt-3 border-t border-white/10">
        <a href="${trade.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-accent hover:underline flex items-center gap-1">
          View SEC Filing
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    ` : ''}
  `;
  
  return card;
}

// Load crowdfunding campaigns
async function loadCrowdfunding() {
  const loadingState = document.getElementById('crowdfundingLoading');
  const emptyState = document.getElementById('crowdfundingEmpty');
  const grid = document.getElementById('crowdfundingGrid');

  if (!loadingState || !emptyState || !grid) {
    console.error('Crowdfunding elements not found');
    return;
  }

  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  grid.innerHTML = '';

  try {
    const params = new URLSearchParams();
    params.set('page', '0');
    params.set('limit', '100');

    const response = await cachedFetch(`/api/news/crowdfunding?${params.toString()}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      let errorData = { error: 'Failed to load crowdfunding campaigns', details: `HTTP ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) {
        // Response is not JSON (probably HTML error page)
        const text = await response.text();
        console.error('[crowdfunding] Non-JSON response:', text.substring(0, 200));
        errorData.details = 'Server returned an error page. Check backend console.';
      }
      
      console.error('[crowdfunding] Backend Error:', errorData);
      
      Swal.fire({
        title: 'Error Loading Crowdfunding Campaigns',
        html: `<div style="text-align: left;">
          <p><strong>Error:</strong> ${errorData.error || 'Failed to load crowdfunding campaigns'}</p>
          ${errorData.details ? `<p><strong>Details:</strong> ${errorData.details}</p>` : ''}
          <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
        </div>`,
        icon: 'error',
        confirmButtonColor: '#f1d85b',
        width: 600
      });
      
      loadingState.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const data = await response.json();
    const campaigns = data.campaigns || [];

    loadingState.classList.add('hidden');

    if (campaigns.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    // Display crowdfunding campaigns
    campaigns.forEach(campaign => {
      const card = createCrowdfundingCard(campaign);
        grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading crowdfunding:', error);
    loadingState.classList.add('hidden');
    
    Swal.fire({
      title: 'Error Loading Crowdfunding Campaigns',
      html: `<div style="text-align: left;">
        <p><strong>Error:</strong> ${error.message || 'Failed to load crowdfunding campaigns'}</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
      </div>`,
      icon: 'error',
      confirmButtonColor: '#f1d85b',
      width: 600
    });
    
    emptyState.classList.remove('hidden');
  }
}

// Create crowdfunding campaign card
function createCrowdfundingCard(campaign) {
  const card = document.createElement('div');
  card.className = 'bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all glare-card';
  
  const offeringProgress = campaign.offeringAmount && campaign.maximumOfferingAmount 
    ? ((campaign.offeringAmount / campaign.maximumOfferingAmount) * 100).toFixed(1)
    : 0;
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-bold text-white mb-2">${campaign.companyName || campaign.nameOfIssuer || 'Unknown Company'}</h3>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold">${campaign.formType || 'N/A'}</span>
          <span class="text-xs text-white/60">${campaign.legalStatusForm || 'N/A'}</span>
        </div>
        ${campaign.issuerWebsite ? `
          <a href="${campaign.issuerWebsite.startsWith('http') ? campaign.issuerWebsite : 'https://' + campaign.issuerWebsite}" target="_blank" class="text-xs text-accent hover:underline">
            🌐 ${campaign.issuerWebsite}
          </a>
        ` : ''}
      </div>
      <div class="text-right">
        <div class="text-xs text-white/60">Filing Date</div>
        <div class="text-sm font-semibold text-white">${formatDate(campaign.filingDate)}</div>
        </div>
    </div>
    
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Target Amount</div>
        <div class="text-lg font-bold text-white">$${campaign.maximumOfferingAmount?.toLocaleString() || 'N/A'}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Raised</div>
        <div class="text-lg font-bold text-green-400">$${campaign.offeringAmount?.toLocaleString() || 'N/A'}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Price Per Share</div>
        <div class="text-lg font-bold text-white">$${campaign.offeringPrice?.toFixed(2) || 'N/A'}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Deadline</div>
        <div class="text-sm font-bold text-white">${campaign.offeringDeadlineDate || 'N/A'}</div>
      </div>
    </div>
    
    ${campaign.offeringAmount && campaign.maximumOfferingAmount ? `
      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-white/60">Progress</span>
          <span class="text-accent font-semibold">${offeringProgress}%</span>
    </div>
        <div class="w-full bg-white/10 rounded-full h-2">
          <div class="bg-accent h-2 rounded-full transition-all" style="width: ${Math.min(offeringProgress, 100)}%"></div>
        </div>
      </div>
    ` : ''}
    
    <div class="pt-3 border-t border-white/10 space-y-2 text-xs">
      <div class="flex justify-between">
        <span class="text-white/60">Security Type:</span>
        <span class="text-white font-medium">${campaign.securityOfferedOtherDescription || campaign.securityOfferedType || 'N/A'}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-white/60">Intermediary:</span>
        <span class="text-white font-medium">${campaign.intermediaryCompanyName || 'N/A'}</span>
      </div>
      ${campaign.issuerCity && campaign.issuerStateOrCountry ? `
        <div class="flex justify-between">
          <span class="text-white/60">Location:</span>
          <span class="text-white font-medium">${campaign.issuerCity}, ${campaign.issuerStateOrCountry}</span>
        </div>
      ` : ''}
      <div class="flex justify-between">
        <span class="text-white/60">Employees:</span>
        <span class="text-white font-medium">${campaign.currentNumberOfEmployees || 'N/A'}</span>
      </div>
    </div>
  `;
  
  return card;
}

// Load equity offerings
async function loadEquityOfferings() {
  const loadingState = document.getElementById('equityLoading');
  const emptyState = document.getElementById('equityEmpty');
  const grid = document.getElementById('equityGrid');

  if (!loadingState || !emptyState || !grid) {
    console.error('Equity offerings elements not found');
    return;
  }

  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  grid.innerHTML = '';

  try {
    const params = new URLSearchParams();
    params.set('page', '0');
    params.set('limit', '100');

    const response = await cachedFetch(`/api/news/equity-offerings?${params.toString()}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      let errorData = { error: 'Failed to load equity offerings', details: `HTTP ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) {
        // Response is not JSON (probably HTML error page)
        const text = await response.text();
        console.error('[equity] Non-JSON response:', text.substring(0, 200));
        errorData.details = 'Server returned an error page. Check backend console.';
      }
      
      console.error('[equity] Backend Error:', errorData);
      
      Swal.fire({
        title: 'Error Loading Equity Offerings',
        html: `<div style="text-align: left;">
          <p><strong>Error:</strong> ${errorData.error || 'Failed to load equity offerings'}</p>
          ${errorData.details ? `<p><strong>Details:</strong> ${errorData.details}</p>` : ''}
          <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
        </div>`,
        icon: 'error',
        confirmButtonColor: '#f1d85b',
        width: 600
      });
      
      loadingState.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const data = await response.json();
    const offerings = data.offerings || [];

    loadingState.classList.add('hidden');

    if (offerings.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    // Display equity offerings
    offerings.forEach(offering => {
      const card = createEquityOfferingCard(offering);
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading equity offerings:', error);
    loadingState.classList.add('hidden');
    
    Swal.fire({
      title: 'Error Loading Equity Offerings',
      html: `<div style="text-align: left;">
        <p><strong>Error:</strong> ${error.message || 'Failed to load equity offerings'}</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
      </div>`,
      icon: 'error',
      confirmButtonColor: '#f1d85b',
      width: 600
    });
    
    emptyState.classList.remove('hidden');
  }
}

// Create equity offering card
function createEquityOfferingCard(offering) {
  const card = document.createElement('div');
  card.className = 'bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all glare-card';
  
  const totalRaised = offering.totalAmountSold || 0;
  const totalTarget = offering.totalOfferingAmount || 0;
  const progress = totalTarget > 0 ? ((totalRaised / totalTarget) * 100).toFixed(1) : 0;
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-bold text-white mb-2">${offering.companyName || offering.entityName || 'Unknown Entity'}</h3>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold">${offering.formType || 'N/A'}</span>
          <span class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">${offering.industryGroupType || 'N/A'}</span>
        </div>
        ${offering.entityType ? `
          <div class="text-xs text-white/60">${offering.entityType} • ${offering.jurisdictionOfIncorporation || 'N/A'}</div>
        ` : ''}
      </div>
      <div class="text-right">
        <div class="text-xs text-white/60">Filing Date</div>
        <div class="text-sm font-semibold text-white">${formatDate(offering.filingDate)}</div>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Total Offering</div>
        <div class="text-lg font-bold text-white">${totalTarget > 0 ? '$' + totalTarget.toLocaleString() : 'Unlimited'}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Amount Sold</div>
        <div class="text-lg font-bold text-green-400">$${totalRaised.toLocaleString()}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Min Investment</div>
        <div class="text-sm font-bold text-white">$${offering.minimumInvestmentAccepted?.toLocaleString() || 'N/A'}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Investors</div>
        <div class="text-sm font-bold text-white">${offering.totalNumberAlreadyInvested || '0'}</div>
      </div>
    </div>
    
    ${totalTarget > 0 ? `
      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-white/60">Fundraising Progress</span>
          <span class="text-accent font-semibold">${progress}%</span>
        </div>
        <div class="w-full bg-white/10 rounded-full h-2">
          <div class="bg-accent h-2 rounded-full transition-all" style="width: ${Math.min(progress, 100)}%"></div>
        </div>
      </div>
    ` : ''}
    
    <div class="pt-3 border-t border-white/10 space-y-2 text-xs">
      ${offering.federalExemptionsExclusions ? `
        <div class="flex justify-between">
          <span class="text-white/60">Exemptions:</span>
          <span class="text-white font-medium">${offering.federalExemptionsExclusions}</span>
        </div>
      ` : ''}
      ${offering.dateOfFirstSale ? `
        <div class="flex justify-between">
          <span class="text-white/60">First Sale Date:</span>
          <span class="text-white font-medium">${offering.dateOfFirstSale}</span>
        </div>
      ` : ''}
      ${offering.issuerCity && offering.issuerStateOrCountry ? `
        <div class="flex justify-between">
          <span class="text-white/60">Location:</span>
          <span class="text-white font-medium">${offering.issuerCity}, ${offering.issuerStateOrCountryDescription || offering.issuerStateOrCountry}</span>
        </div>
      ` : ''}
      <div class="flex justify-between">
        <span class="text-white/60">Equity Type:</span>
        <span class="text-white font-medium">${offering.securitiesOfferedAreOfEquityType ? 'Yes' : 'No'}</span>
      </div>
    </div>
  `;
  
  return card;
}

// Load acquisition ownership
async function loadOwnership(symbol) {
  const loadingState = document.getElementById('ownershipLoading');
  const emptyState = document.getElementById('ownershipEmpty');
  const grid = document.getElementById('ownershipGrid');

  if (!loadingState || !emptyState || !grid) {
    console.error('Ownership elements not found');
    return;
  }

  if (!symbol || symbol.trim().length === 0) {
    Swal.fire({
      title: 'Symbol Required',
      text: 'Please enter a stock symbol (e.g., AAPL, MSFT, TSLA)',
      icon: 'warning',
      confirmButtonColor: '#f1d85b'
    });
    return;
  }

  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  grid.innerHTML = '';

  try {
    const params = new URLSearchParams();
    params.set('symbol', symbol.toUpperCase());

    const response = await cachedFetch(`/api/news/acquisition-ownership?${params.toString()}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      let errorData = { error: 'Failed to load ownership data', details: `HTTP ${response.status}` };
      try {
        errorData = await response.json();
      } catch (e) {
        // Response is not JSON (probably HTML error page)
        const text = await response.text();
        console.error('[ownership] Non-JSON response:', text.substring(0, 200));
        errorData.details = 'Server returned an error page. Check backend console.';
      }
      
      console.error('[ownership] Backend Error:', errorData);
      
      Swal.fire({
        title: 'Error Loading Ownership Data',
        html: `<div style="text-align: left;">
          <p><strong>Error:</strong> ${errorData.error || 'Failed to load ownership data'}</p>
          ${errorData.details ? `<p><strong>Details:</strong> ${errorData.details}</p>` : ''}
          <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
        </div>`,
        icon: 'error',
        confirmButtonColor: '#f1d85b',
        width: 600
      });
      
      loadingState.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    const data = await response.json();
    const ownership = data.ownership || [];

    loadingState.classList.add('hidden');

    if (ownership.length === 0) {
      emptyState.classList.remove('hidden');
      grid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-lg font-semibold text-white">No ownership data found for ${symbol.toUpperCase()}</div>
          <div class="text-sm text-white/60 mt-2">Try searching for another symbol</div>
        </div>
      `;
      return;
    }

    // Deduplicate ownership records
    const uniqueOwnership = deduplicateOwnershipRecords(ownership);
    
    // Log deduplication info to console only
    if (uniqueOwnership.length < ownership.length) {
      }

    // Display unique ownership records
    uniqueOwnership.forEach(record => {
      const card = createOwnershipCard(record);
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading ownership:', error);
    loadingState.classList.add('hidden');
    
    Swal.fire({
      title: 'Error Loading Ownership Data',
      html: `<div style="text-align: left;">
        <p><strong>Error:</strong> ${error.message || 'Failed to load ownership data'}</p>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">Check browser console and backend terminal for more details</p>
      </div>`,
      icon: 'error',
      confirmButtonColor: '#f1d85b',
      width: 600
    });
    
    emptyState.classList.remove('hidden');
  }
}

// Deduplicate ownership records based on key fields
function deduplicateOwnershipRecords(records) {
  const seen = new Set();
  const unique = [];
  
  records.forEach(record => {
    // Create a unique key based on symbol, entity name, filing date, and ownership percentage
    const key = `${record.symbol || ''}-${record.nameOfReportingPerson || ''}-${record.filingDate || ''}-${record.percentOfClass || ''}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(record);
    }
  });
  
  return unique;
}

// Create ownership record card
function createOwnershipCard(record) {
  const card = document.createElement('div');
  card.className = 'bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all glare-card';
  
  const percentOwnership = parseFloat(record.percentOfClass) || 0;
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl font-bold text-accent">${record.symbol || 'N/A'}</span>
          <span class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">${percentOwnership.toFixed(2)}% Ownership</span>
        </div>
        <h3 class="text-white font-semibold mb-1">${record.nameOfReportingPerson || 'Unknown Entity'}</h3>
        <div class="text-xs text-white/60">${record.citizenshipOrPlaceOfOrganization || 'N/A'}</div>
      </div>
      <div class="text-right">
        <div class="text-xs text-white/60">Filing Date</div>
        <div class="text-sm font-semibold text-white">${formatDate(record.filingDate)}</div>
        </div>
    </div>
    
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Beneficially Owned</div>
        <div class="text-lg font-bold text-white">${parseInt(record.amountBeneficiallyOwned || 0).toLocaleString()}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">% of Class</div>
        <div class="text-lg font-bold text-accent">${percentOwnership.toFixed(2)}%</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Sole Voting</div>
        <div class="text-sm font-bold text-white">${parseInt(record.soleVotingPower || 0).toLocaleString()}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Shared Voting</div>
        <div class="text-sm font-bold text-white">${parseInt(record.sharedVotingPower || 0).toLocaleString()}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Sole Dispositive</div>
        <div class="text-sm font-bold text-white">${parseInt(record.soleDispositivePower || 0).toLocaleString()}</div>
      </div>
      <div class="bg-[#1E1E21] rounded-lg p-3">
        <div class="text-xs text-white/60 mb-1">Shared Dispositive</div>
        <div class="text-sm font-bold text-white">${parseInt(record.sharedDispositivePower || 0).toLocaleString()}</div>
      </div>
    </div>
    
    <div class="pt-3 border-t border-white/10 space-y-2 text-xs">
      <div class="flex justify-between">
        <span class="text-white/60">Reporting Person Type:</span>
        <span class="text-white font-medium">${record.typeOfReportingPerson || 'N/A'}</span>
      </div>
      ${record.cusip ? `
        <div class="flex justify-between">
          <span class="text-white/60">CUSIP:</span>
          <span class="text-white font-medium">${record.cusip}</span>
        </div>
      ` : ''}
      <div class="flex justify-between">
        <span class="text-white/60">Accepted Date:</span>
        <span class="text-white font-medium">${formatDate(record.acceptedDate)}</span>
      </div>
    </div>
    
    ${record.url ? `
      <div class="mt-3 pt-3 border-t border-white/10">
        <a href="${record.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-accent hover:underline flex items-center gap-1">
          View SEC Filing (13G/13D)
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
    </div>
    ` : ''}
  `;
  
  return card;
}

// Event listeners
// Ownership search button
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchOwnershipBtn');
  const symbolInput = document.getElementById('ownershipSymbolInput');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const symbol = symbolInput?.value?.trim();
      if (symbol) {
        loadOwnership(symbol);
      }
    });
  }
  
  if (symbolInput) {
    symbolInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const symbol = symbolInput.value.trim();
        if (symbol) {
          loadOwnership(symbol);
      }
    }
  });
}
});

document.getElementById('refreshBtn')?.addEventListener('click', (e) => {
  // Clear cache if Ctrl/Cmd + Click
  if (e.ctrlKey || e.metaKey) {
    apiCache.clearAll();
    Swal.fire({
      icon: 'success',
      title: 'Cache Cleared',
      text: 'All cached data has been cleared. Fetching fresh data...',
      timer: 2000,
      showConfirmButton: false
    });
  }
  
  // Reload current tab
  const newsTypes = ['general', 'press', 'stock', 'crypto', 'forex'];
  if (newsTypes.includes(activeTab)) {
    loadNews(activeTab);
  } else if (activeTab === 'insider') {
    loadInsiderTrades();
  } else if (activeTab === 'crowdfunding') {
    loadCrowdfunding();
  } else if (activeTab === 'equity') {
    loadEquityOfferings();
  } else if (activeTab === 'ownership') {
    // Reload with current symbol
    const symbol = document.getElementById('ownershipSymbolInput')?.value?.trim();
    if (symbol) {
      loadOwnership(symbol);
    }
  }
});


