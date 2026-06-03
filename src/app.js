// Global state
let state = {
  bookmarks: [],
  userName: '',
  defaultEngine: 'google',
  showSeconds: true,
  editMode: false,
  activeSearchEngine: null, // 'google', 'youtube', 'wikipedia', 'duckduckgo', 'bing' or null
  theme: 'dark'
};

// Search engine configurations
const searchEngines = {
  google: {
    name: 'Google',
    icon: 'search',
    url: 'https://www.google.com/search?q={query}',
    colorClass: 'google',
    placeholder: 'Zoeken op Google...'
  },
  youtube: {
    name: 'YouTube',
    icon: 'video',
    url: 'https://www.youtube.com/results?search_query={query}',
    colorClass: 'youtube',
    placeholder: 'Zoeken op YouTube...'
  },
  wikipedia: {
    name: 'Wikipedia',
    icon: 'book-open',
    url: 'https://nl.wikipedia.org/wiki/Special:Search?search={query}',
    colorClass: 'wikipedia',
    placeholder: 'Zoeken op Wikipedia...'
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    icon: 'shield',
    url: 'https://duckduckgo.com/?q={query}',
    colorClass: 'duckduckgo',
    placeholder: 'Veilig zoeken op DuckDuckGo...'
  },
  bing: {
    name: 'Bing',
    icon: 'globe',
    url: 'https://www.bing.com/search?q={query}',
    colorClass: 'bing',
    placeholder: 'Zoeken op Bing...'
  }
};

// Trigger shortcuts mapping
const engineTriggers = {
  '@g': 'google',
  '@y': 'youtube',
  '@w': 'wikipedia',
  '@d': 'duckduckgo',
  '@b': 'bing'
};

// Default Bookmarks Data
const defaultBookmarks = [
  {
    id: 'cat-1',
    name: 'Veelgebruikt',
    items: [
      { id: 'bm-1', title: 'Google', url: 'https://www.google.com' },
      { id: 'bm-2', title: 'Buienradar', url: 'https://www.buienradar.nl' },
      { id: 'bm-3', title: 'Tweakers', url: 'https://tweakers.net' },
      { id: 'bm-4', title: 'GitHub', url: 'https://github.com' }
    ]
  },
  {
    id: 'cat-2',
    name: 'Nieuws & Media',
    items: [
      { id: 'bm-5', title: 'NOS Nieuws', url: 'https://nos.nl' },
      { id: 'bm-6', title: 'NU.nl', url: 'https://www.nu.nl' },
      { id: 'bm-7', title: 'RTL Nieuws', url: 'https://www.rtlnieuws.nl' }
    ]
  },
  {
    id: 'cat-3',
    name: 'Socials & Entertainment',
    items: [
      { id: 'bm-8', title: 'YouTube', url: 'https://www.youtube.com' },
      { id: 'bm-9', title: 'Reddit', url: 'https://www.reddit.com' },
      { id: 'bm-10', title: 'Netflix', url: 'https://www.netflix.com' }
    ]
  }
];

// Weather Code translation to Dutch & Lucide Icon
function translateWeather(code) {
  const mapping = {
    0: { desc: 'Helder', icon: 'sun' },
    1: { desc: 'Voornamelijk helder', icon: 'sun-dim' },
    2: { desc: 'Licht bewolkt', icon: 'cloud-sun' },
    3: { desc: 'Bewolkt', icon: 'cloud' },
    45: { desc: 'Mist', icon: 'cloud-fog' },
    48: { desc: 'Rijp mist', icon: 'cloud-fog' },
    51: { desc: 'Lichte motregen', icon: 'cloud-drizzle' },
    53: { desc: 'Matige motregen', icon: 'cloud-drizzle' },
    55: { desc: 'Zware motregen', icon: 'cloud-drizzle' },
    61: { desc: 'Lichte regen', icon: 'cloud-rain' },
    63: { desc: 'Regen', icon: 'cloud-rain' },
    65: { desc: 'Zware regenval', icon: 'cloud-rain' },
    66: { desc: 'Lichte ijzel', icon: 'snowflake' },
    67: { desc: 'Zware ijzel', icon: 'snowflake' },
    71: { desc: 'Lichte sneeuwval', icon: 'snowflake' },
    73: { desc: 'Sneeuwval', icon: 'snowflake' },
    75: { desc: 'Zware sneeuwval', icon: 'snowflake' },
    77: { desc: 'Sneeuwvlokken', icon: 'snowflake' },
    80: { desc: 'Lichte regenbuien', icon: 'cloud-rain-wind' },
    81: { desc: 'Regenbuien', icon: 'cloud-rain-wind' },
    82: { desc: 'Hevige regenbuien', icon: 'cloud-rain-wind' },
    85: { desc: 'Lichte sneeuwbuien', icon: 'snowflake' },
    86: { desc: 'Zware sneeuwbuien', icon: 'snowflake' },
    95: { desc: 'Onweer', icon: 'cloud-lightning' },
    96: { desc: 'Onweer met hagel', icon: 'cloud-lightning' },
    99: { desc: 'Zwaar onweer', icon: 'cloud-lightning' }
  };
  return mapping[code] || { desc: 'Onbekend', icon: 'cloud' };
}

// -------------------------------------------------------------
// Initialize App
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadBookmarks();
  initClock();
  initWeather();
  initSearch();
  initModalListeners();
  initEditMode();
  initThemeToggle();
  initDragAndDrop();
  
  // Create Initial Lucide Icons
  lucide.createIcons();
});

// -------------------------------------------------------------
// Settings Management
// -------------------------------------------------------------
function loadSettings() {
  state.userName = localStorage.getItem('lp_userName') || '';
  state.defaultEngine = localStorage.getItem('lp_defaultEngine') || 'google';
  state.showSeconds = localStorage.getItem('lp_showSeconds') !== 'false';
  state.theme = localStorage.getItem('lp_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  // Populate settings fields in modal
  document.getElementById('settings-user-name').value = state.userName;
  document.getElementById('settings-default-engine').value = state.defaultEngine;
  document.getElementById('settings-show-seconds').checked = state.showSeconds;
  
  applyTheme();
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('btn-theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('lp_theme', state.theme);
      applyTheme();
    });
  }
}

function applyTheme() {
  const toggleBtn = document.getElementById('btn-theme-toggle');
  if (!toggleBtn) return;
  
  if (state.theme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.innerHTML = '<i data-lucide="moon"></i>';
    toggleBtn.title = "Donker thema inschakelen";
  } else {
    document.body.classList.remove('light-theme');
    toggleBtn.innerHTML = '<i data-lucide="sun"></i>';
    toggleBtn.title = "Licht thema inschakelen";
  }
  if (window.lucide) {
    lucide.createIcons();
  }
}

