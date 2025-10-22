/**
 * Day-level caching utility for API calls
 * Caches responses in localStorage with automatic expiry at end of day
 */

class CacheManager {
  constructor(prefix = 'pitchlense_cache') {
    this.prefix = prefix;
  }

  /**
   * Generate cache key from URL and payload
   */
  generateKey(url, payload = null) {
    const payloadStr = payload ? JSON.stringify(payload) : '';
    return `${this.prefix}_${btoa(url + payloadStr)}`;
  }

  /**
   * Get today's date string (YYYY-MM-DD)
   */
  getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Check if cache is valid (same day)
   */
  isCacheValid(cacheData) {
    if (!cacheData || !cacheData.date) return false;
    return cacheData.date === this.getTodayString();
  }

  /**
   * Get cached data if valid
   * @param {string} url - API endpoint URL
   * @param {object} payload - Request payload (optional)
   * @returns {object|null} Cached data or null
   */
  get(url, payload = null) {
    try {
      const key = this.generateKey(url, payload);
      const cached = localStorage.getItem(key);
      
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      
      if (!this.isCacheValid(cacheData)) {
        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
      }
      
      return cacheData.data;
    } catch (error) {
      console.error('[Cache] Error reading cache:', error);
      return null;
    }
  }

  /**
   * Set cache data with today's date
   * @param {string} url - API endpoint URL
   * @param {object} payload - Request payload (optional)
   * @param {any} data - Data to cache
   */
  set(url, payload = null, data) {
    try {
      const key = this.generateKey(url, payload);
      const cacheData = {
        date: this.getTodayString(),
        url: url,
        payload: payload,
        data: data,
        cachedAt: new Date().toISOString()
      };
      
      localStorage.setItem(key, JSON.stringify(cacheData));
      } catch (error) {
      console.error('[Cache] Error setting cache:', error);
      // If localStorage is full, clear old cache entries
      if (error.name === 'QuotaExceededError') {
        this.clearOldCache();
        // Try again
        try {
          const key = this.generateKey(url, payload);
          const cacheData = {
            date: this.getTodayString(),
            url: url,
            payload: payload,
            data: data,
            cachedAt: new Date().toISOString()
          };
          localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (retryError) {
          console.error('[Cache] Failed to set cache after clearing old entries');
        }
      }
    }
  }

  /**
   * Clear all cache entries for this prefix
   */
  clearAll() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key);
        }
      }
      keys.forEach(key => localStorage.removeItem(key));
      } catch (error) {
      console.error('[Cache] Error clearing cache:', error);
    }
  }

  /**
   * Clear expired cache entries (from previous days)
   */
  clearOldCache() {
    try {
      const today = this.getTodayString();
      const keys = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          try {
            const cached = localStorage.getItem(key);
            const cacheData = JSON.parse(cached);
            if (!cacheData || cacheData.date !== today) {
              keys.push(key);
            }
          } catch (e) {
            // Invalid cache entry, mark for removal
            keys.push(key);
          }
        }
      }
      
      keys.forEach(key => localStorage.removeItem(key));
      } catch (error) {
      console.error('[Cache] Error clearing old cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    try {
      let count = 0;
      let totalSize = 0;
      const today = this.getTodayString();
      let todayCount = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          count++;
          const value = localStorage.getItem(key);
          totalSize += value.length;
          
          try {
            const cacheData = JSON.parse(value);
            if (cacheData.date === today) {
              todayCount++;
            }
          } catch (e) {}
        }
      }
      
      return {
        totalEntries: count,
        todayEntries: todayCount,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        date: today
      };
    } catch (error) {
      console.error('[Cache] Error getting stats:', error);
      return null;
    }
  }
}

/**
 * Cached fetch wrapper
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Promise<Response>} Fetch response
 */
async function cachedFetch(url, options = {}, useCache = true) {
  const cache = new CacheManager();
  
  // Extract payload for cache key
  const payload = options.body ? JSON.parse(options.body) : null;
  const cacheKey = url + (options.method || 'GET');
  
  // Try to get from cache first
  if (useCache) {
    const cachedData = cache.get(cacheKey, payload);
    if (cachedData) {
      // Show cache indicator (brief toast)
      showCacheIndicator();
      
      // Return a fake Response object with cached data
      return {
        ok: true,
        status: 200,
        json: async () => cachedData,
        text: async () => JSON.stringify(cachedData),
        cached: true
      };
    }
  }
  
  // Cache miss or cache disabled, make API call
  const response = await fetch(url, options);
  
  // Cache successful responses
  if (response.ok && useCache) {
    try {
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      cache.set(cacheKey, payload, data);
    } catch (error) {
      console.error('[Cache] Error caching response:', error);
    }
  }
  
  return response;
}

/**
 * Show cache indicator (brief visual feedback)
 */
let cacheIndicatorTimeout;
function showCacheIndicator() {
  // Clear existing timeout
  if (cacheIndicatorTimeout) {
    clearTimeout(cacheIndicatorTimeout);
  }
  
  // Find or create indicator element
  let indicator = document.getElementById('cache-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'cache-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(34, 197, 94, 0.95);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    indicator.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Loaded from cache</span>
    `;
    document.body.appendChild(indicator);
  }
  
  // Show indicator
  indicator.style.opacity = '1';
  
  // Hide after 2 seconds
  cacheIndicatorTimeout = setTimeout(() => {
    indicator.style.opacity = '0';
  }, 2000);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.CacheManager = CacheManager;
  window.cachedFetch = cachedFetch;
  window.showCacheIndicator = showCacheIndicator;
}



