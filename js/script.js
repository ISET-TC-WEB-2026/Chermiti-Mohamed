// liste des produits
const produits = [
  {
    id: 1,
    nom: "Perceuse sans fil 18 V",
    categorie: "outillage",
    prix: 189.0,
    description: "Perceuse légère avec batterie et chargeur rapide.",
    image: "images/produits/produit1.jpg",
    specifications: ["Tension : 18 V", "Batterie et chargeur inclus", "Mandrin 13 mm"]
  },
  {
    id: 2,
    nom: "Marteau de charpentier",
    categorie: "outillage",
    prix: 29.9,
    description: "Marteau robuste avec manche antidérapant.",
    image: "images/produits/produit2.jpg",
    specifications: ["Tête en acier forgé", "Manche antidérapant", "Arrache-clou intégré"]
  },
  {
    id: 3,
    nom: "Peinture murale blanche 5 L",
    categorie: "peinture",
    prix: 64.9,
    description: "Peinture mate couvrante pour murs intérieurs.",
    image: "images/produits/produit3.jpg",
    specifications: ["Contenance : 5 L", "Finition mate", "Rendement : 10 m²/L"]
  },
  {
    id: 4,
    nom: "Lot de 5 pinceaux",
    categorie: "peinture",
    prix: 24.5,
    description: "Plusieurs tailles pour les surfaces et les finitions.",
    image: "images/produits/produit4.jpg",
    specifications: ["5 largeurs", "Poils synthétiques", "Toutes peintures"]
  },
  {
    id: 5,
    nom: "Boîte de vis à bois",
    categorie: "quincaillerie",
    prix: 18.5,
    description: "Boîte de 200 vis zinguées de différentes tailles.",
    image: "images/produits/produit5.jpg",
    specifications: ["200 pièces", "Acier zingué", "Tailles assorties"]
  },
  {
    id: 6,
    nom: "Jeu de tournevis isolés",
    categorie: "electricite",
    prix: 46.0,
    description: "Six tournevis isolés pour les travaux électriques.",
    image: "images/produits/produit6.jpg",
    specifications: ["Isolation 1000 V", "4 plats + 2 cruciformes", "Pointes aimantées"]
  },
  {
    id: 7,
    nom: "Ruban adhésif isolant",
    categorie: "electricite",
    prix: 6.8,
    description: "Ruban souple et résistant pour protéger les câbles.",
    image: "images/produits/produit7.jpg",
    specifications: ["Longueur : 20 m", "PVC isolant", "Couleur : Noir"]
  },
  {
    id: 8,
    nom: "Clé à molette 250 mm",
    categorie: "outillage",
    prix: 32.0,
    description: "Clé réglable en acier pour écrous et raccords.",
    image: "images/produits/produit8.jpg",
    specifications: ["Longueur : 250 mm", "Acier Chrome-Vanadium", "Graduation gravée"]
  }
];

let panier = [];

function formaterPrix(prix) {
  return prix.toFixed(3).replace(".", ",") + " DT";
}

//compteur panier
function majCompteur() {
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);
  document.querySelectorAll("#compteur-panier").forEach((el) => {
    el.textContent = total;
  });
}

majCompteur();

// ajouter au panier
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-ajouter")) return;

  const id = Number(e.target.dataset.produitId);
  const inputQte = document.querySelector("#quantite-produit");
  const quantite = inputQte ? Math.max(1, Number(inputQte.value)) : 1;

  const existant = panier.find((item) => item.id === id);

  if (existant) {
    existant.quantite += quantite;
  } else {
    panier.push({ id, quantite });
  }

  majCompteur();
});

// recherche et filtrage
const inputRecherche = document.querySelector("#recherche");
const selectCategorie = document.querySelector("#categorie");
const cartes = document.querySelectorAll(".carte-produit");

