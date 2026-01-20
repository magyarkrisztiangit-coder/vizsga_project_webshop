import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function OrderPreviewPage() {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)
  const [cart, setCart] = useState([])
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  })
  const [orderPlaced, setOrderPlaced] = useState(false)

  const fmt = (n) => new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(n)

  useEffect(() => {
    // Hide toolbar when page loads
    const toolbar = document.getElementById('toolbar')
    if (toolbar) {
      toolbar.classList.add('hidden')
    }
    
    const saved = localStorage.getItem('orderData')
    if (!saved) {
      alert('Nincs rendelési adat. Vissza a pénztárhoz.')
      navigate('/checkout')
      return
    }

    const data = JSON.parse(saved)
    setOrderData(data)
    setCart(data.cart || [])
  }, [navigate])

  const handleCardChange = (e) => {
    const { name, value } = e.target
    if (name === 'cardExpiry') {
      let cleanedValue = value.replace(/\D/g, '')
      if (cleanedValue.length >= 2) {
        cleanedValue = cleanedValue.substring(0, 2) + '/' + cleanedValue.substring(2, 4)
      }
      setCardData(prev => ({ ...prev, [name]: cleanedValue }))
    } else {
      setCardData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleConfirmOrder = () => {
    if (!cardData.cardNumber || !cardData.cardExpiry || !cardData.cardCvc || !cardData.cardName) {
      alert('Kérlek töltsd ki az összes kártya adatot.')
      return
    }
    
    localStorage.removeItem('cart')
    localStorage.removeItem('orderData')
    setOrderPlaced(true)
    
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  if (!orderData) {
    return <div>Betöltés...</div>
  }

  const SHIPPING = { csomagpont: 500, utanfvet: 1000 }
  const shippingFee = SHIPPING[orderData.shipping] || 0

  return (
    <>
      <style>{`
        :root {
          --bg: #0b1220;
          --card: #0f1724;
          --muted: #9aa4b2;
          --text: #e6eef6;
          --accent: #1e90ff;
          --accent-2: #0ea5e9;
          --success: #22c55e;
          --glass: rgba(255, 255, 255, 0.03);
        }
        .wrap { max-width: 800px; margin: 28px auto; padding: 20px; }
        .header h1 { font-size: 1.6rem; margin: 0; }
        .grid { display: grid; grid-template-columns: 1fr 380px; gap: 18px; }
        @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
        .card { background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 18px; }
        label { display: block; font-size: 0.86rem; color: var(--muted); margin-bottom: 6px; }
        input { width: 100%; padding: 11px; border-radius: 8px; background: var(--glass); border: 1px solid rgba(255,255,255,0.03); color: var(--text); font-size: 0.95rem; }
        .row { display: flex; gap: 12px; }
        .btn { background: var(--accent); color: white; padding: 10px 14px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: var(--text); padding: 9px 12px; border-radius: 8px; cursor: pointer; }
        .cart-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,0.03); }
        .muted { color: var(--muted); font-size: 0.92rem; }
        .summary { margin-top: 12px; }
        .total-big { display: flex; justify-content: space-between; align-items: end; padding-top: 16px; border-top: 2px solid rgba(255,255,255,0.02); margin-top: 12px; }
        .total-label { font-size: 0.95rem; color: var(--muted); }
        .total-amount { font-size: 1.6rem; font-weight: 800; color: var(--accent); }
        .success-message { color: var(--success); font-weight: 700; }
      `}</style>

      <div className="wrap">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1><Link to="/">CarCore</Link></h1>
            <div style={{ marginLeft: '8px' }}>
              <h2 style={{ margin: '0', fontSize: '1.1rem', fontWeight: 600 }}>Rendelés előnézet</h2>
              <p className="muted" style={{ margin: 0 }}>Ellenőrizd az adataidat</p>
            </div>
          </div>
        </header>

        <div className="grid">
          {!orderPlaced ? (
            <>
              <main className="card">
                <h4 style={{ margin: '0 0 8px' }}>Rendelés előnézet</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Név:</strong> {orderData.name}</div>
                  <div><strong>E-mail:</strong> {orderData.email}</div>
                  <div><strong>Szállítás:</strong> {orderData.shipping}</div>
                  <div><strong>Fizetés:</strong> {orderData.payment}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.03)' }}>
                    <div className="muted">Végösszeg</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{fmt(orderData.total)}</div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ margin: '0 0 8px' }}>Fizetési adatok</h4>
                    <div className="row">
                      <div style={{ flex: 1 }}>
                        <label htmlFor="card-number">Kártyaszám</label>
                        <input
                          type="text"
                          id="card-number"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label htmlFor="card-expiry">Lejárat (MM/YY)</label>
                        <input
                          type="text"
                          id="card-expiry"
                          name="cardExpiry"
                          placeholder="12/25"
                          value={cardData.cardExpiry}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label htmlFor="card-cvc">CVC</label>
                        <input
                          type="text"
                          id="card-cvc"
                          name="cardCvc"
                          placeholder="123"
                          value={cardData.cardCvc}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label htmlFor="card-name">Kártyán lévő név</label>
                        <input
                          type="text"
                          id="card-name"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardData.cardName}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={handleConfirmOrder} className="btn">Megrendelés elküldése</button>
                    <Link to="/checkout" className="btn-ghost" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Vissza a pénztárhoz
                    </Link>
                  </div>
                </div>
              </main>
            </>
          ) : (
            <main className="card">
              <div className="success-message">✓ Köszönjük! A rendelésed elküldésre került.</div>
              <p style={{ marginTop: '10px' }}>Sikeresen leadtad a rendelésed. Visszaigazolást fogsz kapni az e-mail címedre.</p>
            </main>
          )}

          <aside className="card">
            <h3 style={{ margin: '0 0 8px' }}>Rendelés áttekintés</h3>
            <div id="cart-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div>
                    {item.name}
                    <span className="muted" style={{ display: 'block' }}>db: {item.qty}</span>
                  </div>
                  <div>{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div className="summary">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="muted">Részösszeg</span>
                <span className="muted">{fmt(orderData.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span className="muted">Szállítás</span>
                <span className="muted">{fmt(shippingFee)}</span>
              </div>
              <div className="total-big">
                <div>
                  <div className="total-label">Összesen</div>
                  <div className="muted" style={{ fontSize: '0.92rem' }}>(fizetendő)</div>
                </div>
                <div className="total-amount">{fmt(orderData.total)}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

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

export default OrderPreviewPage
