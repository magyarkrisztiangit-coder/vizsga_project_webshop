import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/style.css'

function ShippingPage() {
  useEffect(() => {
    // Hide toolbar when page loads
    const toolbar = document.getElementById('toolbar')
    if (toolbar) {
      toolbar.classList.add('hidden')
    }
  }, [])
  
  return (
    <>
      <style>{`
        .shipping-container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
        .shipping-header { text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #007bff; }
        .shipping-header h1 { font-size: 2.5rem; color: #333; margin-bottom: 0.5rem; }
        .shipping-header p { font-size: 1.1rem; color: #666; }
        .shipping-section { margin-bottom: 3rem; padding: 2rem; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #007bff; }
        .shipping-section h2 { font-size: 1.8rem; color: #007bff; margin-bottom: 1.5rem; margin-top: 0; }
        .shipping-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .method-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease; }
        .method-card:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .method-card h3 { color: #007bff; margin-top: 0; margin-bottom: 1rem; font-size: 1.3rem; }
        .method-card p { color: #555; line-height: 1.6; margin: 0.5rem 0; }
        .price-tag { font-weight: bold; color: #28a745; font-size: 1.1rem; margin-top: 1rem; }
        .delivery-time { color: #666; font-style: italic; margin-top: 0.5rem; }
        .info-list { list-style: none; padding: 0; }
        .info-list li { padding: 0.5rem 0; padding-left: 1.5rem; position: relative; color: #555; }
        .info-list li:before { content: "✓"; position: absolute; left: 0; color: #007bff; font-weight: bold; }
        .back-link { display: inline-block; margin-bottom: 2rem; color: #007bff; text-decoration: none; font-weight: 500; }
        .back-link:hover { text-decoration: underline; }
      `}</style>

      <header className="header">
        <div className="container">
          <div className="header-top">
            <h1><Link to="/">CarCore</Link></h1>
            <div className="header-right">
              <button className="account-btn" aria-label="Fiók">
                <span className="account-icon">👤</span>
                <span className="account-text">Bejelentkezés</span>
              </button>
              <button id="cartButton" className="cart-btn" aria-label="Kosár">Kosár (<span id="cartCount">0</span>)</button>
              <button id="menuToggle" className="menu-toggle" aria-label="Menü">☰</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="shipping-container">
          <Link to="/" className="back-link">← Vissza a főoldalra</Link>

          <div className="shipping-header">
            <h1>📦 Szállítási Információk</h1>
            <p>Ismerje meg szállítási lehetőségeinket és kiválasztható módszereinket</p>
          </div>

          <section className="shipping-section">
            <h2>Hogyan működik a szállítás?</h2>
            <p>CarCore-nál a szállítási folyamat egyszerű és megbízható:</p>
            <ul className="info-list">
              <li>Rendelést leadja az webshopunkon keresztül</li>
              <li>Megkapja a rendelés visszaigazolást e-mailben</li>
              <li>Raktárunkban előkészítjük a terméket</li>
              <li>A kiválasztott szállítónak átadásra kerül</li>
              <li>Nyomkövetési szám küldésre kerül Önnek</li>
              <li>Termék biztonságosan érkezik meg címére</li>
            </ul>
          </section>

          <section className="shipping-section">
            <h2>Szállítási Módok és Eszközök</h2>
            <div className="shipping-methods">
              <div className="method-card">
                <h3>🏪 Személyes átvétel</h3>
                <p>Vegyék át közvetlenül raktárunkból Budapest megjelölt helyén.</p>
                <div className="price-tag">Ingyenes</div>
                <div className="delivery-time">Átvétel: azonnal (munkanapok)</div>
              </div>

              <div className="method-card">
                <h3>🚚 GLS Kurier</h3>
                <p>Megbízható és gyors szállítás az ország bármely pontjára GLS flottájával.</p>
                <div className="price-tag">1.290 Ft - 2.490 Ft</div>
                <div className="delivery-time">Szállítás: 1-3 munkanap</div>
              </div>

              <div className="method-card">
                <h3>📫 DPD Express</h3>
                <p>Expresz szállítás DPD hálózatán keresztül az ország egész területére.</p>
                <div className="price-tag">2.490 Ft - 3.990 Ft</div>
                <div className="delivery-time">Szállítás: 24-48 óra</div>
              </div>

              <div className="method-card">
                <h3>🏤 Magyar Posta</h3>
                <p>Hagyományos postai szállítás gazdaságos megoldás kisebb csomagokhoz.</p>
                <div className="price-tag">890 Ft - 1.890 Ft</div>
                <div className="delivery-time">Szállítás: 3-5 munkanap</div>
              </div>

              <div className="method-card">
                <h3>📦 Foxpost Csomagautomata</h3>
                <p>Önkiszolgáló csomagátvételi automata szolgáltatás Magyarország több városában.</p>
                <div className="price-tag">990 Ft - 1.490 Ft</div>
                <div className="delivery-time">Szállítás: 2-4 munkanap</div>
              </div>

              <div className="method-card">
                <h3>🌍 DHL Paketshop</h3>
                <p>Nemzetközi és hazai szállítás kiváló minőségben DHL networkön.</p>
                <div className="price-tag">1.890 Ft - 4.990 Ft</div>
                <div className="delivery-time">Szállítás: 2-3 munkanap</div>
              </div>
            </div>
          </section>

          <section className="shipping-section">
            <h2>Szállítási Feltételek</h2>
            <ul className="info-list">
              <li>Ingyenes szállítás 50.000 Ft feletti rendeléseknél (GLS)</li>
              <li>Személyes átvétel mindig ingyenes</li>
              <li>Szombati szállítás felára: +500 Ft</li>
              <li>Nyomkövetési szám küldése e-mailben azonnal a feladás után</li>
              <li>Csomagok biztosítottak az alapértékelmen belül</li>
            </ul>
          </section>

          <Link to="/" className="back-link">← Vissza a főoldalra</Link>
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

export default ShippingPage
