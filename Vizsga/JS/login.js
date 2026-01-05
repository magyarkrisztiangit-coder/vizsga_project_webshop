/**
 * Login/Register functionality
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerLink = document.getElementById("registerLink");
  const loginLink = document.getElementById("loginLink");
  const loginContainer = document.querySelector(".login-container");
  const registerContainer = document.querySelector(".register-container");

  // Switch to register
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.classList.add("hidden");
      registerContainer.classList.remove("hidden");
    });
  }

  // Switch to login
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      registerContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    });
  }

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      // Simple validation (in real app, send to server)
      if (email && password) {
        alert("Bejelentkezés sikeres! (Ez csak demo)");
        // Redirect back to index
        window.location.href = "index.html";
      } else {
        alert("Kérjük, töltse ki az összes mezőt!");
      }
    });
  }

  // Register form submit
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      if (password !== confirmPassword) {
        alert("A jelszavak nem egyeznek!");
        return;
      }
      if (email && password) {
        alert("Regisztráció sikeres! (Ez csak demo)");
        // Switch to login
        registerContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
      } else {
        alert("Kérjük, töltse ki az összes mezőt!");
      }
    });
  }
});