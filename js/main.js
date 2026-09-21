const burger = document.getElementById("burger");
const menu = document.getElementById("menu-mobile");

burger.addEventListener("click", () => {
  const estOuvert = burger.getAttribute("aria-expanded") === "true";

  menu.hidden = estOuvert;
  burger.setAttribute("aria-expanded", String(!estOuvert));
  burger.setAttribute("aria-label", estOuvert ? "Ouvrir le menu" : "Fermer le menu");
});

menu.querySelectorAll("a").forEach((lien) => {
  lien.addEventListener("click", () => {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu");
  });
});