document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // DOM Elements
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const searchInput = document.getElementById('searchInput');
  const sections = document.querySelectorAll('.terms-section');
  const tocLinks = document.querySelectorAll('.toc-link');
  const consentCheckbox = document.getElementById('consentCheckbox');
  const acceptBtn = document.getElementById('acceptBtn');
  const noResults = document.getElementById('noResults');

  // Theme Toggle Logic
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    
    // Update Theme Icon
    themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    lucide.createIcons();
  });

  // Checkbox Consent Logic
  consentCheckbox.addEventListener('change', (e) => {
    acceptBtn.disabled = !e.target.checked;
  });

  acceptBtn.addEventListener('click', () => {
    alert('Thank you! You have accepted the Zaride Terms of Service.');
    window.location.href = 'index.html';
  });

  // Interactive Live Search Filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    sections.forEach(section => {
      const text = section.textContent.toLowerCase();
      if (text.includes(query)) {
        section.style.display = 'block';
        visibleCount++;
      } else {
        section.style.display = 'none';
      }
    });

    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  });

  // Scrollspy to update Active Link in TOC
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // DOM Elements
  const themeToggleBtn = document.getElementById('themeToggle');
  const searchInput = document.getElementById('searchInput');
  const sections = document.querySelectorAll('.terms-section');
  const tocLinks = document.querySelectorAll('.toc-link');
  const consentCheckbox = document.getElementById('consentCheckbox');
  const acceptBtn = document.getElementById('acceptBtn');
  const noResults = document.getElementById('noResults');

  // FIXED: Theme Toggle Logic
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      
      // Update button icon safely by setting innerHTML
      themeToggleBtn.innerHTML = `<i data-lucide="${isLight ? 'moon' : 'sun'}"></i>`;
      lucide.createIcons();
    });
  }

  // Checkbox Consent Logic
  if (consentCheckbox && acceptBtn) {
    consentCheckbox.addEventListener('change', () => {
      acceptBtn.disabled = !consentCheckbox.checked;
    });

    acceptBtn.addEventListener('click', () => {
      if (!acceptBtn.disabled) {
        window.location.href = 'join.html';
      }
    });
  }

  // Interactive Live Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(query)) {
          section.style.display = 'block';
          visibleCount++;
        } else {
          section.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  }

  // Scrollspy to update Active Link in TOC
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});