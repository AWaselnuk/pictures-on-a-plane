"use strict";

console.log('Launching app');

chrome.devtools.panels.create("Pictures on a plane", "icon.png", "panel.html", function (panel) {
  // code invoked on panel creation
  console.log('It is alive!');
});