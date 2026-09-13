const dialog = document.querySelector('#auth-dialog');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const status = document.querySelector('#auth-status');
const title = document.querySelector('#auth-title');
const subtitle = document.querySelector('#auth-subtitle');
const tabs = [...document.querySelectorAll('[data-auth-tab]')];

/* -------------------------------------------------------
   AUTH UI
------------------------------------------------------- */

function showMode(mode) {
  const isRegister = mode === 'register';

  registerForm.classList.toggle('hidden', !isRegister);
  loginForm.classList.toggle('hidden', isRegister);

  title.textContent = isRegister
    ? 'Begin your campaign'
    : 'Resume your campaign';

  subtitle.textContent = isRegister
    ? 'Create your character and begin your campaign.'
    : 'Enter your credentials to continue your campaign.';

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

/* -------------------------------------------------------
   OPEN AUTH MODAL
------------------------------------------------------- */

document
  .querySelectorAll('[data-auth-mode]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      openAuth(button.dataset.authMode);
    });
  });

/* -------------------------------------------------------
   SWITCH LOGIN / REGISTER
------------------------------------------------------- */

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    showMode(tab.dataset.authTab);
  });
});

/* -------------------------------------------------------
   CLOSE MODAL
------------------------------------------------------- */

document
  .querySelector('[data-close-dialog]')
  .addEventListener('click', () => {
    dialog.close();
  });

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

/* -------------------------------------------------------
   LOCAL ACCOUNT SYSTEM
   GitHub Pages has no backend.

   Accounts are stored only in this browser using
   localStorage.

   This is suitable for frontend/demo testing only.
------------------------------------------------------- */

const ACCOUNT_KEY = 'life_rpg_account';
const SESSION_KEY = 'life_rpg_session';

function getAccount() {
  const account = localStorage.getItem(ACCOUNT_KEY);

  if (!account) {
    return null;
  }

  try {
    return JSON.parse(account);
  } catch {
    return null;
  }
}

function saveAccount(account) {
  localStorage.setItem(
    ACCOUNT_KEY,
    JSON.stringify(account)
  );
}

function createSession(account) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      loggedIn: true,
      email: account.email,
      displayName: account.displayName,
      loginTime: new Date().toISOString()
    })
  );
}

/* -------------------------------------------------------
   CREATE ACCOUNT
------------------------------------------------------- */

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);

  const displayName = String(
    formData.get('displayName') || ''
  ).trim();

  const email = String(
    formData.get('email') || ''
  ).trim().toLowerCase();

  const password = String(
    formData.get('password') || ''
  );

  /* Validation */

  if (displayName.length < 2) {
    status.textContent =
      'Player name must contain at least 2 characters.';
    return;
  }

  if (!email) {
    status.textContent =
      'Please enter your email address.';
    return;
  }

  if (password.length < 8) {
    status.textContent =
      'Password must contain at least 8 characters.';
    return;
  }

  /* Check existing account */

  const existingAccount = getAccount();

  if (existingAccount) {
    status.textContent =
      'An account already exists in this browser. Please sign in instead.';
    return;
  }

  /* Create local account */

  const account = {
    displayName,
    email,

    /*
     * Demo only.
     * Do NOT use this approach for a production application.
     */
    password,

    createdAt: new Date().toISOString(),

    character: {
      level: 1,
      xp: 0,
      gold: 0,
      streak: 0,

      attributes: {
        intellect: 0,
        strength: 0,
        discipline: 0,
        vitality: 0
      },

      quests: [],
      inventory: [],
      badges: []
    }
  };

  saveAccount(account);
  createSession(account);

  status.textContent =
    'Character created successfully!';

  status.setAttribute(
    'data-type',
    'success'
  );

  const submit = registerForm.querySelector(
    'button[type="submit"]'
  );

  submit.disabled = true;
  submit.textContent = 'Campaign created ✓';

  /*
   * Open the application page after a short delay.
   *
   * app.html is used instead of /app because this
   * project is hosted on GitHub Pages.
   */
  setTimeout(() => {
    window.location.href = './app.html';
  }, 700);
});

/* -------------------------------------------------------
   SIGN IN
------------------------------------------------------- */

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);

  const email = String(
    formData.get('email') || ''
  ).trim().toLowerCase();

  const password = String(
    formData.get('password') || ''
  );

  const account = getAccount();

  /* No account */

  if (!account) {
    status.textContent =
      'No character exists in this browser. Create an account first.';
    return;
  }

  /* Wrong email */

  if (account.email !== email) {
    status.textContent =
      'Email or password is incorrect.';
    return;
  }

  /* Wrong password */

  if (account.password !== password) {
    status.textContent =
      'Email or password is incorrect.';
    return;
  }

  /* Successful login */

  createSession(account);

  status.textContent =
    'Welcome back, ' + account.displayName + '!';

  status.setAttribute(
    'data-type',
    'success'
  );

  const submit = loginForm.querySelector(
    'button[type="submit"]'
  );

  submit.disabled = true;
  submit.textContent = 'Entering campaign ✓';

  setTimeout(() => {
    window.location.href = './app.html';
  }, 700);
});

/* -------------------------------------------------------
   SCROLL REVEAL ANIMATIONS
------------------------------------------------------- */

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
