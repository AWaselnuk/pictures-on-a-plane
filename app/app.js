'use strict';

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function main() {
  var runButton = document.getElementById('run');

  runButton.addEventListener('click', function () {
    console.log('it has been watched');
  });
}

ready(main);
