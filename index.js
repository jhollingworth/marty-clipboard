require('./index.css');

var keymage = require('keymage');
var nanoModal = require('nanomodal');

keymage('ctrl-shift-c', function() {
  var Marty = window.Marty;

  if (!Marty) {
    console.warn('Marty not found on page');
    return;
  }

  nanoModal("Marty State").onShow(function (modal) {
    modal.setContent(content());

    function content() {
      var state = Marty.dehydrate();
      var textarea = document.createElement("textarea")
      textarea.cols = 50
      textarea.rows = 5;
      textarea.value =  JSON.stringify(state);
      textarea.onchange = updateState;
      textarea.onkeyup = updateState;
      textarea.onpaste = updateState;

      function updateState() {
        try {
          var json = JSON.parse(textarea.value);

          Marty.rehydrate(json);
        } catch (e) {
          console.error('Invalid JSON');
        }
      }

      return textarea;
    }
  }).show();
  return false;
});
