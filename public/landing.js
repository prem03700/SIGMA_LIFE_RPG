const dialog = document.querySelector('#auth-dialog');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const status = document.querySelector('#auth-status');
const title = document.querySelector('#auth-title');
const subtitle = document.querySelector('#auth-subtitle');
const tabs = [...document.querySelectorAll('[data-auth-tab]')];
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
function readStoredProfile() {
  try {
    const value = localStorage.getItem('life-rpg-profile');
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem('life-rpg-profile');
    localStorage.removeItem('life-rpg-campaign');
    return null;
  }
}

function showMode(mode) {
  const isRegister = mode === 'register';
  registerForm.classList.toggle('hidden', !isRegister);
  loginForm.classList.toggle('hidden', isRegister);
  title.textContent = isRegister ? 'Begin your campaign' : 'Resume your campaign';
  subtitle.textContent = isRegister ? 'Create a secure account. Your progress follows you across devices.' : 'Your quests, XP, streak and inventory are waiting.';
  tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.authTab === mode)));
  status.textContent = '';
}
function openAuth(mode) {
  showMode(mode);
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => dialog.querySelector('form:not(.hidden) input')?.focus());
}
document.querySelectorAll('[data-auth-mode]').forEach((button) => button.addEventListener('click', () => openAuth(button.dataset.authMode)));
tabs.forEach((tab) => tab.addEventListener('click', () => showMode(tab.dataset.authTab)));
document.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

function submitAuth(form) {
  const submit = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.timezone = timezone;
  status.textContent = '';
  const previous = submit.textContent;
  submit.disabled = true;
  submit.textContent = 'Synchronizing…';
  try {
    const profile = readStoredProfile();
    const email = payload.email.trim().toLowerCase();
    if (form === registerForm) {
      if (profile && profile.email !== email) throw new Error('This browser already has a campaign. Sign in with that email.');
      localStorage.setItem('life-rpg-profile', JSON.stringify({ email, displayName: payload.displayName.trim(), timezone }));
    } else if (!profile || profile.email !== email) {
      throw new Error('No campaign found for that email in this browser.');
    }
    window.location.assign('app.html');
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
    submit.textContent = previous;
  }
}
registerForm.addEventListener('submit', (event) => { event.preventDefault(); submitAuth(registerForm); });
loginForm.addEventListener('submit', (event) => { event.preventDefault(); submitAuth(loginForm); });

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
