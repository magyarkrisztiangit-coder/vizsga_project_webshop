/**
 * Card hover effect
 * Nagyítja a kártyákat, amikor az egér rámutat
 */

function attachCardHoverEffect() {
  const cards = document.querySelectorAll(".card");
  
  cards.forEach(card => {
    // Már van-e event listener-e? Ha igen, ne adjunk hozzá újat
    if (card.dataset.hoverAttached) return;
    card.dataset.hoverAttached = "true";
    
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.05)";
      card.style.transition = "transform 0.3s ease-in-out";
      card.style.zIndex = "100";
      card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "scale(1)";
      card.style.zIndex = "1";
      card.style.boxShadow = "none";
    });
  });
}

// Első futtatás
document.addEventListener("DOMContentLoaded", attachCardHoverEffect);

// Observer az dinamikusan létrehozott kártyákhoz
const observer = new MutationObserver(() => {
  attachCardHoverEffect();
});

observer.observe(document.getElementById("products") || document.body, {
  childList: true,
  subtree: true
});
