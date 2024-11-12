import { displayModalGallery, setupAddPhotoButton } from "./modal.js";

// Fonction pour récupérer les données des travaux
async function getData() {
  try {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de réseau");
    const data = await response.json();

    console.log("Données récupérées :", data);

    data.forEach((elem) => {
      displayWorks(elem);
      displayModalGallery(elem); // Utilisation de la fonction importée
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Fonction pour afficher les travaux dans la galerie principale
export function displayWorks(elem) {
  const gallery = document.getElementById("gallery");
  const fig = document.createElement("figure");
  fig.setAttribute("class", "gallery-item");
  fig.setAttribute("data-cat", elem.categoryId);
  fig.setAttribute("id", `gal_${elem.id}`); // Ajout de l'ID

  const img = document.createElement("img");
  img.setAttribute("alt", elem.title);
  img.setAttribute("src", elem.imageUrl);

  const caption = document.createElement("figcaption");
  caption.textContent = elem.title;

  fig.appendChild(img);
  fig.appendChild(caption);
  gallery.appendChild(fig);
}

// Fonction pour récupérer les catégories
async function getCategories() {
  try {
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de réseau");
    const categories = await response.json();

    displayCategoriesButtons(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// Fonction pour afficher les boutons de catégories
function displayCategoriesButtons(categories) {
  const buttonContainer = document.getElementById("boutton");

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => filterWorks(0));
  buttonContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.setAttribute("data-cat", category.id);
    button.addEventListener("click", () => filterWorks(category.id));
    buttonContainer.appendChild(button);
  });
}

// Fonction pour filtrer les travaux par catégorie
function filterWorks(categoryId) {
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    if (categoryId === 0 || item.getAttribute("data-cat") == categoryId) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Fonction principale exécutée lorsque le DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  const deleteModal = document.getElementById("deleteModal");
  const closeDeleteModal = document.getElementById("closeDeleteModal");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");
  const editButton = document.getElementById("editButton");
  const modifierSection = document.querySelector(".modifier");
  const myModal = document.getElementById("myModal");
  const closeModal = document.getElementById("closeModal");
  const editionDiv = document.getElementById("edition");
  const filtersContainer = document.getElementById("boutton"); // Conteneur des boutons de filtre

  // Fonction de vérification d'authentification
  function isAuthenticated() {
    const token = localStorage.getItem("token");
    // Afficher ou masquer la section "modifier" en fonction de la présence du token
    modifierSection.style.display = token ? "flex" : "none";
    editionDiv.style.display = token ? "flex" : "none";

    // Masquer les filtres si l'utilisateur est connecté
    filtersContainer.style.display = token ? "none" : "flex";
  }

  // Fonction pour ouvrir la modale de modification
  function openModal() {
    const token = localStorage.getItem("token");
    if (token) {
      myModal.style.display = "block";
    } else {
      alert("Veuillez vous connecter pour modifier.");
    }
  }

  // Gestion de la connexion et de la déconnexion
  const stateLog = document.querySelector('a[href="./login.html"]');
  const token = localStorage.getItem("token");

  if (stateLog) {
    if (token) {
      stateLog.textContent = "Logout";
      stateLog.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.clear(); // Effacer le token
        window.location.reload(); // Recharger la page pour mettre à jour l'interface
      });
    } else {
      stateLog.textContent = "Login";
    }
  }

  // Afficher ou masquer les éléments en fonction de l'authentification
  isAuthenticated();

  if (editButton) {
    editButton.addEventListener("click", openModal);
  }

  if (editionDiv) {
    editionDiv.addEventListener("click", openModal);
  }

  closeModal.onclick = function () {
    myModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === myModal || event.target === deleteModal) {
      myModal.style.display = "none";
      deleteModal.style.display = "none";
    }
  };

  closeDeleteModal.onclick = function () {
    deleteModal.style.display = "none";
  };

  confirmDelete.addEventListener("click", function () {
    console.log("Photo supprimée");
    deleteModal.style.display = "none";
  });

  cancelDelete.addEventListener("click", function () {
    deleteModal.style.display = "none";
  });

  // Appels aux fonctions pour récupérer les travaux et les catégories
  getData();
  getCategories();
  setupAddPhotoButton(); // Initialiser le bouton d'ajout de photo
});
