// Investment Management JavaScript

// State
let currentInvestment = null;
let allInvestments = [];

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
      loadInvestments();
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
function formatCurrency(amount) {
  if (!amount && amount !== 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Calculate days since investment
function daysSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Load all investments
async function loadInvestments() {
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const grid = document.getElementById('investmentsGrid');
  const summaryKPIs = document.getElementById('summaryKPIs');

  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  grid.innerHTML = '';

  try {
    const searchValue = document.getElementById('searchInput').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (statusFilter) params.set('status', statusFilter);

    const response = await fetch(`/api/investments?${params.toString()}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to load investments');

    const data = await response.json();
    allInvestments = data.investments || [];

    loadingState.classList.add('hidden');

    if (allInvestments.length === 0) {
      emptyState.classList.remove('hidden');
      summaryKPIs.innerHTML = '';
      return;
    }

    // Calculate summary metrics
    const totalInvested = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.total_invested || 0), 0);
    const totalValue = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.current_value || 0), 0);
    const averageROI = allInvestments
      .filter(inv => inv.roi_percentage !== null)
      .reduce((sum, inv, idx, arr) => sum + parseFloat(inv.roi_percentage), 0) / 
      (allInvestments.filter(inv => inv.roi_percentage !== null).length || 1);
    const activeCount = allInvestments.filter(inv => inv.status === 'Active').length;

    // Display summary KPIs
    summaryKPIs.innerHTML = `
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="text-sm text-white/60 mb-1">Total Invested</div>
        <div class="text-2xl font-bold text-white">${formatCurrency(totalInvested)}</div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="text-sm text-white/60 mb-1">Current Value</div>
        <div class="text-2xl font-bold text-white">${formatCurrency(totalValue)}</div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="text-sm text-white/60 mb-1">Average ROI</div>
        <div class="text-2xl font-bold ${averageROI >= 0 ? 'text-green-400' : 'text-red-400'}">
          ${averageROI.toFixed(2)}%
        </div>
      </div>
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="text-sm text-white/60 mb-1">Active Investments</div>
        <div class="text-2xl font-bold text-white">${activeCount}</div>
      </div>
    `;

    // Display investments
    allInvestments.forEach(investment => {
      const card = createInvestmentCard(investment);
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading investments:', error);
    loadingState.classList.add('hidden');
    emptyState.classList.remove('hidden');
    Swal.fire({
      title: 'Error',
      text: 'Failed to load investments',
      icon: 'error',
      confirmButtonColor: '#f1d85b'
    });
  }
}

// Create investment card
function createInvestmentCard(investment) {
  const card = document.createElement('div');
  card.className = 'bg-[#2E3137] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all cursor-pointer glare-card';

  const roi = investment.roi_percentage;
  const roiColor = roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : 'text-white/60';
  const statusColor = investment.status === 'Active' ? 'bg-green-500' : investment.status === 'Exited' ? 'bg-blue-500' : 'bg-red-500';

  card.innerHTML = `
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-white truncate">${investment.startup_name}</h3>
        <div class="text-sm text-white/60 mt-1">${investment.funding_round || 'N/A'} • ${formatDate(investment.investment_date)}</div>
      </div>
      <div class="flex gap-2 ml-2">
        <button class="edit-btn w-8 h-8 grid place-items-center rounded-full border border-white/10 bg-[#1E1E21] text-white/80 hover:bg-white/10" title="Edit" data-id="${investment.investment_id}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="delete-btn w-8 h-8 grid place-items-center rounded-full border border-white/10 bg-[#1E1E21] text-white/80 hover:bg-white/10" title="Delete" data-id="${investment.investment_id}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-3 mb-4">
      <div class="flex justify-between items-center">
        <span class="text-sm text-white/60">Invested</span>
        <span class="text-sm font-semibold text-white">${formatCurrency(investment.total_invested)}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-white/60">Current Value</span>
        <span class="text-sm font-semibold text-white">${investment.current_value ? formatCurrency(investment.current_value) : 'N/A'}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-white/60">ROI</span>
        <span class="text-sm font-semibold ${roiColor}">${roi ? roi + '%' : 'N/A'}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-white/60">Equity</span>
        <span class="text-sm font-semibold text-white">${investment.equity_percentage ? investment.equity_percentage + '%' : 'N/A'}</span>
      </div>
    </div>

    <div class="flex items-center justify-between pt-3 border-t border-white/10">
      <span class="text-xs px-2 py-1 rounded-full ${statusColor} text-white">${investment.status}</span>
      <span class="text-xs text-white/60">${investment.total_updates || 0} updates</span>
    </div>
  `;

  // Click card to view details (except on buttons)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.edit-btn') && !e.target.closest('.delete-btn')) {
      viewInvestmentDetail(investment.investment_id);
    }
  });

  // Edit button
  card.querySelector('.edit-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openEditModal(investment);
  });

  // Delete button
  card.querySelector('.delete-btn').addEventListener('click', async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete Investment',
      text: 'Are you sure you want to delete this investment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await deleteInvestment(investment.investment_id);
    }
  });

  return card;
}

// View investment detail
async function viewInvestmentDetail(investmentId) {
  try {
    const response = await fetch(`/api/investments/${investmentId}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to load investment');

    const data = await response.json();
    currentInvestment = data.investment;
    const updates = data.updates || [];

    // Get metrics
    const metricsResponse = await fetch(`/api/investments/${investmentId}/metrics`, {
      credentials: 'include'
    });
    const metricsData = await metricsResponse.json();

    // Hide list, show detail
    document.getElementById('investmentsList').classList.add('hidden');
    document.getElementById('investmentDetail').classList.remove('hidden');

    // Render detail view
    renderInvestmentDetail(currentInvestment, updates, metricsData);

  } catch (error) {
    console.error('Error loading investment detail:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to load investment details',
      icon: 'error',
      confirmButtonColor: '#f1d85b'
    });
  }
}

// Render investment detail
function renderInvestmentDetail(investment, updates, metrics) {
  const detailContent = document.getElementById('detailContent');
  
  detailContent.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-2xl font-bold text-white">${investment.startup_name}</h2>
            <div class="text-sm text-white/60 mt-1">
              ${investment.funding_round || 'N/A'} • ${investment.investment_type || 'Equity'} • ${formatDate(investment.investment_date)}
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full ${investment.status === 'Active' ? 'bg-green-500' : investment.status === 'Exited' ? 'bg-blue-500' : 'bg-red-500'} text-white">
            ${investment.status}
          </span>
        </div>
        ${investment.notes ? `<p class="text-white/80 text-sm mt-4">${investment.notes}</p>` : ''}
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
          <div class="text-xs text-white/60 mb-1">Total Invested</div>
          <div class="text-xl font-bold text-white">${formatCurrency(investment.total_invested)}</div>
        </div>
        <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
          <div class="text-xs text-white/60 mb-1">Current Value</div>
          <div class="text-xl font-bold text-white">${investment.current_value ? formatCurrency(investment.current_value) : 'N/A'}</div>
        </div>
        <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
          <div class="text-xs text-white/60 mb-1">ROI</div>
          <div class="text-xl font-bold ${investment.roi_percentage >= 0 ? 'text-green-400' : 'text-red-400'}">
            ${investment.roi_percentage ? investment.roi_percentage + '%' : 'N/A'}
          </div>
        </div>
        <div class="bg-[#2E3137] border border-white/10 rounded-xl p-4">
          <div class="text-xs text-white/60 mb-1">Duration</div>
          <div class="text-xl font-bold text-white">${daysSince(investment.investment_date)} days</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4">Valuation Over Time</h3>
          <div style="height: 300px; position: relative;">
            <canvas id="valuationChart"></canvas>
          </div>
        </div>
        <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
          <h3 class="text-lg font-bold text-white mb-4">ROI Progression</h3>
          <div style="height: 300px; position: relative;">
            <canvas id="roiChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Investment Details Table -->
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Investment Details</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-white/60">Investor Name</div>
            <div class="text-white font-semibold">${investment.investor_name || 'N/A'}</div>
          </div>
          <div>
            <div class="text-sm text-white/60">Initial Investment</div>
            <div class="text-white font-semibold">${formatCurrency(investment.investment_amount)}</div>
          </div>
          <div>
            <div class="text-sm text-white/60">Equity Percentage</div>
            <div class="text-white font-semibold">${investment.current_equity_percentage ? investment.current_equity_percentage + '%' : 'N/A'}</div>
          </div>
          <div>
            <div class="text-sm text-white/60">Company Valuation</div>
            <div class="text-white font-semibold">${investment.current_valuation ? formatCurrency(investment.current_valuation) : 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- Updates Timeline -->
      <div class="bg-[#2E3137] border border-white/10 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-white">Updates Timeline</h3>
          <button id="addUpdateBtn" class="px-4 py-2 bg-[#FFF27A] text-[#1E1E21] font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Update
          </button>
        </div>
        <div id="updatesTimeline" class="space-y-4 mt-4">
          ${updates.length === 0 ? '<div class="text-center text-white/60 py-8">No updates yet</div>' : updates.map(update => `
            <div class="border-l-2 border-accent pl-4 pb-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-white font-semibold">${update.update_type}</div>
                  <div class="text-sm text-white/60">${formatDate(update.update_date)}</div>
                </div>
                ${update.additional_amount ? `<div class="text-accent font-semibold">${formatCurrency(update.additional_amount)}</div>` : ''}
              </div>
              ${update.notes ? `<p class="text-white/80 text-sm mt-2">${update.notes}</p>` : ''}
              <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
                ${update.new_valuation ? `<div><span class="text-white/60">Valuation:</span> <span class="text-white">${formatCurrency(update.new_valuation)}</span></div>` : ''}
                ${update.new_equity_percentage ? `<div><span class="text-white/60">Equity:</span> <span class="text-white">${update.new_equity_percentage}%</span></div>` : ''}
                ${update.roi_percentage ? `<div><span class="text-white/60">ROI:</span> <span class="text-white">${update.roi_percentage}%</span></div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Add update button handler
  document.getElementById('addUpdateBtn').addEventListener('click', () => {
    openUpdateModal(investment.investment_id);
  });

  // Render charts
  if (metrics.success) {
    renderCharts(metrics.timeline);
  }
}

// Store chart instances for cleanup
let valuationChartInstance = null;
let roiChartInstance = null;

// Render charts
function renderCharts(timeline) {
  if (!timeline || timeline.length === 0) return;

  // Destroy existing charts if they exist
  if (valuationChartInstance) {
    valuationChartInstance.destroy();
    valuationChartInstance = null;
  }
  if (roiChartInstance) {
    roiChartInstance.destroy();
    roiChartInstance = null;
  }

  // Valuation Chart
  const valuationCtx = document.getElementById('valuationChart');
  if (valuationCtx) {
    valuationChartInstance = new Chart(valuationCtx, {
      type: 'line',
      data: {
        labels: timeline.map(t => formatDate(t.date)),
        datasets: [
          {
            label: 'Valuation',
            data: timeline.map(t => t.valuation),
            borderColor: '#f1d85b',
            backgroundColor: 'rgba(241, 216, 91, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Investment Value',
            data: timeline.map(t => t.value),
            borderColor: '#78e6d0',
            backgroundColor: 'rgba(120, 230, 208, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#fff' }
          }
        },
        scales: {
          y: {
            ticks: { color: '#fff', callback: (value) => formatCurrency(value) },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  // ROI Chart
  const roiCtx = document.getElementById('roiChart');
  if (roiCtx) {
    roiChartInstance = new Chart(roiCtx, {
      type: 'line',
      data: {
        labels: timeline.map(t => formatDate(t.date)),
        datasets: [{
          label: 'ROI %',
          data: timeline.map(t => parseFloat(t.roi)),
          borderColor: '#78e6d0',
          backgroundColor: 'rgba(120, 230, 208, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#fff' }
          }
        },
        scales: {
          y: {
            ticks: { color: '#fff', callback: (value) => value + '%' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }
}

// Back to list
document.getElementById('backToList')?.addEventListener('click', () => {
  document.getElementById('investmentDetail').classList.add('hidden');
  document.getElementById('investmentsList').classList.remove('hidden');
  currentInvestment = null;
});

// Add/Edit Investment Modal
document.getElementById('addInvestmentBtn')?.addEventListener('click', () => {
  openAddModal();
});

document.getElementById('closeModal')?.addEventListener('click', closeInvestmentModal);
document.getElementById('cancelBtn')?.addEventListener('click', closeInvestmentModal);

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add Investment';
  document.getElementById('investmentForm').reset();
  document.getElementById('investment_id').value = '';
  document.getElementById('investmentModal').classList.remove('hidden');
}

function openEditModal(investment) {
  document.getElementById('modalTitle').textContent = 'Edit Investment';
  document.getElementById('investment_id').value = investment.investment_id;
  document.getElementById('startup_name').value = investment.startup_name;
  document.getElementById('investor_name').value = investment.investor_name || '';
  document.getElementById('funding_round').value = investment.funding_round || '';
  document.getElementById('investment_type').value = investment.investment_type || 'Equity';
  document.getElementById('investment_amount').value = investment.investment_amount;
  document.getElementById('equity_percentage').value = investment.equity_percentage || '';
  document.getElementById('company_valuation').value = investment.company_valuation || '';
  document.getElementById('investment_date').value = investment.investment_date.split('T')[0];
  document.getElementById('status').value = investment.status;
  document.getElementById('notes').value = investment.notes || '';
  document.getElementById('investmentModal').classList.remove('hidden');
}

function closeInvestmentModal() {
  document.getElementById('investmentModal').classList.add('hidden');
}

// Save investment
document.getElementById('investmentForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const investmentId = document.getElementById('investment_id').value;
  const formData = {
    startup_name: document.getElementById('startup_name').value,
    investor_name: document.getElementById('investor_name').value,
    funding_round: document.getElementById('funding_round').value,
    investment_type: document.getElementById('investment_type').value,
    investment_amount: parseFloat(document.getElementById('investment_amount').value),
    equity_percentage: document.getElementById('equity_percentage').value ? parseFloat(document.getElementById('equity_percentage').value) : null,
    company_valuation: document.getElementById('company_valuation').value ? parseFloat(document.getElementById('company_valuation').value) : null,
    investment_date: document.getElementById('investment_date').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };

  try {
    const url = investmentId ? `/api/investments/${investmentId}` : '/api/investments';
    const method = investmentId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Failed to save investment');

    await Swal.fire({
      title: 'Success!',
      text: investmentId ? 'Investment updated successfully' : 'Investment created successfully',
      icon: 'success',
      confirmButtonColor: '#f1d85b'
    });

    closeInvestmentModal();
    loadInvestments();

  } catch (error) {
    console.error('Error saving investment:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to save investment',
      icon: 'error',
      confirmButtonColor: '#f1d85b'
    });
  }
});

// Delete investment
async function deleteInvestment(investmentId) {
  try {
    const response = await fetch(`/api/investments/${investmentId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to delete investment');

    await Swal.fire({
      title: 'Deleted!',
      text: 'Investment deleted successfully',
      icon: 'success',
      confirmButtonColor: '#f1d85b'
    });

    loadInvestments();

  } catch (error) {
    console.error('Error deleting investment:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to delete investment',
      icon: 'error',
      confirmButtonColor: '#f1d85b'
    });
  }
}

// Update Modal
document.getElementById('closeUpdateModal')?.addEventListener('click', closeUpdateModal);
document.getElementById('cancelUpdateBtn')?.addEventListener('click', closeUpdateModal);

function openUpdateModal(investmentId) {
  currentInvestment = { investment_id: investmentId };
  document.getElementById('updateForm').reset();
  // Set today as default date
  document.getElementById('update_date').value = new Date().toISOString().split('T')[0];
  document.getElementById('updateModal').classList.remove('hidden');
}

function closeUpdateModal() {
  document.getElementById('updateModal').classList.add('hidden');
}

// Save update
document.getElementById('updateForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!currentInvestment) return;

  const formData = {
    update_type: document.getElementById('update_type').value,
    additional_amount: document.getElementById('additional_amount').value ? parseFloat(document.getElementById('additional_amount').value) : null,
    new_valuation: document.getElementById('new_valuation').value ? parseFloat(document.getElementById('new_valuation').value) : null,
    new_equity_percentage: document.getElementById('new_equity_percentage').value ? parseFloat(document.getElementById('new_equity_percentage').value) : null,
    update_date: document.getElementById('update_date').value,
    notes: document.getElementById('update_notes').value
  };

  try {
    const response = await fetch(`/api/investments/${currentInvestment.investment_id}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Failed to add update');

    await Swal.fire({
      title: 'Success!',
      text: 'Update added successfully',
      icon: 'success',
      confirmButtonColor: '#f1d85b'
    });

    closeUpdateModal();
    // Reload detail view
    viewInvestmentDetail(currentInvestment.investment_id);

  } catch (error) {
    console.error('Error adding update:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to add update',
      icon: 'error',
      confirmButtonColor: '#f1d85b'
    });
  }
});

// Search and filter
document.getElementById('searchInput')?.addEventListener('input', debounce(loadInvestments, 500));
document.getElementById('statusFilter')?.addEventListener('change', loadInvestments);

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}



