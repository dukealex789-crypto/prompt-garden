(function() {
  "use strict";

  var totalSeconds = 0;
  var remaining = 0;
  var running = false;
  var interval = null;
  var isCountdown = true;
  var elapsed = 0;

  var display = document.getElementById("timerDisplay");
  var label = document.getElementById("timerLabel");
  var ring = document.getElementById("timerRing");
  var toggleBtn = document.getElementById("timerToggle");
  var body = document.getElementById("timerBody");
  var startBtn = document.getElementById("timerStart");
  var pauseBtn = document.getElementById("timerPause");
  var resetBtn = document.getElementById("timerReset");
  var modeBtn = document.getElementById("timerModeBtn");
  var presetBtns = document.querySelectorAll(".preset-btn");
  var section = document.getElementById("timerSection");

  var circumference = 2 * Math.PI * 52;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = "0";

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function updateRing() {
    if (isCountdown && totalSeconds > 0) {
      var fraction = remaining / totalSeconds;
      ring.style.strokeDashoffset = circumference * (1 - fraction);
    } else {
      var pct = totalSeconds > 0 ? Math.min(elapsed / totalSeconds, 1) : 0;
      ring.style.strokeDashoffset = circumference * (1 - pct);
    }
  }

  function updateDisplay() {
    if (isCountdown) {
      display.textContent = formatTime(remaining);
      if (totalSeconds > 0) {
        var pct = Math.round((remaining / totalSeconds) * 100);
        label.textContent = pct + "%";
      }
    } else {
      display.textContent = formatTime(elapsed);
      label.textContent = "正计时";
    }
    updateRing();
  }

  function tick() {
    if (isCountdown) {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        stop();
        display.textContent = "00:00";
        label.textContent = "完成!";
        ring.style.strokeDashoffset = circumference;
      }
    } else {
      elapsed++;
      updateDisplay();
    }
  }

  function start() {
    if (running) return;
    if (isCountdown && remaining <= 0) return;
    running = true;
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    interval = setInterval(tick, 1000);
  }

  function pause() {
    running = false;
    clearInterval(interval);
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  }

  function stop() {
    running = false;
    clearInterval(interval);
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  }

  function reset() {
    stop();
    if (isCountdown) {
      remaining = totalSeconds;
    } else {
      elapsed = 0;
    }
    updateDisplay();
  }

  function setPreset(min) {
    stop();
    totalSeconds = min * 60;
    remaining = totalSeconds;
    elapsed = 0;
    isCountdown = true;
    modeBtn.textContent = "倒计时 ▼";
    ring.classList.remove("count-up");
    updateDisplay();
    presetBtns.forEach(function(b) { b.classList.remove("active"); });
    document.querySelector('[data-min="' + min + '"]').classList.add("active");
  }

  function toggleMode() {
    stop();
    isCountdown = !isCountdown;
    if (isCountdown) {
      remaining = totalSeconds;
      elapsed = 0;
      modeBtn.textContent = "倒计时 ▼";
      ring.classList.remove("count-up");
    } else {
      elapsed = 0;
      modeBtn.textContent = "正计时 ▶";
      ring.classList.add("count-up");
      if (totalSeconds === 0) totalSeconds = 15 * 60;
    }
    updateDisplay();
  }

  presetBtns.forEach(function(b) {
    b.addEventListener("click", function() {
      setPreset(parseInt(this.getAttribute("data-min")));
    });
  });

  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);
  modeBtn.addEventListener("click", toggleMode);

  toggleBtn.addEventListener("click", function() {
    section.classList.toggle("timer-open");
  });

  // Init: default 15 min countdown
  setPreset(15);
})();
