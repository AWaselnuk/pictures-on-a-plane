// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

// Main

// HAR Entry -> Boolean
function isImageType(HARentry) {
  return HARentry.response
    && (
      HARentry.response.content.mimeType == 'image/jpeg'
      || HARentry.response.content.mimeType == 'image/jpeg'
    )
}

// HAR Entry -> Image
function toImage (HARentry) {
  return {
    time: HARentry.time,
    url: HARentry.request.url,
    size: HARentry.response.content.size,
    mimeType: HARentry.response.content.mimeType
  };
}

function main() {
  const $runButton = $('#run');
  const $sections = $('.section');
  const $scrollText = $('.scroll-text');
  const $imagesContainer = $('#images');
  const HARTestData = getSampleHAR();
  const entries = HARTestData.entries;
  const images = entries
    .filter((entry) => isImageType(entry))
    .map((entry) => toImage(entry));

  function transitionToSection(sectionName) {
    $sections.addClass('hidden');
    $sections.filter(`#${sectionName}`).removeClass('hidden');
  }

  function animateScrollText() {
    const $scrollTextDuration =
      $scrollText.find('.scroll-text__item').length * 1.2 * 1000 + 1000;

    const promise = new Promise((resolve, reject) => {
      $scrollText.addClass('js-animate');
      window.setTimeout(() => resolve(), $scrollTextDuration);
    });

    return promise;
  }

  $runButton.on('click', () => {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    // chrome.devtools.network.getHAR((harLog) => {
    //   log(getSampleHAR());
    // });

    // Transition to results screen
    transitionToSection('sectionLoading');
    animateScrollText()
      .then(() => transitionToSection('sectionResults'));


  });

  // Spit out HAR data
  log(images);
  $imagesContainer.html(`<pre><code>${JSON.stringify(images, null, 2)}</code></pre>`);
}

// Init

domReady(main);

