const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('#theme-icon');
const applyTheme = (theme) => {
  document.body.classList.toggle('light', theme === 'light');
  themeIcon.textContent = theme === 'light' ? '☾' : '☀';
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
};
let savedTheme;
try { savedTheme = localStorage.getItem('fiqah-theme'); } catch { /* Use the default theme when storage is unavailable. */ }
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const theme = document.body.classList.contains('light') ? 'dark' : 'light';
  applyTheme(theme);
  try { localStorage.setItem('fiqah-theme', theme); } catch { /* Theme still works without persistence. */ }
});
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));
// Observe once per element; no scroll handlers or animation dependencies.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = document.querySelectorAll('.reveal');
let revealObserver;
document.querySelectorAll('.strength-grid, .skills-grid, .project-grid, .recognition-grid').forEach(grid => {
  [...grid.children].forEach((card, index) => {
    card.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
  });
});
const revealElement = element => {
  element.classList.add('visible');
  revealObserver?.unobserve(element);
};
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) revealElement(entry.target);
  }), { threshold: 0.09 });
  document.documentElement.classList.add('motion-ready');
  revealElements.forEach(element => revealObserver.observe(element));
}
// Keyboard navigation should never land on an invisible control.
document.addEventListener('focusin', event => {
  const element = event.target.closest('.reveal');
  if (element) revealElement(element);
});
const projectAnimations = new Map();
reducedMotion.addEventListener('change', event => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  document.documentElement.classList.remove('motion-ready');
  revealElements.forEach(revealElement);
  projectAnimations.forEach(animation => animation.cancel());
  projectAnimations.clear();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.focus();
  }
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(btn => {
    const active = btn === button;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  let visibleIndex = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    projectAnimations.get(card)?.cancel();
    projectAnimations.delete(card);
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (card.hidden) return;
    revealElement(card);
    if (!reducedMotion.matches && typeof card.animate === 'function') {
      const animation = card.animate([
        { opacity: 0, translate: '0 12px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: 340, delay: Math.min(visibleIndex, 4) * 45, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      projectAnimations.set(card, animation);
      animation.onfinish = () => {
        if (projectAnimations.get(card) === animation) projectAnimations.delete(card);
      };
    }
    visibleIndex++;
  });
}));
// Academic project details. Add real images later by setting each image path.
const projects = {
  fyp: { title: 'AI-Generated Response Detection Using SVM (FYP)', description: 'Developing a support vector machine (SVM) model to identify AI-generated responses in online assessments.', highlights: ['Research and development of an SVM-based detection model', 'Python-based machine learning workflow', 'Focus on AI-generated responses in online assessments'], images: [{src:'images/fyp-login.png',caption:'Login interface'}, {src:'images/fyp-submit.png',caption:'Text submission'}, {src:'images/fyp-results.png',caption:'Detection analysis'}] },
  student: { title: 'Student Performance Prediction', description: 'A predictive analytics system developed using Python, Random Forest, and Streamlit.', highlights: ['Random Forest prediction model', 'Interactive Streamlit application', 'Student performance analytics'], images: [{src:'images/student-prediction.png',caption:'CGPA predictor — interactive Streamlit application'}] },
  heart: { title: 'Heart Attack Risk Prediction', description: 'A classification project using the J48 decision tree algorithm in WEKA.', highlights: ['J48 classification model', 'Model development and analysis using WEKA', 'Heart attack risk prediction'], image: '' },
  butterfly: { title: 'Butterfly Recognition Using CNN', description: 'An image recognition project using convolutional neural networks (CNN) in MATLAB.', highlights: ['CNN-based image recognition', 'MATLAB implementation', 'Butterfly classification'], image: '' },
  ecommerce: { title: 'E-Commerce Sales Insights Dashboard', description: 'An interactive Power BI dashboard for exploring sales performance, customer behavior, and product profitability.', highlights: ['Power BI visualizations', 'Data transformation with Power Query', 'Measures and analysis using DAX'], images: [{src:'images/ecommerce-landing.png',caption:'Dashboard landing page'}, {src:'images/ecommerce-overview.png',caption:'Executive overview'}, {src:'images/ecommerce-products.png',caption:'Product, pricing & profitability'}, {src:'images/ecommerce-customers.png',caption:'Customer behaviour analysis'}, {src:'images/ecommerce-regional.png',caption:'Regional & operational performance'}] },
  hostel: { title: 'Kolej Kerawang Management System', description: 'A hostel management application developed with Java NetBeans featuring QR code check-in and check-out.', highlights: ['Hostel management workflows', 'QR code-based check-in', 'QR code-based check-out'], image: '' },
  books: { title: 'Book Management System', description: 'A Java-based application developed using NetBeans IDE to manage and organize book records.', highlights: ['Java application built in NetBeans', 'Book record management', 'Organizing book information'], image: '' }
};
const dialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
document.querySelectorAll('.project-open').forEach(button => button.addEventListener('click', () => {
  const p = projects[button.dataset.project];
  document.querySelector('#dialog-title').textContent = p.title;
  document.querySelector('#dialog-description').textContent = p.description;
  const list = document.querySelector('#dialog-highlights');
  list.replaceChildren();
  p.highlights.forEach(item => { const li = document.createElement('li'); li.textContent = item; list.append(li); });
  dialogImage.replaceChildren();
  if (p.images?.length) {
    const gallery = document.createElement('div');
    gallery.className = 'project-gallery';
    const stage = document.createElement('figure');
    stage.className = 'gallery-stage';
    const fullSize = document.createElement('a');
    fullSize.target = '_blank';
    fullSize.rel = 'noopener noreferrer';
    fullSize.title = 'Open full-size screenshot in a new tab';
    const preview = document.createElement('img');
    preview.decoding = 'async';
    fullSize.append(preview);
    const caption = document.createElement('figcaption');
    caption.setAttribute('aria-live', 'polite');
    caption.setAttribute('aria-atomic', 'true');
    stage.append(fullSize, caption);
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    const previous = document.createElement('button');
    previous.type = 'button'; previous.textContent = '? Previous';
    previous.setAttribute('aria-label', 'Previous screenshot');
    const counter = document.createElement('span');
    const next = document.createElement('button');
    next.type = 'button'; next.textContent = 'Next ?';
    next.setAttribute('aria-label', 'Next screenshot');
    controls.append(previous, counter, next);
    const thumbnails = document.createElement('div');
    thumbnails.className = 'gallery-thumbnails';
    thumbnails.setAttribute('role', 'group');
    thumbnails.setAttribute('aria-label', 'Choose a project screenshot');
    let activeIndex = 0;
    const thumbnailButtons = p.images.map((entry, index) => {
      const thumbnail = document.createElement('button');
      thumbnail.type = 'button';
      thumbnail.setAttribute('aria-label', `Show screenshot ${index + 1}: ${entry.caption}`);
      const image = document.createElement('img');
      image.src = entry.src; image.alt = ''; image.loading = 'lazy';
      const label = document.createElement('span'); label.textContent = entry.caption;
      thumbnail.append(image, label);
      thumbnail.addEventListener('click', () => showImage(index));
      thumbnails.append(thumbnail);
      return thumbnail;
    });
    const showImage = index => {
      activeIndex = (index + p.images.length) % p.images.length;
      const entry = p.images[activeIndex];
      preview.src = entry.src;
      preview.alt = `${p.title}: ${entry.caption}`;
      fullSize.href = entry.src;
      fullSize.setAttribute('aria-label', `Open full-size screenshot: ${entry.caption} (new tab)`);
      caption.textContent = entry.caption;
      counter.textContent = `${activeIndex + 1} / ${p.images.length}`;
      thumbnailButtons.forEach((thumbnail, position) => thumbnail.setAttribute('aria-pressed', String(position === activeIndex)));
    };
    previous.addEventListener('click', () => showImage(activeIndex - 1));
    next.addEventListener('click', () => showImage(activeIndex + 1));
    gallery.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      showImage(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    });
    controls.hidden = thumbnails.hidden = p.images.length < 2;
    gallery.append(stage, controls, thumbnails);
    showImage(0);
    dialogImage.append(gallery);
  } else {
    const message = document.createElement('span'); message.textContent = 'Screenshots coming soon';
    const note = document.createElement('small'); note.textContent = 'Project information is available above. Images will be added later.';
    dialogImage.append(message, note);
  }
  dialog.showModal();
  dialog.scrollTop = 0;
}));
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();

// Suspend decorative movement while the page is out of view.
const syncMotionVisibility = () => document.body.classList.toggle('motion-paused', document.hidden);
document.addEventListener('visibilitychange', syncMotionVisibility);
syncMotionVisibility();
