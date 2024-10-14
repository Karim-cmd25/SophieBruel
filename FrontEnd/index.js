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

// 1) ***********************FONCTION RECUPERATIONS DES CATEGS

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

// Créer un bouton
const button = document.createElement("button");
const buutton = document.createElement("button");
const buuutton = document.createElement("button");
const buuuutton = document.createElement("button");

// Définir le texte du bouton
button.textContent = "Tous";
buutton.textContent = "Objets";
buuutton.textContent = "Appartements";
buuuutton.textContent = "Hotels&Restaurants";

// Ajouter un écouteur d'événements pour le clic
button.addEventListener("click", function () {
  alert("Bouton cliqué avec addEventListener !");
});

// Ajouter le bouton au conteneur dans le HTML
document.getElementById("boutton").appendChild(button);
document.getElementById("boutton").appendChild(buutton);
document.getElementById("boutton").appendChild(buuutton);
document.getElementById("boutton").appendChild(buuuutton);

//3)****************** fonction de trie (boucle for)

[
  { id: 1, name: "Objets" },
  { id: 2, name: "Appartements" },
  { id: 3, name: "Hôtels et restaurants" },
];
