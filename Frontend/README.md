# CarCore - Autóalkatrész Webáruház

A CarCore egy modern, React-alapú autóalkatrész webáruház, amely Vite-tel készült.

## 📁 Projekt Struktúra

```
Frontend/
├── src/
│   ├── pages/              # React komponens oldalak
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderPreviewPage.jsx
│   │   ├── WarrantyPage.jsx
│   │   └── ShippingPage.jsx
│   ├── lib/                # Utility függvények és modulok
│   │   ├── app.js
│   │   ├── card.js
│   │   ├── login.js
│   │   └── navbar-toggle.js
│   ├── styles/             # CSS fájlok
│   │   └── style.css
│   ├── App.jsx             # Gyökér komponens
│   ├── main.jsx            # Belépési pont
│   └── index.css           # Globális stílok
├── public/
│   ├── DATA/               # JSON adatbázis
│   │   └── data.json
│   └── IMAGES/             # Termékképek
├── index.html              # HTML sablon
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 🚀 Telepítés és Futtatás

### Előfeltételek
- Node.js (16+)
- npm vagy yarn

### Telepítés
```bash
cd Frontend
npm install
```

### Fejlesztési szerver
```bash
npm run dev
```
A szerver a `http://localhost:5175` címen indulna el.

### Produkciós build
```bash
npm run build
```

## 📝 Fájlok Leírása

### `src/pages/`
- **HomePage.jsx** - Termékek listázása, szűrés, keresés, kosár
- **LoginPage.jsx** - Bejelentkezés és regisztráció
- **CheckoutPage.jsx** - Pénztár és szállítási adatok
- **OrderPreviewPage.jsx** - Rendelés megerősítés és fizetés
- **WarrantyPage.jsx** - Garancia információ
- **ShippingPage.jsx** - Szállítás információ

### `src/lib/`
- **app.js** - Terméklist megjelenítés, szűrés, kosár kezelés
- **card.js** - Termékkalap hover effektusok
- **login.js** - Bejelentkezési form kezelés
- **navbar-toggle.js** - Hamburger menü kezelés

### `src/styles/`
- **style.css** - Globális CSS stílusok (sötét téma, reszponzív dizájn)

## 🎯 Funkciók

✅ Termékek megjelenítése és keresése
✅ Szűrés márka és kategória szerint
✅ Kosár kezelés (hozzáadás, módosítás, eltávolítás)
✅ localStorage adattárolás
✅ Felhasználói bejelentkezés (UI csak)
✅ Pénztár és rendelés feldolgozás
✅ Reszponzív tervezés
✅ Hamburger menü mobilnézethez

## 🛠️ Technológiák

- **React** 19.2.0 - UI framework
- **React Router** 6.x - Oldal navigáció
- **Vite** 7.3.1 - Build eszköz
- **CSS3** - Stílusok

## 📧 Kapcsolat

Email: info@carcore.hu
Telefon: +36 1 234 5678
