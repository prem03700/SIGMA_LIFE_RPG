const dialog = document.querySelector('#auth-dialog');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const status = document.querySelector('#auth-status');
const title = document.querySelector('#auth-title');
const subtitle = document.querySelector('#auth-subtitle');
const tabs = [...document.querySelectorAll('[data-auth-tab]')];

function showMode(mode) {
  const isRegister = mode === 'register';

  registerForm.classList.toggle('hidden', !isRegister);
  loginForm.classList.toggle('hidden', isRegister);

  title.textContent = isRegister
    ? 'Begin your campaign'
    : 'Resume your campaign';

  subtitle.textContent = isRegister
    ? 'Create a secure account. Your progress follows you across devices.'
    : 'Your quests, XP, streak and inventory are waiting.';

  tabs.forEach((tab) => {
    tab.setAttribute(
      'aria-selected',
      String(tab.dataset.authTab === mode)
    );
  });

  status.textContent = '';
  status.removeAttribute('data-type');
}

function openAuth(mode) {
  showMode(mode);

  if (!dialog.open) {
    dialog.showModal();
  }

  requestAnimationFrame(() => {
    dialog
      .querySelector('form:not(.hidden) input')
      ?.focus();
  });
}

/* Open authentication dialog */
document
  .querySelectorAll('[data-auth-mode]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      openAuth(button.dataset.authMode);
    });
  });

/* Switch between Register and Login */
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    showMode(tab.dataset.authTab);
  });
});

/* Close authentication dialog */
document
  .querySelector('[data-close-dialog]')
  .addEventListener('click', () => {
    dialog.close();
  });

/* Close dialog when clicking outside the modal */
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

/*
 * Authentication
 *
 * IMPORTANT:
 * There is currently NO backend connected.
 *
 * Therefore:
 * - No fetch()
 * - No API calls
 * - No fake endpoints
 * - No JSON parsing
 * - No fake account creation
 */

function showBackendMessage(form) {
  const submit = form.querySelector('button[type="submit"]');

  submit.disabled = true;

  status.textContent =
    'The server is not connected yet. Account creation will be available after the backend is deployed.';

  status.setAttribute('data-type', 'info');

  setTimeout(() => {
    submit.disabled = false;
  }, 1000);
}

/* Create Account */
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  showBackendMessage(registerForm);
});

/* Sign In */
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  showBackendMessage(loginForm);
});

/* Scroll reveal animations */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll('.reveal')
  .forEach((node) => {
    observer.observe(node);
  });
