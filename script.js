/* ============================================================
   JobSeeker — Main JavaScript
   ============================================================ */

/* ---------- Data ---------- */
const JOBS_DATA = [
  { title: 'Software Developer',          company: 'Tech Innovators',       location: 'Bangalore, India',  salary: '₹8,00,000/yr',  type: 'Full-Time' },
  { title: 'Digital Marketing Specialist',company: 'Growth Hub',            location: 'Mumbai, India',     salary: '₹6,00,000/yr',  type: 'Full-Time' },
  { title: 'UI/UX Designer',              company: 'Creative Minds',        location: 'Remote',            salary: '₹5,50,000/yr',  type: 'Full-Time' },
  { title: 'Data Analyst',               company: 'Data Insights Pvt Ltd', location: 'Delhi, India',      salary: '₹7,50,000/yr',  type: 'Full-Time' },
  { title: 'Customer Support Executive', company: 'CallPro Services',       location: 'Hyderabad, India',  salary: '₹3,00,000/yr',  type: 'Full-Time' },
  { title: 'Content Writer',             company: 'MediaWorks Ltd',         location: 'Remote',            salary: '₹4,50,000/yr',  type: 'Part-Time' },
  { title: 'Sales Executive',            company: 'Global Traders',         location: 'Chennai, India',    salary: '₹5,00,000/yr',  type: 'Full-Time' },
  { title: 'Graphic Designer',           company: 'Design Studio',          location: 'Remote',            salary: '₹4,80,000/yr',  type: 'Full-Time' },
  { title: 'Network Engineer',           company: 'IT Solutions Inc.',      location: 'Pune, India',       salary: '₹9,00,000/yr',  type: 'Full-Time' },
  { title: 'HR Manager',                 company: 'PeopleFirst Corp.',      location: 'Kolkata, India',    salary: '₹7,00,000/yr',  type: 'Full-Time' },
];

const USERS = [
  {
    email: 'ronitguleria5@gmail.com', password: 'ronit123',
    name: 'Ronit Guleria', phone: '+91 9876543210',
    address: '123 Main Street, Ludhiana, Punjab',
    skills: 'JavaScript, Python, React',
    experience: '5 years as a Backend Developer',
    photo: './ronit.jpg'
  },
  {
    email: 'ankitbalouria@gmail.com', password: 'ankit123',
    name: 'Ankit Balouria', phone: '+91 6230553026',
    address: '456 Elm Street, Delhi, India',
    skills: 'HTML, CSS, JavaScript, Figma',
    experience: '3 years as a Frontend Developer',
    photo: './ankit.jpg'
  },
];

/* ============================================================
   NAVIGATION
   ============================================================ */
let currentPage = 'home';

function navigate(page) {
  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');

  // Auth guard — protected pages require login
  const protectedPages = ['profile', 'edit-profile', 'application-form'];
  if (protectedPages.includes(page) && !sessionStorage.getItem('loggedInUser')) {
    showToast('Please log in first.', 'error');
    navigate('login');
    return;
  }

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Clear active class on nav items
  document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('nav-active'));

  // Page-specific init
  if (page === 'jobs')         renderJobsTable(JOBS_DATA);
  if (page === 'profile')      loadProfile();
  if (page === 'edit-profile') loadEditForm();

  updateAuthNav();
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function updateAuthNav() {
  const user = sessionStorage.getItem('loggedInUser');
  const authBtn = document.getElementById('nav-auth');
  const btn = authBtn.querySelector('button');
  if (user) {
    btn.textContent = 'Logout';
    btn.onclick = logout;
  } else {
    btn.textContent = 'Login';
    btn.onclick = () => navigate('login');
  }
  btn.className = 'nav-cta';
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ============================================================
   JOBS TABLE
   ============================================================ */
function renderJobsTable(data) {
  const tbody = document.getElementById('jobsTableBody');
  tbody.innerHTML = data.map(j => `
    <tr>
      <td><strong>${j.title}</strong></td>
      <td class="td-company">${j.company}</td>
      <td>${j.location}</td>
      <td class="td-salary">${j.salary}</td>
      <td><span class="job-type-badge">${j.type}</span></td>
      <td><button class="apply-btn" onclick="navigate('application-form')">Apply Now</button></td>
    </tr>
  `).join('');
}

function filterJobs() {
  const q = document.getElementById('jobSearch').value.toLowerCase();
  const filtered = JOBS_DATA.filter(j =>
    j.title.toLowerCase().includes(q) ||
    j.company.toLowerCase().includes(q) ||
    j.location.toLowerCase().includes(q)
  );
  renderJobsTable(filtered);
}

/* ============================================================
   POST A JOB (HOME)
   ============================================================ */
function handlePostJob(e) {
  e.preventDefault();
  showToast('✓ Job posted successfully!');
  e.target.reset();
}

/* ============================================================
   APPLICATION FORM
   ============================================================ */
function initAppForm() {
  const form = document.getElementById('appForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    showToast("✓ Application submitted! We'll be in touch soon.");
    this.reset();
    document.getElementById('resumePreview').style.display = 'none';
  });
}

