const speedSlider = document.getElementById("speed-slider");
const speedDisplay = document.getElementById("speed-display");

function setCurrentSpeedValue(speed) {
  speedDisplay.textContent = `${parseFloat(speed).toFixed(2)}x`;
  speedSlider.value = speed;
}

chrome.storage.local.get("playbackSpeed", function (data) {
  if (data.playbackSpeed) {
    setCurrentSpeedValue(data.playbackSpeed);
  }
});

function updatePlaybackSpeed(speed) {
  setCurrentSpeedValue(speed);

  chrome.storage.local.set({ playbackSpeed: speed });

  chrome.tabs.query({ url: "*://www.youtube.com/*" }, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, { action: "setPlaybackSpeed", speed: speed }, function (response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
        } else {
          console.log(response);
        }
      });
    });
  });
}

speedSlider.addEventListener("input", function (event) {
  const speed = event.target.value;
  updatePlaybackSpeed(speed);
});

speedSlider.addEventListener("mouseup", function (event) {
  const speed = event.target.value;
  updatePlaybackSpeed(speed);
});
