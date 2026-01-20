import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ search: '', brand: '', category: '' })
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const cartCountRef = useRef(0)
  const productsRef = useRef([])

  const itemsPerPage = 9

  // Initialize on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/DATA/data.json")
        const data = await res.json()
        productsRef.current = Array.isArray(data) ? data : []
        setProducts(productsRef.current)
        setFilteredProducts(productsRef.current)
        
        // Extract brands and categories
        const brandSet = new Set()
        const catSet = new Set()
        productsRef.current.forEach(p => {
          if (p.brand) brandSet.add(p.brand)
          if (p.category) catSet.add(p.category)
        })
        
        setBrands(Array.from(brandSet).sort())
        setCategories(Array.from(catSet).sort())
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            // Filter out invalid cart items
            const validCart = Array.isArray(parsedCart) ? parsedCart.filter(item => item && item.id && item.price !== undefined && item.qty) : []
            setCart(validCart)
          } catch (err) {
            console.error("Error parsing cart:", err)
            setCart([])
          }
        }
      } catch (err) {
        console.error("Error loading data:", err)
      }
    }
    
    // Hide toolbar when page loads
    const toolbar = document.getElementById('toolbar')
    if (toolbar) {
      toolbar.classList.add('hidden')
    }
    
    loadData()
  }, [])
  // Filter products
  useEffect(() => {
    let filtered = productsRef.current
    
    if (filters.search) {
      const needle = filters.search.toLowerCase()
      filtered = filtered.filter(p => {
        const hay = `${p.name || ''} ${p.brand || ''} ${p.oem || ''}`.toLowerCase()
        return hay.includes(needle)
      })
    }
    
    if (filters.brand) {
      filtered = filtered.filter(p => {
        const norm = s => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '')
        const pbrand = norm(p.brand || '')
        const sbrand = norm(filters.brand || '')
        return pbrand.includes(sbrand) || sbrand.includes(pbrand)
      })
    }
    
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }
    
    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [filters])

  // Format price
  const formatPrice = (n) => {
    return Number(n || 0).toLocaleString("hu-HU")
  }

  // Add to cart
  const handleAddToCart = (product) => {
    const newCart = [...cart]
    const idx = newCart.findIndex(i => i.id === product.id)
    
    if (idx !== -1) {
      // Increase quantity if item exists
      newCart[idx].qty = Math.min((newCart[idx].qty || 0) + 1, product.stock || newCart[idx].qty)
      // Move to front
      const updatedItem = newCart.splice(idx, 1)[0]
      newCart.unshift(updatedItem)
    } else {
      // Add new item
      newCart.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        qty: 1
      })
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  // Update cart quantity
  const changeQty = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, Math.min((item.qty || 1) + delta, item.stock || Infinity))
        return newQty === 0 ? null : { ...item, qty: newQty }
      }
      return item
    }).filter(Boolean)
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  // Remove from cart
  const removeItem = (id) => {
    const newCart = cart.filter(i => i.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const pageItems = filteredProducts.slice(startIdx, endIdx)

  const cartTotal = cart.reduce((sum, i) => sum + ((i?.price || 0) * (i?.qty || 0)), 0)
  const cartCount = cart.reduce((sum, i) => sum + (i?.qty || 0), 0)

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-top">
            <h1><Link to="/">CarCore</Link></h1>
            <div className="header-right">
              <button className="account-btn" aria-label="Fiók">
                <span className="account-icon">👤</span>
                <span className="account-text">
                  <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Bejelentkezés
                  </Link>
                </span>
              </button>
              <button id="cartButton" className="cart-btn" aria-label="Kosár" onClick={() => setCartOpen(!cartOpen)}>
                Kosár (<span id="cartCount">{cartCount}</span>)
              </button>
              <button id="menuToggle" className="menu-toggle" aria-label="Menü" onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const toolbar = document.getElementById("toolbar")
                if (toolbar) {
                  toolbar.classList.toggle("hidden")
                }
              }}>☰</button>
            </div>
          </div>
          <div className="toolbar" id="toolbar">
            <input 
              id="searchInput" 
              type="search" 
              placeholder="Keresés névre, márkára, OEM számra..." 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <select 
              id="brandFilter"
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
            >
              <option value="">Márka</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select 
              id="categoryFilter"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">Kategória</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button id="resetFilters" onClick={() => {
              setFilters({ search: '', brand: '', category: '' })
              setCurrentPage(1)
            }}>Szűrők törlése</button>
          </div>
        </div>
      </header>

      <main className="container">
        <section id="products" className="grid">
          {pageItems.length === 0 ? (
            <p>Nincs találat a megadott szűrők alapján.</p>
          ) : (
            pageItems.map(p => (
              <div key={p.id} className="card">
                <img className="card-img" src={p.image || ""} alt={p.name || "Termék"} />
                <div className="card-body">
                  <h3 className="card-title">{p.name}</h3>
                  <div className="meta">
                    <span className="brand">{p.brand || "Ismeretlen márka"}</span> | <span className="category">{p.category || "Kategória nélkül"}</span>
                  </div>
                  {p.oem && <div className="oem">OEM: {p.oem}</div>}
                  {Array.isArray(p.compatible) && p.compatible.length > 0 && (
                    <div className="compat">Kompatibilis: {p.compatible.map(c => `${c.make} ${c.model} (${c.yearFrom || ""}-${c.yearTo || ""})`).join(", ")}</div>
                  )}
                  {!Array.isArray(p.compatible) || p.compatible.length === 0 && <div className="compat">Kompatibilitás nincs megadva</div>}
                  <div className="desc">{p.description || ""}</div>
                  <div className="price">{formatPrice(p.price)} Ft</div>
                  <div className="stock">{p.stock > 0 ? `Raktáron: ${p.stock} db` : "Nincs raktáron"}</div>
                  <button className="addToCart" disabled={p.stock <= 0} onClick={() => handleAddToCart(p)}>Kosárba</button>
                </div>
              </div>
            ))
          )}
        </section>
        <div id="pagination" className="pagination">
          {totalPages > 1 && (
            <>
              <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Előző
              </button>
              <span className="pagination-info">Oldal {currentPage} / {totalPages}</span>
              <button 
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Következő →
              </button>
            </>
          )}
        </div>
      </main>

      <div id="cartModal" className={`modal ${cartOpen ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Kosár</h2>
            <button id="closeCart" aria-label="Bezárás" onClick={() => setCartOpen(false)}>×</button>
          </div>
          <div id="cartItems">
            {!cart || cart.length === 0 ? (
              <p>A kosár üres.</p>
            ) : (
              cart.filter(item => item && item.id && item.price !== undefined).map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image || ""} alt={item.name || "Termék"} />
                  <div>
                    <div className="title">{item.name}</div>
                    <div className="muted">{formatPrice(item.price || 0)} Ft / db</div>
                  </div>
                  <div className="qty-controls">
                    <button onClick={() => changeQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, +1)}>+</button>
                    <button onClick={() => removeItem(item.id)}>Eltávolítás</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="cart-footer">
            <div className="total">
              <strong>Összesen:</strong>
              <span id="cartTotal">{formatPrice(cartTotal)} Ft</span>
            </div>
            <button id="clearCartBtn" className="btn-secondary" onClick={clearCart}>Kosár ürítése</button>
            <Link to="/checkout" className="btn-primary" style={{ textDecoration: 'none', color: 'white' }} onClick={() => setCartOpen(false)}>
              Pénztárhoz
            </Link>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop ${cartOpen ? '' : 'hidden'}`} id="backdrop" onClick={() => setCartOpen(false)}></div>

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

export default HomePage
