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
// Replace any text below with approved public-facing details only.
const projects = {
  risk: { title: 'Asset Risk Assessment System', description: 'An internal risk management prototype that guides users from identifying assets to assessing risks and planning treatments.', highlights: ['Asset identification and CIA-based valuation', 'Threat and vulnerability selection', 'Risk evaluation, treatment planning, and approval status'], image: '' },
  outing: { title: 'Student Outing Management', description: 'A web application for managing student outing sessions and recording movements during approved time windows.', highlights: ['Guard workflows for student exit and return', 'Admin reporting and filters', 'Support for multiple eligible outing sessions'], image: '' },
  i4uhr: { title: 'i4uHR Management System', description: 'A prototype designed to simplify workforce record maintenance and improve staffing visibility.', highlights: ['Role-based workflows for administrators and programme HR users', 'Programme views synchronized with a master dataset', 'Vacancy and staffing overview'], image: '' },
  workforce: { title: 'Workforce Analytics Dashboard', description: 'An interactive Looker Studio dashboard for monitoring staffing positions, filled posts, and vacancies.', highlights: ['Workforce summary indicators', 'Interactive programme-level filtering', 'Visual breakdowns and vacancy analysis'], image: '' },
  moa: { title: 'MoA Monitoring Dashboard', description: 'A dashboard supporting the monitoring of placement agreements with higher education institutions.', highlights: ['Agreement status and expiry monitoring', 'Renewal tracking', 'Facility and programme addition requests'], image: '' }
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
  if (p.image) {
    const img = document.createElement('img'); img.src = p.image; img.alt = `Approved screenshot of ${p.title}`; img.loading = 'lazy'; dialogImage.append(img);
  } else {
    const message = document.createElement('span'); message.textContent = 'Project screenshot placeholder';
    const note = document.createElement('small'); note.textContent = 'Add an approved screenshot in the project images folder.';
    dialogImage.append(message, note);
  }
  dialog.showModal();
}));
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();
