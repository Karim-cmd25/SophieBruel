import { displayWorks } from "./index.js";

// VARIABLES MODALES
const modalGallery = document.getElementById("modalGallery");
const modalAutre = document.getElementById("modalAutre");
const closeModalAutre = document.getElementById("closeModalAutre");
const addPhotoButton = document.getElementById("addPhotoButton");
const comebackButton = document.getElementById("comeback"); // Flèche pour revenir de modal 2 à modal 1
const modal1 = document.getElementById("myModal"); // Modal 1
const deleteModal = document.getElementById("deleteModal"); // Modal de confirmation de suppression

// FONCTION POUR AFFICHER LA GALERIE DANS LA MODAL
export function displayModalGallery(elem) {
  const fig = document.createElement("figure");
  fig.classList.add("gallery-item");
  fig.setAttribute("data-cat", elem.categoryId);
  fig.id = `mod_${elem.id}`;

  const img = document.createElement("img");
  img.alt = elem.title;
  img.src = elem.imageUrl;

  const caption = document.createElement("figcaption");
  caption.textContent = elem.title;

  const icon = document.createElement("img");
  icon.src = "assets/icons/trash.jpg";
  icon.classList.add("trashIcon");
  icon.addEventListener("click", () => {
    confirmDeletePhoto(elem.id); // Appel de la fonction de confirmation suppression
  });

  fig.appendChild(img);

  fig.appendChild(icon);
  modalGallery.appendChild(fig);
}

// FONCTION POUR CONFIRMER LA SUPPRESSION D'UNE PHOTO
function confirmDeletePhoto(id) {
  deleteModal.style.display = "block"; // Affiche la modal de confirmation

  // Gérer le clic sur le bouton "Supprimer"
  document.getElementById("confirmDelete").onclick = async () => {
    await deleteWorks(id); // Appelle la fonction de suppression
    deleteModal.style.display = "none"; // Ferme la modal après suppression
  };

  // Gérer le clic sur le bouton "Annuler"
  document.getElementById("cancelDelete").onclick = () => {
    deleteModal.style.display = "none"; // Ferme la modal sans supprimer
  };
}

// FONCTION POUR SUPPRIMER UN PROJET
async function deleteWorks(id) {
  const url = `http://localhost:5678/api/works/${id}`;
  const token = localStorage.getItem("token");

  if (!token) return;

  const options = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const result = await fetch(url, options);
    if (result.ok) {
      deleteItem(id);
    } else {
      console.error("Erreur lors de la suppression:", result.status);
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
  }
}

// FONCTION POUR SUPPRIMER UN ÉLÉMENT DU DOM
function deleteItem(id) {
  const modalItem = document.getElementById(`mod_${id}`);
  if (modalItem) modalItem.remove();
}

// FONCTION POUR OUVRIR LA MODAL D'AJOUT
export function displayModalAutre() {
  modalAutre.style.display = "block";
  populateCategorySelect();

  closeModalAutre.onclick = function () {
    modalAutre.style.display = "none";
  };

  comebackButton.onclick = function () {
    modalAutre.style.display = "none"; // Masquer la modal 2
    modal1.style.display = "block"; // Afficher la modal 1
  };

  window.onclick = function (event) {
    if (event.target === modalAutre) {
      modalAutre.style.display = "none";
    }
  };
}