function saveSettings() {
  state.userName = document.getElementById('settings-user-name').value.trim();
  state.defaultEngine = document.getElementById('settings-default-engine').value;
  state.showSeconds = document.getElementById('settings-show-seconds').checked;
  
  localStorage.setItem('lp_userName', state.userName);
  localStorage.setItem('lp_defaultEngine', state.defaultEngine);
  localStorage.setItem('lp_showSeconds', state.showSeconds);
  
  // Refresh layout
  updateClock();
  updateGreeting();
  closeAllModals();
}

// -------------------------------------------------------------
// Bookmarks Management
// -------------------------------------------------------------
function loadBookmarks() {
  const localData = localStorage.getItem('lp_bookmarks');
  if (localData) {
    try {
      state.bookmarks = JSON.parse(localData);
    } catch (e) {
      console.error("Fout bij laden van bookmarks, defaults worden geladen", e);
      state.bookmarks = JSON.parse(JSON.stringify(defaultBookmarks));
    }
  } else {
    state.bookmarks = JSON.parse(JSON.stringify(defaultBookmarks));
    saveBookmarksState();
  }
  renderBookmarks();
}

function saveBookmarksState() {
  localStorage.setItem('lp_bookmarks', JSON.stringify(state.bookmarks));
}

// Extract domain for favicons
function getDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (e) {
    return "";
  }
}

// Fallback favicon generator (on error)
window.handleFaviconError = function(imgElement, title) {
  const firstLetter = title ? title.trim().charAt(0).toUpperCase() : '?';
  const fallback = document.createElement('div');
  fallback.className = 'bookmark-favicon-fallback';
  fallback.textContent = firstLetter;
  
  const colors = [
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ef4444, #dc2626)',
    'linear-gradient(135deg, #ec4899, #be185d)',
    'linear-gradient(135deg, #6366f1, #4f46e5)'
  ];
  
  const charCode = firstLetter.charCodeAt(0) || 0;
  fallback.style.background = colors[charCode % colors.length];
  
  imgElement.replaceWith(fallback);
};

// Render bookmarks grids
function renderBookmarks() {
  const grid = document.getElementById('bookmarks-grid');
  grid.innerHTML = '';
  
  if (state.bookmarks.length === 0) {
    grid.innerHTML = `
      <div class="no-results-msg" style="grid-column: span 12;">
        <i data-lucide="folder-open" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3>Geen categorieën gevonden</h3>
        <p>Gebruik de bewerkmodus om categorieën en snelkoppelingen toe te voegen of importeer je bookmarks via instellingen.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  state.bookmarks.forEach(cat => {
    const catEl = document.createElement('section');
    catEl.className = 'bookmarks-category';
    catEl.setAttribute('data-cat-id', cat.id);
    if (state.editMode) {
      catEl.setAttribute('draggable', 'true');
    }
    
    // Category Header
    const headerEl = document.createElement('div');
    headerEl.className = 'category-header';
    headerEl.innerHTML = `
      <h3 class="category-title">
        ${state.editMode ? `
          <div class="cat-grab-handle" title="Sleep om categorie te verplaatsen">
            <i data-lucide="grip-vertical"></i>
          </div>
        ` : ''}
        <i data-lucide="folder"></i>
        <span>${escapeHTML(cat.name)}</span>
      </h3>
      <div class="category-actions">
        <button class="cat-action-btn btn-sort-cat" onclick="sortCategoryAlphabetically('${cat.id}')" title="Sorteer alfabetisch (A-Z)">
          <i data-lucide="arrow-down-a-z"></i>
        </button>
        <button class="cat-action-btn btn-edit-cat" onclick="openEditCategoryModal('${cat.id}')" title="Categorie bewerken">
          <i data-lucide="edit-2"></i>
        </button>
        <button class="cat-action-btn danger btn-delete-cat" onclick="deleteCategory('${cat.id}')" title="Categorie verwijderen">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    
    // Category Links Grid
    const linksGridEl = document.createElement('div');
    linksGridEl.className = 'links-grid';
    
    // Render links
    cat.items.forEach(link => {
      const linkEl = document.createElement('a');
      linkEl.className = 'bookmark-card';
      linkEl.href = link.url;
      linkEl.setAttribute('data-bm-id', link.id);
      
      if (state.editMode) {
        linkEl.setAttribute('draggable', 'true');
      } else {
        linkEl.setAttribute('draggable', 'false');
      }
      
      // Prevent navigation in Edit Mode
      linkEl.addEventListener('click', (e) => {
        if (state.editMode) {
          e.preventDefault();
        }
      });
      
      const domain = getDomain(link.url);
      const faviconUrl = domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : '';
      
      linkEl.innerHTML = `
        <img src="${faviconUrl}" class="bookmark-favicon" alt="" draggable="false" onerror="handleFaviconError(this, '${escapeQuotes(link.title)}')">
        <div class="bookmark-info" draggable="false">
          <span class="bookmark-name" title="${escapeQuotes(link.title)}" draggable="false">${escapeHTML(link.title)}</span>
          <span class="bookmark-url" draggable="false">${escapeHTML(domain || link.url)}</span>
        </div>
        
        <!-- Edit actions overlay (shows in Edit Mode) -->
        <div class="bookmark-card-actions" draggable="false">
          <button class="card-action-btn" draggable="false" onclick="event.preventDefault(); openEditBookmarkModal('${cat.id}', '${link.id}')" title="Bewerken">
            <i data-lucide="edit-2" draggable="false"></i>
          </button>
          <button class="card-action-btn danger" draggable="false" onclick="event.preventDefault(); deleteBookmark('${cat.id}', '${link.id}')" title="Verwijderen">
            <i data-lucide="trash-2" draggable="false"></i>
          </button>
        </div>
      `;
      linksGridEl.appendChild(linkEl);
    });
    
    // Render "Add Bookmark" Card inside grid
    const addCard = document.createElement('div');
    addCard.className = 'bookmark-card add-bookmark-card';
    addCard.setAttribute('onclick', `openAddBookmarkModal('${cat.id}')`);
    addCard.innerHTML = `
      <i data-lucide="plus"></i>
      <span>Toevoegen</span>
    `;
    linksGridEl.appendChild(addCard);
    
    catEl.appendChild(headerEl);
    catEl.appendChild(linksGridEl);
    grid.appendChild(catEl);
  });
  
  lucide.createIcons();
  
  // Re-run filter in case the search bar has text
  filterBookmarks(document.getElementById('search-input').value);
}

// Helper to escape HTML characters
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// CRUD Operations
function addCategory(name) {
  const newCat = {
    id: 'cat-' + Date.now(),
    name: name,
    items: []
  };
  state.bookmarks.push(newCat);
  saveBookmarksState();
  renderBookmarks();
}

