'use strict';

// Random code snippets created while learning about extensions

// example popup
function popUpMain() {
  var runButton = document.getElementById('run');

  runButton.addEventListener('click', function () {
    chrome.tabs.executeScript(null, { file: "app/content_script.js" });
  });

  function handleMessage(request, sender, sendResponse) {
    log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    log(request.images);
    sendResponse({ result: "images received" });
  }

  chrome.runtime.onMessage.addListener(handleMessage);
}

// example content script

var images = document.querySelectorAll('img');
var imageSrcs = Array.from(images).map(function (img) {
  return img.src;
});

chrome.runtime.sendMessage({ images: imageSrcs }, function (response) {
  console.dir(response);
});