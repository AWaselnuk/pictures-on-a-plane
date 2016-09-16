'use strict';

// import { log } from 'utilities';
// import { getSampleHAR } from 'sample-data';

function main() {
  var $body = $('body');
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

  var categoryData = CATEGORIES.map(function (category) {
    var imagesForCategory = images.filter(function (image) {
      return image.category === category;
    });

    return {
      label: category,
      imageCount: imagesForCategory.length,
      images: imagesForCategory
    };
  });

  var imagesHTML = categoryData.map(function (category) {
    if (category.imageCount === 0) {
      return emptyCategoryHTML(category);
    } else {
      return categoryHTML(category);
    }
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

  function setCategory(category) {
    $body.attr('class', 'active-category-' + category);
  }

  function updateImageCounts(categoryData) {
    categoryData.forEach(function (category) {
      $('.category-item__badge--' + category.label).html(category.imageCount);
    });
  }

  $body.on('click', '.category-item', function (evt) {
    setCategory($(evt.target).data('category'));
  });

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

    // TODO: below steps to here
  });

  $imagesContainer.html(imagesHTML);
  updateImageCounts(categoryData);
  setCategory('scooter');
}

var CATEGORIES = ['scooter', 'bicycle', 'car', 'train', 'airplane', 'spaceship', 'teleportation'];

var REGULAR_3G_BYTES_PER_SECOND = 750e3;

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
  var path = function () {
    var splitURL = HARentry.request.url.split("/");
    return splitURL[splitURL.length - 1];
  }();

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
    return 'train';
  } else if (imageSize < 75000) {
    return 'car';
  } else if (imageSize < 150000) {
    return 'bicycle';
  } else {
    return 'scooter';
  }
}

// Image -> HTML
function imageHTML(image) {
  return '<li class="image-item" data-image-url="' + image.url + '">\n    <b class="inline-title">SIZE</b> ' + image.kbSize + ' kb<br>\n    <b class="inline-title">TIME (3G)</b> ' + image.mobileTime + ' ms<br>\n    <b class="inline-title">URL</b> ' + image.path + '\n  </li>';
}

// CategoryData -> HTML
function emptyCategoryHTML(category) {
  return '<p class="has-category has-category--' + category.label + '">\n      You have no images in the ' + category.label + ' category.\n    </p>';
}

// CategoryData -> HTML
function categoryHTML(category) {
  return '<ol class="list-reset has-category has-category--' + category.label + '">\n    ' + category.images.sort(function (a, b) {
    return b.size - a.size;
  }).map(imageHTML).join("\n") + '\n  </ol>';
}

// Init

$(main);