function editCategory(id, newName) {
  const cat = state.bookmarks.find(c => c.id === id);
  if (cat) {
    cat.name = newName;
    saveBookmarksState();
    renderBookmarks();
  }
}

function deleteCategory(id) {
  if (confirm("Weet je zeker dat je deze gehele categorie wilt verwijderen?")) {
    state.bookmarks = state.bookmarks.filter(c => c.id !== id);
    saveBookmarksState();
    renderBookmarks();
  }
}

function addBookmark(catId, title, url) {
  const cat = state.bookmarks.find(c => c.id === catId);
  if (cat) {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    const newBm = {
      id: 'bm-' + Date.now(),
      title: title,
      url: url
    };
    cat.items.push(newBm);
    saveBookmarksState();
    renderBookmarks();
  }
}

function editBookmark(catId, bmId, title, url) {
  const cat = state.bookmarks.find(c => c.id === catId);
  if (cat) {
    const link = cat.items.find(i => i.id === bmId);
    if (link) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      link.title = title;
      link.url = url;
      saveBookmarksState();
      renderBookmarks();
    }
  }
}

function deleteBookmark(catId, bmId) {
  const cat = state.bookmarks.find(c => c.id === catId);
  if (cat) {
    cat.items = cat.items.filter(i => i.id !== bmId);
    saveBookmarksState();
    renderBookmarks();
  }
}

// -------------------------------------------------------------
// Clock & Greetings Widget
// -------------------------------------------------------------
function initClock() {
  updateClock();
  updateGreeting();
  setInterval(() => {
    updateClock();
    // Update greeting once every minute is sufficient
    const now = new Date();
    if (now.getSeconds() === 0) {
      updateGreeting();
    }
  }, 1000);
}

function updateClock() {
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  
  const now = new Date();
  
  // Format Time
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');
  
  if (state.showSeconds) {
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;
  } else {
    timeEl.textContent = `${hours}:${minutes}`;
  }
  
  // Format Date (Dutch language options)
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('nl-NL', options);
}

function updateGreeting() {
  const greetingEl = document.getElementById('greeting');
  const hour = new Date().getHours();
  let greetWord = "Goededag";
  
  if (hour >= 5 && hour < 12) {
    greetWord = "Goedemorgen";
  } else if (hour >= 12 && hour < 18) {
    greetWord = "Goedemiddag";
  } else if (hour >= 18 && hour < 24) {
    greetWord = "Goedenavond";
  } else {
    greetWord = "Goedenacht";
  }
  
  if (state.userName) {
    greetingEl.textContent = `${greetWord}, ${state.userName}`;
  } else {
    greetingEl.textContent = greetWord;
  }
}

// -------------------------------------------------------------
// Search and Omnibox Shortcuts Logic
// -------------------------------------------------------------
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  const helper = document.getElementById('search-helper');
  
  // Handle typing input
  searchInput.addEventListener('input', (e) => {
    let value = e.target.value;
    
    // 1. Detect shortcut tags
    if (!state.activeSearchEngine) {
      // Look for match of trigers at the beginning of the text, e.g. "@g "
      for (const [trigger, engineKey] of Object.entries(engineTriggers)) {
        if (value.startsWith(trigger + ' ')) {
          activateSearchEngine(engineKey);
          searchInput.value = value.substring(trigger.length + 1);
          break;
        }
      }
    }
    
    // Toggle helper overlay showing shortcut options when user starts typing '@'
    if (value === '@') {
      helper.classList.remove('hidden');
    } else if (!value.startsWith('@') || value === '') {
      helper.classList.add('hidden');
    }
    
    // Toggle X clear button
    if (searchInput.value !== '' || state.activeSearchEngine) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
    
    // 2. Filter bookmark cards on screen
    // If we have an active search engine badge, we filter using the badge terms
    filterBookmarks(searchInput.value);
  });
  
  // Handle Backspace when input field is empty to remove search engine badge
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && searchInput.value === '' && state.activeSearchEngine) {
      // Find the trigger prefix to restore
      const trigger = Object.keys(engineTriggers).find(key => engineTriggers[key] === state.activeSearchEngine);
      deactivateSearchEngine();
      searchInput.value = trigger + ' ';
      clearBtn.classList.remove('hidden');
      filterBookmarks(searchInput.value);
    }
    
    // Handle Enter to launch search actions
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
    
    // Handle ArrowDown and ArrowUp for navigating filtered bookmarks
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !state.editMode && !state.activeSearchEngine) {
      const visibleCards = [...document.querySelectorAll('.bookmark-card:not(.filtered-out):not(.add-bookmark-card)')];
      if (visibleCards.length > 0) {
        e.preventDefault(); // Prevent page scrolling or input cursor movement
        
        // Find current active-match
        const currentActive = document.querySelector('.bookmark-card.active-match');
        let nextIndex = 0;
        
        if (currentActive) {
          const currentIndex = visibleCards.indexOf(currentActive);
          if (e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % visibleCards.length;
          } else {
            nextIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
          }
          currentActive.classList.remove('active-match');
        } else {
          // If none active, start at 0 for ArrowDown, or last for ArrowUp
          nextIndex = e.key === 'ArrowDown' ? 0 : visibleCards.length - 1;
        }
        
        const targetCard = visibleCards[nextIndex];
        targetCard.classList.add('active-match');
        
        // Scroll the selected card into view smoothly if offscreen
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
  
  // Toggle helper on focus
  searchInput.addEventListener('focus', () => {
    if (searchInput.value === '@') {
      helper.classList.remove('hidden');
    }
  });
  
  // Click handler for helper options
  document.querySelectorAll('.shortcut-tip').forEach(tip => {
    tip.addEventListener('click', () => {
      const prefix = tip.getAttribute('data-prefix');
      const engineKey = engineTriggers[prefix];
      activateSearchEngine(engineKey);
      searchInput.value = '';
      searchInput.focus();
      helper.classList.add('hidden');
      clearBtn.classList.remove('hidden');
    });
  });
  
  // Click on empty space closes helper
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      helper.classList.add('hidden');
    }
  });
  
  // Clear search input action
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    deactivateSearchEngine();
    clearBtn.classList.add('hidden');
    helper.classList.add('hidden');
    filterBookmarks('');
    searchInput.focus();
  });
}

function activateSearchEngine(engineKey) {
  state.activeSearchEngine = engineKey;
  const config = searchEngines[engineKey];
  
  const badge = document.getElementById('search-engine-badge');
  const inputWrapper = document.querySelector('.search-input-wrapper');
  const searchInput = document.getElementById('search-input');
  
  badge.className = `search-engine-badge ${config.colorClass}`;
  badge.querySelector('.badge-text').textContent = config.name;
  badge.querySelector('.badge-icon').setAttribute('data-lucide', config.icon);
  badge.classList.remove('hidden');
  
  searchInput.placeholder = config.placeholder;
  
  lucide.createIcons();
}

