import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/style.css'
import { initializeLoginForm } from '../lib/login.js'

function LoginPage() {
  const [isLoginVisible, setIsLoginVisible] = useState(true)

  useEffect(() => {
    // Hide toolbar when page loads
    const toolbar = document.getElementById('toolbar')
    if (toolbar) {
      toolbar.classList.add('hidden')
    }
    // Initialize login form
    initializeLoginForm()
  }, [])

  const handleMenuToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const toolbar = document.getElementById('toolbar')
    if (toolbar) {
      toolbar.classList.toggle('hidden')
    }
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-top">
            <h1><Link to="/">CarCore</Link></h1>
            <div className="account-section">
              <button className="account-btn" aria-label="Fiók">
                <span className="account-icon">👤</span>
                <span className="account-text">Bejelentkezés</span>
              </button>
            </div>
            <button id="menuToggle" className="menu-toggle" aria-label="Menü" onClick={handleMenuToggle}>☰</button>
          </div>
          <div className="toolbar" id="toolbar">
            <input id="searchInput" type="search" placeholder="Keresés névre, márkára, OEM számra..." />
            <select id="brandFilter">
              <option value="">Márka</option>
            </select>
            <select id="categoryFilter">
              <option value="">Kategória</option>
            </select>
            <button id="resetFilters">Szűrők törlése</button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className={`login-container ${!isLoginVisible ? 'hidden' : ''}`}>
          <h2>Bejelentkezés</h2>
          <form id="loginForm">
            <div className="form-group">
              <label htmlFor="email">E-mail cím:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Jelszó:</label>
              <div className="password-field">
                <input type="password" id="password" name="password" required />
                <button type="button" className="password-toggle" data-target="password">👁️</button>
              </div>
            </div>
            <button type="submit" className="login-btn">Bejelentkezés</button>
          </form>
          <p>Nincs még fiókod? <a href="#" id="registerLink" onClick={(e) => {
            e.preventDefault()
            setIsLoginVisible(false)
          }}>Regisztrálj itt</a></p>
        </div>

        <div className={`register-container ${isLoginVisible ? 'hidden' : ''}`}>
          <h2>Regisztráció</h2>
          <form id="registerForm">
            <div className="form-group">
              <label htmlFor="regEmail">E-mail cím:</label>
              <input type="email" id="regEmail" name="regEmail" required />
            </div>
            <div className="form-group">
              <label htmlFor="birthDate">Születési dátum:</label>
              <input type="date" id="birthDate" name="birthDate" required />
            </div>
            <div className="form-group">
              <label htmlFor="regPassword">Jelszó:</label>
              <div className="password-field">
                <input type="password" id="regPassword" name="regPassword" required />
                <button type="button" className="password-toggle" data-target="regPassword">👁️</button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Jelszó megerősítése:</label>
              <div className="password-field">
                <input type="password" id="confirmPassword" name="confirmPassword" required />
                <button type="button" className="password-toggle" data-target="confirmPassword">👁️</button>
              </div>
            </div>
            <button type="submit" className="register-btn">Regisztráció</button>
          </form>
          <p>Van már fiókod? <a href="#" id="loginLink" onClick={(e) => {
            e.preventDefault()
            setIsLoginVisible(true)
          }}>Jelentkezz be</a></p>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CarCore</h3>
              <p>Minőségi alkatrészek és autószerelési kellékek. Megbízható szolgáltatás, gyors szállítás.</p>
            </div>
            <div className="footer-section">
              <h4>Szolgáltatások</h4>
              <ul>
                <li><Link to="/szallitas">Szállítás</Link></li>
                <li><a href="#">Visszaküldés</a></li>
                <li><Link to="/garancia">Garancia</Link></li>
                <li><a href="#">Ügyfélszolgálat</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Kapcsolat</h4>
              <ul>
                <li>Email: info@carcore.hu</li>
                <li>Telefon: +36 1 234 5678</li>
                <li>Cím: Budapest, Magyarország</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CarCore. Minden jog fenntartva. | <a href="#">Adatvédelmi tájékoztató</a> | <a href="#">ÁSZF</a></p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default LoginPage
