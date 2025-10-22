// Symbol Search JavaScript

let selectedSymbol = null;
let searchTimeout = null;
let companyCharts = {};

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
      document.getElementById('searchInput')?.focus();
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

// Format currency
function formatCurrency(value) {
  if (!value || value === 'None') return 'N/A';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  return '$' + num.toLocaleString();
}

// Format percentage
function formatPercent(value) {
  if (!value || value === 'None') return 'N/A';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return (num * 100).toFixed(2) + '%';
}

// Format number
function formatNumber(value) {
  if (!value || value === 'None') return 'N/A';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString();
}

// Search input with real-time search
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const resultsContainer = document.getElementById('resultsContainer');
const searchIcon = document.getElementById('searchIcon');
const loadingIcon = document.getElementById('loadingIcon');

searchInput?.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  
  if (searchTimeout) clearTimeout(searchTimeout);

  if (query.length === 0) {
    searchResults.classList.add('hidden');
    return;
  }

  searchIcon.classList.add('hidden');
  loadingIcon.classList.remove('hidden');

  searchTimeout = setTimeout(() => performSearch(query), 300);
});

// Perform search
async function performSearch(keywords) {
  try {
    const response = await fetch(`/api/search/symbols?keywords=${encodeURIComponent(keywords)}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    const matches = data.bestMatches || [];

    searchIcon.classList.remove('hidden');
    loadingIcon.classList.add('hidden');

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-6 text-center text-white/60">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" class="mx-auto mb-3 text-white/40">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <div class="text-sm">No results found for "${keywords}"</div>
        </div>
      `;
      searchResults.classList.remove('hidden');
      return;
    }

    resultsContainer.innerHTML = matches.map(match => {
      const symbol = match['1. symbol'];
      const name = match['2. name'];
      const type = match['3. type'];
      const region = match['4. region'];
      const matchScore = parseFloat(match['9. matchScore']) * 100;
      const currency = match['8. currency'];

      return `
        <div class="search-result-item p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors" data-symbol='${JSON.stringify(match).replace(/'/g, "&#39;")}'>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg font-bold text-white">${symbol}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">${type}</span>
              </div>
              <div class="text-sm text-white/80 mb-2">${name}</div>
              <div class="flex items-center gap-3 text-xs text-white/60">
                <span>📍 ${region}</span>
                <span>💱 ${currency}</span>
              </div>
            </div>
            <div class="text-right ml-4">
              <div class="text-xs text-white/60">Match</div>
              <div class="text-sm font-semibold text-accent">${matchScore.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    searchResults.classList.remove('hidden');

    document.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const symbolData = JSON.parse(item.getAttribute('data-symbol'));
        loadCompanyData(symbolData['1. symbol']);
      });
    });

  } catch (error) {
    console.error('Search error:', error);
    searchIcon.classList.remove('hidden');
    loadingIcon.classList.add('hidden');
  }
}

// Load comprehensive company data
async function loadCompanyData(symbol) {
  try {
    // Hide search view, show company view with loading
    document.getElementById('searchView').classList.add('hidden');
    document.getElementById('companyView').classList.remove('hidden');
    
    const companyContent = document.getElementById('companyContent');
    companyContent.innerHTML = `
      <div class="min-h-[60vh] grid place-items-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FFF27A] mx-auto mb-4"></div>
          <div class="text-xl font-semibold text-white">Loading ${symbol} Data...</div>
          <div class="text-sm text-white/60 mt-2">Fetching comprehensive company information</div>
        </div>
      </div>
    `;

    // Fetch comprehensive data
    const response = await fetch(`/api/search/company/${symbol}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to load company data');

    const data = await response.json();
    
    // Also fetch news for this symbol
    const newsResponse = await fetch(`/api/news?tickers=${symbol}&limit=10`, {
      credentials: 'include'
    });
    const newsData = await newsResponse.json();

    // Render company view
    renderCompanyView(symbol, data, newsData.feed || []);

  } catch (error) {
    console.error('Error loading company data:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to load company data',
      icon: 'error',
      confirmButtonColor: '#f1d85b'
    });
    
    document.getElementById('backToSearch').click();
  }
}

// Render company view
function renderCompanyView(symbol, data, news) {
  const overview = data.overview || {};
  const isETF = overview.AssetType?.includes('ETF');
  
  const content = document.getElementById('companyContent');
  
  content.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">${overview.Name || symbol}</h1>
            <div class="flex items-center gap-3 text-sm text-white/60">
              <span>${overview.Exchange || 'N/A'}: ${symbol}</span>
              <span>•</span>
              <span>${overview.AssetType || 'N/A'}</span>
              <span>•</span>
              <span>${overview.Sector || overview.Industry || 'N/A'}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-white/60">Market Cap</div>
            <div class="text-2xl font-bold text-white">${formatCurrency(overview.MarketCapitalization)}</div>
          </div>
        </div>
        ${overview.Description ? `<p class="text-white/80 text-sm mt-4">${overview.Description}</p>` : ''}
      </div>

      <!-- Tabs -->
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-2 flex gap-2 overflow-x-auto">
        <button class="company-tab active flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="overview">Overview</button>
        <button class="company-tab flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="financials">Financials</button>
        <button class="company-tab flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="earnings">Earnings</button>
        <button class="company-tab flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="technical">Technical</button>
        <button class="company-tab flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="dividends">Dividends & Splits</button>
        ${isETF ? '<button class="company-tab flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="etf">ETF Details</button>' : ''}
        <button class="company-tab flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all text-sm" data-tab="news">News</button>
      </div>

      <!-- Tab Content -->
      <div id="overviewTab" class="company-tab-content">${renderOverviewTab(overview, data)}</div>
      <div id="financialsTab" class="company-tab-content hidden">${renderFinancialsTab(data)}</div>
      <div id="earningsTab" class="company-tab-content hidden">${renderEarningsTab(data)}</div>
      <div id="technicalTab" class="company-tab-content hidden" data-symbol="${symbol}">
        <div class="text-center py-12">
          <div class="text-white/60 mb-4">Technical indicators will load when you open this tab</div>
          <button class="load-technical-btn px-6 py-3 bg-[#FFF27A] text-[#1E1E21] font-semibold rounded-lg hover:opacity-90 transition-opacity" data-symbol="${symbol}">
            Load Technical Indicators
          </button>
        </div>
      </div>
      <div id="dividendsTab" class="company-tab-content hidden">${renderDividendsTab(data)}</div>
      ${isETF ? `<div id="etfTab" class="company-tab-content hidden">${renderETFTab(data.etf_profile)}</div>` : ''}
      <div id="newsTab" class="company-tab-content hidden">${renderNewsTab(news, symbol)}</div>
    </div>
  `;

  // Add tab switchers
  document.querySelectorAll('.company-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.company-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.company-tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById(tab + 'Tab').classList.remove('hidden');
    });
  });

  // Add load technical indicators button handler
  document.querySelector('.load-technical-btn')?.addEventListener('click', function() {
    const symbol = this.getAttribute('data-symbol');
    loadTechnicalIndicators(symbol);
  });

  // Render charts after DOM update
  setTimeout(() => {
    renderFinancialCharts(data);
    renderEarningsChart(data.earnings);
    renderSharesChart(data.shares_outstanding);
  }, 100);
}

// Render Overview Tab
function renderOverviewTab(overview, data) {
  return `
    <!-- KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
        <div class="text-xs text-white/60 mb-1">P/E Ratio</div>
        <div class="text-xl font-bold text-white">${overview.PERatio || 'N/A'}</div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
        <div class="text-xs text-white/60 mb-1">EPS</div>
        <div class="text-xl font-bold text-white">${overview.EPS || 'N/A'}</div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
        <div class="text-xs text-white/60 mb-1">Revenue TTM</div>
        <div class="text-xl font-bold text-white">${formatCurrency(overview.RevenueTTM)}</div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
        <div class="text-xs text-white/60 mb-1">Dividend Yield</div>
        <div class="text-xl font-bold text-white">${formatPercent(overview.DividendYield)}</div>
      </div>
    </div>

    <!-- Company Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Company Information</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-white/60">Sector:</span><span class="text-white font-semibold">${overview.Sector || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Industry:</span><span class="text-white font-semibold">${overview.Industry || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Country:</span><span class="text-white font-semibold">${overview.Country || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Currency:</span><span class="text-white font-semibold">${overview.Currency || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Fiscal Year End:</span><span class="text-white font-semibold">${overview.FiscalYearEnd || 'N/A'}</span></div>
        </div>
        ${overview.OfficialSite ? `<a href="${overview.OfficialSite}" target="_blank" class="mt-4 block text-accent hover:underline text-sm">🌐 Visit Website</a>` : ''}
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Stock Performance</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-white/60">52 Week High:</span><span class="text-white font-semibold">${overview['52WeekHigh'] || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">52 Week Low:</span><span class="text-white font-semibold">${overview['52WeekLow'] || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">50 Day MA:</span><span class="text-white font-semibold">${overview['50DayMovingAverage'] || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">200 Day MA:</span><span class="text-white font-semibold">${overview['200DayMovingAverage'] || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Beta:</span><span class="text-white font-semibold">${overview.Beta || 'N/A'}</span></div>
        </div>
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Financial Metrics</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-white/60">EBITDA:</span><span class="text-white font-semibold">${formatCurrency(overview.EBITDA)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Profit Margin:</span><span class="text-white font-semibold">${formatPercent(overview.ProfitMargin)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">ROE:</span><span class="text-white font-semibold">${formatPercent(overview.ReturnOnEquityTTM)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">ROA:</span><span class="text-white font-semibold">${formatPercent(overview.ReturnOnAssetsTTM)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Book Value:</span><span class="text-white font-semibold">${overview.BookValue || 'N/A'}</span></div>
        </div>
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Analyst Ratings</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-white/60">Target Price:</span><span class="text-white font-semibold">${overview.AnalystTargetPrice || 'N/A'}</span></div>
          <div class="flex items-center gap-2 text-xs mt-3">
            <span class="px-2 py-1 bg-green-600 text-white rounded">Strong Buy: ${overview.AnalystRatingStrongBuy || 0}</span>
            <span class="px-2 py-1 bg-green-500 text-white rounded">Buy: ${overview.AnalystRatingBuy || 0}</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2 py-1 bg-gray-500 text-white rounded">Hold: ${overview.AnalystRatingHold || 0}</span>
            <span class="px-2 py-1 bg-red-500 text-white rounded">Sell: ${overview.AnalystRatingSell || 0}</span>
            <span class="px-2 py-1 bg-red-600 text-white rounded">Strong Sell: ${overview.AnalystRatingStrongSell || 0}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Financials Tab
function renderFinancialsTab(data) {
  const income = data.income_statement?.annualReports?.[0] || {};
  const balance = data.balance_sheet?.annualReports?.[0] || {};
  const cashFlow = data.cash_flow?.annualReports?.[0] || {};

  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Income Statement</h3>
        <div style="height: 300px; position: relative;">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Balance Sheet</h3>
        <div style="height: 300px; position: relative;">
          <canvas id="assetsChart"></canvas>
        </div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Cash Flow</h3>
        <div style="height: 300px; position: relative;">
          <canvas id="cashFlowChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Financial Tables -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h4 class="font-bold text-white mb-3">Latest Income (${income.fiscalDateEnding || 'N/A'})</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-white/60">Total Revenue:</span><span class="text-white">${formatCurrency(income.totalRevenue)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Gross Profit:</span><span class="text-white">${formatCurrency(income.grossProfit)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Operating Income:</span><span class="text-white">${formatCurrency(income.operatingIncome)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Net Income:</span><span class="text-white">${formatCurrency(income.netIncome)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">EBITDA:</span><span class="text-white">${formatCurrency(income.ebitda)}</span></div>
        </div>
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h4 class="font-bold text-white mb-3">Latest Balance (${balance.fiscalDateEnding || 'N/A'})</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-white/60">Total Assets:</span><span class="text-white">${formatCurrency(balance.totalAssets)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Total Liabilities:</span><span class="text-white">${formatCurrency(balance.totalLiabilities)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Shareholder Equity:</span><span class="text-white">${formatCurrency(balance.totalShareholderEquity)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Cash:</span><span class="text-white">${formatCurrency(balance.cashAndCashEquivalentsAtCarryingValue)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Long Term Debt:</span><span class="text-white">${formatCurrency(balance.longTermDebt)}</span></div>
        </div>
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h4 class="font-bold text-white mb-3">Latest Cash Flow (${cashFlow.fiscalDateEnding || 'N/A'})</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-white/60">Operating CF:</span><span class="text-white">${formatCurrency(cashFlow.operatingCashflow)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Investing CF:</span><span class="text-white">${formatCurrency(cashFlow.cashflowFromInvestment)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Financing CF:</span><span class="text-white">${formatCurrency(cashFlow.cashflowFromFinancing)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">CapEx:</span><span class="text-white">${formatCurrency(cashFlow.capitalExpenditures)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Dividends Paid:</span><span class="text-white">${formatCurrency(cashFlow.dividendPayout)}</span></div>
        </div>
      </div>
    </div>
  `;
}

// Render Financials Tab
function renderFinancialsTab(data) {
  return `<div id="financialChartsContainer"></div>`;
}

// Render Earnings Tab
function renderEarningsTab(data) {
  const earnings = data.earnings?.annualEarnings || [];
  const estimates = data.earnings_estimates?.estimates || [];

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Earnings History</h3>
        <div style="height: 300px; position: relative;">
          <canvas id="earningsChart"></canvas>
        </div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Shares Outstanding</h3>
        <div style="height: 300px; position: relative;">
          <canvas id="sharesChart"></canvas>
        </div>
      </div>
    </div>

    ${estimates.length > 0 ? `
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Earnings Estimates</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-white/5">
              <tr>
                <th class="p-3 text-left text-white/80">Date</th>
                <th class="p-3 text-left text-white/80">EPS Est.</th>
                <th class="p-3 text-left text-white/80">Revenue Est.</th>
                <th class="p-3 text-left text-white/80">Analysts</th>
              </tr>
            </thead>
            <tbody>
              ${estimates.slice(0, 5).map(est => `
                <tr class="border-t border-white/10 hover:bg-white/5">
                  <td class="p-3 text-white">${est.date || 'N/A'}</td>
                  <td class="p-3 text-white">${est.eps_estimate_average || 'N/A'}</td>
                  <td class="p-3 text-white">${formatCurrency(est.revenue_estimate_average)}</td>
                  <td class="p-3 text-white">${est.eps_estimate_analyst_count || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `;
}

// Render Dividends Tab
function renderDividendsTab(data) {
  const dividends = data.dividends?.data || [];
  const splits = data.splits?.data || [];

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Recent Dividends</h3>
        <div class="space-y-3 max-h-[500px] overflow-y-auto">
          ${dividends.length > 0 ? dividends.slice(0, 10).map(div => `
            <div class="border-l-2 border-accent pl-3 pb-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-white font-semibold">$${div.amount}</div>
                  <div class="text-xs text-white/60">Ex-Date: ${div.ex_dividend_date}</div>
                </div>
                <div class="text-xs text-white/60">Pay: ${div.payment_date}</div>
              </div>
            </div>
          `).join('') : '<div class="text-white/60 text-center py-8">No dividend data available</div>'}
        </div>
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Stock Splits</h3>
        <div class="space-y-3 max-h-[500px] overflow-y-auto">
          ${splits.length > 0 ? splits.map(split => `
            <div class="border-l-2 border-blue-500 pl-3 pb-2">
              <div class="text-white font-semibold">${split.split_factor}:1 Split</div>
              <div class="text-xs text-white/60">Effective: ${split.effective_date}</div>
            </div>
          `).join('') : '<div class="text-white/60 text-center py-8">No split data available</div>'}
        </div>
      </div>
    </div>
  `;
}

// Render ETF Tab
function renderETFTab(etf) {
  if (!etf || !etf.sectors) return '<div class="text-white/60 text-center py-8">No ETF data available</div>';

  const sectors = etf.sectors || [];
  const holdings = etf.holdings || [];

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">ETF Information</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-white/60">Net Assets:</span><span class="text-white font-semibold">${formatCurrency(etf.net_assets)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Expense Ratio:</span><span class="text-white font-semibold">${formatPercent(etf.net_expense_ratio)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Dividend Yield:</span><span class="text-white font-semibold">${formatPercent(etf.dividend_yield)}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Inception:</span><span class="text-white font-semibold">${etf.inception_date || 'N/A'}</span></div>
          <div class="flex justify-between"><span class="text-white/60">Leveraged:</span><span class="text-white font-semibold">${etf.leveraged || 'NO'}</span></div>
        </div>
      </div>

      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Sector Allocation</h3>
        <div class="space-y-2">
          ${sectors.slice(0, 5).map(sector => {
            const weight = parseFloat(sector.weight) * 100;
            return `
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-white/80">${sector.sector}</span>
                  <span class="text-white">${weight.toFixed(1)}%</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                  <div class="bg-accent h-2 rounded-full" style="width: ${weight}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    ${holdings.length > 0 ? `
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5">
        <h3 class="text-lg font-bold text-white mb-4">Top Holdings</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-white/5">
              <tr>
                <th class="p-3 text-left text-white/80">Symbol</th>
                <th class="p-3 text-left text-white/80">Company</th>
                <th class="p-3 text-right text-white/80">Weight</th>
              </tr>
            </thead>
            <tbody>
              ${holdings.slice(0, 10).map(holding => `
                <tr class="border-t border-white/10 hover:bg-white/5">
                  <td class="p-3 text-white font-semibold">${holding.symbol}</td>
                  <td class="p-3 text-white/80">${holding.description}</td>
                  <td class="p-3 text-white text-right">${formatPercent(holding.weight)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `;
}

// Render News Tab
function renderNewsTab(news, symbol) {
  if (!news || news.length === 0) {
    return '<div class="text-white/60 text-center py-8">No news available</div>';
  }

  return `
    <div class="grid gap-4">
      ${news.map(article => {
        const sentiment = article.overall_sentiment_score;
        const sentimentLabel = sentiment >= 0.15 ? 'Bullish' : sentiment <= -0.15 ? 'Bearish' : 'Neutral';
        const sentimentColor = sentiment >= 0.15 ? 'bg-green-500' : sentiment <= -0.15 ? 'bg-red-500' : 'bg-blue-500';

        return `
          <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer" onclick="window.open('${article.url}', '_blank')">
            <div class="flex items-start gap-3">
              ${article.banner_image ? `<img src="${article.banner_image}" class="w-24 h-24 object-cover rounded-lg flex-shrink-0" onerror="this.style.display='none'">` : ''}
              <div class="flex-1 min-w-0">
                <h4 class="text-white font-bold mb-2 line-clamp-2">${article.title}</h4>
                <p class="text-sm text-white/70 mb-2 line-clamp-2">${article.summary || ''}</p>
                <div class="flex items-center gap-3 text-xs text-white/60">
                  <span>${article.source}</span>
                  <span>•</span>
                  <span class="px-2 py-0.5 rounded-full ${sentimentColor} text-white">${sentimentLabel}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Render financial charts
function renderFinancialCharts(data) {
  const income = data.income_statement?.annualReports || [];
  const balance = data.balance_sheet?.annualReports || [];
  const cashFlow = data.cash_flow?.annualReports || [];

  // Revenue Chart
  if (income.length > 0) {
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
      const chartData = income.slice(0, 5).reverse();
      companyCharts.revenue = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.map(d => d.fiscalDateEnding?.substring(0, 4) || ''),
          datasets: [{
            label: 'Revenue',
            data: chartData.map(d => parseFloat(d.totalRevenue) / 1e9),
            backgroundColor: '#f1d85b',
            borderColor: '#f1d85b',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: '#fff', callback: v => '$' + v.toFixed(1) + 'B' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#fff' }, grid: { display: false } }
          }
        }
      });
    }
  }

  // Assets Chart
  if (balance.length > 0) {
    const ctx = document.getElementById('assetsChart');
    if (ctx) {
      const chartData = balance.slice(0, 5).reverse();
      companyCharts.assets = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.map(d => d.fiscalDateEnding?.substring(0, 4) || ''),
          datasets: [{
            label: 'Total Assets',
            data: chartData.map(d => parseFloat(d.totalAssets) / 1e9),
            backgroundColor: '#78e6d0',
            borderColor: '#78e6d0',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: '#fff', callback: v => '$' + v.toFixed(1) + 'B' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#fff' }, grid: { display: false } }
          }
        }
      });
    }
  }

  // Cash Flow Chart
  if (cashFlow.length > 0) {
    const ctx = document.getElementById('cashFlowChart');
    if (ctx) {
      const chartData = cashFlow.slice(0, 5).reverse();
      companyCharts.cashFlow = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.map(d => d.fiscalDateEnding?.substring(0, 4) || ''),
          datasets: [{
            label: 'Operating Cash Flow',
            data: chartData.map(d => parseFloat(d.operatingCashflow) / 1e9),
            backgroundColor: '#22c55e',
            borderColor: '#22c55e',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: '#fff', callback: v => '$' + v.toFixed(1) + 'B' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#fff' }, grid: { display: false } }
          }
        }
      });
    }
  }
}

// Render earnings chart
function renderEarningsChart(earnings) {
  if (!earnings || !earnings.annualEarnings) return;
  
  const ctx = document.getElementById('earningsChart');
  if (!ctx) return;

  const chartData = earnings.annualEarnings.slice(0, 10).reverse();
  companyCharts.earnings = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.map(d => d.fiscalDateEnding?.substring(0, 4) || ''),
      datasets: [{
        label: 'EPS',
        data: chartData.map(d => parseFloat(d.reportedEPS)),
        borderColor: '#f1d85b',
        backgroundColor: 'rgba(241, 216, 91, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        x: { ticks: { color: '#fff' }, grid: { display: false } }
      }
    }
  });
}

// Render shares chart
function renderSharesChart(shares) {
  if (!shares || !shares.data) return;
  
  const ctx = document.getElementById('sharesChart');
  if (!ctx) return;

  const chartData = shares.data.slice(0, 12).reverse();
  companyCharts.shares = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.map(d => d.date?.substring(0, 7) || ''),
      datasets: [{
        label: 'Shares Outstanding',
        data: chartData.map(d => parseFloat(d.shares_outstanding_diluted) / 1e9),
        borderColor: '#78e6d0',
        backgroundColor: 'rgba(120, 230, 208, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#fff', callback: v => v.toFixed(2) + 'B' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        x: { ticks: { color: '#fff', maxRotation: 45 }, grid: { display: false } }
      }
    }
  });
}

// Back to search
document.getElementById('backToSearch')?.addEventListener('click', () => {
  // Destroy charts
  Object.keys(companyCharts).forEach(key => {
    if (companyCharts[key]) {
      companyCharts[key].destroy();
      delete companyCharts[key];
    }
  });

  document.getElementById('companyView').classList.add('hidden');
  document.getElementById('searchView').classList.remove('hidden');
  searchInput.value = '';
  searchInput.focus();
});

// Handle Enter key
searchInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    
    const firstResult = document.querySelector('.search-result-item');
    if (firstResult) {
      const symbolData = JSON.parse(firstResult.getAttribute('data-symbol'));
      loadCompanyData(symbolData['1. symbol']);
    }
  }
});

// Click outside to close results
document.addEventListener('click', (e) => {
  if (!e.target.closest('#searchInput') && !e.target.closest('#searchResults')) {
    searchResults.classList.add('hidden');
  }
});

// Search hints
document.querySelectorAll('.search-hint').forEach(hint => {
  hint.addEventListener('click', () => {
    const keyword = hint.getAttribute('data-keyword');
    searchInput.value = keyword;
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });
});

// Load technical indicators with lazy loading
async function loadTechnicalIndicators(symbol) {
  const technicalTab = document.getElementById('technicalTab');
  
  technicalTab.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFF27A] mx-auto mb-4"></div>
      <div class="text-lg font-semibold text-white">Loading Technical Indicators...</div>
      <div class="text-sm text-white/60 mt-2">Fetching 10 indicators (this may take ~5 seconds)</div>
      <div id="technicalProgress" class="mt-4 text-xs text-accent"></div>
    </div>
  `;

  try {
    const response = await fetch(`/api/search/technical/${symbol}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to load technical indicators');

    const data = await response.json();
    renderTechnicalIndicators(data.indicators || []);

  } catch (error) {
    console.error('Error loading technical indicators:', error);
    technicalTab.innerHTML = `
      <div class="text-center py-12 text-red-400">
        <div class="text-lg font-semibold mb-2">Failed to load technical indicators</div>
        <div class="text-sm text-white/60">${error.message}</div>
        <button class="load-technical-btn mt-4 px-6 py-3 bg-[#FFF27A] text-[#1E1E21] font-semibold rounded-lg hover:opacity-90 transition-opacity" data-symbol="${symbol}">
          Try Again
        </button>
      </div>
    `;
    
    // Re-add event listener
    document.querySelector('.load-technical-btn')?.addEventListener('click', function() {
      loadTechnicalIndicators(this.getAttribute('data-symbol'));
    });
  }
}

