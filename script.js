const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('#theme-icon');
const applyTheme = (theme) => {
  document.body.classList.toggle('light', theme === 'light');
  themeIcon.textContent = theme === 'light' ? '☾' : '☀';
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
};
const savedTheme = localStorage.getItem('fiqah-theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const theme = document.body.classList.contains('light') ? 'dark' : 'light';
  applyTheme(theme);
  localStorage.setItem('fiqah-theme', theme);
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
}));
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.09 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(btn => {
    const active = btn === button;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
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
    const gallery = document.createElement('div'); gallery.className = 'screenshot-gallery';
    p.images.forEach((entry, index) => {
      const figure = document.createElement('figure');
      const picture = document.createElement('img'); picture.src = entry.src;
      picture.alt = `${p.title}: ${entry.caption}`; picture.loading = 'lazy';
      picture.tabIndex = 0; picture.title = 'Click to view full-size screenshot';
      picture.addEventListener('click', () => window.open(entry.src, '_blank', 'noopener,noreferrer'));
      picture.addEventListener('keydown', ev => { if (ev.key === 'Enter') picture.click(); });
      const caption = document.createElement('figcaption'); caption.textContent = `${index + 1}. ${entry.caption}`;
      figure.append(picture, caption); gallery.append(figure);
    });
    dialogImage.append(gallery);
  } else {
    const message = document.createElement('span'); message.textContent = 'Screenshots coming soon';
    const note = document.createElement('small'); note.textContent = 'Project information is available above. Images will be added later.';
    dialogImage.append(message, note);
  }
  dialog.showModal();
}));
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();