function deactivateSearchEngine() {
  state.activeSearchEngine = null;
  const badge = document.getElementById('search-engine-badge');
  const searchInput = document.getElementById('search-input');
  
  badge.classList.add('hidden');
  searchInput.placeholder = 'Zoek of typ @g voor Google, @y voor YouTube...';
}

function performSearch(query) {
  query = query.trim();
  
  // If there is a direct typing prefix (not badge parsed yet, e.g. "@g query" or "@gquery")
  if (!state.activeSearchEngine) {
    for (const [trigger, engineKey] of Object.entries(engineTriggers)) {
      if (query.toLowerCase().startsWith(trigger + ' ')) {
        const actualQuery = query.substring(trigger.length + 1).trim();
        const url = searchEngines[engineKey].url.replace('{query}', encodeURIComponent(actualQuery));
        window.location.href = url;
        return;
      } else if (query.toLowerCase().startsWith(trigger)) {
        // Handle trigger with no spaces
        const actualQuery = query.substring(trigger.length).trim();
        const url = searchEngines[engineKey].url.replace('{query}', encodeURIComponent(actualQuery));
        window.location.href = url;
        return;
      }
    }
  }
  
  // If active badge is present
  if (state.activeSearchEngine) {
    const url = searchEngines[state.activeSearchEngine].url.replace('{query}', encodeURIComponent(query));
    window.location.href = url;
    return;
  }
  
  // If no prefix is present:
  if (query === '') return;
  
  // If there is an active-match highlighted card, open it!
  const activeMatchCard = document.querySelector('.bookmark-card.active-match');
  if (activeMatchCard) {
    window.location.href = activeMatchCard.href;
    return;
  }
  
  // Otherwise, default search engine action
  const defaultEngineConfig = searchEngines[state.defaultEngine] || searchEngines.google;
  const searchUrl = defaultEngineConfig.url.replace('{query}', encodeURIComponent(query));
  window.location.href = searchUrl;
}

// Filter layout cards by keywords
function filterBookmarks(searchText) {
  searchText = searchText.trim().toLowerCase();
  
  // Parse terms: split by whitespace. Filters cards that match *all* words
  const terms = searchText.split(/\s+/).filter(t => t !== '');
  
  const categories = document.querySelectorAll('.bookmarks-category');
  const noResultsMsg = document.getElementById('no-results-msg');
  let hasAnyVisibleCategory = false;
  
  // Reset active-match classes on all cards
  document.querySelectorAll('.bookmark-card').forEach(card => {
    card.classList.remove('active-match');
  });
  
  // Don't filter out the "Add Bookmark" elements if search is empty
  categories.forEach(catEl => {
    const cards = catEl.querySelectorAll('.bookmark-card:not(.add-bookmark-card)');
    let visibleCardsInCat = 0;
    
    cards.forEach(cardEl => {
      const title = cardEl.querySelector('.bookmark-name').textContent.toLowerCase();
      const url = cardEl.querySelector('.bookmark-url').textContent.toLowerCase();
      
      let matches = true;
      if (terms.length > 0) {
        // Loop through terms. All terms must match (AND filter)
        for (const term of terms) {
          if (!title.includes(term) && !url.includes(term)) {
            matches = false;
            break;
          }
        }
      }
      
      if (matches) {
        cardEl.classList.remove('filtered-out');
        visibleCardsInCat++;
      } else {
        cardEl.classList.add('filtered-out');
      }
    });
    
    // Hide category block if no links match
    if (terms.length > 0 && visibleCardsInCat === 0) {
      catEl.classList.add('collapsed');
    } else {
      catEl.classList.remove('collapsed');
      hasAnyVisibleCategory = true;
    }
  });
  
  // Add active-match to the FIRST visible bookmark card
  // only if there is a search text, no active search engine badge, and not in edit mode
  if (terms.length > 0 && !state.activeSearchEngine && !state.editMode) {
    const firstVisibleCard = document.querySelector('.bookmark-card:not(.filtered-out):not(.add-bookmark-card)');
    if (firstVisibleCard) {
      firstVisibleCard.classList.add('active-match');
    }
  }
  
  // Toggle no results error message
  if (!hasAnyVisibleCategory && terms.length > 0) {
    noResultsMsg.classList.remove('hidden');
  } else {
    noResultsMsg.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// Weather Widget (Open-Meteo Integration)
// -------------------------------------------------------------
function initWeather() {
  const widget = document.getElementById('weather-widget');
  const panel = document.getElementById('weather-forecast-panel');
  if (!widget || !panel) return;
  
  let pressTimer = null;
  let isLongPress = false;
  let startX = 0;
  let startY = 0;
  
  // Function to start holding animation and timeout
  const startPress = (x, y) => {
    isLongPress = false;
    startX = x;
    startY = y;
    widget.classList.add('holding');
    
    pressTimer = setTimeout(() => {
      isLongPress = true;
      widget.classList.remove('holding');
      
      // Perform force-refresh
      localStorage.removeItem('lp_weather_cache');
      fetchWeather(true);
      
      // Flash green confirmation
      widget.classList.add('refreshed');
      setTimeout(() => {
        widget.classList.remove('refreshed');
      }, 800);
    }, 2000);
  };
  
  // Function to cancel holding
  const cancelPress = () => {
    clearTimeout(pressTimer);
    widget.classList.remove('holding');
  };
  
  // Mouse events
  widget.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only left click
    startPress(e.clientX, e.clientY);
  });
  
  widget.addEventListener('mouseup', () => {
    cancelPress();
  });
  
  widget.addEventListener('mouseleave', () => {
    cancelPress();
  });
  
  // Touch events (for mobile/tablets)
  widget.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startPress(touch.clientX, touch.clientY);
  }, { passive: true });
  
  widget.addEventListener('touchend', () => {
    cancelPress();
  });
  
  widget.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const distance = Math.hypot(touch.clientX - startX, touch.clientY - startY);
    if (distance > 10) {
      cancelPress();
    }
  }, { passive: true });
  
  // Click event (toggles panel)
  widget.addEventListener('click', (e) => {
    if (isLongPress) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Toggle forecast panel
    panel.classList.toggle('hidden');
    
    // If panel is shown, render the cached forecast immediately
    if (!panel.classList.contains('hidden')) {
      const cache = localStorage.getItem('lp_weather_cache');
      if (cache) {
        renderForecast(JSON.parse(cache));
      }
    }
  });
  
  // Close forecast panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.weather-wrapper')) {
      panel.classList.add('hidden');
    }
  });
  
  fetchWeather();
}

