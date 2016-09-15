const images = document.querySelectorAll('img');
const imageSrcs = Array.from(images).map(function (img) { return img.src });

chrome.runtime.sendMessage({images: imageSrcs}, function(response) {
  console.dir(response);
});
