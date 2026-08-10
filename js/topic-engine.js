var TopicEngine = (function() {
  "use strict";

  var HISTORY_MAX = 30;
  var history = [];

  function getTopics(lang, mode) {
    var db = topicDB[lang] || topicDB["en"] || {};
    return (db[mode] || db.prompt || []).slice();
  }

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function random(lang, mode) {
    mode = mode || "prompt";
    var topics = getTopics(lang, mode);
    if (topics.length === 0) return "No topics available.";

    if (history.length >= topics.length - 1) {
      history = history.slice(-Math.min(HISTORY_MAX, Math.floor(topics.length / 2)));
    }

    var shuffled = shuffleArray(topics);
    var picked = null;

    for (var i = 0; i < shuffled.length; i++) {
      if (history.indexOf(shuffled[i]) === -1) {
        picked = shuffled[i];
        break;
      }
    }

    if (picked === null) {
      history = [];
      picked = shuffled[Math.floor(Math.random() * shuffled.length)];
    }

    history.push(picked);
    if (history.length > HISTORY_MAX) history.shift();
    return picked;
  }

  return { random: random };
})();
