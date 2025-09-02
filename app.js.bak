// This code will handle the menu navigation

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('.nav-links');
  const menuButton = document.querySelector('.menu-button');
  const sections = document.querySelectorAll('section');
  const refreshTab = document.querySelector('.refresh-tab');
  const mainNav = document.getElementById('main-nav');
  const floatingMenu = document.getElementById('floating-menu');
  const sidePanel = document.getElementById('side-panel');

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1 - Math.pow(1 - t, 4)), // https://easings.net
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

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

  // Apply smooth scrolling to all anchor links using Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      lenis.scrollTo(target);
    });
  });

  // This code will handle the menu navigation

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('.nav-links');
  const menuButton = document.querySelector('.menu-button');
  const sections = document.querySelectorAll('section');
  const refreshTab = document.querySelector('.refresh-tab');
  const mainNav = document.getElementById('main-nav');
  const floatingMenu = document.getElementById('floating-menu');
  const sidePanel = document.getElementById('side-panel');

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1 - Math.pow(1 - t, 4)), // https://easings.net
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

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

  // Apply smooth scrolling to all anchor links using Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      lenis.scrollTo(target);
    });
  });

  navLinks.addEventListener('click', (event) => {
    const target = event.target;

    if (target.tagName === 'A') {
      event.preventDefault();
      const sectionId = target.getAttribute('href');
      lenis.scrollTo(sectionId);
      closeSidePanel();
    }
  });

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

  // Scrolling text direction change using Lenis
  const scrollingTextSpans = document.querySelectorAll('.scrolling-text span');
  let lastScrollDirection = 0; // 0 for initial, 1 for down, -1 for up

  function setScrollDirection(direction) {
    const animation = direction === 'down' ? 'scroll-right 50s linear infinite' : 'scroll-left 50s linear infinite';
    scrollingTextSpans.forEach(span => {
      span.style.animation = animation;
    });
  }

  lenis.on('scroll', ({ direction }) => {
    if (direction !== lastScrollDirection) {
      setScrollDirection(direction === 1 ? 'down' : 'up');
      lastScrollDirection = direction;
    }
  });

  // Initialize scroll direction
  setScrollDirection('up'); // Default to left (up) initially
});
});
