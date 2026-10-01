document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const getStartedBtn = document.getElementById('getStartedBtn');
  const signInBtn = document.getElementById('signInBtn');

  // Interactive Click Handlers
  getStartedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Welcome to Zaride! Redirecting to rider registration...');
  });

  signInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Opening Zaride Sign In page...');
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

