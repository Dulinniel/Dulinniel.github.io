let lastKeyTime = Date.now();
let buffer = [];

let settings = {
  time: 1000,
  scheme: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]
}

document.addEventListener("keydown", ( event ) => 
{

  const key = event.key;
  const currentKeyTime = Date.now();

  if ( currentKeyTime - lastKeyTime > settings.time ) buffer = [key]; // Safely delete buffer
  else buffer.push(key);

  lastKeyTime = currentKeyTime;

  if (JSON.stringify(buffer) == JSON.stringify(settings.scheme)) {
    [...document.getElementsByTagName('link')].forEach(css => {
      css.rel.disabled = true;
    });
    loadCSS('src/style/alternate/index.css');

  }

});

function loadCSS(URL) {

  return new Promise ( (resolve, reject) => {
    try {

      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = URL;
      document.head.appendChild(link);
      resolve();
      console.log("You typed the Konami code, welcome to the byte field !");

    } catch ( e ) {
      if ( e ) reject();
    }
  });
}
