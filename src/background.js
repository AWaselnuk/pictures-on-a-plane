chrome.runtime.onConnect.addListener((devToolsConnection) => {
    // assign the listener function to a variable so we can remove it later
    const devToolsListener = (message, sender, sendResponse) => {
        // Inject a content script into the identified tab
        chrome.tabs.executeScript(message.tabId, { file: message.scriptToInject });
    }

    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function() {
         devToolsConnection.onMessage.removeListener(devToolsListener);
    });
});
