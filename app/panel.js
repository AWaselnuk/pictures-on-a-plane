'use strict';

// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

// Main

// HAR Entry -> Boolean
function isImageType(HARentry) {
  return HARentry.response && (HARentry.response.content.mimeType == 'image/jpeg' || HARentry.response.content.mimeType == 'image/jpeg');
}

// HAR Entry -> Image
function toImage(HARentry) {
  return {
    time: HARentry.time,
    url: HARentry.request.url,
    size: HARentry.response.content.size,
    mimeType: HARentry.response.content.mimeType
  };
}

function main() {
  var $runButton = $('#run');
  var $sections = $('.section');
  var $scrollText = $('.scroll-text');
  var $imagesContainer = $('#images');
  var HARTestData = getSampleHAR();
  var entries = HARTestData.entries;
  var images = entries.filter(function (entry) {
    return isImageType(entry);
  }).map(function (entry) {
    return toImage(entry);
  });

  function transitionToSection(sectionName) {
    $sections.addClass('hidden');
    $sections.filter('#' + sectionName).removeClass('hidden');
  }

  function animateScrollText() {
    var $scrollTextDuration = $scrollText.find('.scroll-text__item').length * 1.2 * 1000 + 1000;

    var promise = new Promise(function (resolve, reject) {
      $scrollText.addClass('js-animate');
      window.setTimeout(function () {
        return resolve();
      }, $scrollTextDuration);
    });

    return promise;
  }

  $runButton.on('click', function () {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    // chrome.devtools.network.getHAR((harLog) => {
    //   log(getSampleHAR());
    // });

    // Transition to results screen
    transitionToSection('sectionLoading');
    animateScrollText().then(function () {
      return transitionToSection('sectionResults');
    });
  });

  // Spit out HAR data
  log(images);
  $imagesContainer.html('<pre><code>' + JSON.stringify(images, null, 2) + '</code></pre>');
}

// Init

domReady(main);
