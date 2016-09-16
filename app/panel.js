'use strict';

// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

// Main

// HAR Entry -> Boolean
function isImageType(HARentry) {
  if (HARentry.response == null) {
    return false;
  }
  var mimeType = HARentry.response.content.mimeType;
  return mimeType == 'image/jpeg' || mimeType == 'image/png' || mimeType == 'image/gif';
}

// HAR Entry for image -> CategorizedImage
function toCategorizedImage(HARentry) {
  var imageSize = HARentry.response.content.size;

  return {
    time: HARentry.time,
    url: HARentry.request.url,
    size: imageSize,
    category: categoryForImageSize(imageSize),
    mimeType: HARentry.response.content.mimeType
  };
}

// Image size in bytes -> Category
function categoryForImageSize(imageSize) {
  if (imageSize < 5000) {
    return 'teleportation';
  } else if (imageSize < 10000) {
    return 'spaceship';
  } else if (imageSize < 30000) {
    return 'airplane';
  } else if (imageSize < 50000) {
    return 'train';
  } else if (imageSize < 75000) {
    return 'car';
  } else if (imageSize < 150000) {
    return 'bicycle';
  } else {
    return 'scooter';
  }
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
    return toCategorizedImage(entry);
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
