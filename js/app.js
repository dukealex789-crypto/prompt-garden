(function() {
  "use strict";

  var currentLang = "zh";
  var currentMode = "prompt";

  function init() {
    var promptEl = document.getElementById("prompt");
    var newBtn = document.getElementById("newPrompt");
    var langOptions = document.querySelectorAll(".lang-option");
    var modeOptions = document.querySelectorAll(".mode-option");

    if (!promptEl || !newBtn) return;

    function updateButtonLabel() {
      newBtn.innerHTML = currentLang === "zh" ? "&#8634; \u6362\u4e00\u4e2a" : "&#8634; New prompt";
    }

    function showPrompt() {
      var topic = TopicEngine.random(currentLang, currentMode);
      promptEl.classList.add("fade-out");
      promptEl.classList.toggle("word-mode", currentMode === "term");
      setTimeout(function() {
        promptEl.textContent = topic;
        promptEl.classList.remove("fade-out");
      }, 200);
    }

    modeOptions.forEach(function(el) {
      el.addEventListener("click", function() {
        var mode = this.getAttribute("data-mode");
        if (mode === currentMode) return;
        currentMode = mode;
        modeOptions.forEach(function(x) { x.classList.toggle("active", x.getAttribute("data-mode") === mode); });
        showPrompt();
      });
    });

    langOptions.forEach(function(el) {
      el.addEventListener("click", function() {
        var lang = this.getAttribute("data-lang");
        if (lang === currentLang) return;
        currentLang = lang;
        langOptions.forEach(function(x) { x.classList.toggle("active", x.getAttribute("data-lang") === lang); });
        updateButtonLabel();
        showPrompt();
      });
    });

    newBtn.addEventListener("click", showPrompt);
    document.addEventListener("keydown", function(e) {
      if (e.code === "Space" && e.target === document.body) { e.preventDefault(); showPrompt(); }
    });

    updateButtonLabel();
    showPrompt();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