// FONCTION POUR PEUPLER LE SÉLECTEUR DE CATÉGORIES
async function populateCategorySelect() {
  try {
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de réseau");
    const categories = await response.json();

    const categorySelect = document.getElementById("categorySelect");
    categorySelect.innerHTML = ""; // Clear previous options
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// FONCTION POUR TÉLÉCHARGER UNE PHOTO
async function uploadPhoto(file, title, categoryId) {
  const url = "http://localhost:5678/api/works";
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", categoryId);

  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const newPhoto = await response.json();
      displayWorks(newPhoto);
      displayModalGallery(newPhoto);
    } else {
      console.error("Erreur lors de l'envoi de la photo :", response.status);
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
  }
}

// ÉVÉNEMENT POUR GÉRER LA SOUMISSION DU FORMULAIRE D'AJOUT DE PHOTO

document
  .getElementById("addPhotoForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("photoFile");
    const titleInput = document.getElementById("photoTitle");
    const categorySelect = document.getElementById("categorySelect");
    const file = fileInput.files[0]; // Obtenir le fichier sélectionné
    const title = titleInput.value;
    const categoryId = categorySelect.value;

    // Vérifier que tous les champs sont remplis
    if (file && title && categoryId) {
      await uploadPhoto(file, title, categoryId); // Appel à la fonction de téléchargement
      modalAutre.style.display = "none"; // Masquer la modal après ajout
      document.getElementById("addPhotoForm").reset(); // Réinitialiser le formulaire
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  });

// INITIALISATION
document.addEventListener("DOMContentLoaded", function () {
  setupAddPhotoButton();
});

// FONCTION POUR CONFIGURER LE BOUTON D'AJOUT DE PHOTO
export function setupAddPhotoButton() {
  if (addPhotoButton) {
    // Lorsque l'utilisateur clique sur le bouton d'ajout de photo
    addPhotoButton.addEventListener("click", () => {
      modal1.style.display = "none"; // Masquer la modal 1
      displayModalAutre(); // Afficher la modal d'ajout de photo
    });
  }
}

// Sélectionner les éléments
// Sélectionner les éléments nécessaires dans le DOM
document.addEventListener("DOMContentLoaded", () => {
  const customFileInputButton = document.getElementById("photoUploadButton");
  const fileInput = document.getElementById("photoFile");
  const imagePreview = document.getElementById("imagePreview");
  const carreSection = document.querySelector(".carre"); // Cibler l'élément .carre
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  ); // Conteneur pour l'aperçu de l'image
  const montagneIcon = document.querySelector(".carre img"); // Icône montagne
  const texteJpg = document.querySelector(".carre p"); // Texte "jpg, png : 4mo max"

  if (customFileInputButton && fileInput && imagePreview) {
    // 1. Gérer le clic sur le bouton personnalisé pour ouvrir le sélecteur de fichier
    customFileInputButton.addEventListener("click", () => {
      fileInput.click(); // Simuler un clic sur l'input file caché
    });

    // 2. Gérer le changement de fichier sélectionné
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0]; // Récupérer le fichier sélectionné

      if (file) {
        // Afficher le nom du fichier sur le bouton
        customFileInputButton.textContent = `Fichier sélectionné: ${file.name}`;

        // Créer un objet FileReader pour lire le fichier
        const reader = new FileReader();

        // Lorsque la lecture est terminée, définir l'URL de l'image pour la prévisualisation
        reader.onload = function (e) {
          imagePreview.src = e.target.result; // Définir l'image source
          imagePreview.style.display = "block"; // Afficher l'image de prévisualisation
          imagePreviewContainer.style.display = "block"; // Afficher le conteneur de prévisualisation

          // Masquer les éléments spécifiques à l'intérieur de .carre
          customFileInputButton.style.display = "none"; // Masquer le bouton "+ Ajouter photo"
          montagneIcon.style.display = "none"; // Masquer l'icône montagne
          texteJpg.style.display = "none"; // Masquer le texte "jpg, png : 4mo max"
        };

        // Lire le fichier sous forme d'URL (Data URL)
        reader.readAsDataURL(file);
      } else {
        // Si aucun fichier n'est sélectionné, masquer la prévisualisation
        imagePreview.style.display = "none";
        imagePreviewContainer.style.display = "none"; // Cacher le conteneur de prévisualisation

        // Réafficher les éléments cachés
        customFileInputButton.style.display = "block"; // Réafficher le bouton "+ Ajouter photo"
        montagneIcon.style.display = "block"; // Réafficher l'icône montagne
        texteJpg.style.display = "block"; // Réafficher le texte "jpg, png : 4mo max"
        validerButton.classList.remove("vert");
      }
    });
  } else {
    console.error(
      "Un ou plusieurs éléments nécessaires n'ont pas été trouvés dans le DOM."
    );
  }
});
