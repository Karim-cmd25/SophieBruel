export function displayModalGallery(elem) {
  const modalGallery = document.getElementById("modalGallery");
  const fig = document.createElement("figure");
  fig.setAttribute("class", "gallery-item");
  fig.setAttribute("data-cat", elem.categoryId);

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
  fig.appendChild(icon); // Ajoute l'icône à la figure
  modalGallery.appendChild(fig);
}

// Ajoute ici les autres fonctions comme deleteWorks et deleteItem si nécessaire.
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
  document.getElementById(`mod_${id}`).remove();
  document.getElementById(`gal_${id}`).remove();
}

// ############### M  O  D  A  L    2 ###########
