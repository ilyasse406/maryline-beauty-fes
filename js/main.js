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

const toile = document.getElementById("dust");
const pinceau = toile.getContext("2d");
const reduireMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let largeur = 0;
let hauteur = 0;
let paillettes = [];
let visible = true;

function preparerToile() {
  const densite = window.devicePixelRatio || 1;
  largeur = toile.clientWidth;
  hauteur = toile.clientHeight;
  toile.width = largeur * densite;
  toile.height = hauteur * densite;
  pinceau.setTransform(densite, 0, 0, densite, 0, 0);

  paillettes = [];
  for (let i = 0; i < 90; i++) {
    paillettes.push({
      x: largeur - Math.random() ** 2 * largeur,
      y: Math.random() ** 2 * hauteur,
      taille: Math.random() * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      vitesse: Math.random() * 1.5 + 0.5,
      chute: Math.random() * 0.15 + 0.03
    });
  }
}

function dessinerPaillettes(temps) {
  pinceau.clearRect(0, 0, largeur, hauteur);

  for (const p of paillettes) {
    const eclat = reduireMouvement ? 0.6 : (Math.sin(temps / 1000 * p.vitesse + p.phase) + 1) / 2;

    if (!reduireMouvement) {
      p.y += p.chute;
      if (p.y > hauteur) p.y = 0;
    }

    pinceau.globalAlpha = 0.15 + eclat * 0.85;
    pinceau.fillStyle = eclat > 0.85 ? "#FFF3D1" : "#D6A560";
    pinceau.beginPath();
    pinceau.arc(p.x, p.y, p.taille * (0.6 + eclat * 0.6), 0, Math.PI * 2);
    pinceau.fill();
  }

  if (!reduireMouvement && visible) {
    requestAnimationFrame(dessinerPaillettes);
  }
}

new ResizeObserver(() => {
  preparerToile();
  if (reduireMouvement) dessinerPaillettes(0);
}).observe(toile);

new IntersectionObserver(([entree]) => {
  const etaitVisible = visible;
  visible = entree.isIntersecting;
  if (visible && !etaitVisible && !reduireMouvement) {
    requestAnimationFrame(dessinerPaillettes);
  }
}).observe(document.getElementById("hero"));

requestAnimationFrame(dessinerPaillettes);

/* ============================================================
   ONGLETS DES TARIFS
   ============================================================ */

const onglets = document.querySelectorAll('[role="tab"]');
const etiquetteCategorie = document.getElementById("cat-label");

function activerOnglet(onglet, donnerFocus) {
  onglets.forEach((o) => {
    const actif = o === onglet;
    o.setAttribute("aria-selected", String(actif));
    o.tabIndex = actif ? 0 : -1;
    document.getElementById(o.getAttribute("aria-controls")).hidden = !actif;
  });

  etiquetteCategorie.textContent = onglet.textContent;

  if (donnerFocus) onglet.focus();
}

onglets.forEach((onglet, index) => {
  onglet.addEventListener("click", () => activerOnglet(onglet, false));

  onglet.addEventListener("keydown", (evenement) => {
    if (evenement.key === "ArrowRight") {
      activerOnglet(onglets[(index + 1) % onglets.length], true);
    }
    if (evenement.key === "ArrowLeft") {
      activerOnglet(onglets[(index - 1 + onglets.length) % onglets.length], true);
    }
  });
});