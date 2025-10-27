// Mobile Navigation Updater Script
// This script helps apply mobile navigation to all pages

const mobileNavPattern = {
  // Mobile menu button HTML
  mobileMenuButton: `<!-- Mobile menu button -->
          <button id="mobileMenuBtn" class="md:hidden w-9 h-9 grid place-items-center rounded-full bg-[#FFF27A] border border-white/10 text-[#1E1E21]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>`,

  // Mobile responsive CSS
  mobileCSS: `        <!-- Mobile responsive styles -->
        <style>
          @media (max-width: 768px) {
            .mobile-navbar {
              grid-template-columns: 1fr !important;
              gap: 8px !important;
            }
            .mobile-main {
              padding: 12px !important;
            }
            .mobile-header {
              padding: 12px 16px !important;
            }
            #pitchlense-navbar {
              display: none !important;
            }
          }
          @media (max-width: 480px) {
            .mobile-card {
              padding: 16px !important;
            }
            .mobile-header {
              padding: 8px 12px !important;
            }
            .mobile-main {
              padding: 8px !important;
            }
          }
        </style>`,

  // Mobile navigation menu
  mobileMenu: `    <!-- Mobile Navigation Menu -->
    <div id="mobileMenu" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden md:hidden">
      <div class="bg-[#2C2F34] border border-white/10 rounded-[18px] m-4 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Navigation</h3>
          <button id="closeMobileMenu" class="w-8 h-8 grid place-items-center rounded-full bg-[#FFF27A] text-[#1E1E21]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav class="flex flex-col gap-2 text-white/80">
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/create-report.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Create Report</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/view-report.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="9" y1="17" x2="9" y2="11"/>
              <line x1="13" y1="17" x2="13" y2="7"/>
              <line x1="17" y1="17" x2="17" y2="13"/>
            </svg>
            <span>Reports</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/market.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span>Market Data</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/investment.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Investments</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/search.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search Symbols</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/news.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
              <line x1="7" y1="8" x2="17" y2="8"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
              <line x1="7" y1="16" x2="13" y2="16"/>
            </svg>
            <span>Market News</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/extension.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Extension</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="/email.html">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>Email Client</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10" href="https://youtu.be/XUuLeXaEIdI" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>How to use PitchLense</span>
          </a>
          <div class="border-t border-white/10 my-2"></div>
          <button id="mobileSignoutBtn" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-white/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign out</span>
          </button>
        </nav>
      </div>
    </div>`,

  // Mobile menu JavaScript
  mobileJS: `    <!-- Mobile Menu JavaScript -->
    <script>
      // Mobile menu functionality
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileMenu = document.getElementById('mobileMenu');
      const closeMobileMenu = document.getElementById('closeMobileMenu');
      const mobileSignoutBtn = document.getElementById('mobileSignoutBtn');

      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
          mobileMenu.classList.remove('hidden');
        });
      }

      if (closeMobileMenu && mobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      }

      if (mobileSignoutBtn) {
        mobileSignoutBtn.addEventListener('click', async () => {
          try { await fetch('/api/auth/logout',{method:'POST'}); } catch(e) {}
          window.location.href='/auth.html';
        });
      }

      // Close mobile menu when clicking outside
      if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
          if (e.target === mobileMenu) {
            mobileMenu.classList.add('hidden');
          }
        });
      }
    </script>`
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mobileNavPattern;
}
