console.log('Launching app');

chrome.devtools.panels.create(
  "Perf Companion",
  "icon.png",
  "panel.html",
  (panel) => {
    // code invoked on panel creation
    console.log('It is alive!');
  }
);
