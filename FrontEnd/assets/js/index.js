async function getData() {
  const url = "http://localhost:5678/api/works";
  const response = await fetch(url);
  const data = await response.json();

  data.forEach((elem) => {
    displayWorks(elem);
  });
}

function displayWorks(elem) {
  const gallery = document.getElementById("gallery");
  const fig = document.createElement("figure");
  fig.setAttribute("class", "gallery-item");
  fig.setAttribute("data-cat", elem.categoryId);

  const img = document.createElement("img");
  img.setAttribute("alt", elem.title);
  img.setAttribute("src", elem.imageUrl);

  const caption = document.createElement("figcaption");
  caption.textContent = elem.title;

  fig.appendChild(img);
  fig.appendChild(caption);
  gallery.appendChild(fig);
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  const response = await fetch(url);
  const categories = await response.json();

  displayCategoriesButtons(categories);
}

function displayCategoriesButtons(categories) {
  const buttonContainer = document.getElementById("boutton");

  // Bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => filterWorks(0)); // 0 pour tous
  buttonContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name; // Assurez-vous que 'name' est correct
    button.setAttribute("data-cat", category.id);
    button.addEventListener("click", () => filterWorks(category.id));
    buttonContainer.appendChild(button);
  });
}

function filterWorks(categoryId) {
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    if (categoryId === 0 || item.getAttribute("data-cat") == categoryId) {
      item.style.display = "block"; // Afficher l'élément
    } else {
      item.style.display = "none"; // Cacher l'élément
    }
  });
}
getData();
getCategories();

//fonction pour ajouter un ecouteurs evenements sur le boutons pour declencher la fonction modal (display modal) ####
function GoModal() {
  GoModal.addEventListener("click");
}

// Appels des fonctions

function isAuthenticated() {
  const token = localStorage.getItem("token");
  const editModeElement = document.getElementById("editMode");
  const displayModeElement = document.getElementById("displayMode");
  if (token) {
    // Affiche le mode édition et le bouton "Modifier" si le token existe
    editModeElement.style.display = "block";
    displayModeElement.style.display = "none"; // Masque le mode affichage
  } else {
    // Masque le mode édition et le bouton "Modifier" si le token n'existe pas
    editModeElement.style.display = "none";
    displayModeElement.style.display = "block"; // Affiche le mode affichage
  }
}
isAuthenticated();
document.addEventListener("DOMContentLoaded", function () {
  isAuthenticated();
});
