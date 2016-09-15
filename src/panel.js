// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

// Main

function main() {
  const runButton = document.getElementById('run');

  runButton.addEventListener('click', () => {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    chrome.devtools.network.getHAR((harLog) => {

      log(getSampleHAR());
    });
  });
}

// Init

domReady(main);

