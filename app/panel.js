'use strict';

// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

// Main

function main() {
  var runButton = document.getElementById('run');

  runButton.addEventListener('click', function () {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    chrome.devtools.network.getHAR(function (harLog) {

      log(getSampleHAR());
    });
  });
}

// Init

domReady(main);