/**
 * Navbar Toggle
 * Az összecsukható navbar működése - minden képernyőméretnél
 */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const toolbar = document.getElementById("toolbar");

  if (!menuToggle || !toolbar) return;

  // Toggle gomb kattintás
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toolbar.classList.toggle("hidden");
  });

  // Toolbar bezárása, ha a keresés inputon ENTER-t nyomunk
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        toolbar.classList.add("hidden");
      }
    });
  }

  // Ne zárjuk be a toolbart a kosár gomb kattintásakor

  // Nem zárjuk be automatikusan más kattintásokra - csak a hamburger ikonra
});

