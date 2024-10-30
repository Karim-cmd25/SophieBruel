// Fonction pour afficher la galerie dans la modal existante
export function displayModalGallery(elem) {
  const modalGallery = document.getElementById("modalGallery");
  const fig = document.createElement("figure");
  fig.setAttribute("class", "gallery-item");
  fig.setAttribute("data-cat", elem.categoryId);
  fig.setAttribute("id", `mod_${elem.id}`); // Ajout de l'ID

  const img = document.createElement("img");
  img.setAttribute("alt", elem.title);
  img.setAttribute("src", elem.imageUrl);

  const caption = document.createElement("figcaption");
  caption.textContent = elem.title;

  // Ajout de l'icône de la poubelle
  const icon = document.createElement("img");
  icon.setAttribute("src", "assets/icons/trash.jpg");
  icon.setAttribute("class", "trashIcon");
  icon.addEventListener("click", () => {
    deleteWorks(elem.id);
  });

  fig.appendChild(img);
  fig.appendChild(caption);
  fig.appendChild(icon);
  modalGallery.appendChild(fig);
}

// Fonction pour supprimer un travail
async function deleteWorks(id) {
  const url = `http://localhost:5678/api/works/${id}`;
  if (!localStorage.getItem("token")) {
    return false;
  }
  const token = localStorage.getItem("token");
  const options = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const result = await fetch(url, options);
  if (result.ok) {
    deleteItem(id);
  }
}

function deleteItem(id) {
  const modalItem = document.getElementById(`mod_${id}`);
  const galleryItem = document.getElementById(`gal_${id}`);

  if (modalItem) modalItem.remove();
  if (galleryItem) galleryItem.remove();
}

// ############### M  O  D  A  L    2 ###########
export function displayModalAutre() {
  const modalAutre = document.getElementById("modalAutre");
  modalAutre.style.display = "block"; // Affiche la modal

  // Remplir le sélecteur de catégories lorsque la modale est ouverte
  populateCategorySelect();

  const closeModalAutre = document.getElementById("closeModalAutre");
  closeModalAutre.onclick = function () {
    modalAutre.style.display = "none"; // Ferme la modal
  };

  window.onclick = function (event) {
    if (event.target === modalAutre) {
      modalAutre.style.display = "none"; // Ferme la modal si clic en dehors
    }
  };
}

// Fonction pour peupler le sélecteur de catégories
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

// Fonction pour gérer le clic sur le bouton "Ajouter Photo"
export function setupAddPhotoButton() {
  const addPhotoButton = document.getElementById("addPhotoButton");
  if (addPhotoButton) {
    addPhotoButton.addEventListener("click", displayModalAutre); // Ouvre la deuxième modal
  }
}

// Appelle cette fonction après le chargement du DOM
document.addEventListener("DOMContentLoaded", function () {
  setupAddPhotoButton();
  // Autres initialisations si nécessaires
});
