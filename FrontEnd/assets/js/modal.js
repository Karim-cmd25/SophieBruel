import { displayWorks } from "./index.js";

// VARIABLES MODALES
const modalGallery = document.getElementById("modalGallery");
const modalAutre = document.getElementById("modalAutre");
const closeModalAutre = document.getElementById("closeModalAutre");
const addPhotoButton = document.getElementById("addPhotoButton");
const comebackButton = document.getElementById("comeback"); // Flèche pour revenir
const modal1 = document.getElementById("myModal"); // Modal principale
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
    confirmDeletePhoto(elem.id); // Appel de la fonction de confirmation
  });

  fig.appendChild(img);
  fig.appendChild(caption);
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

// FONCTION POUR SUPPRIMER UN TRAVAIL
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
    modalAutre.style.display = "none"; // Masquer la modal d'ajout
    modal1.style.display = "block"; // Afficher la modal principale
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
      modal1.style.display = "none"; // Masquer la modal principale
      displayModalAutre(); // Afficher la modal d'ajout de photo
    });
  }

  // Gérer le clic sur le bouton "Ajouter photo"
  const customFileInputButton = document.getElementById("photoUploadButton");
  const fileInput = document.getElementById("photoFile");

  if (customFileInputButton && fileInput) {
    customFileInputButton.addEventListener("click", () => {
      // Simuler un clic sur l'input de type file
      fileInput.click();
    });
  }

  // Gérer la sélection de fichier (en affichant le nom du fichier dans le bouton)
  fileInput.addEventListener("change", () => {
    const fileName = fileInput.files[0]?.name || "Aucun fichier sélectionné";
    customFileInputButton.textContent = `Fichier sélectionné: ${fileName}`;
  });
}
