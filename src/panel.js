// import { log } from 'utilities';
// import { getSampleHAR } from 'sample-data';

function main() {
  const $body = $('body');
  const $runButton = $('#run');
  const $sections = $('.section');
  const $scrollText = $('.scroll-text');
  const $imagesContainer = $('#images');
  const HARTestData = getSampleHAR();
  const entries = HARTestData.entries;
  const images = entries
    .filter((entry) => isImageType(entry))
    .map((entry) => toCategorizedImage(entry));

  const categoryData =
    CATEGORIES.map((category) => {
      const imagesForCategory = images.filter((image) => image.category === category);

      return {
        label: category,
        imageCount: imagesForCategory.length,
        images: imagesForCategory
      };
    });

  const imagesHTML =
    categoryData.map((category) => {
      if (category.imageCount === 0) {
        return emptyCategoryHTML(category);
      } else {
        return categoryHTML(category);
      }
    });

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

  function setCategory(category) {
    $body.attr('class', `active-category-${category}`);
  }

  function updateImageCounts(categoryData) {
    categoryData.forEach((category) => {
      $(`.category-item__badge--${category.label}`).html(category.imageCount);
    });
  }

  $body.on('click', '.category-item', (evt) => {
    setCategory($(evt.target).data('category'));
  });

  $runButton.on('click', () => {
    // HAR spec http://www.softwareishard.com/blog/har-12-spec/
    // chrome.devtools.network.getHAR((harLog) => {
    //   log(getSampleHAR());
    // });

    // Transition to results screen
    transitionToSection('sectionLoading');
    animateScrollText()
      .then(() => transitionToSection('sectionResults'));

    // TODO: below steps to here
  });

  $imagesContainer.html(imagesHTML);
  updateImageCounts(categoryData);
  setCategory('scooter');
}

const CATEGORIES = [
  'scooter',
  'bicycle',
  'car',
  'train',
  'airplane',
  'spaceship',
  'teleportation'
];

const REGULAR_3G_BYTES_PER_SECOND = 750e3;

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
  const path = (() => {
    const splitURL = HARentry.request.url.split("/");
    return splitURL[splitURL.length - 1];
  })();

  return {
    time: HARentry.time,
    mobileTime: (imageSize / REGULAR_3G_BYTES_PER_SECOND * 1000).toFixed(2),
    url: HARentry.request.url,
    path: path,
    size: imageSize,
    kbSize: imageSize / 1000,
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

// Image -> HTML
function imageHTML(image) {
  return `<li class="image-item" data-image-url="${image.url}">
    <b class="inline-title">SIZE</b> ${image.kbSize} kb<br>
    <b class="inline-title">TIME (3G)</b> ${image.mobileTime} ms<br>
    <b class="inline-title">URL</b> ${image.path}
  </li>`;
}

// CategoryData -> HTML
function emptyCategoryHTML(category) {
  return `<p class="has-category has-category--${category.label}">
      You have no images in the ${category.label} category.
    </p>`;
}

// CategoryData -> HTML
function categoryHTML(category) {
  return `<ol class="list-reset has-category has-category--${category.label}">
    ${category.images
        .sort((a, b) => b.size - a.size)
        .map(imageHTML)
        .join("\n")
    }
  </ol>`;
}

// Background page wiring

const backgroundPageConnection = chrome.runtime.connect();

backgroundPageConnection.onMessage.addListener((message) => {
  log(message);
});

chrome.runtime.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: 'content-script.js'
});

// Init

$(main);

