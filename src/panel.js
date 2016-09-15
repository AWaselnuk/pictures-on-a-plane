// import { log, domReady } from 'utilities';

// Main

function main() {
  const runButton = document.getElementById('run');

  runButton.addEventListener('click', () => {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    // chrome.devtools.network.getHAR((harLog) => {
    //   log(harLog);
    // })

    log('testing');
  });
}

// Init

domReady(main);
