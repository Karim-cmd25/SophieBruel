document.addEventListener("DOMContentLoaded", function () {
  showLoginForm();
});

function showLoginForm() {
  const main = document.querySelector("main");
  main.innerHTML = `
          <h2>Log In</h2>
          <form id="workForm">
              <label for="email">E-mail :</label>
              <input type="email" id="email" name="email" required />
              <label for="password">Mot de passe :</label>
              <input type="password" id="password" name="password" required />
              <button type="submit" class="btn-login">Se connecter</button>
              <div id="loading" style="display: none;">Chargement...</div>
              <div id="error-message" style="color: red; display: none;"></div>
          </form>
          <p><a href="motdepasse-oublie.html">Mot de passe oublié </a></p>
      `;

  document
    .getElementById("workForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const data = {};

      formData.forEach((value, key) => {
        data[key] = value;
      });
      console.log(data);

      const loadingIndicator = document.getElementById("loading");
      loadingIndicator.style.display = "block";
      const errorMessage = document.getElementById("error-message");
      errorMessage.style.display = "none";

      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }

        const responseData = await response.json();
        console.log("Données de réponse :", responseData);
        alert("Connexion réussie !");
        localStorage.setItem("token", responseData.token);
        console.log("Token stocké :", localStorage.getItem("token"));

        window.location.href = "index.html";
      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
      } finally {
        loadingIndicator.style.display = "none";
      }
    });
}