function handleFileUpload(input) {
  const preview = document.getElementById('resumePreview');

  // Show image preview for image files
  if (input.files[0] && input.files[0].type.startsWith('image/')) {
    const fr = new FileReader();
    fr.onload = () => { preview.src = fr.result; preview.style.display = 'block'; };
    fr.readAsDataURL(input.files[0]);
  }

  // Upload file to Google Apps Script
  if (input.files[0]) {
    const fr2 = new FileReader();
    fr2.onload = () => {
      const spt = fr2.result.split('base64,')[1];
      fetch('https://script.google.com/macros/s/AKfycbxc19D9r7CvQLIIE_NPzwxrJEoen-NRSIxjP-M-FfSaTuFHlNxkX5yd6Ka5eUROjZzH/exec', {
        method: 'POST',
        body: JSON.stringify({
          base64: spt,
          type: input.files[0].type,
          name: input.files[0].name
        })
      }).catch(() => {});
    };
    fr2.readAsDataURL(input.files[0]);
  }
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function handleContact(e) {
  e.preventDefault();
  const form = e.target;
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyzIPAB1cTBRhqqeTnQry23iOPjuPYyBbNfF-r7sEZrNbCUQw_bAlh07BQefbY-MCoz/exec';
  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(() => { showToast("✓ Message sent! We'll get back to you."); form.reset(); })
    .catch(() => { showToast('✓ Message sent!'); form.reset(); });
}

/* ============================================================
   AUTH — LOGIN
   ============================================================ */
function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  const user     = USERS.find(u => u.email === email && u.password === password);

  if (user) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    errEl.style.display = 'none';
    showToast('✓ Welcome back, ' + user.name.split(' ')[0] + '!');
    updateAuthNav();
    setTimeout(() => navigate('profile'), 600);
  } else {
    errEl.textContent = 'Invalid email or password. Please try again.';
    errEl.style.display = 'block';
  }
}

/* ============================================================
   AUTH — SIGNUP
   ============================================================ */
function handleSignup(e) {
  e.preventDefault();
  const name     = document.getElementById('signupName').value;
  const email    = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const newUser  = { email, password, name, phone: '', address: '', skills: '', experience: '', photo: '/logo.png' };

  sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
  showToast('✓ Account created! Welcome, ' + name.split(' ')[0] + '!');
  updateAuthNav();
  setTimeout(() => navigate('profile'), 600);
}

/* ============================================================
   PROFILE — LOAD
   ============================================================ */
function loadProfile() {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!user) { navigate('login'); return; }

  document.getElementById('profileName').textContent       = user.name;
  document.getElementById('profileEmail').textContent      = user.email;
  document.getElementById('profilePhone').textContent      = user.phone      || 'Not set';
  document.getElementById('profileAddress').textContent    = user.address    || 'Not set';
  document.getElementById('profileExperience').textContent = user.experience || 'Not set';

  // Skill chips
  const skillsEl = document.getElementById('profileSkills');
  skillsEl.innerHTML = '';
  if (user.skills) {
    user.skills.split(',').forEach(s => {
      if (!s.trim()) return;
      const chip = document.createElement('span');
      chip.className   = 'skill-chip';
      chip.textContent = s.trim();
      skillsEl.appendChild(chip);
    });
  }

  // Avatar
  const avatar = document.getElementById('profileAvatar');
  avatar.src = user.photo || '/logo.png';
  avatar.onerror = () => {
    avatar.src = '';
    avatar.style.background = 'linear-gradient(135deg,#6c63ff,#a855f7)';
  };
}

/* ============================================================
   PROFILE — EDIT
   ============================================================ */
function loadEditForm() {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!user) { navigate('login'); return; }

  document.getElementById('editName').value       = user.name       || '';
  document.getElementById('editEmail').value      = user.email      || '';
  document.getElementById('editPhone').value      = user.phone      || '';
  document.getElementById('editAddress').value    = user.address    || '';
  document.getElementById('editSkills').value     = user.skills     || '';
  document.getElementById('editExperience').value = user.experience || '';
}

function saveProfile(e) {
  e.preventDefault();
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));

  user.name       = document.getElementById('editName').value;
  user.email      = document.getElementById('editEmail').value;
  user.phone      = document.getElementById('editPhone').value;
  user.address    = document.getElementById('editAddress').value;
  user.skills     = document.getElementById('editSkills').value;
  user.experience = document.getElementById('editExperience').value;

  sessionStorage.setItem('loggedInUser', JSON.stringify(user));
  showToast('✓ Profile updated successfully!');
  setTimeout(() => navigate('profile'), 600);
}

/* ============================================================
   LOGOUT
   ============================================================ */
function logout() {
  sessionStorage.removeItem('loggedInUser');
  updateAuthNav();
  showToast('You have been logged out.', 'error');
  setTimeout(() => navigate('home'), 400);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  updateAuthNav();
  initAppForm();
});
