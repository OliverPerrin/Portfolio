// This code will handle the menu navigation

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('.nav-links');
  const menuButton = document.querySelector('.menu-button');
  const sections = document.querySelectorAll('section');
  const refreshTab = document.querySelector('.refresh-tab');
  const mainNav = document.getElementById('main-nav');
  const floatingMenu = document.getElementById('floating-menu');
  const sidePanel = document.getElementById('side-panel');

  refreshTab.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default behavior of the anchor element (navigation)
    location.reload(); // Reload the page
  });

  menuButton.addEventListener('click', () => {
    sidePanel.classList.toggle('hidden');
    menuButton.classList.toggle('open');
  });

  const closeSidePanel = () => {
    sidePanel.classList.add('hidden');
    menuButton.classList.remove('open');
  };

  // Smooth scrolling function
  function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Apply smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScroll(target, 1000); // 1000ms duration
    });
  });

  navLinks.addEventListener('click', (event) => {
    const target = event.target;

    if (target.tagName === 'A') {
      event.preventDefault();
      const sectionId = target.getAttribute('href');
      smoothScroll(sectionId, 1000);
      closeSidePanel();
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      mainNav.classList.add('hidden');
      floatingMenu.classList.remove('hidden');
    } else {
      mainNav.classList.remove('hidden');
      floatingMenu.classList.add('hidden');
      closeSidePanel();
    }
  });

  // Prevent automatic scrolling on page load
  if (window.location.hash) {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Scrolling text animation
  // const scrollingText = document.querySelector('.scrolling-text');
  // scrollingText.addEventListener('animationiteration', () => {
  //   scrollingText.style.transform = 'translateX(0)';
  // });

  const sidePanelLinks = sidePanel.querySelectorAll('.nav-links a');
  sidePanelLinks.forEach(link => {
    link.addEventListener('click', closeSidePanel);
  });

  // Close side panel when clicking outside
  document.addEventListener('click', (event) => {
    if (!sidePanel.contains(event.target) && !menuButton.contains(event.target)) {
      closeSidePanel();
    }
  });

  // Theme switcher
  const toggleTheme = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Function to set the theme
  const setTheme = (theme) => {
    if (theme === 'dark-mode') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  };

  // Set initial theme
  if (currentTheme) {
    setTheme(currentTheme);
  }

  // Toggle theme on button click
  toggleTheme.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      setTheme('light-mode');
    } else {
      setTheme('dark-mode');
    }
  });

  // Scrolling text direction change
  const scrollingTextSpans = document.querySelectorAll('.scrolling-text span');
  let lastScrollTop = 0;
  let isScrollingDown = false;

  function setScrollDirection(direction) {
    const animation = direction === 'right' ? 'scroll-right' : 'scroll-left';
    scrollingTextSpans.forEach(span => {
      span.style.animation = 'none';
      span.offsetHeight; // Trigger reflow
      span.style.animation = `${animation} 50s linear infinite`;
    });
  }

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    if (st > lastScrollTop && !isScrollingDown) {
      // Started scrolling down
      isScrollingDown = true;
      setScrollDirection('right');
    } else if (st < lastScrollTop && isScrollingDown) {
      // Started scrolling up
      isScrollingDown = false;
      setScrollDirection('left');
    }
    
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }, false);

  // Initialize scroll direction
  setScrollDirection('left');

  // ... (rest of the existing code)
});

