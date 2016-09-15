'use strict';

function domReady(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function log(msg) {
  return console.log(msg);
}