function fetchWeather(forceRefresh = false) {
  const cacheKey = 'lp_weather_cache';
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData && !forceRefresh) {
    try {
      const data = JSON.parse(cachedData);
      // Cache for 15 minutes
      if (Date.now() - data.timestamp < 15 * 60 * 1000) {
        renderWeather(data);
        return;
      }
    } catch(e) {
      localStorage.removeItem(cacheKey);
    }
  }
  
  // Request geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherData(lat, lon);
      },
      (error) => {
        console.warn("Geolocation geweigerd of mislukt. Gebruik standaardlocatie (Amsterdam).");
        // Fallback: Amsterdam Coordinates
        getWeatherData(52.3676, 4.9041, "Amsterdam");
      },
      { timeout: 10000 }
    );
  } else {
    // Fallback: Amsterdam
    getWeatherData(52.3676, 4.9041, "Amsterdam");
  }
}

function getWeatherData(lat, lon, label = "Mijn Locatie") {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=auto`;
  const widget = document.getElementById('weather-widget');
  widget.classList.add('loading');
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data.current_weather) {
        const weather = data.current_weather;
        const info = translateWeather(weather.weathercode);
        
        // Parse daily forecast
        const forecast = [];
        const daily = data.daily;
        const hourly = data.hourly;
        
        if (daily && hourly) {
          for (let i = 0; i < 5; i++) {
            const dateStr = daily.time[i];
            const morningIdx = i * 24 + 9;
            const afternoonIdx = i * 24 + 15;
            
            const morningTemp = Math.round(hourly.temperature_2m[morningIdx]);
            const morningCode = hourly.weathercode[morningIdx];
            const morningPop = hourly.precipitation_probability[morningIdx];
            
            const afternoonTemp = Math.round(hourly.temperature_2m[afternoonIdx]);
            const afternoonCode = hourly.weathercode[afternoonIdx];
            const afternoonPop = hourly.precipitation_probability[afternoonIdx];
            
            forecast.push({
              date: dateStr,
              temp_max: Math.round(daily.temperature_2m_max[i]),
              temp_min: Math.round(daily.temperature_2m_min[i]),
              apparent_max: Math.round(daily.apparent_temperature_max[i]),
              apparent_min: Math.round(daily.apparent_temperature_min[i]),
              code: daily.weathercode[i],
              morning_temp: morningTemp,
              morning_code: morningCode,
              morning_pop: morningPop,
              afternoon_temp: afternoonTemp,
              afternoon_code: afternoonCode,
              afternoon_pop: afternoonPop
            });
          }
        }
        
        const cache = {
          temp: Math.round(weather.temperature),
          code: weather.weathercode,
          desc: info.desc,
          icon: info.icon,
          timestamp: Date.now(),
          location: label,
          forecast: forecast
        };
        
        localStorage.setItem('lp_weather_cache', JSON.stringify(cache));
        renderWeather(cache);
      }
    })
    .catch(err => {
      console.error("Fout bij ophalen weergegevens:", err);
      const widget = document.getElementById('weather-widget');
      widget.classList.remove('loading');
      widget.querySelector('.weather-desc').textContent = "Weer niet beschikbaar";
    });
}

function renderWeather(cache) {
  const widget = document.getElementById('weather-widget');
  const tempEl = widget.querySelector('.weather-temp');
  const descEl = widget.querySelector('.weather-desc');
  const iconEl = widget.querySelector('.weather-icon');
  
  tempEl.textContent = `${cache.temp}°C`;
  descEl.textContent = cache.desc;
  iconEl.setAttribute('data-lucide', cache.icon);
  
  widget.classList.remove('loading');
  lucide.createIcons();
  
  // Update the forecast panel
  renderForecast(cache);
}

function renderForecast(cache) {
  const panel = document.getElementById('weather-forecast-panel');
  if (!panel) return;
  
  if (!cache.forecast || cache.forecast.length === 0) {
    panel.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 12px 0;">Geen voorspellingsgegevens beschikbaar</div>`;
    return;
  }
  
  let html = `
    <div class="forecast-header">
      <div class="forecast-title">5-daagse Verwachting</div>
      <div class="forecast-location">
        <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
        <span>${escapeHTML(cache.location || "Mijn Locatie")}</span>
      </div>
    </div>
  `;
  
  html += `<div class="forecast-days">`;
  
  cache.forecast.forEach((day, index) => {
    const dayLabel = getDayLabel(day.date, index);
    const dayWeather = translateWeather(day.code);
    
    const morningWeather = translateWeather(day.morning_code);
    const afternoonWeather = translateWeather(day.afternoon_code);
    
    html += `
      <div class="forecast-day-row">
        <div class="forecast-day-main">
          <span class="forecast-day-name">${dayLabel}</span>
          <div class="forecast-day-desc" title="${dayWeather.desc}">
            <i data-lucide="${dayWeather.icon}" class="forecast-day-icon"></i>
            <span>${dayWeather.desc}</span>
          </div>
          <div class="forecast-day-temps">
            <span class="forecast-temp-range">${day.temp_max}°<span class="temp-min"> / ${day.temp_min}°C</span></span>
            <span class="forecast-feels-range">Gevoel: ${day.apparent_max}°<span class="feels-min"> / ${day.apparent_min}°C</span></span>
          </div>
        </div>
        <div class="forecast-day-details">
          <div class="forecast-period" title="Ochtend (09:00): ${morningWeather.desc}">
            <i data-lucide="sunrise"></i>
            <span class="forecast-period-label">Ochtend:</span>
            <i data-lucide="${morningWeather.icon}"></i>
            <span class="forecast-period-temp">${day.morning_temp}°C</span>
            <span class="forecast-rain" title="Regenkans: ${day.morning_pop}%">
              <i data-lucide="droplet"></i>
              ${day.morning_pop}%
            </span>
          </div>
          <div class="forecast-period" title="Middag (15:00): ${afternoonWeather.desc}">
            <i data-lucide="sunset"></i>
            <span class="forecast-period-label">Middag:</span>
            <i data-lucide="${afternoonWeather.icon}"></i>
            <span class="forecast-period-temp">${day.afternoon_temp}°C</span>
            <span class="forecast-rain" title="Regenkans: ${day.afternoon_pop}%">
              <i data-lucide="droplet"></i>
              ${day.afternoon_pop}%
            </span>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  panel.innerHTML = html;
  
  // Render lucide icons inside the panel
  if (window.lucide) {
    lucide.createIcons({
      nameAttr: 'data-lucide',
      root: panel
    });
  }
}

function getDayLabel(dateStr, index) {
  if (index === 0) return "Vandaag";
  if (index === 1) return "Morgen";
  
  const date = new Date(dateStr.replace(/-/g, "/"));
  const label = date.toLocaleDateString('nl-NL', { weekday: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// -------------------------------------------------------------
// Edit Mode Manager
// -------------------------------------------------------------
function initEditMode() {
  const editBtn = document.getElementById('btn-edit-mode');
  const controlsBar = document.getElementById('edit-controls-bar');
  
  editBtn.addEventListener('click', () => {
    state.editMode = !state.editMode;
    
    if (state.editMode) {
      editBtn.classList.add('active');
      editBtn.innerHTML = '<i data-lucide="check"></i><span>Klaar</span>';
      controlsBar.classList.remove('hidden');
      document.body.classList.add('edit-mode-active');
      
      // Clear active-match when entering edit mode
      document.querySelectorAll('.bookmark-card.active-match').forEach(card => {
        card.classList.remove('active-match');
      });
    } else {
      editBtn.classList.remove('active');
      editBtn.innerHTML = '<i data-lucide="edit-3"></i><span>Bewerken</span>';
      controlsBar.classList.add('hidden');
      document.body.classList.remove('edit-mode-active');
      
      // Re-evaluate active match if there's search text
      filterBookmarks(document.getElementById('search-input').value);
    }
    
    // Re-render bookmarks to apply draggable attributes in DOM
    renderBookmarks();
    
    lucide.createIcons();
  });
}

// -------------------------------------------------------------
// Modals & Events Manager
// -------------------------------------------------------------
function initModalListeners() {
  // Opening Modals
  document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
  
  document.getElementById('btn-add-category').addEventListener('click', () => {
    openAddCategoryModal();
  });
  
  // Saving forms
  document.getElementById('btn-save-settings').addEventListener('click', saveSettings);
  
  document.getElementById('btn-save-bookmark').addEventListener('click', saveBookmarkForm);
  document.getElementById('btn-save-category').addEventListener('click', saveCategoryForm);
  
  // Closing modals
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  // Close modals on clicking overlay outside the content
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });
  
  // Import file input
  const fileInput = document.getElementById('bookmarks-file-input');
  fileInput.addEventListener('change', handleBookmarkImport);
  
  // Reset Defaults handler
  document.getElementById('btn-reset-defaults').addEventListener('click', () => {
    if (confirm("Weet je zeker dat je alle gegevens wilt resetten naar fabrieksinstellingen? Dit wist al je bookmarks!")) {
      localStorage.removeItem('lp_bookmarks');
      localStorage.removeItem('lp_userName');
      localStorage.removeItem('lp_defaultEngine');
      localStorage.removeItem('lp_showSeconds');
      loadSettings();
      loadBookmarks();
      closeAllModals();
    }
  });
  
  // Export backup JSON
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `launchpad_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Import backup JSON
  const jsonImportBtn = document.getElementById('btn-import-json');
  const jsonFileInput = document.getElementById('json-file-input');
  jsonImportBtn.addEventListener('click', () => jsonFileInput.click());
  jsonFileInput.addEventListener('change', handleJsonImport);
}

function openSettingsModal() {
  document.getElementById('settings-modal').classList.remove('hidden');
  document.getElementById('import-status').style.display = 'none';
}

function openAddCategoryModal() {
  document.getElementById('category-id').value = '';
  document.getElementById('category-name').value = '';
  document.getElementById('category-modal-title').innerHTML = '<i data-lucide="folder-plus"></i> Categorie toevoegen';
  document.getElementById('category-modal').classList.remove('hidden');
  lucide.createIcons();
}

function openEditCategoryModal(catId) {
  event.stopPropagation();
  const cat = state.bookmarks.find(c => c.id === catId);
  if (cat) {
    document.getElementById('category-id').value = cat.id;
    document.getElementById('category-name').value = cat.name;
    document.getElementById('category-modal-title').innerHTML = '<i data-lucide="edit-2"></i> Categorie bewerken';
    document.getElementById('category-modal').classList.remove('hidden');
    lucide.createIcons();
  }
}

function openAddBookmarkModal(catId) {
  document.getElementById('bookmark-id').value = '';
  document.getElementById('bookmark-category-id').value = catId;
  document.getElementById('bookmark-title').value = '';
  document.getElementById('bookmark-url').value = '';
  document.getElementById('bookmark-modal-title').innerHTML = '<i data-lucide="plus-circle"></i> Snelkoppeling toevoegen';
  document.getElementById('bookmark-modal').classList.remove('hidden');
  lucide.createIcons();
}

function openEditBookmarkModal(catId, bmId) {
  const cat = state.bookmarks.find(c => c.id === catId);
  if (cat) {
    const link = cat.items.find(l => l.id === bmId);
    if (link) {
      document.getElementById('bookmark-id').value = link.id;
      document.getElementById('bookmark-category-id').value = catId;
      document.getElementById('bookmark-title').value = link.title;
      document.getElementById('bookmark-url').value = link.url;
      document.getElementById('bookmark-modal-title').innerHTML = '<i data-lucide="edit-2"></i> Snelkoppeling bewerken';
      document.getElementById('bookmark-modal').classList.remove('hidden');
      lucide.createIcons();
    }
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
}

function saveCategoryForm() {
  const id = document.getElementById('category-id').value;
  const name = document.getElementById('category-name').value.trim();
  
  if (!name) {
    alert("Vul een naam in voor de categorie.");
    return;
  }
  
  if (id) {
    editCategory(id, name);
  } else {
    addCategory(name);
  }
  closeAllModals();
}

function saveBookmarkForm() {
  const id = document.getElementById('bookmark-id').value;
  const catId = document.getElementById('bookmark-category-id').value;
  const title = document.getElementById('bookmark-title').value.trim();
  const url = document.getElementById('bookmark-url').value.trim();
  
  if (!title || !url) {
    alert("Vul alle velden in.");
    return;
  }
  
  if (id) {
    editBookmark(catId, id, title, url);
  } else {
    addBookmark(catId, title, url);
  }
  closeAllModals();
}

// -------------------------------------------------------------
// Import Netscape HTML Firefox Bookmarks
// -------------------------------------------------------------
function handleBookmarkImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const statusEl = document.getElementById('import-status');
  statusEl.className = 'import-status';
  statusEl.style.display = 'block';
  statusEl.textContent = 'Bezig met importeren...';
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const htmlText = evt.target.result;
      const importedCategories = parseBookmarksHTML(htmlText);
      
      if (importedCategories.length === 0) {
        statusEl.className = 'import-status error';
        statusEl.textContent = 'Geen bookmarks gevonden in dit bestand.';
        return;
      }
      
      // Merge or overwrite bookmarks
      if (confirm(`Er zijn ${importedCategories.length} categorieën gevonden. Wil je deze toevoegen aan je huidige bookmarks? (Kies 'Annuleren' om je huidige bookmarks te vervangen)`)) {
        state.bookmarks = [...state.bookmarks, ...importedCategories];
      } else {
        state.bookmarks = importedCategories;
      }
      
      saveBookmarksState();
      renderBookmarks();
      
      statusEl.className = 'import-status success';
      statusEl.textContent = 'Import succesvol voltooid!';
      
      // Clear file input
      e.target.value = '';
    } catch(err) {
      console.error(err);
      statusEl.className = 'import-status error';
      statusEl.textContent = 'Fout bij verwerken bestand. Zorg ervoor dat het een geldig HTML bladwijzerbestand is.';
    }
  };
  
  reader.readAsText(file);
}

