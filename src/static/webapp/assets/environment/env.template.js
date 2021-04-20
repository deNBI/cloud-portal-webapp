(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["API_HOST"] = "${API_HOST}";
  window["env"]["PRODUCTION"] = "${PRODUCTION}";

})(this);
