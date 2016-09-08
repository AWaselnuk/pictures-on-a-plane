'use strict';

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function main() {
  var runButton = document.getElementById('run');

  runButton.addEventListener('click', function () {
    chrome.tabs.executeScript(null, { file: "app/content_script.js" });
  });

  function handleMessage(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log(request.images);
    sendResponse({ result: "images received" });
  }

  chrome.runtime.onMessage.addListener(handleMessage);
}

ready(main);