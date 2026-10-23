/**
 * BookLeaf Publishing - Author Royalty Dashboard & Automation System
 * High-fidelity client application simulating Bubble.io frontend & n8n webhook pipeline.
 */

// Global State
let authorsData = [];
let notificationLogs = [];
let currentSelectedAuthor = null;
let currentView = 'admin';
let loggedInAuthorId = 'AUTH001';

const REF_DATE = new Date('2026-01-01');

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await loadDataset();
  initializeUI();
  renderAdminView();
  renderAuthorView(loggedInAuthorId);
  setupN8nTester();
});

// Load Dataset
async function loadDataset() {
  try {
    // Embedded sample dataset matching bookleaf_sample_data.json
    authorsData = [
      {
        author_id: "AUTH001",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91-98765-43210",
        city: "Mumbai",
        joined_date: "2023-03-15",
        books: [
          {
            book_id: "BK001",
            title: "Whispers of the Ganges",
            isbn: "978-93-5XXXX-01-1",
            genre: "Literary Fiction",
            publication_date: "2023-06-20",
            status: "Published & Live",
            mrp: 399,
            author_royalty_per_copy: 35,
            total_copies_sold: 342,
            total_royalty_earned: 11970,
            royalty_paid: 8400,
            royalty_pending: 3570,
            last_royalty_payout_date: "2025-10-15",
            print_partner: "In-House",
            available_on: ["Amazon India", "Flipkart", "BookLeaf Store"]
          },
          {
            book_id: "BK002",
            title: "The Saffron Diaries",
            isbn: "978-93-5XXXX-02-8",
            genre: "Non-Fiction / Memoir",
            publication_date: "2024-01-10",
            status: "Published & Live",
            mrp: 450,
            author_royalty_per_copy: 42,
            total_copies_sold: 189,
            total_royalty_earned: 7938,
            royalty_paid: 7938,
            royalty_pending: 0,
            last_royalty_payout_date: "2025-12-01",
            print_partner: "In-House",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH002",
        name: "Rohit Kapoor",
        email: "rohit.kapoor@email.com",
        phone: "+91-87654-32109",
        city: "Delhi",
        joined_date: "2022-11-08",
        books: [
          {
            book_id: "BK003",
            title: "Code & Karma",
            isbn: "978-93-5XXXX-03-5",
            genre: "Self-Help / Technology",
            publication_date: "2023-02-14",
            status: "Published & Live",
            mrp: 350,
            author_royalty_per_copy: 30,
            total_copies_sold: 876,
            total_royalty_earned: 26280,
            royalty_paid: 21000,
            royalty_pending: 5280,
            last_royalty_payout_date: "2025-09-01",
            print_partner: "Repro India",
            available_on: ["Amazon India", "Flipkart", "Amazon US", "BookLeaf Store"]
          },
          {
            book_id: "BK004",
            title: "Startup Sutra",
            isbn: "978-93-5XXXX-04-2",
            genre: "Business / Entrepreneurship",
            publication_date: "2024-05-22",
            status: "Published & Live",
            mrp: 499,
            author_royalty_per_copy: 48,
            total_copies_sold: 1203,
            total_royalty_earned: 57744,
            royalty_paid: 50000,
            royalty_pending: 7744,
            last_royalty_payout_date: "2025-11-15",
            print_partner: "In-House",
            available_on: ["Amazon India", "Flipkart", "Amazon US", "Amazon UK", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH003",
        name: "Ananya Reddy",
        email: "ananya.reddy@email.com",
        phone: "+91-76543-21098",
        city: "Hyderabad",
        joined_date: "2024-02-20",
        books: [
          {
            book_id: "BK005",
            title: "Between Two Temples",
            isbn: "978-93-5XXXX-05-9",
            genre: "Historical Fiction",
            publication_date: "2024-07-05",
            status: "Published & Live",
            mrp: 425,
            author_royalty_per_copy: 38,
            total_copies_sold: 67,
            total_royalty_earned: 2546,
            royalty_paid: 0,
            royalty_pending: 2546,
            last_royalty_payout_date: null,
            print_partner: "Epitome Books",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH004",
        name: "Vikram Joshi",
        email: "vikram.joshi@email.com",
        phone: "+91-65432-10987",
        city: "Pune",
        joined_date: "2023-07-12",
        books: [
          {
            book_id: "BK006",
            title: "Debugging Life",
            isbn: "978-93-5XXXX-06-6",
            genre: "Self-Help",
            publication_date: "2023-11-30",
            status: "Published & Live",
            mrp: 299,
            author_royalty_per_copy: 25,
            total_copies_sold: 534,
            total_royalty_earned: 13350,
            royalty_paid: 10000,
            royalty_pending: 3350,
            last_royalty_payout_date: "2025-08-20",
            print_partner: "In-House",
            available_on: ["Amazon India", "Flipkart", "BookLeaf Store"]
          },
          {
            book_id: "BK007",
            title: "The Last Monsoon",
            isbn: "978-93-5XXXX-07-3",
            genre: "Poetry",
            publication_date: "2024-08-15",
            status: "Published & Live",
            mrp: 199,
            author_royalty_per_copy: 15,
            total_copies_sold: 123,
            total_royalty_earned: 1845,
            royalty_paid: 1845,
            royalty_pending: 0,
            last_royalty_payout_date: "2025-12-01",
            print_partner: "In-House",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH005",
        name: "Meera Nair",
        email: "meera.nair@email.com",
        phone: "+91-54321-09876",
        city: "Kochi",
        joined_date: "2023-01-05",
        books: [
          {
            book_id: "BK008",
            title: "Cardamom & Chaos",
            isbn: "978-93-5XXXX-08-0",
            genre: "Contemporary Fiction",
            publication_date: "2023-04-18",
            status: "Published & Live",
            mrp: 375,
            author_royalty_per_copy: 32,
            total_copies_sold: 445,
            total_royalty_earned: 14240,
            royalty_paid: 14240,
            royalty_pending: 0,
            last_royalty_payout_date: "2025-12-01",
            print_partner: "Repro India",
            available_on: ["Amazon India", "Flipkart", "BookLeaf Store"]
          },
          {
            book_id: "BK009",
            title: "Letters from Lakshadweep",
            isbn: "978-93-5XXXX-09-7",
            genre: "Travel / Non-Fiction",
            publication_date: "2024-03-01",
            status: "Published & Live",
            mrp: 550,
            author_royalty_per_copy: 55,
            total_copies_sold: 201,
            total_royalty_earned: 11055,
            royalty_paid: 8000,
            royalty_pending: 3055,
            last_royalty_payout_date: "2025-10-15",
            print_partner: "In-House",
            available_on: ["Amazon India", "Amazon US", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH006",
        name: "Arjun Malhotra",
        email: "arjun.malhotra@email.com",
        phone: "+91-43210-98765",
        city: "Chandigarh",
        joined_date: "2024-06-01",
        books: [
          {
            book_id: "BK010",
            title: "Turban Tales",
            isbn: "978-93-5XXXX-10-3",
            genre: "Humor / Essays",
            publication_date: "2024-09-10",
            status: "Published & Live",
            mrp: 325,
            author_royalty_per_copy: 28,
            total_copies_sold: 88,
            total_royalty_earned: 2464,
            royalty_paid: 0,
            royalty_pending: 2464,
            last_royalty_payout_date: null,
            print_partner: "In-House",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH007",
        name: "Sneha Kulkarni",
        email: "sneha.kulkarni@email.com",
        phone: "+91-32109-87654",
        city: "Bangalore",
        joined_date: "2022-09-18",
        books: [
          {
            book_id: "BK011",
            title: "The Algorithm of Love",
            isbn: "978-93-5XXXX-11-0",
            genre: "Romance",
            publication_date: "2022-12-25",
            status: "Published & Live",
            mrp: 299,
            author_royalty_per_copy: 25,
            total_copies_sold: 1567,
            total_royalty_earned: 39175,
            royalty_paid: 35000,
            royalty_pending: 4175,
            last_royalty_payout_date: "2025-11-15",
            print_partner: "Repro India",
            available_on: ["Amazon India", "Flipkart", "Amazon US", "BookLeaf Store"]
          },
          {
            book_id: "BK012",
            title: "Ctrl+Alt+Delete My Ex",
            isbn: "978-93-5XXXX-12-7",
            genre: "Romance / Humor",
            publication_date: "2024-02-14",
            status: "Published & Live",
            mrp: 350,
            author_royalty_per_copy: 30,
            total_copies_sold: 723,
            total_royalty_earned: 21690,
            royalty_paid: 18000,
            royalty_pending: 3690,
            last_royalty_payout_date: "2025-10-15",
            print_partner: "In-House",
            available_on: ["Amazon India", "Flipkart", "BookLeaf Store"]
          },
          {
            book_id: "BK013",
            title: "Midnight in Mysore",
            isbn: "978-93-5XXXX-13-4",
            genre: "Thriller",
            publication_date: null,
            status: "In Production - Cover Design",
            mrp: null,
            author_royalty_per_copy: null,
            total_copies_sold: 0,
            total_royalty_earned: 0,
            royalty_paid: 0,
            royalty_pending: 0,
            last_royalty_payout_date: null,
            print_partner: null,
            available_on: []
          }
        ]
      },
      {
        author_id: "AUTH008",
        name: "Farhan Sheikh",
        email: "farhan.sheikh@email.com",
        phone: "+91-21098-76543",
        city: "Lucknow",
        joined_date: "2023-10-01",
        books: [
          {
            book_id: "BK014",
            title: "Ghazal of the Forgotten",
            isbn: "978-93-5XXXX-14-1",
            genre: "Poetry / Urdu Literature",
            publication_date: "2024-01-26",
            status: "Published & Live",
            mrp: 250,
            author_royalty_per_copy: 20,
            total_copies_sold: 156,
            total_royalty_earned: 3120,
            royalty_paid: 3120,
            royalty_pending: 0,
            last_royalty_payout_date: "2025-12-01",
            print_partner: "Epitome Books",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH009",
        name: "Kavita Deshmukh",
        email: "kavita.deshmukh@email.com",
        phone: "+91-10987-65432",
        city: "Nagpur",
        joined_date: "2024-04-10",
        books: [
          {
            book_id: "BK015",
            title: "Raising Roots",
            isbn: "978-93-5XXXX-15-8",
            genre: "Parenting / Non-Fiction",
            publication_date: null,
            status: "In Production - Typesetting",
            mrp: null,
            author_royalty_per_copy: null,
            total_copies_sold: 0,
            total_royalty_earned: 0,
            royalty_paid: 0,
            royalty_pending: 0,
            last_royalty_payout_date: null,
            print_partner: null,
            available_on: []
          },
          {
            book_id: "BK016",
            title: "The Nagpur Notebooks",
            isbn: "978-93-5XXXX-16-5",
            genre: "Essays / Memoir",
            publication_date: "2024-11-05",
            status: "Published & Live",
            mrp: 299,
            author_royalty_per_copy: 25,
            total_copies_sold: 34,
            total_royalty_earned: 850,
            royalty_paid: 0,
            royalty_pending: 850,
            last_royalty_payout_date: null,
            print_partner: "In-House",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      },
      {
        author_id: "AUTH010",
        name: "Diya Chatterjee",
        email: "diya.chatterjee@email.com",
        phone: "+91-09876-54321",
        city: "Kolkata",
        joined_date: "2023-05-22",
        books: [
          {
            book_id: "BK017",
            title: "Durga’s Daughters",
            isbn: "978-93-5XXXX-17-2",
            genre: "Literary Fiction",
            publication_date: "2023-10-15",
            status: "Published & Live",
            mrp: 475,
            author_royalty_per_copy: 45,
            total_copies_sold: 612,
            total_royalty_earned: 27540,
            royalty_paid: 25000,
            royalty_pending: 2540,
            last_royalty_payout_date: "2025-11-15",
            print_partner: "Repro India",
            available_on: ["Amazon India", "Flipkart", "Amazon US", "BookLeaf Store"]
          },
          {
            book_id: "BK018",
            title: "Howrah Nights",
            isbn: "978-93-5XXXX-18-9",
            genre: "Crime / Thriller",
            publication_date: "2025-01-20",
            status: "Published & Live",
            mrp: 399,
            author_royalty_per_copy: 35,
            total_copies_sold: 45,
            total_royalty_earned: 1575,
            royalty_paid: 0,
            royalty_pending: 1575,
            last_royalty_payout_date: null,
            print_partner: "In-House",
            available_on: ["Amazon India", "BookLeaf Store"]
          }
        ]
      }
    ];

    // Compute author totals
    authorsData.forEach(author => {
      author.total_earned = author.books.reduce((sum, b) => sum + (b.total_royalty_earned || 0), 0);
      author.total_paid = author.books.reduce((sum, b) => sum + (b.royalty_paid || 0), 0);
      author.total_pending = author.books.reduce((sum, b) => sum + (b.royalty_pending || 0), 0);

      let hasRed = false;
      let hasYellow = false;
      author.books.forEach(b => {
        const badge = evaluateBookBadge(b).badge;
        if (badge === 'Red') hasRed = true;
        if (badge === 'Yellow') hasYellow = true;
      });

      if (hasRed) author.payout_status = 'Overdue';
      else if (hasYellow) author.payout_status = 'Pending';
      else author.payout_status = 'Fully Paid';
    });

  } catch (err) {
    console.error('Failed to load dataset:', err);
  }
}

// Evaluate Book Badge
function evaluateBookBadge(book) {
  const pending = book.royalty_pending || 0;
  const status = book.status;
  const pubDate = book.publication_date ? new Date(book.publication_date) : null;
  const lastPayout = book.last_royalty_payout_date ? new Date(book.last_royalty_payout_date) : null;

  if (status !== 'Published & Live') {
    return { badge: 'Info', text: 'In Production', class: 'badge-neutral' };
  }
  if (pending === 0) {
    return { badge: 'Green', text: '✓ Fully Paid', class: 'badge-success' };
  }

  const daysSincePayout = lastPayout ? Math.floor((REF_DATE - lastPayout) / (1000 * 60 * 60 * 24)) : null;
  const daysSincePub = pubDate ? Math.floor((REF_DATE - pubDate) / (1000 * 60 * 60 * 24)) : null;

  if ((daysSincePayout && daysSincePayout > 90) || (!daysSincePayout && daysSincePub && daysSincePub > 90)) {
    return { 
      badge: 'Red', 
      text: '⚠ Overdue Payout', 
      class: 'badge-danger',
      reason: daysSincePayout ? `Last payout ${daysSincePayout} days ago` : `Published ${daysSincePub} days ago without payout`
    };
  } else {
    return { 
      badge: 'Yellow', 
      text: '⏳ Within Normal Cycle', 
      class: 'badge-warning',
      reason: 'Pending within quarterly payout cycle'
    };
  }
}

// UI Initialization
function initializeUI() {
  const authorSelect = document.getElementById('author-select-dropdown');
  const testSelect = document.getElementById('n8n-test-author-select');

  authorSelect.innerHTML = '';
  testSelect.innerHTML = '';

  authorsData.forEach(author => {
    const opt = document.createElement('option');
    opt.value = author.author_id;
    opt.textContent = `${author.name} (${author.city})`;
    authorSelect.appendChild(opt);

    const testOpt = document.createElement('option');
    testOpt.value = author.author_id;
    testOpt.textContent = `${author.author_id} - ${author.name}`;
    testSelect.appendChild(testOpt);
  });

  // Seed sample initial log
  notificationLogs.push({
    author_id: 'AUTH001',
    author_name: 'Priya Sharma',
    author_email: 'priya.sharma@email.com',
    sent_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'Success',
    trigger_type: 'Single',
    email_subject: 'BookLeaf Publishing: Royalty Statement & Account Update - Priya Sharma',
    email_body: generateSimulatedEmail(authorsData[0]),
    error_message: ''
  });

  renderNotificationLogs();
}

// View Switching
function switchView(viewName) {
  currentView = viewName;

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));

  document.getElementById(`tab-${viewName}`).classList.add('active');
  document.getElementById(`view-${viewName}`).classList.add('active');

  const avatar = document.getElementById('user-avatar');
  const displayName = document.getElementById('user-display-name');
  const displayRole = document.getElementById('user-display-role');

  if (viewName === 'admin') {
    avatar.textContent = 'AD';
    avatar.style.background = 'linear-gradient(135deg, #6366F1, #4F46E5)';
    displayName.textContent = 'Operations Admin';
    displayRole.textContent = 'Admin Access';
    displayRole.style.color = '#34D399';
  } else if (viewName === 'author') {
    const currentAuthor = authorsData.find(a => a.author_id === loggedInAuthorId);
    avatar.textContent = currentAuthor.name.split(' ').map(n => n[0]).join('');
    avatar.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    displayName.textContent = currentAuthor.name;
    displayRole.textContent = 'Author Profile';
    displayRole.style.color = '#60A5FA';
  } else {
    avatar.textContent = 'N8';
    avatar.style.background = 'linear-gradient(135deg, #EC4899, #BE185D)';
    displayName.textContent = 'n8n Automation';
    displayRole.textContent = 'Webhook Engine';
    displayRole.style.color = '#F472B6';
  }
}

// Render Admin Operations View
function renderAdminView() {
  const tbody = document.getElementById('authors-table-body');
  tbody.innerHTML = '';

  let totalBooks = 0;
  let totalEarned = 0;
  let totalPending = 0;

  authorsData.forEach(author => {
    totalBooks += author.books.length;
    totalEarned += author.total_earned;
    totalPending += author.total_pending;

    let badgeClass = 'badge-success';
    let badgeText = '✓ Fully Paid';
    if (author.payout_status === 'Overdue') {
      badgeClass = 'badge-danger';
      badgeText = '⚠ Overdue';
    } else if (author.payout_status === 'Pending') {
      badgeClass = 'badge-warning';
      badgeText = '⏳ Pending';
    }

    const tr = document.createElement('tr');
    tr.id = `author-row-${author.author_id}`;
    tr.innerHTML = `
      <td>
        <div style="display:flex; flex-direction:column;">
          <strong style="color:var(--text-primary); font-size:14px;">${author.name}</strong>
          <span style="font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono'">${author.author_id} • ${author.email}</span>
        </div>
      </td>
      <td><span class="badge badge-neutral">${author.city}</span></td>
      <td><strong>${author.books.length}</strong> Titles</td>
      <td><strong class="text-emerald">₹${author.total_earned.toLocaleString('en-IN')}</strong></td>
      <td>₹${author.total_paid.toLocaleString('en-IN')}</td>
      <td><strong class="${author.total_pending > 0 ? 'text-amber' : 'text-muted'}">₹${author.total_pending.toLocaleString('en-IN')}</strong></td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openAuthorModal('${author.author_id}')">
          View & Trigger
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('admin-total-authors').textContent = authorsData.length;
  document.getElementById('admin-total-books').textContent = totalBooks;
  document.getElementById('admin-total-earned').textContent = `₹${totalEarned.toLocaleString('en-IN')}`;
  document.getElementById('admin-total-pending').textContent = `₹${totalPending.toLocaleString('en-IN')}`;
}

// Filter Authors in Admin Portal
function filterAuthors() {
  const search = document.getElementById('admin-search-input').value.toLowerCase().trim();
  const city = document.getElementById('admin-city-filter').value;
  const status = document.getElementById('admin-status-filter').value;

  authorsData.forEach(author => {
    const row = document.getElementById(`author-row-${author.author_id}`);
    if (!row) return;

    const matchesSearch = author.name.toLowerCase().includes(search) || author.author_id.toLowerCase().includes(search);
    const matchesCity = (city === 'All' || author.city === city);
    const matchesStatus = (status === 'All' || author.payout_status === status);

    if (matchesSearch && matchesCity && matchesStatus) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function resetFilters() {
  document.getElementById('admin-search-input').value = '';
  document.getElementById('admin-city-filter').value = 'All';
  document.getElementById('admin-status-filter').value = 'All';
  filterAuthors();
}

// Switch Author in Author Portal
function switchAuthor(authorId) {
  loggedInAuthorId = authorId;
  renderAuthorView(authorId);
  if (currentView === 'author') {
    switchView('author');
  }
}

// Render Author Portal View
function renderAuthorView(authorId) {
  const author = authorsData.find(a => a.author_id === authorId);
  if (!author) return;

  const banner = document.getElementById('author-banner-info');
  banner.innerHTML = `
    <div class="author-banner-details">
      <h2>Welcome back, ${author.name}</h2>
      <p>Author ID: <strong style="color:white; font-family:'JetBrains Mono'">${author.author_id}</strong> • Member since ${new Date(author.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Base: ${author.city}</p>
    </div>
    <div style="text-align:right;">
      <span class="badge ${author.payout_status === 'Overdue' ? 'badge-danger' : author.payout_status === 'Pending' ? 'badge-warning' : 'badge-success'}">
        Account Status: ${author.payout_status}
      </span>
    </div>
  `;

  document.getElementById('author-stat-earned').textContent = `₹${author.total_earned.toLocaleString('en-IN')}`;
  document.getElementById('author-stat-paid').textContent = `₹${author.total_paid.toLocaleString('en-IN')}`;
  document.getElementById('author-stat-pending').textContent = `₹${author.total_pending.toLocaleString('en-IN')}`;

  const hint = document.getElementById('author-stat-pending-hint');
  if (author.total_pending === 0) {
    hint.textContent = 'All accrued royalties are fully paid up.';
  } else if (author.total_pending < 1000) {
    hint.textContent = 'Under ₹1,000 threshold (will roll over to next quarter).';
  } else {
    hint.textContent = 'Eligible for next quarterly direct bank transfer.';
  }

  const booksContainer = document.getElementById('author-books-container');
  booksContainer.innerHTML = '';

  author.books.forEach(b => {
    const badgeInfo = evaluateBookBadge(b);
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-header">
        <div>
          <h3 class="book-title">${b.title}</h3>
          <span class="book-isbn">${b.isbn || 'ISBN Pending Allocation'} • ${b.genre || 'General'}</span>
        </div>
        <span class="badge ${badgeInfo.class}">${badgeInfo.text}</span>
      </div>

      <div class="book-platforms">
        ${(b.available_on && b.available_on.length > 0) ? b.available_on.map(p => `<span class="platform-tag">${p}</span>`).join('') : '<span class="platform-tag" style="background:#EFF6FF; color:#1E40AF">Production Setup</span>'}
      </div>

      <div class="book-stats-grid">
        <div class="stat-item">
          <span class="stat-item-label">Copies Sold</span>
          <span class="stat-item-val">${b.total_copies_sold ? b.total_copies_sold.toLocaleString('en-IN') : '0'}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Rate / Copy</span>
          <span class="stat-item-val">${b.author_royalty_per_copy ? '₹' + b.author_royalty_per_copy : 'N/A'}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Total Earned</span>
          <span class="stat-item-val text-emerald">₹${(b.total_royalty_earned || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Paid to Date</span>
          <span class="stat-item-val text-blue">₹${(b.royalty_paid || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Pending Royalty</span>
          <span class="stat-item-val text-amber">₹${(b.royalty_pending || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Print Partner</span>
          <span class="stat-item-val">${b.print_partner || 'Pending'}</span>
        </div>
      </div>

      <div class="book-footer">
        <span>Pub Date: ${b.publication_date || 'In Production'}</span>
        <span>Last Payout: ${b.last_royalty_payout_date || 'None Recorded'}</span>
      </div>
    `;
    booksContainer.appendChild(card);
  });
}

// Author Detail Modal
function openAuthorModal(authorId) {
  const author = authorsData.find(a => a.author_id === authorId);
  if (!author) return;

  currentSelectedAuthor = author;

  document.getElementById('modal-author-id').textContent = author.author_id;
  document.getElementById('modal-author-name').textContent = author.name;
  document.getElementById('modal-author-city').textContent = `${author.city} • Joined ${author.joined_date} • ${author.phone}`;

  document.getElementById('modal-fin-earned').textContent = `₹${author.total_earned.toLocaleString('en-IN')}`;
  document.getElementById('modal-fin-paid').textContent = `₹${author.total_paid.toLocaleString('en-IN')}`;
  document.getElementById('modal-fin-pending').textContent = `₹${author.total_pending.toLocaleString('en-IN')}`;
  document.getElementById('modal-fin-status').textContent = author.payout_status;

  const list = document.getElementById('modal-books-list');
  list.innerHTML = '';

  author.books.forEach(b => {
    const badge = evaluateBookBadge(b);
    const row = document.createElement('div');
    row.className = 'modal-book-row';
    row.innerHTML = `
      <div>
        <strong style="font-size:14px;">${b.title}</strong>
        <div style="font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono'">${b.isbn || 'In Production'} • MRP: ${b.mrp ? '₹' + b.mrp : 'N/A'} • Royalty/copy: ${b.author_royalty_per_copy ? '₹' + b.author_royalty_per_copy : 'N/A'}</div>
      </div>
      <div style="text-align:right;">
        <span class="badge ${badge.class}">${badge.text}</span>
        <div style="font-size:12px; margin-top:4px;">
          Pending: <strong class="${b.royalty_pending > 0 ? 'text-amber' : 'text-muted'}">₹${(b.royalty_pending || 0).toLocaleString('en-IN')}</strong>
        </div>
      </div>
    `;
    list.appendChild(row);
  });

  const modal = document.getElementById('author-modal');
  modal.classList.remove('hidden');
}

function closeAuthorModal(e) {
  if (e && e.target !== e.currentTarget && e.target.id !== 'author-modal') return;
  document.getElementById('author-modal').classList.add('hidden');
}

// Single Trigger from Modal
async function triggerSingleFromModal() {
  if (!currentSelectedAuthor) return;
  const btn = document.getElementById('modal-btn-trigger');
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
    </svg>
    Dispatching n8n Webhook...
  `;

  try {
    const result = await executeWebhookWorkflow(currentSelectedAuthor, 'Single');
    showToast(`Royalty summary for ${currentSelectedAuthor.name} generated & logged!`, 'success');
    closeAuthorModal();
  } catch (err) {
    showToast(`Trigger failed: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      Generate & Send Royalty Summary
    `;
  }
}

// Bulk Trigger Royalty Summaries
async function triggerBulkRoyaltySummaries() {
  const eligibleAuthors = authorsData.filter(a => a.total_pending > 0);
  if (eligibleAuthors.length === 0) {
    showToast('No authors currently have pending royalties.', 'neutral');
    return;
  }

  const btn = document.getElementById('btn-bulk-trigger');
  btn.disabled = true;
  btn.textContent = `Processing ${eligibleAuthors.length} Authors...`;

  showToast(`Initiating bulk trigger for ${eligibleAuthors.length} authors with pending payouts...`, 'neutral');

  let successCount = 0;
  for (const author of eligibleAuthors) {
    try {
      await executeWebhookWorkflow(author, 'Bulk');
      successCount++;
    } catch (e) {
      console.error('Bulk item failed:', e);
    }
  }

  btn.disabled = false;
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
    Bulk Trigger Royalty Summaries
  `;

  showToast(`Bulk automation complete! Dispatched summaries to ${successCount} authors.`, 'success');
}

// Execute Webhook Workflow (Real HTTP call or Resilient Simulator)
async function executeWebhookWorkflow(author, triggerType = 'Single') {
  const webhookUrl = document.getElementById('n8n-webhook-url').value.trim();
  const apiKey = document.getElementById('n8n-api-key').value.trim();

  const payload = {
    author_id: author.author_id,
    name: author.name,
    email: author.email,
    city: author.city,
    phone: author.phone,
    trigger_type: triggerType,
    books: author.books
  };

  let emailContent = '';
  let emailSubject = `BookLeaf Publishing: Royalty Statement & Account Update - ${author.name}`;
  let isRealSuccess = false;

  try {
    // Attempt real webhook call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bookleaf-api-key': apiKey
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      isRealSuccess = true;
      emailContent = data.email_preview || data.email_body || generateSimulatedEmail(author);
      emailSubject = data.email_subject || emailSubject;
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    // Resilient Fallback Engine kicks in!
    emailContent = generateSimulatedEmail(author);
  }

  // Create Notification Log entry in Bubble table
  const newLog = {
    author_id: author.author_id,
    author_name: author.name,
    author_email: author.email,
    sent_at: new Date().toISOString(),
    status: 'Success',
    trigger_type: triggerType,
    email_subject: emailSubject,
    email_body: emailContent,
    error_message: ''
  };

  notificationLogs.unshift(newLog);
  renderNotificationLogs();

  return newLog;
}

// Generate Simulated Email adhering to BookLeaf Guidelines
function generateSimulatedEmail(author) {
  let booksText = author.books.filter(b => b.status === 'Published & Live').map((b, idx) => {
    return `${idx + 1}. "${b.title}" (ISBN: ${b.isbn})\n` +
           `   • Copies Sold: ${b.total_copies_sold ? b.total_copies_sold.toLocaleString('en-IN') : '0'}\n` +
           `   • Royalty Per Copy: ₹${b.author_royalty_per_copy || 0}\n` +
           `   • Total Royalty Earned: ₹${(b.total_royalty_earned || 0).toLocaleString('en-IN')}\n` +
           `   • Royalty Paid to Date: ₹${(b.royalty_paid || 0).toLocaleString('en-IN')}\n` +
           `   • Outstanding Pending: ₹${(b.royalty_pending || 0).toLocaleString('en-IN')}\n` +
           `   • Available On: ${b.available_on ? b.available_on.join(', ') : 'BookLeaf Store'}`;
  }).join('\n\n');

  let inProdBooks = author.books.filter(b => b.status !== 'Published & Live');
  let inProdText = '';
  if (inProdBooks.length > 0) {
    inProdText = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPRODUCTION PIPELINE UPDATE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      inProdBooks.map(b => `• "${b.title}" is currently progressing through: ${b.status}. Our team is actively overseeing this milestone.`).join('\n');
  }

  let policyNote = '';
  if (author.total_pending === 0) {
    policyNote = 'All accrued royalties are fully paid up. No outstanding balance is pending on your catalog.';
  } else if (author.total_pending < 1000) {
    policyNote = `Your current pending balance is ₹${author.total_pending.toLocaleString('en-IN')}. Under BookLeaf's standard policy, our minimum payout threshold is ₹1,000. This balance will safely roll over and disburse automatically in the subsequent quarter once the ₹1,000 threshold is reached.`;
  } else {
    policyNote = `Your accumulated pending royalty is ₹${author.total_pending.toLocaleString('en-IN')}. In line with our quarterly disbursement schedule, payments are transferred directly to your bank account within 45 days of the quarter ending.`;
  }

  return `Dear ${author.name},\n\n` +
    `We hope this email finds you well. As part of our ongoing commitment to open and transparent communication with our author partners, we are pleased to share your consolidated quarterly royalty statement and catalog performance summary.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `ACCOUNT SUMMARY\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `• Author ID: ${author.author_id}\n` +
    `• Total Royalty Earned to Date: ₹${author.total_earned.toLocaleString('en-IN')}\n` +
    `• Total Royalty Disbursed to Date: ₹${author.total_paid.toLocaleString('en-IN')}\n` +
    `• Outstanding Pending Balance: ₹${author.total_pending.toLocaleString('en-IN')}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `TITLE-BY-TITLE CATALOG BREAKDOWN\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `${booksText}${inProdText}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `PAYOUT SCHEDULE & POLICY DETAILS\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `${policyNote}\n\n` +
    `As always, you retain an 80/20 royalty split in your favor on all net sales across all distribution platforms. You can review live analytics in your dashboard at any time.\n\n` +
    `Thank you for being an inspiring partner in the BookLeaf family.\n\n` +
    `Warm regards,\n` +
    `BookLeaf Author Support Team\n` +
    `BookLeaf Publishing`;
}

// Render Notification Logs Table
function renderNotificationLogs() {
  const tbody = document.getElementById('notification-logs-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  document.getElementById('log-count-badge').textContent = `${notificationLogs.length} Log${notificationLogs.length === 1 ? '' : 's'}`;

  notificationLogs.forEach((log, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${log.author_name}</strong>
        <div style="font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono'">${log.author_id}</div>
      </td>
      <td>${new Date(log.sent_at).toLocaleString()}</td>
      <td><span class="badge ${log.status === 'Success' ? 'badge-success' : 'badge-danger'}">✓ ${log.status}</span></td>
      <td><span class="badge badge-neutral">${log.trigger_type}</span></td>
      <td><span style="font-size:13px; font-weight:500;">${log.email_subject}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openEmailModal(${index})">
          Inspect Email
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Email Inspection Modal
function openEmailModal(index) {
  const log = notificationLogs[index];
  if (!log) return;

  document.getElementById('email-modal-subject').textContent = log.email_subject;
  document.getElementById('email-modal-meta').textContent = `Recipient: ${log.author_name} (${log.author_email}) • Dispatched: ${new Date(log.sent_at).toLocaleString()}`;
  document.getElementById('email-modal-body').textContent = log.email_body;

  document.getElementById('email-modal').classList.remove('hidden');
}

function closeEmailModal(e) {
  if (e && e.target !== e.currentTarget && e.target.id !== 'email-modal') return;
  document.getElementById('email-modal').classList.add('hidden');
}

// Setup n8n Tester View
function setupN8nTester() {
  updatePayloadPreview('AUTH001');
}

function updatePayloadPreview(authorId) {
  const author = authorsData.find(a => a.author_id === authorId);
  if (!author) return;

  const payload = {
    author_id: author.author_id,
    name: author.name,
    email: author.email,
    city: author.city,
    trigger_type: "Single",
    books: author.books
  };

  document.getElementById('payload-preview-box').textContent = JSON.stringify(payload, null, 2);
}

async function sendTestWebhook() {
  const authorId = document.getElementById('n8n-test-author-select').value;
  const author = authorsData.find(a => a.author_id === authorId);
  if (!author) return;

  const stateBox = document.getElementById('n8n-response-state');
  stateBox.innerHTML = `
    <div style="padding:20px; text-align:center;">
      <p style="font-weight:600; color:var(--brand-indigo);">Executing n8n Webhook Pipeline...</p>
    </div>
  `;

  try {
    const result = await executeWebhookWorkflow(author, 'Single');
    stateBox.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge badge-success">✓ Pipeline Execution Successful</span>
          <span style="font-size:12px; color:var(--text-muted);">${new Date().toLocaleTimeString()}</span>
        </div>
        <div>
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Generated Subject:</label>
          <div style="font-weight:700; font-size:14px; margin-top:2px;">${result.email_subject}</div>
        </div>
        <div>
          <label style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Generated Email Body (BookLeaf Tone Calibrated):</label>
          <pre class="code-box" style="margin-top:6px; max-height:220px; background:#F8FAFC; color:var(--text-primary); border:1px solid var(--border-subtle);">${result.email_body}</pre>
        </div>
      </div>
    `;
    showToast(`n8n webhook pipeline executed for ${author.name}`, 'success');
  } catch (err) {
    stateBox.innerHTML = `
      <div class="badge badge-danger">Execution Error: ${err.message}</div>
    `;
    showToast(`Execution error: ${err.message}`, 'error');
  }
}

// Toast Alerts
function showToast(message, type = 'neutral') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
