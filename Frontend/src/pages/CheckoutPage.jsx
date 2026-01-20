import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function CheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zip: '',
    city: '',
    address: '',
    shipping: 'csomagpont',
    payment: 'bank',
    pickup: ''
  })
  const [showPickupOther, setShowPickupOther] = useState(false)

  const SHIPPING_FEES = {
    csomagpont: 500,
    utanfvet: 1000
  }

  useEffect(() => {
    // Hide toolbar when page loads
    const toolbar = document.getElementById('toolbar')
    if (toolbar) {
      toolbar.classList.add('hidden')
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleShippingChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, shipping: value }))
    if (value === 'csomagpont') {
      setShowPickupOther(false)
    }
  }

  const handlePickupChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, pickup: value }))
    if (value === 'Másik (kézzel megadható)') {
      setShowPickupOther(true)
    } else {
      setShowPickupOther(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      zip: '',
      city: '',
      address: '',
      shipping: 'csomagpont',
      payment: 'bank',
      pickup: ''
    })
    setShowPickupOther(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      alert('Kérlek töltsd ki a nevet és e-mail címet.')
      return
    }
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const shippingFee = SHIPPING_FEES[formData.shipping] || 0
    const total = subtotal + shippingFee

    // Save order data
    localStorage.setItem('orderData', JSON.stringify({
      ...formData,
      total,
      cart,
      subtotal
    }))

    navigate('/order-preview')
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shippingFee = SHIPPING_FEES[formData.shipping] || 0
  const total = subtotal + shippingFee

  const fmt = (n) => new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(n)

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
          --danger: #ff6b6b;
          --glass: rgba(255, 255, 255, 0.03);
        }
        * { box-sizing: border-box; }
        .wrap { max-width: 1100px; margin: 28px auto; padding: 20px; }
        .header h1 { font-size: 1.6rem; margin: 0; }
        .grid { display: grid; grid-template-columns: 1fr 380px; gap: 18px; }
        @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
        .card { background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 18px; }
        label { display: block; font-size: 0.86rem; color: var(--muted); margin-bottom: 6px; }
        input, select, textarea { width: 100%; padding: 11px; border-radius: 8px; background: var(--glass); border: 1px solid rgba(255,255,255,0.03); color: var(--text); font-size: 0.95rem; }
        .row { display: flex; gap: 12px; }
        .section { margin-bottom: 14px; }
        .radio-row { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 8px; }
        input[type=radio] { width: 16px; height: 16px; }
        .btn { background: var(--accent); color: white; padding: 10px 14px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: var(--text); padding: 9px 12px; border-radius: 8px; cursor: pointer; }
        .cart-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,0.03); }
        .muted { color: var(--muted); font-size: 0.92rem; }
        .summary { margin-top: 12px; }
        .total-big { display: flex; justify-content: space-between; align-items: end; padding-top: 16px; border-top: 2px solid rgba(255,255,255,0.02); margin-top: 12px; }
        .total-label { font-size: 0.95rem; color: var(--muted); }
        .total-amount { font-size: 1.6rem; font-weight: 800; color: var(--accent); }
      `}</style>

      <div className="wrap">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1><Link to="/">CarCore</Link></h1>
            <div style={{ marginLeft: '8px' }}>
              <h2 style={{ margin: '0', fontSize: '1.1rem', fontWeight: 600 }}>Pénztár</h2>
              <p className="muted" style={{ margin: 0 }}>Teljesítés és fizetés — biztonságos, gyors</p>
            </div>
          </div>
        </header>

        <div className="grid">
          {/* Bal oldal: checkout form */}
          <main className="card">
            <form onSubmit={handleSubmit}>
              <div className="section">
                <h3 style={{ margin: '0 0 8px' }}>Szállítási adatok</h3>
                <div className="row">
                  <div style={{ flex: 1 }}>
                    <label htmlFor="name">Teljes név</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Kiss János"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ width: '160px' }}>
                    <label htmlFor="phone">Telefonszám</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+36 20 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="valaki@pelda.hu"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ marginTop: '12px' }} className="row">
                  <div style={{ width: '160px' }}>
                    <label htmlFor="zip">Irányítószám</label>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      placeholder="1111"
                      value={formData.zip}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="city">Város</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Budapest"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="address">Utca, házszám</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Fő utca 1."
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="section">
                <h3 style={{ margin: '0 0 8px' }}>Szállítási mód</h3>
                <div>
                  <label className="radio-row">
                    <input
                      type="radio"
                      name="shipping"
                      value="csomagpont"
                      checked={formData.shipping === 'csomagpont'}
                      onChange={handleShippingChange}
                    />
                    Csomagponti átvétel
                    <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>+500 Ft</span>
                  </label>
                  <div style={{ margin: '8px 0 0 26px' }}>
                    <label htmlFor="pickup">Válassz csomagpontot</label>
                    <select
                      id="pickup"
                      value={formData.pickup}
                      onChange={handlePickupChange}
                    >
                      <option value="">-- Válassz --</option>
                      <option>Budapest — Deák Ferenc tér</option>
                      <option>Debrecen — Piac utca</option>
                      <option>Szeged — Kossuth Lajos sgt.</option>
                      <option>Másik (kézzel megadható)</option>
                    </select>
                    {showPickupOther && (
                      <div style={{ marginTop: '8px' }}>
                        <input
                          type="text"
                          placeholder="Csomagpont címe"
                          value={formData.pickupText || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pickupText: e.target.value
                          }))}
                        />
                      </div>
                    )}
                  </div>

                  <label className="radio-row" style={{ marginTop: '8px' }}>
                    <input
                      type="radio"
                      name="shipping"
                      value="utanfvet"
                      checked={formData.shipping === 'utanfvet'}
                      onChange={handleShippingChange}
                    />
                    Utánvételes szállítás
                    <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>+1000 Ft</span>
                  </label>
                </div>
              </div>

              <div className="section">
                <h3 style={{ margin: '0 0 8px' }}>Fizetés</h3>
                <label className="radio-row">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={formData.payment === 'paypal'}
                    onChange={handleInputChange}
                  />
                  PayPal
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>Online</span>
                </label>
                <label className="radio-row" style={{ marginTop: '6px' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={formData.payment === 'bank'}
                    onChange={handleInputChange}
                  />
                  Banki átutalás
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>Díjmentes</span>
                </label>
                <label className="radio-row" style={{ marginTop: '6px' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.payment === 'cod'}
                    onChange={handleInputChange}
                  />
                  Utánvét (készpénz)
                </label>

                {formData.payment === 'bank' && (
                  <div style={{ marginTop: '10px' }} className="muted">
                    Banki átutalás: 12345678-12345678-12345678 — Kérjük add meg a rendelés számát a közleményben.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                <button type="submit" className="btn">Rendelés leadása</button>
                <button type="button" onClick={handleReset} className="btn-ghost">Űrlap törlése</button>
              </div>
            </form>
          </main>

          {/* Jobb oldal: kosár összegzés */}
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
                <span className="muted">{fmt(subtotal)}</span>
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
                <div className="total-amount">{fmt(total)}</div>
              </div>
            </div>

            <div style={{ marginTop: '12px' }} className="muted">
              Megjegyzés: Az utánvétes fizetés a kiválasztott szállítási díjjal együtt adódik.
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

export default CheckoutPage
