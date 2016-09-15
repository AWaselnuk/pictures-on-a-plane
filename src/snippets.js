function popUpMain() {
  const runButton = document.getElementById('run');

  runButton.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {file: "app/content_script.js"});
  });

  function handleMessage(request, sender, sendResponse) {
    log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    log(request.images);
    sendResponse({result: "images received"});
  }

  chrome.runtime.onMessage.addListener(handleMessage);
}
