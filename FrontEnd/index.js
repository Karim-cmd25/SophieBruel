async function getdata() {
  const url = "http://localhost:5678/api/works";
  const response = await fetch(url);
  //console.log(response);
  const data = await response.json();
  console.log(typeof data);
  //console.log(data);
  for (let elem of data) {
    displayWorks(elem);
  }
}

//recupération des élements du tableau

function displayWorks(elem) {
  console.log(typeof elem);
  const gallery = document.getElementById("gallery");
  const fig = document.createElement("figure");
  fig.setAttribute("id", `fig_${elem.id}`); // Create Id: it is to facilitate the removal from the modal
  fig.setAttribute("class", "fig");
  fig.setAttribute("data-cat", elem.categoryId); // Create data: it is to facilitate the sorting
  const img = document.createElement("img");
  img.setAttribute("alt", elem.title);
  img.setAttribute("src", elem.imageUrl);
  const caption = document.createElement("figcaption");
  caption.textContent = elem.title;
  fig.append(img, caption);
  //insertInModal(data); // send data to create the collection in modal
  gallery.append(fig);

  // console.log(elem);
}

getdata();

// 1) ***********************FONCTION RECUPERATIONS DES CATEGORIES ############

async function getcategories() {
  const url = "http://localhost:5678/api/categories";
  const response = await fetch(url);
  const categories = await response.json(); // Utilise 'categories' ici
  console.log(typeof categories); // Affiche le type de 'categories'

  for (let elem of categories) {
    // Utilise 'categories' dans la boucle
    displayCategoriesButton(elem);
    console.log(categories);
  }
}

function displayCategoriesButton(elem) {
  console.log(typeof elem);
  const portfolio = document.getElementById("portfolio"); // Cibler l'élément avec l'ID 'portfolio'
}

getcategories();

// 2) ****************** fonctions creations des boutons et attacher ecouteurs (lancement fonction de tri en dessous)

const button = document.createElement("button");
const buutton = document.createElement("button");
const buuutton = document.createElement("button");
const buuuutton = document.createElement("button");

// Définir le texte des boutons
button.textContent = "Tous";
buutton.textContent = "Objets";
buuutton.textContent = "Appartements";
buuuutton.textContent = "Hôtels & Restaurants";

//############# AJOUT DATTRIBUTS DATA-CAT ####################
button.setAttribute("data-cat", "0");
buutton.setAttribute("data-cat", "objetsId");
buuutton.setAttribute("data-cat", "AppartsId");
buuuutton.setAttribute("data-cat", "HotelsRestaurantsId");

// Ajouter un écouteur d'événements pour le clic
button.addEventListener("click", function () {
  trier("Tous");
});
buutton.addEventListener("click", function () {
  trier("Objets");
});
buuutton.addEventListener("click", function () {
  trier("Appartements");
});
buuuutton.addEventListener("click", function () {
  trier("Hôtels et restaurants");
});

//########## Ajouter les boutons au conteneur dans le HTML##################
document.getElementById("boutton").appendChild(button);
document.getElementById("boutton").appendChild(buutton);
document.getElementById("boutton").appendChild(buuutton);
document.getElementById("boutton").appendChild(buuuutton);

// Données à trier #######################
const items = [
  { id: 1, name: "Objet 1", type: "Objets" },
  { id: 2, name: "Appartement 1", type: "Appartements" },
  { id: 3, name: "Restaurant 1", type: "Hôtels et restaurants" },
  { id: 4, name: "Objet 2", type: "Objets" },
  { id: 5, name: "Appartement 2", type: "Appartements" },
];

// Fonction de tri ####################
function trier(type) {
  const messageDiv = document.getElementById("message");

  let filteredItems = []; // Créer un tableau vide

  let index = 0; // Compteur pour le tableau filtré

  for (let i = 0; i < items.length; i++) {
    if (type === "Tous" || items[i].type === type) {
      filteredItems[index] = items[i]; // Assignation directe
      index++; // Incrémenter le compteur
    }
  }

  // Afficher les éléments triés  #########################
  if (index > 0) {
    messageDiv.textContent = `Éléments trouvés pour ${type} : ${filteredItems
      .slice(0, index)
      .map((item) => item.name)
      .join(", ")}`;
  } else {
    messageDiv.textContent = `Aucun élément trouvé pour : ${type}.`;
  }
}
trier();
