/**
 * PitchLense - Centralized Sidebar Navigation Component
 * Include this script in your HTML and call renderNavbar(currentPage)
 */

function renderNavbar(activePage = '') {
  const navItems = [
    {
      id: 'create',
      href: '/create-report.html',
      title: 'Create',
      tooltip: 'Create Report',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>`
    },
    {
      id: 'reports',
      href: '/view-report.html',
      title: 'Reports',
      tooltip: 'View Reports',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="9" y1="17" x2="9" y2="11"/>
        <line x1="13" y1="17" x2="13" y2="7"/>
        <line x1="17" y1="17" x2="17" y2="13"/>
      </svg>`
    },
    // {
    //   id: 'market',
    //   href: '/market.html',
    //   title: 'Market',
    //   tooltip: 'Market Data',
    //   icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    //     <path d="M3 3v18h18"/>
    //     <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
    //   </svg>`
    // },
    {
      id: 'investment',
      href: '/investment.html',
      title: 'Investments',
      tooltip: 'Investments',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>`
    },
    {
      id: 'search',
      href: '/search.html',
      title: 'Search',
      tooltip: 'Search Symbols',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>`
    },
    {
      id: 'market',
      href: '/market.html',
      title: 'Market',
      tooltip: 'Market Performance',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3v18h18"/>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
      </svg>`
    },
    {
      id: 'news',
      href: '/news.html',
      title: 'News',
      tooltip: 'Market News',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
        <line x1="7" y1="8" x2="17" y2="8"/>
        <line x1="7" y1="12" x2="17" y2="12"/>
        <line x1="7" y1="16" x2="13" y2="16"/>
      </svg>`
    },
    {
      id: 'networking',
      href: '/networking.html',
      title: 'Networking',
      tooltip: 'Networking',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`
    },
    {
      id: 'meeting-assistant',
      href: '/meeting-assistant.html',
      title: 'Meeting Assistant',
      tooltip: 'AI Meeting Assistant',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="5" width="14" height="14" rx="2" ry="2"></rect>
        <polygon points="16 7 22 11 22 13 16 17 16 7"></polygon>
      </svg>`
    },
    {
      id: 'email',
      href: '/email.html',
      title: 'Email',
      tooltip: 'Email Client',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>`
    },
    {
      id: 'academy',
      href: '/academy.html',
      title: 'Academy',
      tooltip: 'PitchLense Academy',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>`
    },
    {
      id: 'extension',
      href: '/extension.html',
      title: 'Extension',
      tooltip: 'Extension',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>`
    },
    {
      id: 'youtube',
      href: 'https://youtu.be/XUuLeXaEIdI',
      title: 'YouTube',
      tooltip: 'How to use PitchLense',
      target: '_blank',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>`
    }
  ];

  const navbar = document.getElementById('pitchlense-navbar');
  if (!navbar) {
    console.error('Navbar container with id "pitchlense-navbar" not found');
    return;
  }

  const navHTML = `
    <nav class="flex flex-col gap-2 text-white/80 w-full items-center">
      ${navItems.map(item => {
        const isActive = activePage === item.id;
        const activeClass = isActive ? 'bg-white/10' : '';
        const targetAttr = item.target ? `target="${item.target}"` : '';
        
        return `
          <a class="w-10 h-10 grid place-items-center rounded-lg ${activeClass} hover:bg-white/10 relative group" 
             href="${item.href}" 
             ${targetAttr}
             title="${item.title}">
            ${item.icon}
            <div class="absolute left-full ml-2 px-3 py-2 bg-[#1E1E21] text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              ${item.tooltip}
              <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-[#1E1E21]"></div>
            </div>
          </a>
        `;
      }).join('')}
    </nav>
    <div class="flex-1"></div>
    <button id="signoutBtn" class="w-10 h-10 grid place-items-center rounded-lg hover:bg-white/10 text-white/80" title="Sign out">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </button>
  `;

  navbar.innerHTML = navHTML;

  // Setup sign out functionality
  const signoutBtn = document.getElementById('signoutBtn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch(e) {
        console.error('Logout error:', e);
      }
      window.location.href = '/auth.html';
    });
  }
}

// Auto-detect current page from URL
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('create-report')) return 'create';
  if (path.includes('view-report') || path.includes('report.html')) return 'reports';
  if (path.includes('market')) return 'market';
  if (path.includes('investment')) return 'investment';
  if (path.includes('search')) return 'search';
  if (path.includes('news')) return 'news';
  if (path.includes('networking')) return 'networking';
  if (path.includes('academy')) return 'academy';
  if (path.includes('meeting-assistant')) return 'meeting-assistant';
  if (path.includes('extension')) return 'extension';
  if (path.includes('email')) return 'email';
  return '';
}

// Auto-initialize if navbar container exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pitchlense-navbar')) {
      renderNavbar(getCurrentPage());
    }
  });
} else {
  if (document.getElementById('pitchlense-navbar')) {
    renderNavbar(getCurrentPage());
  }
}