// Render technical indicators
function renderTechnicalIndicators(indicators) {
  const technicalTab = document.getElementById('technicalTab');
  
  if (indicators.length === 0) {
    technicalTab.innerHTML = '<div class="text-white/60 text-center py-8">No technical data available</div>';
    return;
  }

  const validIndicators = indicators.filter(ind => !ind.error && ind.data);

  technicalTab.innerHTML = `
    <div class="mb-4 text-sm text-white/60">
      Loaded ${validIndicators.length} of ${indicators.length} indicators
    </div>
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));">
      ${validIndicators.map((indicator, index) => {
        // Get the latest value
        const dataKey = Object.keys(indicator.data).find(key => key !== 'Meta Data');
        const technicalData = indicator.data[dataKey] || indicator.data;
        
        // Convert to array for charting
        const dataPoints = [];
        for (const [date, values] of Object.entries(technicalData)) {
          if (typeof values === 'object') {
            const valueKey = Object.keys(values)[0];
            dataPoints.push({ date, value: parseFloat(values[valueKey]) });
          }
        }
        
        dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
        const latestValue = dataPoints[dataPoints.length - 1]?.value || 0;

        return `
          <div class="bg-[#2E3137] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-white">${indicator.name}</h3>
                <div class="text-xs text-white/60">${indicator.function}</div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-accent">${latestValue.toFixed(2)}</div>
                <div class="text-xs text-white/60">Latest</div>
              </div>
            </div>
            <div style="height: 200px; position: relative;">
              <canvas id="technical-${index}"></canvas>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    ${indicators.filter(ind => ind.error).length > 0 ? `
      <div class="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        <h4 class="text-red-400 font-semibold mb-2">Failed to Load:</h4>
        <div class="text-sm text-white/60">
          ${indicators.filter(ind => ind.error).map(ind => `${ind.name} (${ind.func})`).join(', ')}
        </div>
      </div>
    ` : ''}
  `;

  // Render charts
  setTimeout(() => {
    validIndicators.forEach((indicator, index) => {
      const dataKey = Object.keys(indicator.data).find(key => key !== 'Meta Data');
      const technicalData = indicator.data[dataKey] || indicator.data;
      
      const dataPoints = [];
      for (const [date, values] of Object.entries(technicalData)) {
        if (typeof values === 'object') {
          const valueKey = Object.keys(values)[0];
          dataPoints.push({ date, value: parseFloat(values[valueKey]) });
        }
      }
      
      dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
      const chartData = dataPoints.slice(-30); // Last 30 data points

      const ctx = document.getElementById(`technical-${index}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.map(d => {
              const date = new Date(d.date);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
              label: indicator.name,
              data: chartData.map(d => d.value),
              borderColor: '#f1d85b',
              backgroundColor: 'rgba(241, 216, 91, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 2,
              pointHoverRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#2E3137',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
              }
            },
            scales: {
              y: {
                ticks: { color: '#fff', callback: v => v.toFixed(2) },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              },
              x: {
                ticks: { color: '#fff', maxRotation: 45, minRotation: 45 },
                grid: { display: false }
              }
            }
          }
        });
      }
    });
  }, 100);
}

// Focus search on / key
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    searchInput.focus();
  }
});


