class customAlert {
  alert(message) {
    // Create some HTML Content
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

    // Handle the newly created elements
    const dialogoverlay = document.getElementById("dialogoverlay");
    const dialogbox = document.getElementById("dialogbox");

    dialogoverlay.style.display = "block";
    dialogbox.style.display = "block";

    // center
    dialogbox.style.top = '40%';
  }

  ok() {
    // hide everything
    document.getElementById("dialogbox").style.display = "none";
    document.getElementById("dialogoverlay").style.display = "none";
  }
}

const Alert = new customAlert();

function copyTag() {
  // Use this clipboard API to put my tag in it
  navigator.clipboard.writeText("dulinniel1337").then(() => {
    // Display the alert 
    Alert.alert("Mon tag dulinniel1337 s'est glissé dans ton presse-papier :D</br></br>( Je détèste le fait qu'ils aient retiré les discriminateurs )");
  }).catch(err => {
    console.error("Erreur lors de la copie : ", err);
  });
}

// Handle IRQ 
function handleKeydown(event) {
  // Add some accessibility options 
  if (event.key === "Enter" || event.key === " ") {
    // Dissable scrolling with space
    event.preventDefault();
    // Call for copy function
    copyTag();
  }
}
