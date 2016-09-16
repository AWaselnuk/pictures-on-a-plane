// import { log, domReady } from 'utilities';
// import { getSampleHAR } from 'sample-data';

const CATEGORIES = [
  'scooter',
  'bicycle',
  'car',
  'train',
  'airplane',
  'spaceship',
  'teleportation'
];

// HAR Entry -> Boolean
function isImageType(HARentry) {
  if (HARentry.response == null) {
    return false;
  }
  const mimeType = HARentry.response.content.mimeType;
  return (
    mimeType == 'image/jpeg'
    || mimeType == 'image/png'
    || mimeType == 'image/gif'
  );
}

// HAR Entry for image -> CategorizedImage
function toCategorizedImage(HARentry) {
  const imageSize = HARentry.response.content.size;

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
    return 'train'
  } else if (imageSize < 75000) {
    return 'car';
  } else if (imageSize < 150000) {
    return 'bicycle'
  } else {
    return 'scooter';
  }
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
    .map((entry) => toCategorizedImage(entry));

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

  function imageToLi(image) {
    return `<li>${image.url}, ${image.size}, ${image.category}</li>`;
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

  const imagesHTML =
    CATEGORIES.map((category) => {
      return `<ol class="list-reset category-${category}">
        ${images
            .filter((image) => image.category === category)
            .map(imageToLi)
            .join("\n")
        }
      </ol>`;
    });

  $imagesContainer.html(imagesHTML);
}

// Init

domReady(main);

