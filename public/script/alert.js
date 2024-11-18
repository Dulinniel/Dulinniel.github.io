function customAlert() {
  this.alert = (message) => {
    // Crée le contenu HTML de la boîte de dialogue
    const dialogHTML = `
      <div id="dialogoverlay"></div>
      <div id="dialogbox" class="slit-in-vertical">
        <div id="dialogboxcontent">
          <div id="dialogboxbody">${message}</div>
          <div id="dialogboxfoot">
            <button class="accept" onclick="Alert.ok()" onkeydown="Alert.ok()" aria-label="Fermer la fenêtre">Yay !</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("afterbegin", dialogHTML);

    // Gestion de l'affichage de la boîte de dialogue
    const dialogoverlay = document.getElementById("dialogoverlay");
    const dialogbox = document.getElementById("dialogbox");

    dialogoverlay.style.display = "block";
    dialogbox.style.display = "block";

    // Centrage vertical
    dialogbox.style.top = '40%';
  }

  this.ok = () => {
    // Masquer la boîte de dialogue
    document.getElementById("dialogbox").style.display = "none";
    document.getElementById("dialogoverlay").style.display = "none";
  }
}

const Alert = new customAlert();

function copyTag() {
  // Utiliser l'API Clipboard pour copier le texte
  navigator.clipboard.writeText("dulinniel1337").then(() => {
    // Afficher une alerte personnalisée après la copie
    Alert.alert("Mon tag dulinniel1337 s'est glissé dans ton presse-papier :D</br></br>( Je détèste le fait qu'ils aient retiré les discriminateurs )");
  }).catch(err => {
    console.error("Erreur lors de la copie : ", err);
  });
}

// Fonction pour gérer les interactions au clavier
function handleKeydown(event) {
  // Vérifie si la touche appuyée est Enter ou Space
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault(); // Empêche le scroll pour Space
    copyTag(); // Appelle la fonction de copie
  }
}