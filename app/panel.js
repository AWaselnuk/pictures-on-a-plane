'use strict';

// import { log, domReady } from 'utilities';

// Main

function main() {
  var runButton = document.getElementById('run');

  runButton.addEventListener('click', function () {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    // chrome.devtools.network.getHAR((harLog) => {
    //   log(harLog);
    // })

    log('testing');
  });
}

// Init

domReady(main);