// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

// Form Elements
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');

// Navigation Functions
document.getElementById('showRegister').addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

document.getElementById('showForgotPassword').addEventListener('click', () => {
  loginForm.style.display = 'none';
  forgotPasswordForm.style.display = 'block';
});

document.getElementById('backToLogin').addEventListener('click', () => {
  forgotPasswordForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Login Handler
loginFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      showError(loginForm, error.message);
      return;
    }

    window.location.href = 'home.html';
  } catch (err) {
    showError(loginForm, err.message || 'An unexpected error occurred during login.');
  }
});

// Register Handler
registerFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      showError(registerForm, error.message);
      return;
    }

    showSuccess(registerForm, 'Account created successfully! Please check your email to confirm if required.');
    setTimeout(() => {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    }, 2000);
  } catch (err) {
    showError(registerForm, err.message || 'An unexpected error occurred during registration.');
  }
});

// Forgot Password Handler
forgotPasswordFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value.trim();

  try {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/index.html'
    });

    if (error) {
      showError(forgotPasswordForm, error.message);
      return;
    }

    showSuccess(forgotPasswordForm, 'Password reset email sent! Check your inbox.');
    setTimeout(() => {
      forgotPasswordForm.style.display = 'none';
      loginForm.style.display = 'block';
    }, 3000);
  } catch (err) {
    showError(forgotPasswordForm, err.message || 'An unexpected error occurred.');
  }
});

// Helper Functions
function showError(container, message) {
  clearMessages(container);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  container.appendChild(errorDiv);
}

function showSuccess(container, message) {
  clearMessages(container);
  const successDiv = document.createElement('div');
  successDiv.className = 'success';
  successDiv.textContent = message;
  container.appendChild(successDiv);
}

function clearMessages(container) {
  const messages = container.querySelectorAll('.error, .success');
  messages.forEach(message => message.remove());
}
