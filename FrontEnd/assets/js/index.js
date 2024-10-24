async function getData() {
  const url = "http://localhost:5678/api/works";
  const response = await fetch(url);
  const data = await response.json();

  data.forEach((elem) => {
    displayWorks(elem);
    displayModalGallery(elem); // Vérifie le nom de la fonction ici
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

function displayModalGallery(elem) {
  const modalGallery = document.getElementById("modalGallery"); // Assurez-vous que l'ID correspond à votre HTML
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
  modalGallery.appendChild(fig); // Ajouter à la galerie de la modal
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  const response = await fetch(url);
  const categories = await response.json();

  displayCategoriesButtons(categories);
}

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

  function isAuthenticated() {
    const token = localStorage.getItem("token");
    modifierSection.style.display = token ? "flex" : "none";
  }

  function openModal() {
    const token = localStorage.getItem("token");
    if (token) {
      myModal.style.display = "block";
    } else {
      alert("Veuillez vous connecter pour modifier.");
    }
  }

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

  getData();
  getCategories();
});
