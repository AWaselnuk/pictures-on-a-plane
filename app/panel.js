'use strict';

// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

// Main

function main() {
  var $runButton = $('#run');
  var $sections = $('.section');
  var $scrollText = $('.scroll-text');

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

    transitionToSection('sectionLoading');
    animateScrollText().then(function () {
      return transitionToSection('sectionResults');
    });
  });
}

// Init

domReady(main);