function filtrer() {
  const texte = inputRecherche ? inputRecherche.value.toLowerCase() : "";
  const cat = selectCategorie ? selectCategorie.value : "tous";

  cartes.forEach((carte) => {
    const titre = carte.querySelector("h3").textContent.toLowerCase();
    const okTexte = titre.includes(texte);
    const okCat = cat === "tous" || carte.dataset.categorie === cat;
    carte.style.display = okTexte && okCat ? "" : "none";
  });
}

if (inputRecherche) inputRecherche.addEventListener("input", filtrer);
if (selectCategorie) selectCategorie.addEventListener("change", filtrer);

// config du page détail produit 
if (window.location.pathname.includes("produit.html")) {
  const params =  new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  const produit = produits.find((p) => p.id === id) || produits[0];

  const img = document.querySelector("main img");
  const nom = document.querySelector("main h1");
  const prix = document.querySelector(".prix");
  const desc = document.querySelector(".description-produit");
  const specs = document.querySelector("main ul");
  const btn = document.querySelector(".btn-ajouter");

  if (img) img.src = produit.image;
  if (nom) nom.textContent = produit.nom;
  if (prix) prix.textContent = formaterPrix(produit.prix);
  if (desc) desc.textContent = produit.description;
  if (specs) specs.innerHTML = produit.specifications.map((s) => `<li>${s}</li>`).join("");
  if (btn) btn.dataset.produitId = produit.id;
}

// Page panier 
const zoneArticles = document.querySelector("#articles-panier");

function afficherPanier() {
  if (!zoneArticles) return;

  if (panier.length === 0) {
    zoneArticles.innerHTML = "<p>Votre panier est vide.</p>";
    calculerTotaux();
    return;
  }

  zoneArticles.innerHTML = panier
    .map((item) => {
      const p = produits.find((prod) => prod.id === item.id);
      if (!p) return "";
      return `
        <div class="article-panier">
          <span>${p.nom}</span>
          <span>${formaterPrix(p.prix)}</span>
          <input type="number" class="qte-panier" data-id="${p.id}" value="${item.quantite}" min="1">
          <span>${formaterPrix(p.prix * item.quantite)}</span>
          <button type="button" class="btn-supprimer" data-id="${p.id}">Supprimer</button>
        </div>
      `;
    })
    .join("");

  calculerTotaux();
}

function calculerTotaux() {
  const elSousTotal = document.querySelector("#sous-total");
  const elLivraison = document.querySelector("#frais-livraison");
  const elTotal = document.querySelector("#total-general");
  if (!elSousTotal) return;

  const sousTotal = panier.reduce((acc, item) => {
    const p = produits.find((prod) => prod.id === item.id);
    return p ? acc + p.prix * item.quantite : acc;
  }, 0);

  const livraison = sousTotal > 0 ? 7.0 : 0;
  const total = sousTotal + livraison;

  elSousTotal.textContent = formaterPrix(sousTotal);
  if (elLivraison) elLivraison.textContent = formaterPrix(livraison);
  if (elTotal) elTotal.textContent = formaterPrix(total);
}

if (zoneArticles) {
  afficherPanier();

  zoneArticles.addEventListener("change", (e) => {
    if (!e.target.classList.contains("qte-panier")) return;
    const id = Number(e.target.dataset.id);
    const qte = Math.max(1, Number(e.target.value) || 1);
    const item = panier.find((p) => p.id === id);
    if (item) {
      item.quantite = qte;
      majCompteur();
      afficherPanier();
    }
  });

  zoneArticles.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-supprimer"))  {
        return;
    }
    const id = Number(e.target.dataset.id);
    panier = panier.filter((item) => item.id !== id);
    majCompteur();
    afficherPanier();
  });
}

// commande 
const formCommande = document.querySelector("#formulaire-commande");
const msgConfirmation = document.querySelector("#message-confirmation");

if (formCommande) {
  calculerTotaux();

  formCommande.addEventListener("submit", (e) => {
    e.preventDefault();

    panier = [];
    majCompteur();
    calculerTotaux();
    formCommande.reset();

    if (msgConfirmation) {
      msgConfirmation.style.display = "block";
      msgConfirmation.hidden = false;
    }
  });
}