// Parse Netscape Bookmarks File
function parseBookmarksHTML(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const categories = [];
  
  // Find all folder headers
  const h3Elements = doc.querySelectorAll('h3');
  
  if (h3Elements.length === 0) {
    // Flat format: just links
    const links = doc.querySelectorAll('a');
    if (links.length > 0) {
      const items = [];
      links.forEach((a, i) => {
        items.push({
          id: `bm-imp-${i}-${Date.now()}`,
          title: a.textContent.trim() || a.href,
          url: a.href
        });
      });
      categories.push({
        id: `cat-imp-${Date.now()}`,
        name: "Geïmporteerd",
        items: items
      });
    }
    return categories;
  }
  
  h3Elements.forEach((h3, catIdx) => {
    const folderName = h3.textContent.trim();
    if (folderName === '') return;
    
    const items = [];
    
    // Look for sibling DL which contains folder children
    let sibling = h3.nextElementSibling;
    while (sibling && sibling.tagName !== 'DL' && sibling.tagName !== 'H3') {
      sibling = sibling.nextElementSibling;
    }
    
    if (sibling && sibling.tagName === 'DL') {
      // Find all immediate links inside this DL list (avoid deeply nested descendants)
      const links = sibling.querySelectorAll(':scope > dt > a, :scope > a');
      links.forEach((a, linkIdx) => {
        items.push({
          id: `bm-imp-${catIdx}-${linkIdx}-${Date.now()}`,
          title: a.textContent.trim() || a.href,
          url: a.href
        });
      });
    }
    
    if (items.length > 0) {
      categories.push({
        id: `cat-imp-${catIdx}-${Date.now()}`,
        name: folderName,
        items: items
      });
    }
  });
  
  // Catch any loose top-level links
  const topLevelLinks = [];
  const allLinks = doc.querySelectorAll('a');
  allLinks.forEach((a, i) => {
    let parent = a.parentElement;
    let inFolder = false;
    while (parent) {
      if (parent.tagName === 'DL' && parent.previousElementSibling && parent.previousElementSibling.tagName === 'H3') {
        inFolder = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!inFolder) {
      topLevelLinks.push({
        id: `bm-imp-top-${i}-${Date.now()}`,
        title: a.textContent.trim() || a.href,
        url: a.href
      });
    }
  });
  
  if (topLevelLinks.length > 0) {
    categories.unshift({
      id: `cat-imp-top-${Date.now()}`,
      name: "Bladwijzers",
      items: topLevelLinks
    });
  }
  
  return categories;
}

// -------------------------------------------------------------
// Import Backup JSON
// -------------------------------------------------------------
function handleJsonImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const statusEl = document.getElementById('import-status');
  statusEl.className = 'import-status';
  statusEl.style.display = 'block';
  statusEl.textContent = 'Laden...';
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      
      // Validation: expect array of categories
      if (Array.isArray(data) && data.every(cat => cat.id && cat.name && Array.isArray(cat.items))) {
        state.bookmarks = data;
        saveBookmarksState();
        renderBookmarks();
        statusEl.className = 'import-status success';
        statusEl.textContent = 'Back-up hersteld!';
      } else {
        throw new Error("Ongeldig bestandsformaat");
      }
    } catch(err) {
      console.error(err);
      statusEl.className = 'import-status error';
      statusEl.textContent = 'Ongeldig JSON back-up bestand.';
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

// -------------------------------------------------------------
// Drag & Drop / Sorting Features
// -------------------------------------------------------------
let draggedCard = null;
let draggedCategory = null;

// FLIP layout shift animation helper for categories
function animateCategoryLayoutShift(action) {
  const categories = document.querySelectorAll('.bookmarks-category');
  const rects = new Map();
  
  // 1. Record First positions
  categories.forEach(cat => {
    if (cat !== draggedCategory) {
      rects.set(cat, cat.getBoundingClientRect());
    }
  });
  
  // 2. Perform the DOM mutation
  action();
  
  // 3. Clear transforms to measure true natural layout positions
  categories.forEach(cat => {
    if (cat === draggedCategory) return;
    cat.style.transition = 'none';
    cat.style.transform = 'none';
  });
  
  // 4. Record Last positions and apply Invert instantly
  categories.forEach(cat => {
    if (cat === draggedCategory) return;
    const firstRect = rects.get(cat);
    if (!firstRect) return;
    
    const lastRect = cat.getBoundingClientRect();
    const dy = firstRect.top - lastRect.top;
    
    cat.style.transform = `translateY(${dy}px)`;
  });
  
  // 5. Force reflow
  const grid = document.getElementById('bookmarks-grid');
  if (grid) {
    grid.offsetHeight;
  }
  
  // 6. Play transition
  categories.forEach(cat => {
    if (cat === draggedCategory) return;
    cat.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
    cat.style.transform = '';
  });
}

// FLIP layout shift animation helper for smooth reordering
function animateLayoutShift(action) {
  const cards = document.querySelectorAll('.bookmark-card');
  const rects = new Map();
  
  // 1. Record First positions (current visual locations, potentially animating)
  cards.forEach(card => {
    if (card !== draggedCard) {
      rects.set(card, card.getBoundingClientRect());
    }
  });
  
  // 2. Perform the DOM mutation
  action();
  
  // 3. Clear inline transforms/transitions to measure true natural layout positions
  cards.forEach(card => {
    if (card === draggedCard) return;
    card.style.transition = 'none';
    card.style.transform = 'none';
  });
  
  // 4. Record Last positions and apply Invert instantly
  cards.forEach(card => {
    if (card === draggedCard) return;
    const firstRect = rects.get(card);
    if (!firstRect) return;
    
    const lastRect = card.getBoundingClientRect();
    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;
    
    // Set the inverted transform instantly
    card.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  
  // 5. Force a single layout reflow on the parent grid container
  const grid = document.getElementById('bookmarks-grid');
  if (grid) {
    grid.offsetHeight;
  }
  
  // 6. Play transition back to natural layout position
  cards.forEach(card => {
    if (card === draggedCard) return;
    card.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
    card.style.transform = '';
  });
}

// Calculate target card using layout offset values that are stable during CSS transitions
function getClosestCardStable(grid, mouseX, mouseY) {
  const cards = [...grid.querySelectorAll('.bookmark-card:not(.dragging):not(.add-bookmark-card)')];
  
  let closestCard = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  let isAfter = false;
  
  for (const card of cards) {
    // Get card center relative to the grid offset coordinates (unaffected by transforms)
    const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
    const cardCenterY = card.offsetTop + card.offsetHeight / 2;
    
    const dx = mouseX - cardCenterX;
    const dy = (mouseY - cardCenterY) * 6; // Penalize vertical distance to prevent row-jumping oscillation
    const distance = dx * dx + dy * dy;
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
      isAfter = mouseX > cardCenterX;
    }
  }
  
  return { card: closestCard, isAfter };
}

function initDragAndDrop() {
  const grid = document.getElementById('bookmarks-grid');
  if (!grid) return;
  
  let isMouseDownOnHandle = false;
  
  grid.addEventListener('mousedown', (e) => {
    isMouseDownOnHandle = !!e.target.closest('.cat-grab-handle');
  });
  
  grid.addEventListener('dragstart', (e) => {
    if (!state.editMode) return;
    
    // 1. Check if dragging a category
    if (isMouseDownOnHandle) {
      const catEl = e.target.closest('.bookmarks-category');
      if (catEl) {
        draggedCategory = catEl;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', catEl.getAttribute('data-cat-id'));
        setTimeout(() => {
          catEl.classList.add('category-dragging');
        }, 0);
        return;
      }
    }
    
    // 2. Check if dragging a bookmark card
    const card = e.target.closest('.bookmark-card:not(.add-bookmark-card)');
    if (card) {
      draggedCard = card;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.getAttribute('data-bm-id'));
      setTimeout(() => {
        card.classList.add('dragging');
      }, 0);
      return;
    }
    
    // 3. Otherwise prevent drag
    e.preventDefault();
  });
  
  grid.addEventListener('dragend', (e) => {
    if (draggedCategory) {
      draggedCategory.classList.remove('category-dragging');
      draggedCategory = null;
      
      // Reset inline styles on all categories
      document.querySelectorAll('.bookmarks-category').forEach(cat => {
        cat.style.transition = '';
        cat.style.transform = '';
      });
      
      saveDraggedOrder();
    }
    
    if (draggedCard) {
      draggedCard.classList.remove('dragging');
      draggedCard = null;
      
      // Reset inline styles on all cards
      document.querySelectorAll('.bookmark-card').forEach(card => {
        card.style.transition = '';
        card.style.transform = '';
      });
      
      saveDraggedOrder();
    }
  });
  
  grid.addEventListener('dragover', (e) => {
    if (!state.editMode) return;
    
    // A. Handle category dragging
    if (draggedCategory) {
      e.preventDefault();
      const targetCat = e.target.closest('.bookmarks-category');
      if (targetCat && targetCat !== draggedCategory) {
        const rect = targetCat.getBoundingClientRect();
        const mouseY = e.clientY;
        const middleY = rect.top + rect.height / 2;
        
        animateCategoryLayoutShift(() => {
          if (mouseY < middleY) {
            grid.insertBefore(draggedCategory, targetCat);
          } else {
            grid.insertBefore(draggedCategory, targetCat.nextSibling);
          }
        });
      }
      return;
    }
    
    // B. Handle bookmark card dragging
    if (draggedCard) {
      e.preventDefault();
      const targetGrid = e.target.closest('.links-grid');
      if (!targetGrid) return;
      
      let targetCard = e.target.closest('.bookmark-card:not(.dragging):not(.add-bookmark-card)');
      let isAfter = false;
      
      if (targetCard) {
        const gridRect = targetGrid.getBoundingClientRect();
        const mouseX = e.clientX - gridRect.left;
        const cardCenterX = targetCard.offsetLeft + targetCard.offsetWidth / 2;
        isAfter = mouseX > cardCenterX;
      } else {
        const gridRect = targetGrid.getBoundingClientRect();
        const mouseX = e.clientX - gridRect.left;
        const mouseY = e.clientY - gridRect.top;
        
        const closestResult = getClosestCardStable(targetGrid, mouseX, mouseY);
        targetCard = closestResult.card;
        isAfter = closestResult.isAfter;
      }
      
      if (targetCard) {
        const referenceNode = isAfter ? targetCard.nextSibling : targetCard;
        if (draggedCard !== referenceNode && draggedCard.nextSibling !== referenceNode) {
          animateLayoutShift(() => {
            targetGrid.insertBefore(draggedCard, referenceNode);
          });
        }
      } else {
        const addCard = targetGrid.querySelector('.add-bookmark-card');
        if (addCard) {
          if (draggedCard.nextSibling !== addCard) {
            animateLayoutShift(() => {
              targetGrid.insertBefore(draggedCard, addCard);
            });
          }
        } else {
          if (draggedCard.parentElement !== targetGrid || draggedCard.nextSibling !== null) {
            animateLayoutShift(() => {
              targetGrid.appendChild(draggedCard);
            });
          }
        }
      }
    }
  });
}

function saveDraggedOrder() {
  const newBookmarks = [];
  const catElements = document.querySelectorAll('.bookmarks-category');
  
  catElements.forEach(catEl => {
    const catId = catEl.getAttribute('data-cat-id');
    const originalCat = state.bookmarks.find(c => c.id === catId);
    if (!originalCat) return;
    
    const newItems = [];
    const cardElements = catEl.querySelectorAll('.bookmark-card:not(.add-bookmark-card)');
    
    cardElements.forEach(cardEl => {
      const bmId = cardEl.getAttribute('data-bm-id');
      let foundLink = null;
      for (const cat of state.bookmarks) {
        const item = cat.items.find(i => i.id === bmId);
        if (item) {
          foundLink = item;
          break;
        }
      }
      
      if (foundLink) {
        newItems.push(foundLink);
      }
    });
    
    newBookmarks.push({
      ...originalCat,
      items: newItems
    });
  });
  
  state.bookmarks = newBookmarks;
  saveBookmarksState();
}

function sortCategoryAlphabetically(catId) {
  const cat = state.bookmarks.find(c => c.id === catId);
  if (cat) {
    cat.items.sort((a, b) => a.title.localeCompare(b.title, 'nl', { sensitivity: 'base' }));
    saveBookmarksState();
    renderBookmarks();
  }
}
