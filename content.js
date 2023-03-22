let currentSpeed = 1.0;

function applyPlaybackSpeed() {
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = parseFloat(currentSpeed);
  }
}

function initializePlaybackSpeed() {
  chrome.storage.local.get("playbackSpeed", function (data) {
    if (data.playbackSpeed) {
      currentSpeed = data.playbackSpeed;
      applyPlaybackSpeed();
    }
  });
}

initializePlaybackSpeed();

let lastVideoUrl = '';

function checkVideoUrl() {
  const video = document.querySelector("video");
  if (video) {
    const videoUrl = video.currentSrc;
    if (videoUrl !== lastVideoUrl) {
      applyPlaybackSpeed();
      lastVideoUrl = videoUrl;
    }
  }
}

const observer = new MutationObserver(checkVideoUrl);
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "setPlaybackSpeed") {
    currentSpeed = parseFloat(message.speed);
    applyPlaybackSpeed();
  }
});

// Check video URL periodically to ensure the playback speed is persistent.
setInterval(checkVideoUrl, 1000);
