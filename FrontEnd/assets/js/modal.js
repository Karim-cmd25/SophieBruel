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
    deleteWorks(elem.id);
  });

  fig.appendChild(img);
  fig.appendChild(icon);
  modalGallery.appendChild(fig);
  window.addEventListener("click", function (event) {
    if (event.target === modal1) {
      modal1.style.display = "none"; // Fermer modal 1 si on clique en dehors
    }
  });
}

// FONCTION POUR SUPPRIMER UN PROJET
async function deleteWorks(id) {
  if (confirm("Voulez-vous supprimer cette photo ?")) {
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
  return false;
}

// FONCTION POUR SUPPRIMER UN ÉLÉMENT DU DOM
function deleteItem(id) {
  const modalItem = document.getElementById(`mod_${id}`);
  if (modalItem) modalItem.remove();
  const galleryItems = document.getElementById(`gal_${id}`);
  if (galleryItems) galleryItems.remove();
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
      displayModalGallery(newPhoto); // Afficher la nouvelle photo dans la galerie

      // Réinitialiser le formulaire et l'image de prévisualisation
      resetForm();

      // Vérifier les conditions pour activer/désactiver le bouton "Valider"
      checkConditions();
    } else {
      console.error("Erreur lors de l'envoi de la photo :", response.status);
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
  }
}

// FONCTION POUR RÉINITIALISER LE FORMULAIRE
function resetForm() {
  const photoTitle = document.getElementById("photoTitle");
  const categorySelect = document.getElementById("categorySelect");
  const imagePreview = document.getElementById("imagePreview");
  const customFileInputButton = document.getElementById("photoUploadButton");

  // Réinitialiser les champs de texte
  photoTitle.value = "";
  categorySelect.value = "";

  // Réinitialiser la prévisualisation de l'image
  imagePreview.style.display = "none"; // Cacher l'image prévisualisée
  document.getElementById("imagePreviewContainer").style.display = "none"; // Cacher le conteneur de prévisualisation

  // Réinitialiser le texte du bouton d'upload
  customFileInputButton.textContent = "+ Ajouter photo";

  // Réafficher les éléments masqués
  customFileInputButton.style.display = "block";
  document.querySelector(".carre img").style.display = "block"; // Réafficher l'icône montagne
  document.querySelector(".carre p").style.display = "block"; // Réafficher le texte "jpg, png : 4mo max"

  // Réinitialiser le bouton "Valider"
  const validerButton = document.querySelector("button.vert");
  validerButton.classList.remove("valid");
  validerButton.disabled = true; // Désactiver le bouton
  validerButton.style.setProperty("background-color", "#ccc", "important");
  validerButton.style.setProperty("color", "#fff", "important");
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
      // Ne pas fermer la modal ici
      resetForm(); // Réinitialiser le formulaire après soumission
      checkConditions(); // Vérifier l'état du bouton
    } else {
      alert("Veuillez remplir tous les champs.");
    }
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

// Sélectionner les éléments nécessaires dans le DOM
document.addEventListener("DOMContentLoaded", () => {
  const customFileInputButton = document.getElementById("photoUploadButton");
  const fileInput = document.getElementById("photoFile");
  const imagePreview = document.getElementById("imagePreview");
  const photoTitle = document.getElementById("photoTitle");
  const categorySelect = document.getElementById("categorySelect");
  const validerButton = document.querySelector("button.vert");

  // Fonction pour vérifier si toutes les conditions sont remplies
  function checkConditions() {
    const isPhotoUploaded = imagePreview.style.display === "block";
    const isTitleEntered = photoTitle.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    // Si toutes les conditions sont remplies, ajouter la classe "valid" au bouton
    if (isPhotoUploaded && isTitleEntered && isCategorySelected) {
      validerButton.classList.add("valid"); // Ajouter la classe pour rendre le bouton vert
      validerButton.disabled = false; // Activer le bouton

      validerButton.style.setProperty(
        "background-color",
        "#1d6154",
        "important"
      );
      validerButton.style.setProperty("color", "white", "important");
    } else {
      validerButton.classList.remove("valid"); // Retirer la classe pour revenir à l'état initial
      validerButton.disabled = true; // Désactiver le bouton
      // Réinitialiser la couleur du bouton en utilisant !important
      validerButton.style.setProperty("background-color", "#ccc", "important");
      validerButton.style.setProperty("color", "#fff", "important");
    }
  }

  // 1. Gérer le clic sur le bouton personnalisé pour ouvrir le sélecteur de fichier
  customFileInputButton.addEventListener("click", () => {
    fileInput.click(); // Simuler un clic sur l'input file caché
  });

  // 2. Gérer le changement de fichier sélectionné
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0]; // Récupérer le fichier sélectionné
    const maxfile = 4 * 1024 * 1024; // Taille maximale du fichier (4 Mo)

    if (file && file.size < maxfile) {
      // Afficher le nom du fichier sur le bouton
      customFileInputButton.textContent = `Fichier sélectionné: ${file.name}`;

      // Créer un objet FileReader pour lire le fichier
      const reader = new FileReader();

      // Lorsque la lecture est terminée, définir l'URL de l'image pour la prévisualisation
      reader.onload = function (e) {
        imagePreview.src = e.target.result; // Définir l'image source
        imagePreview.style.display = "block"; // Afficher l'image de prévisualisation
        document.getElementById("imagePreviewContainer").style.display =
          "block"; // Afficher le conteneur de prévisualisation

        // Masquer les éléments spécifiques à l'intérieur de .carre
        customFileInputButton.style.display = "none"; // Masquer le bouton "+ Ajouter photo"
        document.querySelector(".carre img").style.display = "none"; // Masquer l'icône montagne
        document.querySelector(".carre p").style.display = "none"; // Masquer le texte "jpg, png : 4mo max"
      };

      // Lire le fichier sous forme d'URL (Data URL)
      reader.readAsDataURL(file);
    } else {
      alert("fichier trop lourd");
      // Si aucun fichier n'est sélectionné, masquer la prévisualisation
      imagePreview.style.display = "none";
      document.getElementById("imagePreviewContainer").style.display = "none"; // Cacher le conteneur de prévisualisation

      // Réafficher les éléments cachés
      customFileInputButton.style.display = "block"; // Réafficher le bouton "+ Ajouter photo"
      document.querySelector(".carre img").style.display = "block"; // Réafficher l'icône montagne
      document.querySelector(".carre p").style.display = "block"; // Réafficher le texte "jpg, png : 4mo max"
    }

    checkConditions(); // Vérifier les conditions après avoir sélectionné un fichier
  });

  // 3. Vérifier si un titre a été ajouté
  photoTitle.addEventListener("input", checkConditions);

  // 4. Vérifier si une catégorie a été sélectionnée
  categorySelect.addEventListener("change", checkConditions);
});
